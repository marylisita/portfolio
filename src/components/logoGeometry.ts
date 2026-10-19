import data from "./model2SpencerianVectorData.json";

/**
 * Geometria compartilhada do monograma escolhido (Exp 2 Spencerian).
 *
 * O M passa por dentro do L: no cruzamento de cima o laço do L fica por cima
 * e interrompe a perna direita do M. O desenho final mantém isso. A "ponte"
 * abaixo é o trecho do M escondido sob o L; as animações desenham o M por ela
 * enquanto o L ainda não chegou, pra o M nunca aparecer cortado no meio da
 * entrada, e o L cobre a ponte quando passa.
 */

type Pt = [number, number];

/** Corredor (em unidades do viewBox 412x320) do M escondido sob o laço de cima do L. */
const HEAL_CORRIDOR: Pt[] = [
  [235, 96],
  [262, 93],
  [262, 135],
  [245, 135],
];

function inside([x, y]: Pt, poly: Pt[]): boolean {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

function bridgePath(): string {
  const re = /M(-?\d+)[ ,](-?\d+)h(\d+)v(\d+)/g;
  const xs = HEAL_CORRIDOR.map((p) => p[0]);
  const ys = HEAL_CORRIDOR.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const w = x1 - x0 + 1;
  const grid = new Uint8Array(w * (y1 - y0 + 1));
  let m: RegExpExecArray | null;
  while ((m = re.exec(data.letterL)) !== null) {
    const [rx, ry, rw, rh] = [+m[1], +m[2], +m[3], +m[4]];
    for (let y = Math.max(ry, y0); y < Math.min(ry + rh, y1 + 1); y++) {
      for (let x = Math.max(rx, x0); x < Math.min(rx + rw, x1 + 1); x++) {
        if (inside([x + 0.5, y + 0.5], HEAL_CORRIDOR)) grid[(y - y0) * w + (x - x0)] = 1;
      }
    }
  }
  // uma linha de pixels por vez, em spans contínuos
  let d = "";
  for (let y = y0; y <= y1; y++) {
    let x = x0;
    while (x <= x1) {
      if (!grid[(y - y0) * w + (x - x0)]) {
        x++;
        continue;
      }
      const start = x;
      while (x <= x1 && grid[(y - y0) * w + (x - x0)]) x++;
      d += `M${start} ${y}h${x - start}v1h-${x - start}z`;
    }
  }
  return d;
}

export const LETTER_M = data.letterM;
export const LETTER_L = data.letterL;
/** Pixels do M escondidos sob o L (só pras animações; o desenho final não os mostra). */
export const M_BRIDGE = bridgePath();

export type Distribution = "signature" | "essential" | "star" | "original" | "minimal";

/** `color`: cor própria (as estrelinhas companheiras); sem ela, o rosa do L */
type Accent = (typeof data.accents)[number] & { color?: string };

/**
 * Estrela redesenhada (a do desenho original era torta: braços de cima e de
 * baixo deslocados, laterais desiguais). Pixel art 11x11, simétrica nos dois
 * eixos, com braços afinando até 1 pixel e miolo cheio, como um ✦. Cada
 * pixel vale 3 unidades, a mesma grade da logo animada, pra não perder o
 * afinamento na reamostragem.
 */
const STAR_ROWS = [
  ".....#.....",
  ".....#.....",
  "....###....",
  "...#####...",
  ".#########.",
  "###########",
  ".#########.",
  "...#####...",
  "....###....",
  ".....#.....",
  ".....#.....",
];
const STAR_PX = 3;
/** canto da estrela (múltiplo de 3, alinhado à grade): no alto, à esquerda do M */
const STAR_ORIGIN = { x: 78, y: 27 };

/**
 * Estrelinhas companheiras, em outras cores da casa, deslocadas na diagonal
 * da estrela (ideia que veio do laboratório do Gemini).
 */
const COMPANIONS = [
  { id: "star_companion_lime", rows: ["..#..", "..#..", "#####", "..#..", "..#.."], origin: { x: 114, y: 18 }, color: "#a3e635" },
  { id: "star_companion_lilac", rows: [".#.", "###", ".#."], origin: { x: 66, y: 57 }, color: "#d8b4fe" },
];

function pixelAccent(id: string, rows: string[], origin: { x: number; y: number }, type: string, color?: string): Accent {
  const size = rows.length * STAR_PX;
  let d = "";
  rows.forEach((row, y) => {
    const first = row.indexOf("#");
    const w = (row.lastIndexOf("#") - first + 1) * STAR_PX;
    d += `M${first * STAR_PX} ${y * STAR_PX}h${w}v${STAR_PX}h-${w}z`;
  });
  const base = data.accents.find((a) => a.type === "sparkle")!;
  return {
    ...base,
    id,
    type,
    pathSolid: d,
    pathDither: d,
    pathOutline: d,
    x: origin.x,
    y: origin.y,
    width: size,
    height: size,
    centerX: origin.x + size / 2,
    centerY: origin.y + size / 2,
    isExtra: false,
    color,
  };
}

function starAccents(): Accent[] {
  return [
    pixelAccent("star_m_top_left", STAR_ROWS, STAR_ORIGIN, "sparkle"),
    ...COMPANIONS.map((c) => pixelAccent(c.id, c.rows, c.origin, "micro", c.color)),
  ];
}

const ESSENTIAL = new Set(["petals_right_left", "petals_right_right"]);
const STAR = new Set([...ESSENTIAL, "sparkle_top_right"]);
const SIGNATURE = new Set([
  ...ESSENTIAL,
  "micro_sparkle_right_top",
  "micro_sparkle_right_left",
  "micro_sparkle_right_right",
  "micro_sparkle_right_bot",
]);

/**
 * signature = a escolhida: as duas pétalas da cauda do L, o brilho miúdo ao
 *             lado delas e a estrela nova no alto, à esquerda do M
 * essential = só as duas pétalas da cauda
 * star      = + a estrela original, no alto à direita
 * original  = todos os elementos da imagem original
 * minimal   = só M+L
 */
export function accentsFor(distribution: Distribution): Accent[] {
  if (distribution === "minimal") return [];
  if (distribution === "signature") return [...data.accents.filter((a) => SIGNATURE.has(a.id)), ...starAccents()];
  if (distribution === "essential") return data.accents.filter((a) => ESSENTIAL.has(a.id));
  if (distribution === "star") return data.accents.filter((a) => STAR.has(a.id));
  return data.accents.filter((a) => !a.isExtra);
}

export const VIEWBOX = data.viewBox;

/** Caixa do desenho (letras + elementos), em unidades do viewBox, pra recortar a marca sem sobra. */
export function boundsFor(distribution: Distribution) {
  const re = /M(-?\d+)[ ,](-?\d+)h(\d+)v(\d+)/g;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const take = (path: string, ox: number, oy: number) => {
    for (const m of path.matchAll(re)) {
      x0 = Math.min(x0, +m[1] + ox);
      y0 = Math.min(y0, +m[2] + oy);
      x1 = Math.max(x1, +m[1] + ox + +m[3]);
      y1 = Math.max(y1, +m[2] + oy + +m[4]);
    }
  };
  take(LETTER_M, 0, 0);
  take(LETTER_L, 0, 0);
  for (const a of accentsFor(distribution)) take(a.pathSolid, a.x, a.y);
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}
