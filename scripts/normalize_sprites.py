"""
Normaliza os sprites da casinha do Tamagotchi.

Problema que resolve:
- Cada PNG estava exportado recortado no contorno (auto-crop), com tamanho de
  canvas diferente a cada quadro. Com objectFit:contain isso fazia o personagem
  mudar de tamanho/posicao a cada frame -> efeito "duas frames ao mesmo tempo"
  e personagem saindo da tela.

O que o script faz, por personagem:
- Detecta o personagem (pixels nao-transparentes) em cada quadro.
- Iguala a ESCALA entre as animacoes "em pe" (idle/andando/comendo/standing),
  usando o idle como referencia, pra nao haver salto de tamanho.
- Coloca todo quadro num canvas UNICO (mesmo tamanho), ancorando os pes na
  base e centralizando na horizontal.

Uso:
    python scripts/normalize_sprites.py            # aplica (faz backup antes)
    python scripts/normalize_sprites.py --dry-run  # so mostra o relatorio
    python scripts/normalize_sprites.py --restore  # restaura do backup

Backup vai para: public/img/sprites/_normalize_backup/
"""

import os
import sys
import shutil
from PIL import Image

SPRITES = os.path.join(os.path.dirname(__file__), "..", "public", "img", "sprites")
SPRITES = os.path.normpath(SPRITES)
BACKUP = os.path.join(SPRITES, "_normalize_backup")
PAD = 4  # respiro em px nas bordas do canvas final

# ---------------------------------------------------------------------------
# Grupos de personagens. "scale_match" = animacoes que devem ter a MESMA escala
# do personagem (todas em pe). "ref" = animacao usada como referencia de altura.
# Animacoes fora de scale_match (sono, brincando) sao so re-encaixadas no canvas
# sem mudar a escala (poses deitadas/rolando nao devem ser esticadas).
# ---------------------------------------------------------------------------

def garota_group(outfit):
    base = f"outfit_{outfit}"
    return {
        "name": f"garota outfit_{outfit}",
        "folders": [
            f"{base}/garota-idle",
            f"{base}/garota-walking",
            f"{base}/garota-comendo",
            f"{base}/garota-sono",
        ],
        "ref": f"{base}/garota-idle",
        "scale_match": {
            f"{base}/garota-idle",
            f"{base}/garota-walking",
            f"{base}/garota-comendo",
        },
    }

GROUPS = [garota_group(0), garota_group(1), garota_group(2)]

GROUPS.append({
    "name": "gato-preto",
    "folders": [
        "gato-preto-idle",
        "gato-preto-andando",
        "gato-preto-comendo",
        "gato-preto-brincando",
        "gato-preto-sono",
    ],
    "ref": "gato-preto-idle",
    "scale_match": {"gato-preto-idle", "gato-preto-andando", "gato-preto-comendo"},
})

GROUPS.append({
    "name": "gato-malhado",
    "folders": [
        "gato-malhado-idle",
        "gato-malhado-andando",
        "gato-malhado-comendo",
        "gato-malhado-brincando",
        "gato-malhado-sono",
    ],
    "ref": "gato-malhado-idle",
    "scale_match": {"gato-malhado-idle", "gato-malhado-andando", "gato-malhado-comendo"},
})


def list_frames(folder_abs):
    if not os.path.isdir(folder_abs):
        return []
    files = [f for f in os.listdir(folder_abs)
             if f.lower().startswith("frame_") and f.lower().endswith(".png")]
    # ordena por numero do frame
    def num(f):
        try:
            return int(f.split("_")[1].split(".")[0])
        except Exception:
            return 0
    return sorted(files, key=num)


def content_bbox(img):
    """bbox (left, top, right, bottom) do personagem (pixels com alpha)."""
    img = img.convert("RGBA")
    alpha = img.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:  # quadro vazio -> usa imagem inteira
        return (0, 0, img.width, img.height)
    return bbox


def analyze(group):
    """Mede cada quadro: tamanho do conteudo (personagem) por pasta."""
    data = {}  # folder -> list of (filename, img, bbox, cw, ch)
    for folder in group["folders"]:
        folder_abs = os.path.join(SPRITES, folder)
        frames = list_frames(folder_abs)
        entries = []
        for fn in frames:
            img = Image.open(os.path.join(folder_abs, fn)).convert("RGBA")
            bbox = content_bbox(img)
            cw = bbox[2] - bbox[0]
            ch = bbox[3] - bbox[1]
            entries.append((fn, img, bbox, cw, ch))
        if entries:
            data[folder] = entries
    return data


def compute_scales(group, data):
    """Fator de escala por pasta (altura do personagem em pe = referencia)."""
    ref = group["ref"]
    # altura "em pe" de uma animacao = maior altura de personagem entre os quadros
    def standing_h(folder):
        return max(ch for (_, _, _, _, ch) in data[folder]) if folder in data else 0

    ref_h = standing_h(ref) if ref in data else 0
    scales = {}
    for folder in data:
        if folder in group["scale_match"] and ref_h > 0:
            h = standing_h(folder)
            f = ref_h / h if h > 0 else 1.0
            # so REDUZIMOS (downscale). Aumentar pixel-art borra e costuma indicar
            # pose diferente, nao diferenca de resolucao -> deixa no original.
            scales[folder] = min(f, 1.0)
        else:
            scales[folder] = 1.0
    return scales


def process(dry_run=False):
    print(f"Sprites em: {SPRITES}\n")
    if not dry_run:
        os.makedirs(BACKUP, exist_ok=True)

    for group in GROUPS:
        data = analyze(group)
        if not data:
            continue
        scales = compute_scales(group, data)

        # tamanho do canvas unico: maior conteudo (ja escalado) do grupo + PAD
        max_w = max_h = 0
        for folder, entries in data.items():
            s = scales[folder]
            for (_, _, _, cw, ch) in entries:
                max_w = max(max_w, round(cw * s))
                max_h = max(max_h, round(ch * s))
        canvas_w = max_w + PAD * 2
        canvas_h = max_h + PAD * 2

        print(f"== {group['name']} ==  canvas final: {canvas_w}x{canvas_h}")
        for folder, entries in data.items():
            s = scales[folder]
            tag = f"escala x{s:.3f}" if abs(s - 1.0) > 0.001 else "escala original"
            print(f"   {folder}: {len(entries)} quadros, {tag}")
            if dry_run:
                continue

            folder_abs = os.path.join(SPRITES, folder)
            # backup da pasta inteira (uma vez)
            bdir = os.path.join(BACKUP, folder)
            if not os.path.exists(bdir):
                os.makedirs(os.path.dirname(bdir), exist_ok=True)
                shutil.copytree(folder_abs, bdir)

            for (fn, img, bbox, cw, ch) in entries:
                content = img.crop(bbox)
                if abs(s - 1.0) > 0.001:
                    nw = max(1, round(cw * s))
                    nh = max(1, round(ch * s))
                    content = content.resize((nw, nh), Image.NEAREST)
                sw, sh = content.size
                canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
                x = (canvas_w - sw) // 2          # centraliza horizontal
                y = canvas_h - sh - PAD           # ancora os pes na base
                canvas.paste(content, (x, y), content)
                canvas.save(os.path.join(folder_abs, fn))
        print()

    if dry_run:
        print("(dry-run: nada foi alterado)")
    else:
        print(f"Pronto! Backup do original em: {BACKUP}")


def restore():
    if not os.path.isdir(BACKUP):
        print("Nao ha backup pra restaurar.")
        return
    for root, _, files in os.walk(BACKUP):
        for f in files:
            src = os.path.join(root, f)
            rel = os.path.relpath(src, BACKUP)
            dst = os.path.join(SPRITES, rel)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(src, dst)
    print("Sprites restaurados do backup.")


if __name__ == "__main__":
    if "--restore" in sys.argv:
        restore()
    else:
        process(dry_run="--dry-run" in sys.argv)
