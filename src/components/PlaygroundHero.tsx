"use client";
import { useEffect, useRef, useState } from "react";
import { animate as animateValue, motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import AsciiDivider from "./AsciiDivider";
import ScrambleText from "./ScrambleText";
import { useT } from "@/i18n/LanguageContext";
import { StampCanvas, useCreativeStudio } from "./CreativeStudio";

/* canto em degrau de 8px — recorte "pixel" nas molduras */
export const PIXEL_CLIP =
  "polygon(0 8px, 8px 8px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 8px), 0 calc(100% - 8px))";

/** Saudação que muda com a hora real E o idioma do site (pedido dela:
 *  brincalhona, sem emoji). Calculada no tick (client-only), então não
 *  dá mismatch de hidratação. */
function greetingFor(hour: number, lang: "pt" | "en") {
  if (lang === "pt") {
    if (hour < 6) return "ainda acordada?";
    if (hour < 10) return "cedo demais para tanta tipografia";
    if (hour < 18) return "horário comercial, aparentemente";
    return "a luz ficou acesa";
  }
  if (hour < 6) return "still up?";
  if (hour < 10) return "too early for this much typography";
  if (hour < 18) return "business hours, apparently";
  return "the light stayed on";
}

/** Relógio ao vivo (referência: barbianaliu.com — "Mon 01:39:03 AM"). */
function LiveClock() {
  const { lang } = useT();
  const [now, setNow] = useState("");
  const [greet, setGreet] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(
        d
          .toLocaleString(lang === "pt" ? "pt-BR" : "en-US", {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          .replace(",", "")
      );
      setGreet(greetingFor(d.getHours(), lang));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lang]);
  return (
    <span className="ph__clock" suppressHydrationWarning>
      <span className="ph__greet">{greet || "…"}</span>
      <span className="ph__note" style={{ color: "var(--acid)" }}>
        {now || "…"}
      </span>
    </span>
  );
}

const styles = `
  .ph {
    position: relative;
    background: transparent; /* deixa o degradê+ruído do .rm aparecer */
    color: var(--ink);
    /* A gravura mede 1521×1034. O pequeno respiro adicional preserva o
       wordmark no topo sem afastar a onda do ticker. */
    min-height: max(100svh, calc(67.98vw + 2rem));
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 8.5rem 5.5rem 2.5rem;
    overflow: hidden;
  }
  .ph__meta {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    font-family: var(--font-body);
    font-size: var(--type-micro);
    text-transform: lowercase;
    letter-spacing: .12em;
    padding-bottom: .55rem;
    position: relative;
    z-index: 1;
  }
  .ph__title {
    /* PF Pixelscript (Adobe) como display do hero — escala equilibrada com respiro */
    font-family: var(--font-pixelscript);
    font-weight: 400;
    font-size: clamp(2rem, min(7.5vw, 9.5vh), 6.5rem);
    line-height: .9;
    /* tracking levemente negativo — testado que a Pixelscript aguenta -.015em
       sem quebrar as ligações do script (mais que isso começa a colar demais) */
    letter-spacing: -.015em;
    text-transform: none;
    margin: clamp(1.2rem, 3.8vh, 2.8rem) 0;
    position: relative;
    z-index: 1;
    pointer-events: none;
  }
  /* padding+margin negativa: expande a CAIXA DE CLIP (máscara da entrada) sem
     mudar o ritmo — senão o floreio da capitular da Pixelscript sai cortado */
  .ph__line { overflow: hidden; display: block; padding: .18em .12em .12em .08em; margin: -.18em -.12em -.12em -.08em; }
  .ph__line--acid { color: var(--hero-highlight, var(--acid)); }
  .ph__foot {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    align-items: end;
    padding-top: .4rem;
    position: relative;
    z-index: 1;
  }
  .ph__sub {
    font-family: var(--font-body);
    font-size: clamp(.95rem, 1.3vw, 1.1rem);
    line-height: 1.5;
  }
  /* frase no vazio da onda: OffBit, alinhada à esquerda, abaixo do título */
  .ph__sub--pocket {
    position: absolute;
    left: 52%;
    top: 60%;
    /* a quebra é forçada no JSX; a largura só evita reflow das duas linhas */
    width: min(42rem, 43vw);
    max-width: none;
    text-align: left;
    text-transform: lowercase;
    font-family: var(--font-subtitle);
    font-size: clamp(1rem, 1.2vw, 1.3rem);
    line-height: 1.35;
    letter-spacing: .01em;
    z-index: 1;
    pointer-events: none;
  }
  @media (min-width: 1360px) {
    .ph__title {
      top: clamp(-4.5rem, -3vw, -2.5rem);
    }
  }
  /* sem largura editorial suficiente, volta ao fluxo e evita sobreposição */
  @media (max-width: 1359px) {
    .ph__sub--pocket {
      position: static;
      width: auto;
      max-width: 100%;
      margin-top: 1.25rem;
    }
  }
  .ph__scroll {
    font-family: var(--font-hand);
    font-size: 1.35rem;
    letter-spacing: .01em;
  }
  .ph__em { font-family: var(--font-head); font-style: italic; font-weight: 600; letter-spacing: -0.01em; }
  .ph__wave-word { display: inline-block; white-space: nowrap; }
  .ph__wave-char { display: inline-block; }
  @keyframes ph-wave {
    0%, 7%, 100% { transform: translateY(0); }
    3.5% { transform: translateY(-3px); }
  }
  @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
    .ph__wave-char {
      animation: ph-wave 8.52s cubic-bezier(.33, 1, .68, 1) var(--wave-delay) infinite;
    }
  }

  /* --- adesivos arrastáveis --- */
  .ph__sticker {
    position: absolute;
    z-index: 2;
    cursor: grab;
    touch-action: none;
    user-select: none;
  }
  .ph__sticker:active { cursor: grabbing; }
  .ph__note {
    font-family: var(--font-subtitle);
    font-size: var(--type-micro);
    text-transform: lowercase;
    letter-spacing: .08em;
    white-space: nowrap;
    pointer-events: none;
    opacity: .62;
  }
  .ph__clock { display: inline-flex; flex-direction: column; gap: .15rem; }
  .ph__greet {
    /* fonte de pixel (OffBit), não a de caligrafia (pedido dela) */
    font-family: var(--font-subtitle);
    font-size: 1.2rem;
    text-transform: lowercase;
    font-weight: 400;
    line-height: 1;
    letter-spacing: .02em;
    color: var(--ink);
    white-space: nowrap;
    pointer-events: none;
  }
  @media (max-width: 720px) {
    .ph {
      min-height: max(100svh, 54rem);
      padding: 7rem 1.25rem 1.5rem;
    }
    .ph__meta span:nth-child(2) { display: none; }
    .ph__title {
      font-size: clamp(2rem, 10.6vw, 2.75rem);
      line-height: 1.08;
      margin: 7.5rem 0 10rem;
    }
    .ph__foot { grid-template-columns: 1fr; gap: 1.25rem; }
    .ph__sticker--desk { display: none; }
    .ph__sticker { cursor: default; }
    .ph__sticker--clock {
      left: auto !important;
      right: 1.25rem;
      top: 23% !important;
      text-align: right;
    }
    .ph__greet { font-size: 1.2rem; }
    .ph__note { font-size: var(--type-micro); }
  }
  @media (prefers-reduced-motion: reduce) {
    .ph__line > span { transform: none !important; }
    .ph__sticker { translate: none; }
  }
`;

const containerAnim = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.15,
    }
  }
};

const lineAnim = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function WavyText({
  text,
  accent = false,
  delay = 0,
}: {
  text: string;
  accent?: boolean;
  delay?: number;
}) {
  const words = text.split(/(\s+)/);
  let character = 0;

  return (
    <span className={accent ? "ph__em" : undefined}>
      {words.map((word, wordIndex) => {
        if (/^\s+$/.test(word)) return word;
        return (
          <span className="ph__wave-word" key={`${word}-${wordIndex}`}>
            {Array.from(word).map((letter) => {
              const index = character++;
              return (
                <span
                  className="ph__wave-char"
                  key={`${letter}-${index}`}
                  style={{ "--wave-delay": `${delay + index * .018}s` } as React.CSSProperties}
                >
                  {letter}
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}

type Sticker = {
  key: string;
  left: string;
  top: string;
  rotate: number;
  deskOnly?: boolean;
  el: React.ReactNode;
};

function DraggableSticker({
  sticker,
  index,
  bounds,
  canDrag,
  reduceMotion,
  resetToken,
  onMoved,
  onSound,
}: {
  sticker: Sticker;
  index: number;
  bounds: React.RefObject<HTMLElement | null>;
  canDrag: boolean;
  reduceMotion: boolean;
  resetToken: number;
  onMoved: () => void;
  onSound: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const previousReset = useRef(resetToken);

  useEffect(() => {
    if (previousReset.current === resetToken) return;
    previousReset.current = resetToken;
    const xAnimation = animateValue(x, 0, {
      type: "spring",
      stiffness: 155,
      damping: 18,
      mass: .85,
    });
    const yAnimation = animateValue(y, 0, {
      type: "spring",
      stiffness: 155,
      damping: 18,
      mass: .85,
    });
    return () => {
      xAnimation.stop();
      yAnimation.stop();
    };
  }, [resetToken, x, y]);

  return (
    <motion.div
      className={`ph__sticker ph__sticker--${sticker.key}${sticker.deskOnly ? " ph__sticker--desk" : ""}`}
      style={{ left: sticker.left, top: sticker.top, x, y }}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.6, rotate: sticker.rotate }}
      animate={{ opacity: 1, scale: 1, rotate: sticker.rotate }}
      transition={{ delay: reduceMotion ? 0 : 0.9 + index * 0.07, duration: reduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      drag={canDrag}
      dragConstraints={bounds}
      dragElastic={0.12}
      dragMomentum
      onDragStart={onSound}
      onDragEnd={() => {
        onMoved();
        onSound();
      }}
      whileHover={canDrag ? {
        scale: 1.045,
        filter: "drop-shadow(0 5px 4px rgba(20,19,16,.18))",
      } : undefined}
      whileDrag={canDrag ? {
        scale: 1.1,
        rotate: 0,
        zIndex: 30,
        filter: "drop-shadow(0 14px 9px rgba(20,19,16,.26))",
      } : undefined}
    >
      {sticker.el}
    </motion.div>
  );
}

export default function PlaygroundHero({
  lines,
  sub,
  subHighlight,
  scrollLabel,
  children,
}: {
  lines: string[];
  sub: string;
  subHighlight: string;
  scrollLabel: string;
  children?: React.ReactNode;
}) {
  const bounds = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const {
    stampMode,
    resetToken,
    markMoved,
    playSound,
  } = useCreativeStudio();

  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const syncViewport = () => setIsMobile(media.matches);

    syncViewport();
    media.addEventListener("change", syncViewport);
    return () => media.removeEventListener("change", syncViewport);
  }, []);

  const canDrag = !reduceMotion && !isMobile;

  // Elementos funcionais do hero; os desenhos ASCII agora vivem só no background.
  const stickers: Sticker[] = [
    // aninhado na concavidade da onda (vazio medido: x45-75% / y19-31% = densidade 0):
    // aproveita o espaço vazio da gravura em vez de flutuar sobre a parte cheia
    { key: "clock", left: "58%", top: "12%", rotate: 3, el: <LiveClock /> },
  ];

  const { scrollYProgress } = useScroll({
    target: bounds,
    offset: ["start start", "end start"]
  });

  // Parallax leve. A opacidade fica em CSS/HTML para o conteúdo principal já
  // nascer visível antes da hidratação (essencial para o LCP no mobile).
  const textY = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <section className="ph" ref={bounds} data-stamp-active={stampMode ? "true" : "false"}>
      <style>{styles}</style>
      <StampCanvas />
      <span
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {scrollLabel}
      </span>

      {/* adesivos — arrastáveis dentro do hero */}
      {stickers.map((s, i) => (
        <DraggableSticker
          key={s.key}
          sticker={s}
          index={i}
          bounds={bounds}
          canDrag={canDrag}
          reduceMotion={Boolean(reduceMotion)}
          resetToken={resetToken}
          onMoved={markMoved}
          onSound={() => playSound("drag")}
        />
      ))}

      {/* menu espalhado (ScatterMenu) e afins */}
      {children}


      <motion.h1 
        className="ph__title" 
        style={{ y: textY }}
        variants={containerAnim}
        initial={reduceMotion ? false : "hidden"}
        animate="show"
        suppressHydrationWarning
      >
        {lines.map((l, i) => (
          <span className="ph__line" key={i}>
            <motion.span
              className={i === lines.length - 1 ? "ph__line--acid" : undefined}
              style={{ display: "block" }}
              variants={lineAnim}
            >
              <ScrambleText text={l} />
            </motion.span>
          </span>
        ))}
      </motion.h1>

      {/* divisor fofo no lugar da linha tracejada */}
      <motion.div
        className="ph__foot"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduceMotion ? 0 : 0.75, duration: reduceMotion ? 0 : 0.7 }}
        style={{ y: textY }}
        suppressHydrationWarning
      >
        <AsciiDivider
          repeat={false}
          pattern="₊✧˚﹕︶︶︶﹕૮₍ ⸝⸝´ ꒳ `⸝⸝ ₎ა﹕︶︶︶﹕˚✧₊"
          size=".82rem"
          opacity={0.62}
          style={{ width: "100%", marginBottom: ".4rem" }}
        />
      </motion.div>

      {/* frase no espaço em branco da onda (concavidade), alinhada à ESQUERDA
          e em OffBit — abaixo do título pra não encostar nele */}
      <p
        className="ph__sub ph__sub--pocket"
        aria-label={`${sub} ${subHighlight}`}
      >
        {(() => {
          // quebra forçada após a primeira vírgula ("...visuais,") = 2 linhas
          // exatas, sem depender de calibragem frágil de largura
          const i = sub.indexOf(",");
          if (i === -1) {
            return (
              <span aria-hidden="true">
                <WavyText text={`${sub} `} delay={.92} />
                <WavyText text={subHighlight} accent delay={.92 + sub.length * .018} />
              </span>
            );
          }
          return (
            <span aria-hidden="true">
              <WavyText text={sub.slice(0, i + 1)} delay={.92} />
              <br />
              <WavyText text={`${sub.slice(i + 1).trim()} `} delay={.92 + (i + 1) * .018} />
              <WavyText text={subHighlight} accent delay={.92 + (sub.length + 1) * .018} />
            </span>
          );
        })()}
      </p>
    </section>
  );
}
