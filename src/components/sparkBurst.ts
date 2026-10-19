import { COLORS as SCRAMBLE_COLORS } from "./ScrambleText";

export const SPARK_GLYPHS = [
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

export const SPARK_COLORS = [
  "#FF2E9A",
  "#f472b6",
  "#d8b4fe",
  "#C4125F",
  "#a3e635",
  "#99f6e4",
  "#FF2A85",
  "#1c1b18",
  ...SCRAMBLE_COLORS,
];

export interface SparkBurstOptions {
  /** quantas faíscas (padrão: 16) */
  count?: number;
  /** tamanho de referência em px */
  size?: number;
  /** de onde as faíscas saem, em % do host */
  area?: { left: number; top: number; width: number; height: number };
  /** troca a cor de uma faísca antes de usar (ex.: tinta escura no tema escuro) */
  mapColor?: (color: string) => string;
}

/**
 * Nossa explosão festiva em arco curvo (com física de arrasto do ar, gravidade,
 * rotação expressiva, pop elástico de escala e glifos fofos do cabeçalho).
 * Roda 100% no compositor via Web Animations API (transform + opacity).
 */
export function fireHeaderStyleBurst(
  host: HTMLElement,
  count = 16,
  options: SparkBurstOptions = {}
) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const rect = host.getBoundingClientRect();
  const baseSize =
    options.size ??
    (rect.width > 120
      ? Math.max(16, Math.min(26, rect.width * 0.058))
      : 22);
  const area =
    options.area ??
    (rect.width > 120
      ? { left: 14, top: 24, width: 72, height: 52 }
      : { left: -10, top: -10, width: 120, height: 120 });
  const drag = 3.2;
  const settle = 1 - Math.exp(-drag);
  const steps = 10;

  for (let index = 0; index < count; index += 1) {
    const spark = document.createElement("span");
    spark.className = "spark-burst__spark";
    spark.textContent =
      SPARK_GLYPHS[Math.floor(Math.random() * SPARK_GLYPHS.length)];
    spark.style.position = "absolute";
    spark.style.fontFamily = "var(--font-mono, monospace)";
    spark.style.fontWeight = "600";
    spark.style.lineHeight = "1";
    spark.style.whiteSpace = "nowrap";
    spark.style.pointerEvents = "none";
    spark.style.zIndex = "12";
    spark.style.willChange = "transform, opacity";

    const rawColor =
      SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
    spark.style.color = options.mapColor ? options.mapColor(rawColor) : rawColor;
    spark.style.left = `${area.left + Math.random() * area.width}%`;
    spark.style.top = `${area.top + Math.random() * area.height}%`;
    spark.style.fontSize = `${(0.52 + Math.random() * 0.52) * baseSize}px`;
    host.appendChild(spark);

    const angle = ((-35 + Math.random() * 250) * Math.PI) / 180;
    const speed = (1.35 + Math.random() * 2.15) * baseSize;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const gravity = (0.65 + Math.random() * 0.55) * baseSize;
    const turnFrom = (Math.random() - 0.5) * 45;
    const turnBy = (Math.random() - 0.5) * 340;

    const frames: Keyframe[] = [];
    for (let step = 0; step <= steps; step += 1) {
      const t = step / steps;
      const travel = (1 - Math.exp(-drag * t)) / settle;
      const x = vx * travel;
      const y = vy * travel + gravity * t * t;
      const scale =
        t < 0.18 ? 0.35 + (t / 0.18) * 0.82 : 1.17 - (t - 0.18) * 0.58;
      const opacity =
        t < 0.1 ? t / 0.1 : t > 0.6 ? Math.max(0, 1 - (t - 0.6) / 0.4) : 1;
      frames.push({
        transform: `translate(-50%, -50%) translate(${x.toFixed(
          1
        )}px, ${y.toFixed(1)}px) rotate(${(turnFrom + turnBy * travel).toFixed(
          1
        )}deg) scale(${scale.toFixed(2)})`,
        opacity,
      });
    }

    const animation = spark.animate(frames, {
      duration: 740 + Math.random() * 480,
      delay: Math.random() * 90,
      easing: "linear",
      fill: "both",
    });
    animation.onfinish = () => spark.remove();
    animation.oncancel = () => spark.remove();
  }
}

export function sparkBurst(host: HTMLElement, options: SparkBurstOptions = {}) {
  const count = options.count ?? 16;
  fireHeaderStyleBurst(host, count, options);
}
