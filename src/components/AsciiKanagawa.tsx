"use client";

import { useEffect, useRef } from "react";

const FRAME_MS = 1000 / 25;

// Ramp de caracteres delicados (removidos os glifos brutos ░ ▒ ▓ ╳)
const SITE_GIBBON_RAMP = [
  "·", "°", "⠂", "⠄", "⠆", "⠒", "⠤", "o", "✳︎", "✦", "✧", "⋆", "♡", "✿", "₊", "˚",
  "≈", "~", "⠶", "⠲", "⠴", "⠛", "⠿",
];

const TITLE_SCRAMBLE_GLYPHS = [
  "♡", "✦", "✧", "⋆", "≈", "°", "⊹", "·", "⠂", "⠁", "✿", "₊", "˚", "✳︎", "⠶", "⠤",
];

const UNIFIED_COLOR = "#173b58"; // Navy azul-escuro único
const PAPER_BG = "rgba(245, 236, 219, 0.05)";

const hash = (x: number, y: number, seed = 0) => {
  const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return value - Math.floor(value);
};

// IMPLEMENTAÇÃO EXATA DA CLASSE FrameLoop DE GIBBONJOYEUX
class FrameLoop {
  frames: number;
  minVal: number;
  maxVal: number;
  val: number;

  constructor(frames = 300, minVal = 0, maxVal = 91) {
    this.frames = frames;
    this.minVal = minVal;
    this.maxVal = maxVal;
    this.val = 0;
  }

  set(v: number) {
    this.val = v % this.frames;
  }

  inc() {
    this.val = (this.val + 1) % this.frames;
  }

  get value() {
    const progress = this.val / this.frames;
    const t = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    return this.minVal + t * (this.maxVal - this.minVal);
  }
}

type MutationPoint = {
  col: number;
  row: number;
  x: number;
  y: number;
  strength: number;
  seed: number;
  blue?: number;
  red?: number;
  isContour?: boolean;
  frameLoop?: FrameLoop;
};

type ActiveMutation = {
  point: MutationPoint;
  startedAt: number;
  phase: number;
};

type Particle = {
  index: number;
  seed: number;
  speed: number;
  arc: number;
  type: number;
  glyph: string;
};

export default function AsciiKanagawa({
  className,
  style,
  src = "/img/kanagawa-ascii-transparent.webp",
  opacity = 0.52,
}: {
  className?: string;
  style?: React.CSSProperties;
  src?: string;
  opacity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;
    const ctx = context;

    const parent = canvas.parentElement ?? canvas;
    const image = new Image();
    image.src = src;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let drawX = 0;
    let drawY = 0;
    let drawWidth = 0;
    let drawHeight = 0;
    let lastFrame = -Infinity;
    let raf = 0;
    let isVisible = false;
    let isRunning = false;

    let mutationGrid = new Map<string, MutationPoint>();
    let contourPoints: MutationPoint[] = [];
    let mutationMapWidth = 160;
    let mutationMapHeight = 100;
    const activeMutations = new Map<string, ActiveMutation>();

    const spray: Particle[] = Array.from({ length: 110 }, (_, index) => ({
      index,
      seed: hash(index, 4, 2),
      speed: 0.4 + hash(index, 9, 1) * 0.9,
      arc: hash(index, 2, 7),
      type: index % 4,
      glyph: SITE_GIBBON_RAMP[index % SITE_GIBBON_RAMP.length],
    }));

    const sampleCanvas = document.createElement("canvas");
    const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });

    function fitImage() {
      if (!image.naturalWidth || !image.naturalHeight) return;
      const imageRatio = image.naturalWidth / image.naturalHeight;
      const viewportRatio = width / height;

      if (imageRatio < viewportRatio) {
        drawWidth = width;
        drawHeight = width / imageRatio;
      } else {
        drawHeight = height;
        drawWidth = height * imageRatio;
      }
      drawX = (width - drawWidth) / 2;
      // Subiu a imagem mais para o topo
      drawY = Math.max(-50, (height - drawHeight) / 2 - 25);
    }

    // Gerador do mapa de ruído de GibbonJoyeux focado na crista marcada da onda
    function buildGibbonWaveMap() {
      if (!image.naturalWidth || !image.naturalHeight || !sampleCtx) return;
      const mapWidth = 160;
      const mapHeight = Math.max(10, Math.round(mapWidth / (image.naturalWidth / image.naturalHeight)));
      mutationMapWidth = mapWidth;
      mutationMapHeight = mapHeight;
      sampleCanvas.width = mapWidth;
      sampleCanvas.height = mapHeight;
      sampleCtx.drawImage(image, 0, 0, mapWidth, mapHeight);

      const pixels = sampleCtx.getImageData(0, 0, mapWidth, mapHeight).data;
      const totalCells = mapWidth * mapHeight;

      // 1. CREATE MAP
      const rawMap = new Float32Array(totalCells);
      for (let y = 0; y < mapHeight; y += 1) {
        for (let x = 0; x < mapWidth; x += 1) {
          rawMap[y * mapWidth + x] = hash(x, y, 7) * 300;
        }
      }

      // 2. BLUR MAP (35 passos de suavização)
      const smoothed = new Float32Array(totalCells);
      const BLUR_STEPS = 35;
      for (let step = 0; step < BLUR_STEPS; step += 1) {
        for (let y = 0; y < mapHeight; y += 1) {
          for (let x = 0; x < mapWidth; x += 1) {
            const idx = y * mapWidth + x;
            const left = rawMap[y * mapWidth + Math.max(0, x - 1)];
            const right = rawMap[y * mapWidth + Math.min(mapWidth - 1, x + 1)];
            const top = rawMap[Math.max(0, y - 1) * mapWidth + x];
            const bottom = rawMap[Math.min(mapHeight - 1, y + 1) * mapWidth + x];
            smoothed[idx] = (rawMap[idx] + left + right + top + bottom) / 5;
          }
        }
        rawMap.set(smoothed);
      }

      // 3. FINALIZE MAP (FrameLoops de GibbonJoyeux)
      const points: MutationPoint[] = [];
      const waveRidgePoints: MutationPoint[] = [];
      const FRAMES = 300;
      const MAX_CHAR_IDX = SITE_GIBBON_RAMP.length - 1;

      for (let y = 1; y < mapHeight - 1; y += 1) {
        for (let x = 1; x < mapWidth - 1; x += 1) {
          const i = (y * mapWidth + x) * 4;
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];
          if (a < 24) continue;
          const darkness = 1 - (r * 0.299 + g * 0.587 + b * 0.114) / 255;
          if (darkness < 0.14) continue;

          let isBoundary = false;
          for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1]]) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < mapWidth && ny >= 0 && ny < mapHeight) {
              const ni = (ny * mapWidth + nx) * 4;
              const nAlpha = pixels[ni + 3];
              const nDarkness = 1 - (pixels[ni] * 0.299 + pixels[ni + 1] * 0.587 + pixels[ni + 2] * 0.114) / 255;
              if (nAlpha < 24 || nDarkness < 0.14) {
                isBoundary = true;
                break;
              }
            }
          }

          const initialValue = Math.floor((rawMap[y * mapWidth + x] % FRAMES));
          const loopObj = new FrameLoop(FRAMES, 0, MAX_CHAR_IDX);
          loopObj.set(initialValue);

          const pt: MutationPoint = {
            col: x,
            row: y,
            x: x / mapWidth,
            y: y / mapHeight,
            strength: darkness,
            seed: hash(x, y, 3) * 100,
            isContour: isBoundary,
            frameLoop: loopObj,
          };

          points.push(pt);

          // Filtra a crista da onda demarcada pelo usuário
          if (isBoundary && pt.y < 0.85 && (pt.x < 0.72 || pt.y < 0.45)) {
            waveRidgePoints.push(pt);
          }
        }
      }

      contourPoints = waveRidgePoints;
      mutationGrid = new Map(points.map((pt) => [`${pt.col}:${pt.row}`, pt]));
    }

    function resize() {
      const rect = parent.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fitImage();
      ctx.font = `${width < 700 ? 9 : 11}px "Courier New", ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
    }

    function drawGibbonContourLoop() {
      if (reduceMotion || !contourPoints.length) return;

      ctx.save();
      const patchSize = Math.max(9, (drawWidth / mutationMapWidth) * 1.18);
      ctx.font = `bold ${patchSize}px "Courier New", monospace`;
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = UNIFIED_COLOR;

      for (let i = 0; i < contourPoints.length; i += 1) {
        const pt = contourPoints[i];
        if (!pt.frameLoop) continue;

        const charIdx = Math.round(pt.frameLoop.value);
        pt.frameLoop.inc();

        const char = SITE_GIBBON_RAMP[charIdx % SITE_GIBBON_RAMP.length];
        if (!char || char === " ") continue;

        const x = drawX + pt.x * drawWidth;
        const y = drawY + pt.y * drawHeight;

        ctx.fillText(char, x, y);
      }

      ctx.restore();
    }

    function drawBase() {
      ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    }

    function drawMutations(time: number) {
      if (!activeMutations.size) return;
      const patchWidth = Math.max(7, (drawWidth / 150) * 0.95);
      const patchHeight = Math.max(8, (drawHeight / 100) * 0.92);

      for (const [key, entry] of activeMutations) {
        const elapsed = time - entry.startedAt;
        if (elapsed >= 360) {
          activeMutations.delete(key);
          continue;
        }
        entry.phase = Math.floor(elapsed / 60);

        const { point, phase } = entry;
        const x = drawX + point.x * drawWidth;
        const y = drawY + point.y * drawHeight;

        const glyphIdx = Math.floor(
          hash(point.col, point.row, phase + 19) * TITLE_SCRAMBLE_GLYPHS.length
        );
        const glyph = TITLE_SCRAMBLE_GLYPHS[glyphIdx];

        ctx.globalAlpha = 0.92;
        ctx.fillStyle = PAPER_BG;
        ctx.fillRect(x - patchWidth / 2, y - patchHeight / 2, patchWidth, patchHeight);

        ctx.globalAlpha = 0.9;
        ctx.fillStyle = UNIFIED_COLOR;
        ctx.fillText(glyph, x, y);
      }
    }

    function drawSpray(seconds: number) {
      ctx.save();
      ctx.globalAlpha = 0.65;
      ctx.fillStyle = UNIFIED_COLOR;

      for (const particle of spray) {
        let x = 0;
        let y = 0;

        if (particle.type === 0) {
          const angle = particle.seed * Math.PI * 2 - seconds * (0.42 + particle.speed * 0.28);
          const radiusX = 0.058 + particle.arc * 0.045;
          const radiusY = 0.105 + particle.arc * 0.075;
          const turbulence = Math.sin(seconds * 1.45 + particle.seed * 29) * 0.009;

          x = drawX + drawWidth * (0.555 + Math.cos(angle) * radiusX + turbulence);
          y = drawY + drawHeight * (0.425 + Math.sin(angle) * radiusY + Math.cos(angle * 2.2) * 0.014);
        } else if (particle.type === 1) {
          const life = (seconds * 0.24 * particle.speed + particle.seed) % 1;
          const spread = particle.arc - 0.5;
          const flutter = Math.sin(seconds * 1.9 + particle.seed * 31) * 0.014;

          x = drawX + drawWidth * (0.49 + spread * 0.08 + life * (0.15 + spread * 0.04) + flutter * life);
          y = drawY + drawHeight * (
            0.31 + spread * 0.08 - Math.sin(life * Math.PI) * (0.13 + particle.seed * 0.065) +
            life * 0.085 + Math.cos(seconds * 1.35 + particle.seed * 19) * 0.008
          );
        } else if (particle.type === 2) {
          const life = (seconds * 0.2 * particle.speed + particle.seed * 3.3) % 1;
          const ripple = Math.sin(seconds * 3.4 + particle.seed * 11) * 0.014;

          x = drawX + drawWidth * (0.38 - life * 0.24 + ripple);
          y = drawY + drawHeight * (0.28 + life * 0.5 + Math.sin(life * Math.PI * 2) * 0.022);
        } else {
          const life = (seconds * 0.16 * particle.speed + particle.seed * 7.1) % 1;
          const driftX = Math.sin(seconds * 1.5 + particle.seed * 17) * 0.02;
          const driftY = Math.cos(seconds * 1.2 + particle.seed * 23) * 0.014;

          x = drawX + drawWidth * (0.45 + particle.arc * 0.22 + life * 0.09 + driftX);
          y = drawY + drawHeight * (0.18 + particle.seed * 0.22 - life * 0.055 + driftY);
        }

        const glyph = SITE_GIBBON_RAMP[(particle.index + Math.floor(seconds * 6.5)) % SITE_GIBBON_RAMP.length];
        ctx.fillText(glyph, x, y);
      }

      ctx.restore();
    }

    function activateHover(clientX: number, clientY: number, startedAt: number) {
      if (reduceMotion) return;
      const rect = canvas!.getBoundingClientRect();
      const relX = clientX - rect.left;
      const relY = clientY - rect.top;

      if (
        relX < drawX || relX > drawX + drawWidth ||
        relY < drawY || relY > drawY + drawHeight
      ) return;

      const col = Math.round(((relX - drawX) / drawWidth) * mutationMapWidth);
      const row = Math.round(((relY - drawY) / drawHeight) * mutationMapHeight);

      let activated = 0;
      for (let rowOffset = -1; rowOffset <= 1 && activated < 8; rowOffset += 1) {
        for (let offset = -2; offset <= 2; offset += 1) {
          const point = mutationGrid.get(`${col + offset}:${row + rowOffset}`);
          if (!point) continue;
          const key = `${point.col}:${point.row}`;
          activeMutations.set(key, {
            point,
            startedAt,
            phase: -1,
          });
          activated += 1;
        }
      }
    }

    function draw(time: number) {
      if (!image.complete || !image.naturalWidth) return;
      const seconds = time * 0.001;
      ctx.clearRect(0, 0, width, height);

      // 1. GRAVURA PRINCIPAL ESTÁTICA POSICIONADA MAIS PARA O TOPO
      drawBase();

      // 2. FLUXO DE CARACTERES DELICADOS COM FrameLoop DE GIBBONJOYEUX
      drawGibbonContourLoop();

      // 3. ESPUMA E HOVER MUTATIONS
      drawSpray(seconds);
      drawMutations(time);
    }

    function loop(time: number) {
      if (!isRunning || !isVisible) return;
      raf = requestAnimationFrame(loop);
      if (time - lastFrame < FRAME_MS) return;
      lastFrame = time;
      draw(time);
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!isVisible) return;
      activateHover(e.clientX, e.clientY, performance.now());
    };

    const startLoop = () => {
      if (reduceMotion || isRunning || !isVisible || !image.complete || !image.naturalWidth) return;
      isRunning = true;
      lastFrame = -Infinity;
      raf = requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      isRunning = false;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const handleImageLoad = () => {
      resize();
      buildGibbonWaveMap();
      draw(performance.now());
      startLoop();
    };

    const handleResize = () => {
      resize();
      if (image.complete && image.naturalWidth) draw(performance.now());
    };

    image.addEventListener("load", handleImageLoad);

    if (image.complete && image.naturalWidth) {
      handleImageLoad();
    }

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          draw(performance.now());
          startLoop();
          return;
        }
        stopLoop();
      },
      { rootMargin: "120px 0px", threshold: 0 },
    );
    visibilityObserver.observe(canvas);

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      stopLoop();
      visibilityObserver.disconnect();
      image.removeEventListener("load", handleImageLoad);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        cursor: "crosshair",
        opacity,
        ...style,
      }}
      aria-label="A Grande Onda de Kanagawa em ASCII animado"
    />
  );
}
