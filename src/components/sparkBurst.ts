import { COLORS as SCRAMBLE_COLORS } from "./ScrambleText";

/* Os glifos cheios aparecem em dobro: os miúdos (· ° +) dão textura, mas
   sozinhos somem no creme. */
export const SPARK_GLYPHS = ["✦", "✦", "✧", "⋆", "♡", "♡", "✿", "✿", "✳", "✳", "*", "⊹", "+", "°", "·"];
/* A paleta da grade da home, mais os dois rosas da casa: o amarelo e o
   verde-água claros quase não aparecem sobre o papel e precisam de companhia. */
export const SPARK_COLORS = [...SCRAMBLE_COLORS, "#FF2E9A", "#C4125F", "#FF2E9A"];

export interface SparkBurstOptions {
  /** quantas faíscas (o nome do cabeçalho solta 16) */
  count?: number;
  /** tamanho de referência em px; padrão: o font-size do host */
  size?: number;
  /** de onde as faíscas saem, em % do host; padrão: a faixa do nome */
  area?: { left: number; top: number; width: number; height: number };
  /** troca a cor de uma faísca antes de usar (ex.: tinta escura no tema escuro) */
  mapColor?: (color: string) => string;
}

/**
 * A explosão do nome no cabeçalho, compartilhada com a logo. Cada faísca sai
 * de um ponto da área com direção, velocidade, giro e tamanho próprios, perde
 * velocidade como se o ar segurasse e cai com peso -- por isso o caminho é
 * curvo. Quase tudo vai para os lados e para baixo.
 *
 * Só transform e opacity, pela Web Animations API: roda no compositor e não
 * disputa a rolagem com o resto da página. O host precisa ser um contêiner
 * posicionado; cada faísca é removida quando a animação acaba.
 */
export function sparkBurst(host: HTMLElement, options: SparkBurstOptions = {}) {
  const size = options.size ?? (Number.parseFloat(getComputedStyle(host).fontSize) || 22);
  const count = options.count ?? 16;
  const area = options.area ?? { left: 6, top: 40, width: 88, height: 30 };
  const drag = 3.2;
  const settle = 1 - Math.exp(-drag);
  const steps = 10;

  for (let index = 0; index < count; index += 1) {
    const spark = document.createElement("span");
    spark.className = "spark-burst__spark";
    Object.assign(spark.style, {
      position: "absolute",
      fontFamily: "var(--font-mono), monospace",
      fontWeight: "400",
      lineHeight: "1",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      willChange: "transform, opacity",
    });
    spark.textContent = SPARK_GLYPHS[Math.floor(Math.random() * SPARK_GLYPHS.length)];
    const color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
    spark.style.color = options.mapColor ? options.mapColor(color) : color;
    spark.style.left = `${area.left + Math.random() * area.width}%`;
    spark.style.top = `${area.top + Math.random() * area.height}%`;
    spark.style.fontSize = `${(0.42 + Math.random() * 0.5) * size}px`;
    host.appendChild(spark);

    /* -25° a 205°: em tela o y cresce para baixo, então 90° é reto para baixo
       e as pontas da faixa sobem só um pouco antes de cair. */
    const angle = ((-25 + Math.random() * 230) * Math.PI) / 180;
    const speed = (1.4 + Math.random() * 2.2) * size;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const gravity = (0.7 + Math.random() * 0.6) * size;
    const turnFrom = (Math.random() - 0.5) * 60;
    const turnBy = (Math.random() - 0.5) * 420;

    const frames: Keyframe[] = [];
    for (let step = 0; step <= steps; step += 1) {
      const t = step / steps;
      const travel = (1 - Math.exp(-drag * t)) / settle;
      const x = vx * travel;
      const y = vy * travel + gravity * t * t;
      const scale = t < 0.18 ? 0.35 + (t / 0.18) * 0.75 : 1.1 - (t - 0.18) * 0.55;
      const opacity = t < 0.1 ? t / 0.1 : t > 0.6 ? Math.max(0, 1 - (t - 0.6) / 0.4) : 1;
      frames.push({
        transform: `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(turnFrom + turnBy * travel).toFixed(1)}deg) scale(${scale.toFixed(2)})`,
        opacity,
      });
    }

    const animation = spark.animate(frames, {
      duration: 760 + Math.random() * 520,
      delay: Math.random() * 70,
      easing: "linear",
      fill: "both",
    });
    animation.onfinish = () => spark.remove();
    animation.oncancel = () => spark.remove();
  }
}
