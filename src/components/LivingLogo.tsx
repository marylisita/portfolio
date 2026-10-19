"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  LETTER_L,
  LETTER_M,
  M_BRIDGE,
  accentsFor,
  Distribution,
} from "./logoGeometry";
import {
  GLYPHS as SCRAMBLE_GLYPHS,
  COLORS as SCRAMBLE_COLORS,
} from "./ScrambleText";
import { fireHeaderStyleBurst } from "./sparkBurst";

/** Como diferenciar o L das pétalas (mesmos modos do laboratório). */
export type DifferentiationMode =
  | "original_solid"
  | "nanquim_all"
  | "ascii_dither_petals"
  | "dual_tone_ruby"
  | "blush_petals"
  | "ink_petals";

export type LivingIntro = "decodeInk" | "ink" | "decode" | "none";
export type LivingHover = "bloom" | "replayInk" | "scramble" | "none";

export interface LivingLogoProps {
  size?: number | string;
  inkColor?: string;
  accentColor?: string;
  distribution?: Distribution;
  differentiationMode?: DifferentiationMode;
  intro?: LivingIntro;
  hover?: LivingHover;
  motion?: "auto" | "reduce";
  speed?: number;
  interactive?: boolean;
  onIntroEnd?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const W = 412;
const H = 320;
const CELL = 3;
const GW = Math.ceil(W / CELL);
const GH = Math.ceil(H / CELL);
const PAD = 0.06;

const L_LABEL = 1;
const M_LABEL = 2;
const A_LABEL = 3;

// tinta em pixel (ink)
const M_DUR = 1150;
const L_START = 900;
const L_DUR = 1000;
const HEAD_INK = 12;
const ACC_START = L_START + L_DUR + 80;
const ACC_STAGGER = 110;
const ACC_POP = 120;

// tinta decode: frente de glifos + frente de pixel atrasada
const DI_M_DUR = 900;
const DI_L_START = 700;
const DI_L_DUR = 850;
const DI_LAG_DITHER = 240;
const DI_LAG_PIXEL = 440;
const DI_ACC_START = DI_L_START + DI_LAG_PIXEL + DI_L_DUR + 80;
const DI_ACC_STAGGER = 140;
const DI_ACC_GLYPH = 240;
const DI_ACC_DITHER = 90;
const SPARKS_TOTAL = 18;

// decode em campo
const DEC_SETTLE = 700;
const DEC_SWEEP = 1050;
const DEC_SWEEP_SPAN = 520;
const DEC_END = DEC_SWEEP + DEC_SWEEP_SPAN + 120;

const BLOCK = 3;
const PEN_GLYPHS = [
  "♡",
  "✦",
  "✧",
  "⋆",
  "✿",
  "✳",
  "⊹",
  "₊",
  "˚",
  "°",
  "·",
  "⠂",
  "⠁",
  "░",
  "≈",
];
const BLOOM_GLYPHS = ["✿", "♡", "✦", "⋆", "₊", "˚", "✳"];
const PEN_COLORS = [
  "#FF2E9A",
  "#f472b6",
  "#d8b4fe",
  "#a3e635",
  "#99f6e4",
  "#C4125F",
  "ink",
];
const RAMP = ["·", "˚", "⋆", "✧", "✦", "✿"];

const TILE = 3;
const SCR_STEPS = 5;
const SCR_STEP_MS = 85;

const BLOOM_GAP = 420;
const BLOOM_STAGGER = 110;
const BLOOM_GLYPH = 220;
const BLOOM_DITHER = 80;

// nuvem de glifos que se fecha sobre cada elemento ao desabrochar
const CLOUD_GLYPHS = 8;
const CLOUD_LEAD = 120; // a nuvem aparece um pouco antes do elemento
const CLOUD_TWINKLE = 380; // brilhinhos que ficam em volta depois que ele vira pixel
// floreio digitado na ponta da cauda do L durante o ato 2
const TAIL_FLOURISH = ["~", ":", ":", "*", " ", "♡"];
const TAIL_AT = { x: 356, y: 258 };
const FLOURISH_HOLD_MS = 1400; // quanto o ~::* ♡ do clique/hover fica na cauda

type Rect = [number, number, number, number];

function parseRects(path: string): Rect[] {
  const rects: Rect[] = [];
  const re = /M(-?\d+)[ ,](-?\d+)h(\d+)v(\d+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(path)) !== null)
    rects.push([+m[1], +m[2], +m[3], +m[4]]);
  return rects;
}

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
  const h =
    m[1].length === 3 ? m[1].split("").map((x) => x + x).join("") : m[1];
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function mix(a: string, b: string, t: number): string {
  const pa = parseHex(a);
  const pb = parseHex(b);
  if (!pa || !pb) return a;
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

const easeInOutSine = (x: number) =>
  -(Math.cos(Math.PI * Math.min(1, Math.max(0, x))) - 1) / 2;

interface Model {
  n: number;
  gx: Int16Array;
  gy: Int16Array;
  label: Uint8Array;
  bridge: Uint8Array;
  acc: Int16Array;
  dM: Int32Array;
  dL: Int32Array;
  maxDM: number;
  maxDL: number;
  accentCount: number;
  accentColorOf: (string | null)[];
  accentBox: { x: number; y: number; w: number; h: number }[];
  blockOf: Int32Array;
  blocks: {
    cells: number[];
    bx: number;
    by: number;
    label: number;
    density: number;
  }[];
  tiles: Map<number, number[]>;
  tileOf: Int32Array;
}

function buildModel(distribution: Distribution): Model {
  const lUnit = new Uint8Array(W * H);
  const mUnit = new Uint8Array(W * H);
  const bUnit = new Uint8Array(W * H);
  const aUnit = new Int16Array(W * H).fill(-1);
  const fill = (
    rects: Rect[],
    ox: number,
    oy: number,
    put: (i: number) => void
  ) => {
    for (const [x, y, w, h] of rects) {
      for (let yy = Math.max(0, y + oy); yy < Math.min(H, y + oy + h); yy++) {
        for (let xx = Math.max(0, x + ox); xx < Math.min(W, x + ox + w); xx++)
          put(yy * W + xx);
      }
    }
  };
  fill(parseRects(LETTER_L), 0, 0, (i) => (lUnit[i] = 1));
  fill(parseRects(LETTER_M), 0, 0, (i) => (mUnit[i] = 1));
  fill(parseRects(M_BRIDGE), 0, 0, (i) => (bUnit[i] = 1));
  const accents = accentsFor(distribution);
  accents.forEach((a, ai) =>
    fill(parseRects(a.pathSolid), a.x, a.y, (i) => (aUnit[i] = ai))
  );

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
      let l = 0,
        m = 0,
        a = 0,
        b = 0,
        aIdx = -1;
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
      if (l + m + a < 3) continue;
      const lab =
        a >= m && a >= l && a > 0 ? A_LABEL : m >= l ? M_LABEL : L_LABEL;
      const isBridge = lab === L_LABEL && b >= 3;
      const idx = gx.length;
      gx.push(cx);
      gy.push(cy);
      label.push(lab);
      bridge.push(isBridge ? 1 : 0);
      acc.push(lab === A_LABEL ? aIdx : -1);

      const inL = lab === L_LABEL || (lab === M_LABEL && l > 0);
      const inM = lab === M_LABEL || isBridge;
      lOcc.push(inL);
      mOcc.push(inM);
      if (inL) lAt[cy * GW + cx] = idx;
      if (inM) mAt[cy * GW + cx] = idx;
    }
  }

  const n = gx.length;

  const strokeDistance = (
    at: Int32Array,
    occ: boolean[],
    pickStart: (a: number, b: number) => number
  ) => {
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

  const m = strokeDistance(mAt, mOcc, (a, b) => (gx[a] <= gx[b] ? a : b));
  const l = strokeDistance(lAt, lOcc, (a, b) => (gy[a] <= gy[b] ? a : b));

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
      counts[A_LABEL] >= counts[M_LABEL] &&
      counts[A_LABEL] >= counts[L_LABEL] &&
      counts[A_LABEL] > 0
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
    accentBox: accents.map((a) => ({
      x: a.x,
      y: a.y,
      w: a.width,
      h: a.height,
    })),
    accentColorOf: accents.map((a) => a.color ?? null),
    blockOf,
    blocks,
    tiles,
    tileOf,
  };
}

export function LivingLogo({
  size = 410,
  inkColor = "#1C1B18",
  accentColor = "#FF2A85",
  distribution = "signature",
  differentiationMode = "original_solid",
  intro = "decodeInk",
  hover = "bloom",
  motion = "auto",
  speed = 1,
  interactive = true,
  onIntroEnd,
  className = "",
  style,
}: LivingLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const model = useMemo(() => buildModel(distribution), [distribution]);

  const [flourishText, setFlourishText] = useState("");
  const [showFlourish, setShowFlourish] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  // o ~::* ♡ da cauda não fica parado: aparece e some sozinho
  useEffect(() => {
    if (!showFlourish) return;
    const id = window.setTimeout(() => setShowFlourish(false), FLOURISH_HOLD_MS);
    return () => window.clearTimeout(id);
  }, [showFlourish, flourishText]);

  const hoverRef = useRef(hover);
  const onIntroEndRef = useRef(onIntroEnd);
  useEffect(() => {
    hoverRef.current = hover;
    onIntroEndRef.current = onIntroEnd;
  }, [hover, onIntroEnd]);

  // Cores de acordo com o modo de diferenciação
  let finalLColor = accentColor;
  let finalPetalColor = accentColor;
  let petalDitherMode = false;
  let petalBlushAlpha = 1;

  switch (differentiationMode) {
    case "original_solid":
      finalLColor = accentColor;
      finalPetalColor = accentColor;
      break;
    case "nanquim_all":
      finalLColor = inkColor;
      finalPetalColor = accentColor;
      break;
    case "ascii_dither_petals":
      finalLColor = accentColor;
      finalPetalColor = accentColor;
      petalDitherMode = true;
      break;
    case "dual_tone_ruby":
      finalLColor = "#8F0B45";
      finalPetalColor = accentColor;
      break;
    case "blush_petals":
      finalLColor = accentColor;
      finalPetalColor = "#FF6BB5";
      petalBlushAlpha = 0.72;
      break;
    case "ink_petals":
      finalLColor = accentColor;
      finalPetalColor = inkColor;
      petalDitherMode = true;
      break;
  }

  const triggerOurCelebrationExplosion = (count = 18) => {
    const host = containerRef.current;
    if (!host) return;
    fireHeaderStyleBurst(host, count, {
      area: { left: 14, top: 20, width: 72, height: 56 },
      mapColor: (c) =>
        c.toLowerCase() === "#1c1b18" || c.toLowerCase() === "#5b564a"
          ? inkColor
          : c,
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      motion === "reduce" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !reduced;
    const activeIntro: LivingIntro = reduced ? "none" : intro;
    const n = model.n;
    const colorIdx = new Uint8Array(n);
    const cellGlyph = new Uint8Array(n);
    const blockCount = new Uint16Array(model.blocks.length);
    const blockScramble = new Uint8Array(model.blocks.length);
    const cellDither = new Uint8Array(n);
    const penColors = PEN_COLORS.map((c) => (c === "ink" ? inkColor : c));
    const sparked = new Set<number>();

    const palette = [
      "",
      finalLColor,
      inkColor,
      finalPetalColor,
      mix(finalLColor, "#ffffff", 0.82), // 4: L molhado
      mix(finalLColor, "#ffffff", 0.45), // 5: L secando
      mix(accentColor, "#ffffff", 0.35), // 6: M molhado (a pena é rosa)
      accentColor, //                       7: M secando
      mix(accentColor, inkColor, 0.55), //  8: M quase seco
    ];
    const family =
      getComputedStyle(canvas).getPropertyValue("--font-mono").trim() ||
      "monospace";

    let scale = 1;
    let padPx = 0;
    const start = performance.now();
    const elapsed = (now: number) => (now - start) * speed;
    let introEnded = false;
    let raf = 0;
    let looping = false;

    const introEnd =
      activeIntro === "decodeInk"
        ? Math.max(
            DI_L_START + DI_LAG_PIXEL + DI_L_DUR + 80,
            model.accentCount
              ? DI_ACC_START +
                  (model.accentCount - 1) * DI_ACC_STAGGER +
                  DI_ACC_GLYPH +
                  DI_ACC_DITHER +
                  60
              : 0
          )
        : activeIntro === "ink"
        ? Math.max(
            L_START + L_DUR + 80,
            model.accentCount
              ? ACC_START + model.accentCount * ACC_STAGGER + ACC_POP
              : 0
          )
        : activeIntro === "decode"
        ? DEC_END
        : 0;

    let bloomStart = -Infinity;
    const bloomSparked = new Set<number>();
    const bloomEnd = model.accentCount
      ? (model.accentCount - 1) * BLOOM_STAGGER + BLOOM_GLYPH + BLOOM_DITHER
      : 0;

    // faíscas por elemento conforme o tamanho: pontinho miúdo solta 2, pétala até 7
    const totalAccentArea = model.accentBox.reduce((sum, b) => sum + b.w * b.h, 0) || 1;
    const sparksFor = (box: { w: number; h: number }) =>
      Math.max(2, Math.min(7, Math.round((SPARKS_TOTAL * 2 * box.w * box.h) / totalAccentArea)));

    // Dispara faísca localizada de cada pétala + nossa explosão geral
    const fireSparks = (ai: number) => {
      const host = containerRef.current;
      if (!host) return;
      const box = ai >= 0 ? model.accentBox[ai] : null;
      fireHeaderStyleBurst(
        host,
        box ? sparksFor(box) : 16,
        {
          area: box
            ? {
                left: (box.x / W) * 100,
                top: (box.y / H) * 100,
                width: Math.max(8, (box.w / W) * 100),
                height: Math.max(8, (box.h / H) * 100),
              }
            : { left: 14, top: 24, width: 72, height: 52 },
          mapColor: (c) =>
            c.toLowerCase() === "#1c1b18" || c.toLowerCase() === "#5b564a"
              ? inkColor
              : c,
        }
      );
    };

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
      const parentW = containerRef.current?.clientWidth;
      const cssW =
        typeof size === "number"
          ? Math.min(size, parentW || size)
          : parentW || 410;
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
      return {
        x: (e.clientX - r.left - padCss) * k,
        y: (e.clientY - r.top - padCss) * k,
      };
    };

    const touchTile = (x: number, y: number, now: number) => {
      const key = Math.floor(y / tileSize) * 1000 + Math.floor(x / tileSize);
      if (key === lastTile) return;
      lastTile = key;
      if (model.tiles.has(key) && !activeTiles.has(key))
        activeTiles.set(key, now);
    };

    const onMove = (e: PointerEvent) => {
      if (
        !canHover ||
        hoverRef.current !== "scramble" ||
        e.pointerType !== "mouse"
      )
        return;
      const now = performance.now();
      if (elapsed(now) < introEnd) return;
      const p = toUnits(e);
      if (lastPoint) {
        const steps = Math.ceil(
          Math.hypot(p.x - lastPoint.x, p.y - lastPoint.y) / (tileSize * 0.5)
        );
        for (let s = 1; s < steps; s++) {
          touchTile(
            lastPoint.x + ((p.x - lastPoint.x) * s) / steps,
            lastPoint.y + ((p.y - lastPoint.y) * s) / steps,
            now
          );
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
      if (!canHover || e.pointerType !== "mouse") return;
      const mode = hoverRef.current;
      if (mode === "replayInk") {
        setReplayKey((k) => k + 1);
        return;
      }
      if (mode !== "bloom") return;
      const now = performance.now();
      if (elapsed(now) < introEnd || now - bloomStart < BLOOM_GAP) return;
      bloomStart = now;
      bloomSparked.clear();
      triggerOurCelebrationExplosion(16);
      setShowFlourish(true);
      wake();
    };

    canvas.addEventListener("pointerenter", onEnter);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    /**
     * Nuvem do desabrochar: antes de o elemento virar pixel, glifos coloridos
     * em volta dele embaralham e se fecham sobre o centro; depois, alguns
     * brilhinhos ficam piscando ao redor e somem.
     */
    const drawBloomCloud = (ai: number, tt: number, glyphMs: number, ditherMs: number, clock: number) => {
      const solidAt = glyphMs + ditherMs;
      if (tt < -CLOUD_LEAD || tt > solidAt + CLOUD_TWINKLE) return;
      const box = model.accentBox[ai];
      const cx = box.x + box.w / 2;
      const cy = box.y + box.h / 2;
      const reach = Math.max(box.w, box.h) * 0.75 + 16;
      const tick = Math.floor(clock / SCR_STEP_MS);
      const gathering = tt < solidAt;
      const p = gathering ? Math.min(1, (tt + CLOUD_LEAD) / (solidAt + CLOUD_LEAD)) : (tt - solidAt) / CLOUD_TWINKLE;
      const count = gathering ? CLOUD_GLYPHS : 3;
      ctx!.font = `700 ${BLOCK * CELL * 1.2 * scale}px "Segoe UI Symbol", ${family}, monospace`;
      for (let k = 0; k < count; k++) {
        const r = (j: number) => hash(ai * 977 + k * 131 + j * 7919 + tick * 37);
        const fixed = (j: number) => hash(ai * 977 + k * 131 + j * 7919);
        const ang = fixed(1) * Math.PI * 2;
        // fechando: o raio encolhe (ease-in); brilhinhos: ficam a uma distância fixa
        const dist = gathering ? reach * (0.35 + 0.65 * fixed(2)) * (1 - p * p) + 3 : reach * (0.55 + 0.3 * fixed(2));
        const alpha = gathering ? Math.min(1, p * 3) * (0.7 + r(3) * 0.3) : (1 - p) * (hash(k + tick * 3) < 0.7 ? 1 : 0.25);
        if (alpha <= 0.02) continue;
        ctx!.save();
        ctx!.translate(toPx(cx + Math.cos(ang) * dist), toPx(cy + Math.sin(ang) * dist));
        ctx!.rotate(((r(4) - 0.5) * 36 * Math.PI) / 180);
        const sc = (gathering ? 0.75 : 0.6) + r(5) * 0.4;
        ctx!.scale(sc, sc);
        ctx!.globalAlpha = alpha;
        ctx!.fillStyle = penColors[Math.floor(r(6) * penColors.length)];
        ctx!.fillText(BLOOM_GLYPHS[Math.floor(r(7) * BLOOM_GLYPHS.length)], 0, 0);
        ctx!.restore();
      }
      ctx!.globalAlpha = 1;
    };

    /** ~::* ♡ digitado na ponta da cauda do L no ato 2; some no fim da entrada */
    const drawTailFlourish = (tt: number, span: number) => {
      if (tt < 0) return;
      const shown = Math.min(TAIL_FLOURISH.length, Math.floor(tt / 70) + 1);
      const fade = Math.min(1, Math.max(0, (span - tt) / 220));
      if (fade <= 0) return;
      ctx!.save();
      ctx!.font = `700 ${12 * scale}px ${family}, monospace`;
      ctx!.textAlign = "left";
      ctx!.globalAlpha = fade;
      ctx!.fillStyle = accentColor;
      ctx!.fillText(TAIL_FLOURISH.slice(0, shown).join(""), toPx(TAIL_AT.x), toPx(TAIL_AT.y));
      ctx!.restore();
    };

    function draw(now: number) {
      const t = elapsed(now);
      const playing = t < introEnd;
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      cellGlyph.fill(0);
      cellDither.fill(0);

      if (playing && activeIntro === "decodeInk") {
        const g = (x: number, dur: number, max: number) =>
          easeInOutSine(x / dur) * (max + 2);
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
            const tt = t - DI_ACC_START - model.acc[i] * DI_ACC_STAGGER;
            if (tt > DI_ACC_GLYPH + DI_ACC_DITHER) {
              c = A_LABEL;
              if (petalDitherMode) dither = 1;
            } else if (tt > DI_ACC_GLYPH) {
              c = A_LABEL;
              dither = 1;
            } else if (tt > 0) glyph = 1;
          } else {
            const dist = { M: model.dM[i], L: model.dL[i] };
            const reach = (who: "M" | "L", f: number) =>
              f > 0 && dist[who] >= 0 && dist[who] <= f;
            const order: ("M" | "L")[] = model.bridge[i]
              ? ["L", "M"]
              : lab === M_LABEL
              ? ["M", "L"]
              : ["L"];

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
        const frontL =
          easeInOutSine((t - L_START) / L_DUR) * (model.maxDL + head);

        for (let i = 0; i < n; i++) {
          const lab = model.label[i];
          let c = 0;
          if (lab === A_LABEL) {
            if (t - ACC_START - model.acc[i] * ACC_STAGGER > 0) {
              c = A_LABEL;
              if (petalDitherMode) cellDither[i] = 1;
            }
          } else {
            const dm = model.dM[i];
            const dl = model.dL[i];
            const fromL = frontL > 0 && dl >= 0 && dl <= frontL;
            const fromMraw = frontM > 0 && dm >= 0 && dm <= frontM;
            const fromM =
              (lab === M_LABEL && fromMraw) ||
              (model.bridge[i] === 1 && fromMraw && !fromL);

            if (fromM) {
              const a = frontM - dm;
              c =
                a >= head
                  ? M_LABEL
                  : a < head * 0.33
                  ? 6
                  : a < head * 0.66
                  ? 7
                  : 8;
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
          colorIdx[i] =
            prog <= sweep
              ? prog > sweep - 0.04
                ? lab === M_LABEL
                  ? 6
                  : 4
                : lab
              : 0;
          if (petalDitherMode && lab === A_LABEL) cellDither[i] = 1;
        }
      } else {
        for (let i = 0; i < n; i++) {
          colorIdx[i] = model.label[i];
          if (petalDitherMode && model.label[i] === A_LABEL) {
            cellDither[i] = 1;
          }
        }
      }

      // Hover bloom
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
          if (
            !bloomSparked.has(ai) &&
            bloomT - ai * BLOOM_STAGGER >= BLOOM_GLYPH + BLOOM_DITHER
          ) {
            bloomSparked.add(ai);
            fireSparks(ai);
          }
        }
      }

      // Hover scramble
      for (const [key, since] of activeTiles) {
        if (now - since >= SCR_STEPS * SCR_STEP_MS) activeTiles.delete(key);
      }
      if (activeTiles.size) {
        for (let i = 0; i < n; i++) {
          if (activeTiles.has(model.tileOf[model.blockOf[i]])) colorIdx[i] = 0;
        }
      }

      // 3) Desenha pixels
      for (let c = 1; c < palette.length; c++) {
        ctx!.fillStyle = palette[c];
        if (c === A_LABEL && petalBlushAlpha < 1) {
          ctx!.globalAlpha = petalBlushAlpha;
        }
        for (let i = 0; i < n; i++) {
          if (colorIdx[i] !== c) continue;
          if (cellDither[i] && (model.gx[i] + model.gy[i]) % 2) continue;
          const own = c === A_LABEL ? model.accentColorOf[model.acc[i]] : null;
          if (own) ctx!.fillStyle = own;
          const ux = model.gx[i] * CELL;
          const uy = model.gy[i] * CELL;
          const x0 = Math.round(toPx(ux));
          const y0 = Math.round(toPx(uy));
          ctx!.fillRect(
            x0,
            y0,
            Math.round(toPx(ux + CELL)) - x0,
            Math.round(toPx(uy + CELL)) - y0
          );
          if (own) ctx!.fillStyle = palette[c];
        }
        ctx!.globalAlpha = 1;
      }

      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";

      // 4) Desenha glifos da pena e do decode
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

      if (anyGlyph) {
        ctx!.font = `700 ${
          BLOCK * CELL * 1.35 * scale
        }px "Segoe UI Symbol", ${family}, monospace`;
        const tick = Math.floor(t / SCR_STEP_MS);
        for (let b = 0; b < model.blocks.length; b++) {
          if (!blockCount[b]) continue;
          const blk = model.blocks[b];
          const pool = blk.label === A_LABEL ? BLOOM_GLYPHS : PEN_GLYPHS;
          const r = (k: number) => hash(b * 131 + tick * 977 + k * 7919);
          ctx!.save();
          ctx!.translate(
            toPx((blk.bx + 0.5) * BLOCK * CELL),
            toPx((blk.by + 0.5) * BLOCK * CELL)
          );
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

      // nuvem de glifos que se fecha sobre cada elemento ao desabrochar (como no laboratório do Gemini)
      if (playing && activeIntro === "decodeInk") {
        for (let ai = 0; ai < model.accentCount; ai++) {
          drawBloomCloud(ai, t - DI_ACC_START - ai * DI_ACC_STAGGER, DI_ACC_GLYPH, DI_ACC_DITHER, t);
        }
        drawTailFlourish(t - DI_ACC_START, introEnd - DI_ACC_START);
      } else if (!playing) {
        const bloomT = now - bloomStart;
        if (bloomT < bloomEnd + CLOUD_TWINKLE) {
          for (let ai = 0; ai < model.accentCount; ai++) {
            drawBloomCloud(ai, bloomT - ai * BLOOM_STAGGER, BLOOM_GLYPH, BLOOM_DITHER, bloomT);
          }
        }
      }

      if (playing && activeIntro === "decode") {
        ctx!.font = `700 ${
          BLOCK * CELL * 1.45 * scale
        }px "Segoe UI Symbol", ${family}, monospace`;
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
              ? PEN_GLYPHS[
                  Math.floor(hash(b * 101 + Math.floor(t / 45)) * PEN_GLYPHS.length)
                ]
              : RAMP[
                  Math.min(
                    RAMP.length - 1,
                    Math.round(blk.density * (RAMP.length - 1))
                  )
                ];
          ctx!.globalAlpha = t < settle ? 0.75 : 1;
          ctx!.fillStyle = blk.label === M_LABEL ? inkColor : finalLColor;
          ctx!.fillText(glyph, toPx(cxu), toPx(cyu));
        }
        ctx!.globalAlpha = 1;
      }

      // Dispara faíscas durante o desabrochar do Ato 2
      if (playing && activeIntro === "decodeInk") {
        for (let ai = 0; ai < model.accentCount; ai++) {
          if (
            sparked.has(ai) ||
            t - DI_ACC_START - ai * DI_ACC_STAGGER < DI_ACC_GLYPH + DI_ACC_DITHER
          )
            continue;
          sparked.add(ai);
          fireSparks(ai);
        }
      }

      // Scramble hover
      if (activeTiles.size) {
        const fs = BLOCK * CELL * 1.25 * scale;
        ctx!.font = `700 ${fs}px "Segoe UI Symbol", ${family}, monospace`;
        for (const [key, since] of activeTiles) {
          const step = Math.min(
            SCR_STEPS - 1,
            Math.floor((now - since) / SCR_STEP_MS)
          );
          for (const b of model.tiles.get(key) ?? []) {
            const blk = model.blocks[b];
            const r = (k: number) =>
              hash(b * 131 + step * 977 + k * 7919 + key);
            ctx!.save();
            ctx!.translate(
              toPx((blk.bx + 0.5) * BLOCK * CELL),
              toPx((blk.by + 0.5) * BLOCK * CELL)
            );
            ctx!.rotate(((r(1) - 0.5) * 36 * Math.PI) / 180);
            const s = 0.85 + r(2) * 0.4;
            ctx!.scale(s, s);
            ctx!.globalAlpha = 0.7 + r(3) * 0.3;
            ctx!.fillStyle =
              SCRAMBLE_COLORS[Math.floor(r(4) * SCRAMBLE_COLORS.length)];
            ctx!.fillText(
              SCRAMBLE_GLYPHS[Math.floor(r(5) * SCRAMBLE_GLYPHS.length)],
              0,
              0
            );
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
        triggerOurCelebrationExplosion(18);
        onIntroEndRef.current?.();
      }
      const blooming = now - bloomStart < bloomEnd + CLOUD_TWINKLE + 40;
      if (elapsed(now) < introEnd || activeTiles.size > 0 || blooming)
        raf = requestAnimationFrame(frame);
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
  }, [
    model,
    size,
    inkColor,
    accentColor,
    finalLColor,
    finalPetalColor,
    petalDitherMode,
    petalBlushAlpha,
    intro,
    motion,
    speed,
    replayKey,
  ]);

  const handleClick = () => {
    if (!interactive) return;
    triggerOurCelebrationExplosion(18);
    setShowFlourish(true);
    setFlourishText("~::* ♡");
  };

  return (
    <div
      ref={containerRef}
      className={`living-logo-container ${className}`}
      onClick={handleClick}
      style={{
        position: "relative",
        width: typeof size === "number" ? `min(${size}px, 100%)` : size,
        aspectRatio: `${W} / ${H}`,
        userSelect: "none",
        cursor: interactive ? "pointer" : "default",
        ...style,
      }}
      title={
        interactive
          ? "Clique ou passe o mouse para desabrochar as faíscas e glifos fofos (~::* ♡)"
          : undefined
      }
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Monograma ML de Maria Isabel Lisita desenhado em tinta com busca em largura"
        style={{ position: "absolute" }}
      />

      {/* Terminal Cute Flourish (~::* ♡) typing out at the tip of the L tail (x=348, y=254) */}
      {showFlourish && flourishText && (
        <span
          style={{
            position: "absolute",
            left: `${(348 / W) * 100}%`,
            top: `${(254 / H) * 100}%`,
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "clamp(0.72rem, 2.5vw, 0.95rem)",
            fontWeight: 700,
            color: finalLColor,
            pointerEvents: "none",
            transform: "translate(-10%, -50%)",
            textShadow: `0 0 8px ${accentColor}66`,
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
            zIndex: 3,
            transition: "opacity 0.2s ease, transform 0.2s ease",
          }}
        >
          {flourishText}
        </span>
      )}
    </div>
  );
}
