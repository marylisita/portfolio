"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import AsciiAnim from "./AsciiAnim";
import {
  GATO_FRAMES,
  GATO_PRETO_FRAMES,
} from "./asciiArt";

/* canto em degrau de 8px — recorte "pixel" nas molduras */
export const PIXEL_CLIP =
  "polygon(0 8px, 8px 8px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 8px), 0 calc(100% - 8px))";

/* linha "pixelada": blocos de 6px em vez de fio contínuo */
const PIXEL_LINE = "repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px)";

/** Relógio ao vivo (referência: barbianaliu.com — "Mon 01:39:03 AM"). */
function LiveClock() {
  const [now, setNow] = useState("");
  useEffect(() => {
    const tick = () =>
      setNow(
        new Date()
          .toLocaleString("pt-BR", {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          .replace(",", "")
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="ph__note" style={{ color: "var(--acid)" }} suppressHydrationWarning>
      {now || "…"}
    </span>
  );
}

const styles = `
  .ph {
    position: relative;
    background: transparent; /* deixa o degradê+ruído do .rm aparecer */
    color: var(--ink);
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 7rem 2rem 2rem;
    background-image: ${PIXEL_LINE};
    background-size: 100% 2px;
    background-position: bottom left;
    background-repeat: no-repeat;
    overflow: hidden;
  }
  .ph__meta {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    font-family: var(--font-body);
    font-size: .78rem;
    text-transform: lowercase;
    letter-spacing: .12em;
    padding-bottom: .9rem;
    background-image: ${PIXEL_LINE};
    background-size: 100% 2px;
    background-position: bottom left;
    background-repeat: no-repeat;
    position: relative;
    z-index: 1;
  }
  .ph__title {
    font-family: var(--font-grotesk);
    font-weight: 700;
    /* limitado por ALTURA de viewport também: com 11.5vw puro o título
       estourava a tela em 1440x900 e cortava a última linha */
    font-size: clamp(2.2rem, min(8.5vw, 12vh), 7.5rem);
    line-height: .9;
    letter-spacing: -0.045em;
    text-transform: lowercase;
    margin: clamp(1.2rem, 4vh, 3rem) 0;
    position: relative;
    z-index: 1;
    pointer-events: none;
  }
  .ph__line { overflow: hidden; display: block; }
  .ph__line--acid { color: var(--acid); }
  .ph__foot {
    display: grid;
    grid-template-columns: 1fr minmax(280px, 34%);
    gap: 2rem;
    align-items: end;
    padding-top: 1rem;
    background-image: ${PIXEL_LINE};
    background-size: 100% 2px;
    background-position: top left;
    background-repeat: no-repeat;
    position: relative;
    z-index: 1;
  }
  .ph__sub {
    font-family: var(--font-body);
    font-size: clamp(.95rem, 1.3vw, 1.1rem);
    line-height: 1.5;
  }
  .ph__scroll {
    font-family: var(--font-hand);
    font-size: 1.35rem;
    letter-spacing: .01em;
  }
  .ph__em { font-family: var(--font-head); font-style: italic; letter-spacing: -0.01em; }

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
    font-family: var(--font-body);
    font-size: .78rem;
    text-transform: lowercase;
    letter-spacing: .08em;
    white-space: nowrap;
    pointer-events: none;
    opacity: .62;
  }

  @media (max-width: 720px) {
    .ph { padding: 5.5rem 1.25rem 1.5rem; }
    .ph__meta span:nth-child(2) { display: none; }
    .ph__title { margin: 2rem 0; }
    .ph__foot { grid-template-columns: 1fr; gap: 1.25rem; }
    .ph__sticker--desk { display: none; }
    .ph__sticker { cursor: default; }
  }
  @supports (animation-timeline: scroll()) {
    @media (max-width: 720px) {
      .ph__sticker:not(.ph__sticker--desk) {
        animation: ph-mobile-drift linear both;
        animation-timeline: scroll(root block);
        animation-range: 0% 18%;
      }
      @keyframes ph-mobile-drift {
        from { translate: 0 0; }
        to { translate: 0 18px; }
      }
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .ph__line > span { transform: none !important; }
    .ph__sticker { animation: none; translate: none; }
  }
`;

const lineAnim = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 0.9, delay: 0.15 + i * 0.11, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

type Sticker = {
  key: string;
  left: string;
  top: string;
  rotate: number;
  deskOnly?: boolean;
  el: React.ReactNode;
};

export default function PlaygroundHero({
  lines,
  location,
  sub,
  subHighlight,
  scrollLabel,
  children,
}: {
  lines: string[];
  location: string;
  sub: string;
  subHighlight: string;
  scrollLabel: string;
  children?: React.ReactNode;
}) {
  const bounds = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const syncViewport = () => setIsMobile(media.matches);

    syncViewport();
    media.addEventListener("change", syncViewport);
    return () => media.removeEventListener("change", syncViewport);
  }, []);

  const canDrag = !reduceMotion && !isMobile;

  // só desenhos ASCII (pedido dela) + relógio e palavrinhas — nada de capas de trabalho
  const stickers: Sticker[] = [
    {
      key: "ascii-gata", left: "6%", top: "14%", rotate: -2,
      el: <AsciiAnim frames={GATO_FRAMES} interval={180} fontSize={6} color="var(--acid)" opacity={0.56} />,
    },
    {
      key: "gato-preto-ascii", left: "20%", top: "62%", rotate: -4, deskOnly: true,
      el: <AsciiAnim frames={GATO_PRETO_FRAMES} interval={300} fontSize={5} color="var(--acid)" opacity={0.38} />,
    },
    // texto
    { key: "rio", left: "12%", top: "40%", rotate: -12, deskOnly: true, el: <span className="ph__note">( rio de janeiro )</span> },
    { key: "clock", left: "76%", top: "38%", rotate: 4, el: <LiveClock /> },
  ];

  return (
    <section className="ph" ref={bounds}>
      <style>{styles}</style>

      <div>
        <div className="ph__meta">
          <span>maria isabel lisita</span>
          <span>portfólio — 2026</span>
          <span>{location}</span>
        </div>
      </div>

      {/* adesivos — arrastáveis dentro do hero */}
      {stickers.map((s, i) => (
        <motion.div
          key={s.key}
          className={`ph__sticker${s.deskOnly ? " ph__sticker--desk" : ""}`}
          style={{ left: s.left, top: s.top }}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.6, rotate: s.rotate }}
          animate={{ opacity: 1, scale: 1, rotate: s.rotate }}
          transition={{ delay: reduceMotion ? 0 : 0.9 + i * 0.07, duration: reduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          drag={canDrag}
          dragConstraints={bounds}
          dragElastic={0.12}
          dragMomentum
          whileHover={canDrag ? { scale: 1.06 } : undefined}
          whileDrag={canDrag ? { scale: 1.12, rotate: 0, zIndex: 30 } : undefined}
        >
          {s.el}
        </motion.div>
      ))}

      {/* menu espalhado (ScatterMenu) e afins */}
      {children}


      <h1 className="ph__title">
        {lines.map((l, i) => (
          <span className="ph__line" key={i}>
            <motion.span
              className={i === lines.length - 1 ? "ph__line--acid" : undefined}
              style={{ display: "block" }}
              variants={lineAnim}
              custom={i}
              initial={reduceMotion ? false : "hidden"}
              animate="show"
            >
              {l}
            </motion.span>
          </span>
        ))}
      </h1>

      <motion.div
        className="ph__foot"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduceMotion ? 0 : 0.75, duration: reduceMotion ? 0 : 0.7 }}
      >
        <span className="ph__scroll">{scrollLabel}</span>
        <p className="ph__sub">
          {sub} <span className="ph__em">{subHighlight}</span>
        </p>
      </motion.div>
    </section>
  );
}
