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
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
      hit = !hit;
  }
  return hit;
}

function bridgePath(): string {
  const re = /M(-?\d+)[ ,](-?\d+)h(\d+)v(\d+)/g;
  const xs = HEAL_CORRIDOR.map((p) => p[0]);
  const ys = HEAL_CORRIDOR.map((p) => p[1]);
  const x0 = Math.min(...xs),
    x1 = Math.max(...xs),
    y0 = Math.min(...ys),
    y1 = Math.max(...ys);
  const w = x1 - x0 + 1;
  const grid = new Uint8Array(w * (y1 - y0 + 1));
  let m: RegExpExecArray | null;
  while ((m = re.exec(data.letterL)) !== null) {
    const [rx, ry, rw, rh] = [+m[1], +m[2], +m[3], +m[4]];
    for (let y = Math.max(ry, y0); y < Math.min(ry + rh, y1 + 1); y++) {
      for (let x = Math.max(rx, x0); x < Math.min(rx + rw, x1 + 1); x++) {
        if (inside([x + 0.5, y + 0.5], HEAL_CORRIDOR))
          grid[(y - y0) * w + (x - x0)] = 1;
      }
    }
  }
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

export type Distribution =
  | "refined"
  | "signature"
  | "signature_clean"
  | "essential"
  | "star"
  | "original"
  | "minimal";

/** `color`: cor própria (as estrelinhas companheiras); sem ela, o rosa do L / pétala */
export type Accent = (typeof data.accents)[number] & { color?: string };

/**
 * Estrela redesenhada (pixel art 11x11, simétrica nos dois eixos, com braços
 * afinando até 1 pixel e miolo cheio, como um ✦). Cada pixel vale 3 unidades,
 * alinhada à grade de 3px da logo animada.
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
const STAR_ORIGIN = { x: 78, y: 27 };

/**
 * As estrelas do desenho original eram tortas (braços de cima e de baixo
 * deslocados, laterais desiguais). Todas as grandes ganham o mesmo desenho
 * simétrico da estrela nova, em tamanhos menores, centradas onde estavam e
 * encaixadas na grade de 3 unidades. A do olho do M é a menor: dentro do laço
 * só há uns 11 de folga pra cada lado.
 */
const STAR_ROWS_9 = [
  "....#....",
  "....#....",
  "...###...",
  "..#####..",
  "#########",
  "..#####..",
  "...###...",
  "....#....",
  "....#....",
];
const STAR_ROWS_7 = [
  "...#...",
  "...#...",
  "..###..",
  "#######",
  "..###..",
  "...#...",
  "...#...",
];
const CUTE_SPARKLE_ROWS: Record<string, string[]> = {
  sparkle_inner_m_loop: STAR_ROWS_7,
  sparkle_mid_right: STAR_ROWS_9,
  sparkle_top_right: STAR_ROWS_9,
  sparkle_top_center: STAR_ROWS_9,
};

/** a do olho do M estava encostada no traço da direita; 2 pixels pra esquerda a centram no laço */
const CUTE_SPARKLE_SHIFT: Record<string, { x: number; y: number }> = {
  sparkle_inner_m_loop: { x: -6, y: 0 },
};

/** troca o desenho torto de uma estrela original pelo simétrico, no mesmo centro */
function cuteSparkle(a: Accent): Accent {
  const rows = CUTE_SPARKLE_ROWS[a.id];
  if (!rows) return a;
  const size = rows.length * STAR_PX;
  const shift = CUTE_SPARKLE_SHIFT[a.id] ?? { x: 0, y: 0 };
  const snap = (v: number) => Math.round(v / STAR_PX) * STAR_PX;
  return pixelAccent(
    a.id,
    rows,
    { x: snap(a.centerX - size / 2) + shift.x, y: snap(a.centerY - size / 2) + shift.y },
    "sparkle",
    a.color
  );
}

const COMPANIONS = [
  {
    id: "star_companion_lime",
    rows: ["..#..", "..#..", "#####", "..#..", "..#.."],
    origin: { x: 114, y: 18 },
    color: "#a3e635",
  },
  {
    id: "star_companion_lilac",
    rows: [".#.", "###", ".#."],
    origin: { x: 66, y: 57 },
    color: "#d8b4fe",
  },
];

function pixelAccent(
  id: string,
  rows: string[],
  origin: { x: number; y: number },
  type: string,
  color?: string
): Accent {
  const size = rows.length * STAR_PX;
  let dSolid = "";
  let dDither = "";
  rows.forEach((row, y) => {
    const first = row.indexOf("#");
    const last = row.lastIndexOf("#");
    const w = (last - first + 1) * STAR_PX;
    dSolid += `M${first * STAR_PX} ${y * STAR_PX}h${w}v${STAR_PX}h-${w}z`;
    for (let x = first; x <= last; x++) {
      if (row[x] === "#" && (x + y) % 2 === 0) {
        dDither += `M${x * STAR_PX} ${y * STAR_PX}h${STAR_PX}v${STAR_PX}h-${STAR_PX}z`;
      }
    }
  });
  const base = data.accents.find((a) => a.type === "sparkle")!;
  return {
    ...base,
    id,
    type,
    pathSolid: dSolid,
    pathDither: dDither || dSolid,
    pathOutline: dDither || dSolid,
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

export function starAccents(): Accent[] {
  return [
    pixelAccent("star_m_top_left", STAR_ROWS, STAR_ORIGIN, "sparkle"),
    ...COMPANIONS.map((c) =>
      pixelAccent(c.id, c.rows, c.origin, "micro", c.color)
    ),
  ];
}

export function companionAccentsOnly(): Accent[] {
  return COMPANIONS.map((c) =>
    pixelAccent(c.id, c.rows, c.origin, "micro", c.color)
  );
}

const ESSENTIAL = new Set(["petals_right_left", "petals_right_right"]);
const STAR = new Set([...ESSENTIAL, "sparkle_top_right"]);
const SIGNATURE_BASE = new Set([
  ...ESSENTIAL,
  "micro_sparkle_right_top",
  "micro_sparkle_right_left",
  "micro_sparkle_right_right",
  "micro_sparkle_right_bot",
]);
const EXTRA_DETAILS = new Set([
  "sparkle_inner_m_loop",
  "petal_bottom_left",
  "sparkle_mid_right",
]);

/**
 * refined         = todos os elementos originais + nossos 3 detalhes nos espaços vazios
 *                   (olho do M, pétala inferior esq., estrela direita) + estrelinhas companheiras
 * signature       = a seleção curada (pétalas da cauda + estrela simétrica no topo esq. + companheiras)
 *                   + nossos 3 detalhes nos espaços vazios
 * signature_clean = só pétalas da cauda + estrela simétrica no topo esq. + companheiras
 * essential       = só as duas pétalas da cauda
 * star            = + a estrela original, no alto à direita
 * original        = todos os 10 elementos da imagem original
 * minimal         = só M+L
 */
export function accentsFor(distribution: Distribution): Accent[] {
  return baseAccentsFor(distribution).map(cuteSparkle);
}

function baseAccentsFor(distribution: Distribution): Accent[] {
  if (distribution === "minimal") return [];
  if (distribution === "refined") {
    return [...data.accents, ...companionAccentsOnly()];
  }
  if (distribution === "signature") {
    return [
      ...data.accents.filter(
        (a) => SIGNATURE_BASE.has(a.id) || EXTRA_DETAILS.has(a.id)
      ),
      ...starAccents(),
    ];
  }
  if (distribution === "signature_clean") {
    return [
      ...data.accents.filter((a) => SIGNATURE_BASE.has(a.id)),
      ...starAccents(),
    ];
  }
  if (distribution === "essential")
    return data.accents.filter((a) => ESSENTIAL.has(a.id));
  if (distribution === "star")
    return data.accents.filter((a) => STAR.has(a.id));
  return data.accents.filter((a) => !a.isExtra);
}

export const VIEWBOX = data.viewBox;

/** Caixa do desenho (letras + elementos), em unidades do viewBox, pra recortar a marca sem sobra. */
export function boundsFor(distribution: Distribution) {
  const re = /M(-?\d+)[ ,](-?\d+)h(\d+)v(\d+)/g;
  let x0 = Infinity,
    y0 = Infinity,
    x1 = -Infinity,
    y1 = -Infinity;
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
