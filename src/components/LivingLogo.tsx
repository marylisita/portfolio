"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { LETTER_L, LETTER_M, M_BRIDGE, accentsFor, Distribution } from "./logoGeometry";
import { GLYPHS as SCRAMBLE_GLYPHS, COLORS as SCRAMBLE_COLORS } from "./ScrambleText";
import { sparkBurst } from "./sparkBurst";

/**
 * Monograma escolhido (Exp 2 Spencerian, cores 00) desenhado em canvas como
 * uma grade de pixels de 3 unidades.
 *
 * Entradas (a tinta segue o traço de verdade: busca em largura pelos pixels
 * de cada letra, a partir da ponta da pena):
 * - decodeInk: escrita em 2 atos. Ato 1: uma pena de glifos fofos do
 *              cabeçalho (♡ ✦ ✿ ✧ ⋆ ✳ ⊹…), nas cores da casa e com o giro e
 *              a escala do ScrambleText, escreve o M e depois o L; atrás dela
 *              o traço condensa em retícula 8-bit e então em pixel sólido.
 *              Ato 2: com o monograma escrito, as pétalas desabrocham em
 *              cascata (de ✿ ♡ ✦ ⋆ ₊ ˚ pra pixel) e cada uma solta a mesma
 *              chuvinha de faíscas do nome no cabeçalho (sparkBurst).
 * - ink:       a tinta em pixel, com a frente clara secando.
 * - decode:    campo de glifos que assentam e derretem numa varredura.
 * O M passa por dentro do L: na entrada, o M é desenhado também pelo trecho
 * escondido sob o laço do L, que o L cobre quando chega.
 *
 * Hover "bloom" (padrão), o mesmo gesto do nome no cabeçalho: ao entrar com
 * o mouse, as pétalas e a estrela voltam a glifo, passam pela retícula, viram
 * pixel em cascata e cada uma solta a chuvinha de faíscas (sparkBurst). Uma
 * vez por entrada, com folga de 450ms; sem toque, sem movimento reduzido e
 * sem o modo lite do site. Sem pétalas (só M+L), a chuvinha sai da logo toda.
 *
 * Hover "scramble", o mesmo das letras dos títulos (ScrambleText): cada
 * ladrilho da logo por onde o mouse passa vira uma grade 3x3 dos símbolos da
 * casa, nas cores da casa, girados e de tamanhos diferentes; re-sorteia 5
 * vezes a cada 85ms e volta ao pixel. Como no ScrambleText, só roda com
 * mouse (hover + ponteiro fino) e sem movimento reduzido.
 */

export type LivingIntro = "decodeInk" | "ink" | "decode" | "none";
export type LivingHover = "bloom" | "scramble" | "none";

export interface LivingLogoProps {
  size?: number;
  inkColor?: string;
  accentColor?: string;
  distribution?: Distribution;
  intro?: LivingIntro;
  hover?: LivingHover;
  motion?: "auto" | "reduce";
  /** acelera a entrada (1 = normal); a tela de carregamento usa mais rápido */
  speed?: number;
  /** chamado uma vez quando a entrada termina (ou logo de cara, sem entrada) */
  onIntroEnd?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const W = 412;
const H = 320;
const CELL = 3;
const GW = Math.ceil(W / CELL);
const GH = Math.ceil(H / CELL);
const PAD = 0.06; // folga do canvas pros glifos da borda

const L_LABEL = 1;
const M_LABEL = 2;
const A_LABEL = 3;

// tinta em pixel (ink)
const M_DUR = 1150;
const L_START = 900;
const L_DUR = 1000;
const HEAD_INK = 12;
const ACC_START = L_START + L_DUR + 80; // pétalas só depois que a tinta inteira secou
const ACC_STAGGER = 110;
const ACC_POP = 120;

// tinta decode: frente de glifos + frente de pixel atrasada
const DI_M_DUR = 900;
const DI_L_START = 700;
const DI_L_DUR = 850;
const DI_LAG_DITHER = 240; // a retícula vem esse tempo atrás da pena de glifos
const DI_LAG_PIXEL = 440; // e o pixel sólido, esse
const DI_ACC_START = DI_L_START + DI_LAG_PIXEL + DI_L_DUR + 80; // ato 2: só com o monograma inteiro em pixel
const DI_ACC_STAGGER = 170;
const DI_ACC_GLYPH = 260; // a pétala desabrocha em glifo...
const DI_ACC_DITHER = 90; // ...passa pela retícula e vira pixel (e solta as faíscas)
const SPARKS_TOTAL = 16; // como o nome do cabeçalho, divididas entre as pétalas

// decode em campo
const DEC_SETTLE = 700;
const DEC_SWEEP = 1050;
const DEC_SWEEP_SPAN = 520;
const DEC_END = DEC_SWEEP + DEC_SWEEP_SPAN + 120;

const BLOCK = 3; // blocos de glifo: 3x3 células = 9 unidades
// glifos fofos do cabeçalho no lugar dos símbolos de código
const PEN_GLYPHS = ["♡", "✦", "✧", "⋆", "✿", "✳", "⊹", "₊", "˚", "°", "·", "⠂", "⠁", "░", "≈"];
const BLOOM_GLYPHS = ["✿", "♡", "✦", "⋆", "₊", "˚"];
/** a paleta multicolorida da casa; a tinta escura vira a tinta do tema */
const PEN_COLORS = ["#FF2E9A", "#f472b6", "#d8b4fe", "#a3e635", "#99f6e4", "#C4125F", "ink"];
const RAMP = ["·", "˚", "⋆", "✧", "✦", "✿"];

// hover scramble: os mesmos números do ScrambleText do cabeçalho
const TILE = 3; // ladrilho = 3x3 blocos = 27 unidades; cada bloco é uma casa da grade
const SCR_STEPS = 5;
const SCR_STEP_MS = 85;

// hover bloom: o ato 2 de novo, mais curto, uma vez por entrada (como o nome no cabeçalho)
const BLOOM_GAP = 450;
const BLOOM_STAGGER = 120;
const BLOOM_GLYPH = 220;
const BLOOM_DITHER = 80;

type Rect = [number, number, number, number];

function parseRects(path: string): Rect[] {
  const rects: Rect[] = [];
  const re = /M(-?\d+)[ ,](-?\d+)h(\d+)v(\d+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(path)) !== null) rects.push([+m[1], +m[2], +m[3], +m[4]]);
  return rects;
}

/** Hash determinístico em [0, 1): o embaralhamento é igual em todo render. */
function hash(n: number): number {
  n = (n ^ 61) ^ (n >>> 16);
  n = n + (n << 3);
  n = n ^ (n >>> 4);
  n = Math.imul(n, 0x27d4eb2d);
  n = n ^ (n >>> 15);
  return (n >>> 0) / 4294967296;
}

function parseHex(c: string): [number, number, number] | null {
  const m = c.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split("").map((x) => x + x).join("") : m[1];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** Mistura duas cores hex; se alguma não for hex, devolve a primeira. */
function mix(a: string, b: string, t: number): string {
  const pa = parseHex(a);
  const pb = parseHex(b);
  if (!pa || !pb) return a;
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

const easeInOutSine = (x: number) => -(Math.cos(Math.PI * Math.min(1, Math.max(0, x))) - 1) / 2;

interface Model {
  n: number;
  gx: Int16Array;
  gy: Int16Array;
  label: Uint8Array;
  /** célula do trecho do M escondido sob o L */
  bridge: Uint8Array;
  acc: Int16Array;
  dM: Int32Array;
  dL: Int32Array;
  maxDM: number;
  maxDL: number;
  accentCount: number;
  /** cor própria de cada elemento (estrelinhas companheiras), ou null */
  accentColorOf: (string | null)[];
  /** caixa de cada pétala, em unidades (origem das faíscas do ato 2) */
  accentBox: { x: number; y: number; w: number; h: number }[];
  /** célula -> bloco de glifo */
  blockOf: Int32Array;
  blocks: { cells: number[]; bx: number; by: number; label: number; density: number }[];
  /** ladrilho (tx + ty * 1000) -> blocos com tinta */
  tiles: Map<number, number[]>;
  /** bloco -> ladrilho */
  tileOf: Int32Array;
}

function buildModel(distribution: Distribution): Model {
  const lUnit = new Uint8Array(W * H);
  const mUnit = new Uint8Array(W * H);
  const bUnit = new Uint8Array(W * H);
  const aUnit = new Int16Array(W * H).fill(-1);
  const fill = (rects: Rect[], ox: number, oy: number, put: (i: number) => void) => {
    for (const [x, y, w, h] of rects) {
      for (let yy = Math.max(0, y + oy); yy < Math.min(H, y + oy + h); yy++) {
        for (let xx = Math.max(0, x + ox); xx < Math.min(W, x + ox + w); xx++) put(yy * W + xx);
      }
    }
  };
  fill(parseRects(LETTER_L), 0, 0, (i) => (lUnit[i] = 1));
  fill(parseRects(LETTER_M), 0, 0, (i) => (mUnit[i] = 1));
  fill(parseRects(M_BRIDGE), 0, 0, (i) => (bUnit[i] = 1));
  const accents = accentsFor(distribution);
  accents.forEach((a, ai) => fill(parseRects(a.pathSolid), a.x, a.y, (i) => (aUnit[i] = ai)));

  const gx: number[] = [];
  const gy: number[] = [];
  const label: number[] = [];
  const bridge: number[] = [];
  const acc: number[] = [];
  const lOcc: boolean[] = [];
  const mOcc: boolean[] = [];
  const lAt = new Int32Array(GW * GH).fill(-1);
  const mAt = new Int32Array(GW * GH).fill(-1);

  for (let cy = 0; cy < GH; cy++) {
    for (let cx = 0; cx < GW; cx++) {
      let l = 0, m = 0, a = 0, b = 0, aIdx = -1;
      for (let yy = cy * CELL; yy < Math.min(H, cy * CELL + CELL); yy++) {
        for (let xx = cx * CELL; xx < Math.min(W, cx * CELL + CELL); xx++) {
          const i = yy * W + xx;
          if (aUnit[i] >= 0) {
            a++;
            aIdx = aUnit[i];
          } else if (mUnit[i]) m++;
          else if (lUnit[i]) l++;
          if (bUnit[i]) b++;
        }
      }
      // limiar baixo (3 de 9) pra não perder pontas finas
      if (l + m + a < 3) continue;
      const lab = a >= m && a >= l && a > 0 ? A_LABEL : m >= l ? M_LABEL : L_LABEL;
      const isBridge = lab === L_LABEL && b >= 3;
      const idx = gx.length;
      gx.push(cx);
      gy.push(cy);
      label.push(lab);
      bridge.push(isBridge ? 1 : 0);
      acc.push(lab === A_LABEL ? aIdx : -1);
      // o L passa por baixo do M nos cruzamentos de baixo: a célula conta pro caminho do L mesmo coberta
      const inL = lab === L_LABEL || (lab === M_LABEL && l > 0);
      // e o M passa por baixo do L no de cima (a ponte)
      const inM = lab === M_LABEL || isBridge;
      lOcc.push(inL);
      mOcc.push(inM);
      if (inL) lAt[cy * GW + cx] = idx;
      if (inM) mAt[cy * GW + cx] = idx;
    }
  }

  const n = gx.length;

  // Distância pelo traço (BFS 8-vizinhos). Duas buscas acham as pontas do
  // traço; a pena começa na ponta escolhida por `pickStart`. Partes soltas
  // continuam a contagem de onde a anterior parou.
  const strokeDistance = (at: Int32Array, occ: boolean[], pickStart: (a: number, b: number) => number) => {
    const dist = new Int32Array(n).fill(-1);
    const bfs = (start: number, base: number, out: Int32Array) => {
      const q = [start];
      out[start] = base;
      let far = start;
      for (let h = 0; h < q.length; h++) {
        const c = q[h];
        if (out[c] > out[far]) far = c;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            const x = gx[c] + dx;
            const y = gy[c] + dy;
            if (x < 0 || y < 0 || x >= GW || y >= GH) continue;
            const nb = at[y * GW + x];
            if (nb >= 0 && out[nb] < 0) {
              out[nb] = out[c] + 1;
              q.push(nb);
            }
          }
        }
      }
      return far;
    };
    let base = 0;
    for (;;) {
      let seed = -1;
      for (let i = 0; i < n; i++) {
        if (occ[i] && dist[i] < 0 && (seed < 0 || gx[i] < gx[seed])) seed = i;
      }
      if (seed < 0) break;
      const a = bfs(seed, 0, new Int32Array(n).fill(-1));
      const b = bfs(a, 0, new Int32Array(n).fill(-1));
      const far = bfs(pickStart(a, b), base, dist);
      base = dist[far] + 1;
    }
    let max = 0;
    for (let i = 0; i < n; i++) if (dist[i] > max) max = dist[i];
    return { dist, max };
  };

  const m = strokeDistance(mAt, mOcc, (a, b) => (gx[a] <= gx[b] ? a : b)); // M: começa pela ponta da esquerda
  const l = strokeDistance(lAt, lOcc, (a, b) => (gy[a] <= gy[b] ? a : b)); // L: começa pelo laço de cima

  const blockOf = new Int32Array(n);
  const blockIndex = new Map<number, number>();
  const blocks: Model["blocks"] = [];
  for (let i = 0; i < n; i++) {
    const bx = Math.floor(gx[i] / BLOCK);
    const by = Math.floor(gy[i] / BLOCK);
    const key = by * 1000 + bx;
    let b = blockIndex.get(key);
    if (b === undefined) {
      b = blocks.length;
      blockIndex.set(key, b);
      blocks.push({ cells: [], bx, by, label: 0, density: 0 });
    }
    blocks[b].cells.push(i);
    blockOf[i] = b;
  }
  const tiles = new Map<number, number[]>();
  const tileOf = new Int32Array(blocks.length);
  blocks.forEach((blk, b) => {
    const counts = [0, 0, 0, 0];
    for (const c of blk.cells) counts[label[c]]++;
    blk.label =
      counts[A_LABEL] >= counts[M_LABEL] && counts[A_LABEL] >= counts[L_LABEL] && counts[A_LABEL] > 0
        ? A_LABEL
        : counts[M_LABEL] >= counts[L_LABEL]
        ? M_LABEL
        : L_LABEL;
    blk.density = blk.cells.length / (BLOCK * BLOCK);
    const key = Math.floor(blk.by / TILE) * 1000 + Math.floor(blk.bx / TILE);
    tileOf[b] = key;
    const list = tiles.get(key);
    if (list) list.push(b);
    else tiles.set(key, [b]);
  });

  return {
    n,
    gx: Int16Array.from(gx),
    gy: Int16Array.from(gy),
    label: Uint8Array.from(label),
    bridge: Uint8Array.from(bridge),
    acc: Int16Array.from(acc),
    dM: m.dist,
    dL: l.dist,
    maxDM: m.max,
    maxDL: l.max,
    accentCount: accents.length,
    accentBox: accents.map((a) => ({ x: a.x, y: a.y, w: a.width, h: a.height })),
    accentColorOf: accents.map((a) => a.color ?? null),
    blockOf,
    blocks,
    tiles,
    tileOf,
  };
}

/**
 * O canvas passa da logo em PAD de cada lado; o contêiner deve cortar
 * (overflow: hidden) se não puder gerar rolagem lateral.
 */
export function LivingLogo({
  size = 410,
  inkColor = "#1C1B18",
  accentColor = "#FF2A85",
  distribution = "signature",
  intro = "decodeInk",
  hover = "bloom",
  motion = "auto",
  speed = 1,
  onIntroEnd,
  className = "",
  style,
}: LivingLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const model = useMemo(() => buildModel(distribution), [distribution]);
  // o hover fica num ref: trocar de hover não pode reiniciar a entrada
  const hoverRef = useRef(hover);
  const onIntroEndRef = useRef(onIntroEnd);
  useEffect(() => {
    hoverRef.current = hover;
    onIntroEndRef.current = onIntroEnd;
  }, [hover, onIntroEnd]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = motion === "reduce" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // como no ScrambleText: só com mouse de verdade
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduced;
    const activeIntro: LivingIntro = reduced ? "none" : intro;
    const n = model.n;
    const colorIdx = new Uint8Array(n);
    /** 0 pixel normal, 1 glifo embaralhando, 2 glifo assentado (entradas) */
    const cellGlyph = new Uint8Array(n);
    const blockCount = new Uint16Array(model.blocks.length);
    const blockScramble = new Uint8Array(model.blocks.length);
    /** célula na fase de retícula (só metade dos pixels, em xadrez) */
    const cellDither = new Uint8Array(n);
    const penColors = PEN_COLORS.map((c) => (c === "ink" ? inkColor : c));
    /** pétalas que já soltaram as faíscas nesta entrada */
    const sparked = new Set<number>();

    // paleta: 0 escondido, 1 L, 2 M, 3 pétala, depois tons de tinta molhada
    const palette = [
      "",
      accentColor,
      inkColor,
      accentColor,
      mix(accentColor, "#ffffff", 0.82), // 4: L molhado
      mix(accentColor, "#ffffff", 0.45), // 5: L secando
      mix(accentColor, "#ffffff", 0.35), // 6: M molhado (a pena é rosa)
      accentColor, //                       7: M secando
      mix(accentColor, inkColor, 0.55), //  8: M quase seco
    ];
    const family = getComputedStyle(canvas).getPropertyValue("--font-mono").trim() || "monospace";

    let scale = 1;
    let padPx = 0;
    const start = performance.now();
    /** tempo da entrada, já acelerado */
    const elapsed = (now: number) => (now - start) * speed;
    let introEnded = false;
    let raf = 0;
    let looping = false;

    const introEnd =
      activeIntro === "decodeInk"
        ? Math.max(
            DI_L_START + DI_LAG_PIXEL + DI_L_DUR + 80,
            model.accentCount
              ? DI_ACC_START + (model.accentCount - 1) * DI_ACC_STAGGER + DI_ACC_GLYPH + DI_ACC_DITHER + 60
              : 0
          )
        : activeIntro === "ink"
        ? Math.max(L_START + L_DUR + 80, model.accentCount ? ACC_START + model.accentCount * ACC_STAGGER + ACC_POP : 0)
        : activeIntro === "decode"
        ? DEC_END
        : 0;

    let bloomStart = -Infinity;
    const bloomSparked = new Set<number>();
    const bloomEnd = model.accentCount ? (model.accentCount - 1) * BLOOM_STAGGER + BLOOM_GLYPH + BLOOM_DITHER : 0;

    /** chuvinha de faíscas do cabeçalho saindo da pétala `ai` (ou da logo toda, com ai = -1) */
    const fireSparks = (ai: number) => {
      const host = canvas.parentElement;
      if (!host) return;
      const box = ai >= 0 ? model.accentBox[ai] : null;
      sparkBurst(host, {
        count: box ? Math.max(6, Math.round(SPARKS_TOTAL / model.accentCount)) : SPARKS_TOTAL,
        size: host.clientWidth * 0.055,
        area: box
          ? { left: (box.x / W) * 100, top: (box.y / H) * 100, width: (box.w / W) * 100, height: (box.h / H) * 100 }
          : { left: 10, top: 30, width: 80, height: 40 },
        mapColor: (c) => (c.toLowerCase() === "#1c1b18" || c.toLowerCase() === "#5b564a" ? inkColor : c),
      });
    };

    /** ladrilhos embaralhando: chave -> início */
    const activeTiles = new Map<number, number>();
    let lastTile = -1;
    let lastPoint: { x: number; y: number } | null = null;

    const wake = () => {
      if (!looping) {
        looping = true;
        raf = requestAnimationFrame(frame);
      }
    };

    const resize = () => {
      const cssW = canvas.parentElement?.clientWidth || size;
      const dpr = Math.min(3, window.devicePixelRatio || 1);
      const padCss = cssW * PAD;
      const cssH = (cssW * H) / W;
      canvas.style.width = `${cssW + padCss * 2}px`;
      canvas.style.height = `${cssH + padCss * 2}px`;
      canvas.style.left = `${-padCss}px`;
      canvas.style.top = `${-padCss}px`;
      canvas.width = Math.round((cssW + padCss * 2) * dpr);
      canvas.height = Math.round((cssH + padCss * 2) * dpr);
      scale = (cssW / W) * dpr;
      padPx = padCss * dpr;
      wake();
    };

    const toPx = (u: number) => u * scale + padPx;
    const tileSize = TILE * BLOCK * CELL;

    const toUnits = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const cssW = r.width / (1 + PAD * 2);
      const padCss = (r.width - cssW) / 2;
      const k = W / cssW;
      return { x: (e.clientX - r.left - padCss) * k, y: (e.clientY - r.top - padCss) * k };
    };

    /** acende o ladrilho sob o ponto, se tiver tinta e não estiver embaralhando */
    const touchTile = (x: number, y: number, now: number) => {
      const key = Math.floor(y / tileSize) * 1000 + Math.floor(x / tileSize);
      if (key === lastTile) return;
      lastTile = key;
      if (model.tiles.has(key) && !activeTiles.has(key)) activeTiles.set(key, now);
    };

    const onMove = (e: PointerEvent) => {
      if (!canHover || hoverRef.current !== "scramble" || e.pointerType !== "mouse") return;
      const now = performance.now();
      if (elapsed(now) < introEnd) return;
      const p = toUnits(e);
      // passada rápida: acende também os ladrilhos no caminho
      if (lastPoint) {
        const steps = Math.ceil(Math.hypot(p.x - lastPoint.x, p.y - lastPoint.y) / (tileSize * 0.5));
        for (let s = 1; s < steps; s++) {
          touchTile(lastPoint.x + ((p.x - lastPoint.x) * s) / steps, lastPoint.y + ((p.y - lastPoint.y) * s) / steps, now);
        }
      }
      touchTile(p.x, p.y, now);
      lastPoint = p;
      if (activeTiles.size) wake();
    };
    const onLeave = () => {
      lastTile = -1;
      lastPoint = null;
    };

    const onEnter = (e: PointerEvent) => {
      if (!canHover || hoverRef.current !== "bloom" || e.pointerType !== "mouse") return;
      if (document.documentElement.dataset.motion === "lite") return;
      const now = performance.now();
      if (elapsed(now) < introEnd || now - bloomStart < BLOOM_GAP) return;
      bloomStart = now;
      bloomSparked.clear();
      if (!model.accentCount) fireSparks(-1);
      wake();
    };

    canvas.addEventListener("pointerenter", onEnter);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    function draw(now: number) {
      const t = elapsed(now);
      const playing = t < introEnd;
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      cellGlyph.fill(0);

      // 1) entrada
      cellDither.fill(0);
      if (playing && activeIntro === "decodeInk") {
        // ato 1: pena de glifos -> retícula -> pixel, pelo mesmo traço
        const g = (x: number, dur: number, max: number) => easeInOutSine(x / dur) * (max + 2);
        const fronts = {
          M: {
            g: g(t, DI_M_DUR, model.maxDM),
            d: g(t - DI_LAG_DITHER, DI_M_DUR, model.maxDM),
            p: g(t - DI_LAG_PIXEL, DI_M_DUR, model.maxDM),
          },
          L: {
            g: g(t - DI_L_START, DI_L_DUR, model.maxDL),
            d: g(t - DI_L_START - DI_LAG_DITHER, DI_L_DUR, model.maxDL),
            p: g(t - DI_L_START - DI_LAG_PIXEL, DI_L_DUR, model.maxDL),
          },
        };
        for (let i = 0; i < n; i++) {
          const lab = model.label[i];
          let c = 0;
          let glyph = 0;
          let dither = 0;
          if (lab === A_LABEL) {
            // ato 2: a pétala desabrocha em glifo, passa pela retícula e vira pixel
            const tt = t - DI_ACC_START - model.acc[i] * DI_ACC_STAGGER;
            if (tt > DI_ACC_GLYPH + DI_ACC_DITHER) c = A_LABEL;
            else if (tt > DI_ACC_GLYPH) {
              c = A_LABEL;
              dither = 1;
            } else if (tt > 0) glyph = 1;
          } else {
            const dist = { M: model.dM[i], L: model.dL[i] };
            const reach = (who: "M" | "L", f: number) => f > 0 && dist[who] >= 0 && dist[who] <= f;
            // M por cima do L, exceto na ponte, onde o L cobre o M quando chega
            const order: ("M" | "L")[] = model.bridge[i] ? ["L", "M"] : lab === M_LABEL ? ["M", "L"] : ["L"];
            for (const who of order) {
              const f = fronts[who];
              const solid = who === "M" ? M_LABEL : L_LABEL;
              if (reach(who, f.p)) {
                c = solid;
                break;
              }
              if (reach(who, f.d)) {
                c = solid;
                dither = 1;
                break;
              }
              if (reach(who, f.g)) {
                glyph = 1;
                break;
              }
            }
          }
          colorIdx[i] = glyph ? 0 : c;
          cellGlyph[i] = glyph;
          cellDither[i] = dither;
        }
      } else if (playing && activeIntro === "ink") {
        const head = HEAD_INK;
        const frontM = easeInOutSine(t / M_DUR) * (model.maxDM + head);
        const frontL = easeInOutSine((t - L_START) / L_DUR) * (model.maxDL + head);
        for (let i = 0; i < n; i++) {
          const lab = model.label[i];
          let c = 0;
          if (lab === A_LABEL) {
            if (t - ACC_START - model.acc[i] * ACC_STAGGER > 0) c = A_LABEL;
          } else {
            const dm = model.dM[i];
            const dl = model.dL[i];
            const fromL = frontL > 0 && dl >= 0 && dl <= frontL;
            const fromMraw = frontM > 0 && dm >= 0 && dm <= frontM;
            const fromM = (lab === M_LABEL && fromMraw) || (model.bridge[i] === 1 && fromMraw && !fromL);
            if (fromM) {
              const a = frontM - dm;
              c = a >= head ? M_LABEL : a < head * 0.33 ? 6 : a < head * 0.66 ? 7 : 8;
            } else if (fromL) {
              const a = frontL - dl;
              c = a >= head ? L_LABEL : a < head * 0.4 ? 4 : 5;
            }
          }
          colorIdx[i] = c;
        }
      } else if (playing && activeIntro === "decode") {
        const sweep = (t - DEC_SWEEP) / DEC_SWEEP_SPAN;
        for (let i = 0; i < n; i++) {
          const lab = model.label[i];
          const prog = (model.gx[i] * CELL + model.gy[i] * CELL) / (W + H);
          colorIdx[i] = prog <= sweep ? (prog > sweep - 0.04 ? (lab === M_LABEL ? 6 : 4) : lab) : 0;
        }
      } else {
        for (let i = 0; i < n; i++) colorIdx[i] = model.label[i];
      }

      // 2a) hover bloom: as pétalas voltam a glifo, retícula e pixel, em cascata
      const bloomT = now - bloomStart;
      if (!playing && bloomT < bloomEnd + 20) {
        for (let i = 0; i < n; i++) {
          if (model.label[i] !== A_LABEL) continue;
          const tt = bloomT - model.acc[i] * BLOOM_STAGGER;
          if (tt < 0 || tt >= BLOOM_GLYPH + BLOOM_DITHER) continue;
          if (tt < BLOOM_GLYPH) {
            colorIdx[i] = 0;
            cellGlyph[i] = 1;
          } else cellDither[i] = 1;
        }
        for (let ai = 0; ai < model.accentCount; ai++) {
          if (!bloomSparked.has(ai) && bloomT - ai * BLOOM_STAGGER >= BLOOM_GLYPH + BLOOM_DITHER) {
            bloomSparked.add(ai);
            fireSparks(ai);
          }
        }
      }

      // 2b) hover scramble: os ladrilhos embaralhando saem do pixel
      for (const [key, since] of activeTiles) {
        if (now - since >= SCR_STEPS * SCR_STEP_MS) activeTiles.delete(key);
      }
      if (activeTiles.size) {
        for (let i = 0; i < n; i++) {
          if (activeTiles.has(model.tileOf[model.blockOf[i]])) colorIdx[i] = 0;
        }
      }

      // 3) pixels, uma passada por cor, alinhados ao pixel do dispositivo
      for (let c = 1; c < palette.length; c++) {
        ctx!.fillStyle = palette[c];
        for (let i = 0; i < n; i++) {
          if (colorIdx[i] !== c) continue;
          if (cellDither[i] && (model.gx[i] + model.gy[i]) % 2) continue;
          const own = c === A_LABEL ? model.accentColorOf[model.acc[i]] : null;
          if (own) ctx!.fillStyle = own;
          const ux = model.gx[i] * CELL;
          const uy = model.gy[i] * CELL;
          const x0 = Math.round(toPx(ux));
          const y0 = Math.round(toPx(uy));
          ctx!.fillRect(x0, y0, Math.round(toPx(ux + CELL)) - x0, Math.round(toPx(uy + CELL)) - y0);
          if (own) ctx!.fillStyle = palette[c];
        }
      }

      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";

      // 4) glifos das entradas
      blockCount.fill(0);
      blockScramble.fill(0);
      let anyGlyph = false;
      for (let i = 0; i < n; i++) {
        const g = cellGlyph[i];
        if (!g) continue;
        const b = model.blockOf[i];
        blockCount[b]++;
        if (g === 1) blockScramble[b] = 1;
        anyGlyph = true;
      }
      const decodeField = playing && activeIntro === "decode";
      if (anyGlyph) {
        // pena de glifos fofos: cores da casa, giro e escala do ScrambleText, re-sorteio a cada 85ms
        ctx!.font = `700 ${BLOCK * CELL * 1.35 * scale}px "Segoe UI Symbol", ${family}, monospace`;
        const tick = Math.floor(t / SCR_STEP_MS);
        for (let b = 0; b < model.blocks.length; b++) {
          if (!blockCount[b]) continue;
          const blk = model.blocks[b];
          const pool = blk.label === A_LABEL ? BLOOM_GLYPHS : PEN_GLYPHS;
          const r = (k: number) => hash(b * 131 + tick * 977 + k * 7919);
          ctx!.save();
          ctx!.translate(toPx((blk.bx + 0.5) * BLOCK * CELL), toPx((blk.by + 0.5) * BLOCK * CELL));
          ctx!.rotate(((r(1) - 0.5) * 36 * Math.PI) / 180);
          const sc = 0.85 + r(2) * 0.4;
          ctx!.scale(sc, sc);
          ctx!.globalAlpha = 0.7 + r(3) * 0.3;
          ctx!.fillStyle = penColors[Math.floor(r(4) * penColors.length)];
          ctx!.fillText(pool[Math.floor(r(5) * pool.length)], 0, 0);
          ctx!.restore();
        }
        ctx!.globalAlpha = 1;
      }
      if (decodeField) {
        ctx!.font = `700 ${BLOCK * CELL * 1.45 * scale}px "Segoe UI Symbol", ${family}, monospace`;
        const sweep = (t - DEC_SWEEP) / DEC_SWEEP_SPAN;
        for (let b = 0; b < model.blocks.length; b++) {
          const blk = model.blocks[b];
          const cxu = (blk.bx + 0.5) * BLOCK * CELL;
          const cyu = (blk.by + 0.5) * BLOCK * CELL;
          if ((cxu + cyu) / (W + H) <= sweep) continue;
          const appear = (cxu / W) * 320 + hash(b * 17 + 3) * 260;
          if (t < appear) continue;
          const settle = DEC_SETTLE + hash(b * 23 + 7) * 260;
          const glyph =
            t < settle
              ? PEN_GLYPHS[Math.floor(hash(b * 101 + Math.floor(t / 45)) * PEN_GLYPHS.length)]
              : RAMP[Math.min(RAMP.length - 1, Math.round(blk.density * (RAMP.length - 1)))];
          ctx!.globalAlpha = t < settle ? 0.75 : 1;
          ctx!.fillStyle = blk.label === M_LABEL ? inkColor : accentColor;
          ctx!.fillText(glyph, toPx(cxu), toPx(cyu));
        }
        ctx!.globalAlpha = 1;
      }

      // ato 2: cada pétala, ao virar pixel, solta a chuvinha de faíscas do cabeçalho
      if (playing && activeIntro === "decodeInk") {
        for (let ai = 0; ai < model.accentCount; ai++) {
          if (sparked.has(ai) || t - DI_ACC_START - ai * DI_ACC_STAGGER < DI_ACC_GLYPH + DI_ACC_DITHER) continue;
          sparked.add(ai);
          fireSparks(ai);
        }
      }

      // 5) hover: grade 3x3 de símbolos da casa em cada ladrilho ativo, como o ScrambleText
      if (activeTiles.size) {
        const fs = BLOCK * CELL * 1.25 * scale;
        ctx!.font = `700 ${fs}px "Segoe UI Symbol", ${family}, monospace`;
        for (const [key, since] of activeTiles) {
          const step = Math.min(SCR_STEPS - 1, Math.floor((now - since) / SCR_STEP_MS));
          for (const b of model.tiles.get(key) ?? []) {
            const blk = model.blocks[b];
            const r = (k: number) => hash(b * 131 + step * 977 + k * 7919 + key);
            ctx!.save();
            ctx!.translate(toPx((blk.bx + 0.5) * BLOCK * CELL), toPx((blk.by + 0.5) * BLOCK * CELL));
            ctx!.rotate(((r(1) - 0.5) * 36 * Math.PI) / 180);
            const s = 0.85 + r(2) * 0.4;
            ctx!.scale(s, s);
            ctx!.globalAlpha = 0.7 + r(3) * 0.3;
            ctx!.fillStyle = SCRAMBLE_COLORS[Math.floor(r(4) * SCRAMBLE_COLORS.length)];
            ctx!.fillText(SCRAMBLE_GLYPHS[Math.floor(r(5) * SCRAMBLE_GLYPHS.length)], 0, 0);
            ctx!.restore();
          }
        }
        ctx!.globalAlpha = 1;
      }
    }

    function frame(now: number) {
      draw(now);
      if (!introEnded && elapsed(now) >= introEnd) {
        introEnded = true;
        onIntroEndRef.current?.();
      }
      const blooming = now - bloomStart < bloomEnd + 40;
      if (elapsed(now) < introEnd || activeTiles.size > 0 || blooming) raf = requestAnimationFrame(frame);
      else looping = false;
    }

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [model, size, inkColor, accentColor, intro, motion, speed]);

  return (
    <div
      className={className}
      style={{ position: "relative", width: `min(${size}px, 100%)`, aspectRatio: `${W} / ${H}`, ...style }}
    >
      <canvas ref={canvasRef} role="img" aria-label="Monograma ML de Maria Isabel Lisita" style={{ position: "absolute" }} />
    </div>
  );
}
