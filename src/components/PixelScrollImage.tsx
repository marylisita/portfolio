"use client";
import { useEffect, useRef } from "react";

/**
 * A imagem é DESCOBERTA em pixels conforme o scroll desce: os blocos vão
 * aparecendo aos poucos (cada um com seu limiar) até montar a foto, e no
 * fim o mosaico afina até a imagem nítida. Pedido dela:
 * "ir aparecendo um projeto enquanto o scroll desce, tipo descobrindo ele em pixels".
 *
 * No hover o mosaico volta a engrossar (a foto "se desmonta" em pixels).
 * Tudo reativo ao scroll — nada prende ou trava a página.
 */

// hash determinístico: mesmo bloco sempre com o mesmo limiar (não pisca a cada render)
function thresholdOf(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const COLS = 22;         // resolução da grade de descoberta (blocos na largura)
const SHARP_COLS = 160;  // a partir daqui já vale desenhar a imagem real
const REVEAL_END = 0.72; // até aqui os blocos aparecem; depois o mosaico afina

export default function PixelScrollImage({
  src,
  alt = "",
  ratio,
  className,
  style,
}: {
  src: string;
  alt?: string;
  /** proporção provisória (altura/largura) só pra evitar pulo antes de carregar;
   *  ao carregar, a proporção REAL do arquivo assume e manda. */
  ratio: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hoverRef = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = src;

    let ready = false;
    let raf = 0;
    let lastKey = "";

    const sizeCanvas = () => {
      // offsetWidth/Height, NÃO getBoundingClientRect: as peças da colagem são
      // rotacionadas, e o rect devolve a caixa envolvente inclinada — isso
      // dimensionava o bitmap errado e achatava a imagem (a EBAT, girada -4°,
      // era a mais distorcida).
      const w = wrap.offsetWidth;
      const h = wrap.offsetHeight;
      if (!w || !h) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      lastKey = "";
    };

    // desenha a imagem inteira num tamanho reduzido e devolve esse mini-canvas
    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d");

    const draw = (p: number, hover: number) => {
      if (!ready || !canvas.width || !offCtx) return;
      // quantiza pra não redesenhar à toa
      const key = `${Math.round(p * 40)}|${Math.round(hover * 10)}`;
      if (key === lastKey) return;
      lastKey = key;

      const W = canvas.width;
      const H = canvas.height;
      const aspect = H / W;
      const cols = COLS;
      const rows = Math.max(1, Math.round(cols * aspect));

      // a moldura já tem a proporção EXATA do arquivo (definida no load), então
      // desenhamos a imagem inteira: nada de recorte, nada de esticar.
      const sx = 0;
      const sy = 0;
      const sw = img.naturalWidth;
      const sh = img.naturalHeight;

      ctx.clearRect(0, 0, W, H);

      const revealP = Math.min(1, p / REVEAL_END);
      const sharpP = Math.max(0, (p - REVEAL_END) / (1 - REVEAL_END));

      // `coarse` = QUANTOS blocos cabem na largura. Mais blocos = mais nítido.
      // Descoberta: fica em COLS. Depois vai subindo até resolver na imagem real.
      const coarseBase = revealP < 1 ? cols : cols + (SHARP_COLS - cols) * sharpP;
      // hover derruba o número de blocos → a foto se desmonta em pixels
      const coarse = Math.max(4, Math.round(coarseBase * (1 - hover * 0.78)));

      if (revealP >= 1 && coarse >= SHARP_COLS * 0.9) {
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
        return;
      }

      // versão reduzida da imagem (1 pixel por bloco do mosaico atual)
      off.width = Math.max(1, coarse);
      off.height = Math.max(1, Math.round(coarse * aspect));
      offCtx.imageSmoothingEnabled = true;
      offCtx.clearRect(0, 0, off.width, off.height);
      offCtx.drawImage(img, sx, sy, sw, sh, 0, 0, off.width, off.height);

      ctx.imageSmoothingEnabled = false;
      if (revealP >= 1) {
        // todos os blocos já apareceram: desenha o mosaico inteiro
        ctx.drawImage(off, 0, 0, off.width, off.height, 0, 0, W, H);
        return;
      }

      // fase 1: descoberta — só os blocos cujo limiar já foi alcançado
      const bw = W / cols;
      const bh = H / rows;
      const ow = off.width / cols;
      const oh = off.height / rows;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (thresholdOf(y * cols + x) > revealP) continue;
          ctx.drawImage(
            off,
            x * ow, y * oh, Math.max(1, ow), Math.max(1, oh),
            Math.floor(x * bw), Math.floor(y * bh), Math.ceil(bw), Math.ceil(bh)
          );
        }
      }
    };

    const progress = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 quando o topo ainda está na borda de baixo; 1 quando subiu ~65% da tela
      return Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.65)));
    };

    const update = () => {
      raf = 0;
      draw(progress(), hoverRef.current);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    // hover: engrossa o mosaico com uma animaçãozinha
    let hoverRaf = 0;
    const animHover = (target: number) => {
      cancelAnimationFrame(hoverRaf);
      const step = () => {
        const d = target - hoverRef.current;
        hoverRef.current += d * 0.18;
        if (Math.abs(d) < 0.01) hoverRef.current = target;
        draw(progress(), hoverRef.current);
        if (hoverRef.current !== target) hoverRaf = requestAnimationFrame(step);
      };
      hoverRaf = requestAnimationFrame(step);
    };
    const onEnter = () => animHover(1);
    const onLeave = () => animHover(0);
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);

    const start = () => {
      ready = true;
      // a proporção real do arquivo assume — impossível esticar ou cortar
      wrap.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
      sizeCanvas();
      update();
    };
    if (img.complete && img.naturalWidth) start();
    else img.onload = start;

    window.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => { sizeCanvas(); update(); });
    ro.observe(wrap);

    return () => {
      window.removeEventListener("scroll", onScroll);
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(hoverRaf);
      img.onload = null;
    };
  }, [src]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", aspectRatio: `1 / ${ratio}`, ...style }}
    >
      <canvas
        ref={canvasRef}
        aria-label={alt}
        role="img"
        style={{ width: "100%", height: "100%", display: "block", imageRendering: "pixelated" }}
      />
    </div>
  );
}
