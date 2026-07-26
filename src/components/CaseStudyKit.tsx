"use client";

import Image from "next/image";
import PixelReveal from "./PixelReveal";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { CSSProperties, ReactNode, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import AsciiDivider from "./AsciiDivider";

export type CaseVariant =
  | "chinario"
  | "ebat"
  | "genlab"
  | "graduation"
  | "hologlam"
  | "isadora"
  | "magazine"
  | "pilotis"
  | "vegcoz";

const ease = [0.16, 1, 0.3, 1] as const;

const styles = `
  .tc {
    --tc-accent: var(--acid);
    --tc-accent-text: var(--tc-accent);
    --tc-label-text: #f8f3e8;
    --tc-accent-soft: rgba(28, 27, 24, .1);
    --tc-paper: rgba(247, 243, 233, .9);
    --tc-ink: var(--ink);
    --tc-line: rgba(28, 27, 24, .28);
    --tc-deep: #171613;
    position: relative;
    padding-bottom: clamp(2rem, 6vw, 5rem);
    color: var(--tc-ink);
    isolation: isolate;
  }
  .tc--chinario {
    --tc-accent: #c90035;
    --tc-accent-soft: rgba(201, 0, 53, .16);
    --tc-paper: rgba(250, 240, 231, .92);
    --tc-deep: #370511;
  }
  .tc--ebat {
    --tc-accent: #3158d7;
    --tc-accent-soft: rgba(49, 88, 215, .15);
    --tc-paper: rgba(246, 241, 224, .93);
    --tc-deep: #18234e;
  }
  .tc--genlab {
    --tc-accent: #B482F6;
    --tc-accent-text: #8A4AE5;
    --tc-label-text: #FDF7FA;
    --tc-accent-soft: rgba(180, 130, 246, 0.14);
    --tc-paper: rgba(252, 246, 249, 0.94);
    --tc-deep: #161224;
  }
  .tc--graduation {
    --tc-accent: #fb4c2f;
    --tc-accent-soft: rgba(250, 58, 92, .15);
    --tc-paper: rgba(250, 241, 224, .93);
    --tc-deep: #25122f;
  }
  .tc--hologlam {
    --tc-accent: #c685ff;
    --tc-accent-soft: rgba(173, 86, 255, .16);
    --tc-paper: rgba(241, 233, 249, .92);
    --tc-deep: #130b22;
  }
  .tc--isadora {
    --tc-accent: #E32026;
    --tc-accent-soft: rgba(227, 32, 38, .16);
    --tc-paper: rgba(248, 244, 235, .95);
    --tc-deep: #171717;
  }
  .tc--magazine {
    --tc-accent: #CC181E;
    --tc-accent-soft: rgba(204, 24, 30, .14);
    --tc-paper: rgba(245, 239, 222, .94);
    --tc-deep: #211d18;
  }
  .tc--pilotis {
    --tc-accent: #00a8ad;
    --tc-accent-soft: rgba(0, 168, 173, .16);
    --tc-paper: rgba(237, 247, 241, .92);
    --tc-deep: #06373b;
  }
  .tc--vegcoz {
    --tc-accent: #4f7f3a;
    --tc-accent-soft: rgba(79, 127, 58, .16);
    --tc-paper: rgba(241, 243, 225, .94);
    --tc-deep: #20321b;
  }

  .tc-thread {
    width: min(calc(100% - 2.5rem), var(--project-content-max));
    height: auto;
    margin: 0 auto clamp(2rem, 5vw, 4.5rem);
    color: var(--tc-accent);
    opacity: .62;
  }

  .tc-section {
    width: min(100%, var(--project-content-max));
    margin: 0 auto;
    /* Mantém a pausa editorial entre capítulos, mas não transforma cada
       divisor em uma tela vazia antes do próximo conteúdo. */
    padding: 0 var(--project-gutter) clamp(2.75rem, 5vw, 4.75rem);
    position: relative;
  }
  .tc-section__rule {
    margin-top: clamp(1.75rem, 3.5vw, 3.25rem);
    color: currentColor;
    opacity: .52;
  }
  .tc-section--compact { width: min(100%, var(--project-compact-max)); }
  .tc-section--ink {
    width: min(calc(100% - 2rem), var(--project-content-max));
    margin-bottom: clamp(2.75rem, 5vw, 4.75rem);
    padding-top: clamp(2.25rem, 4vw, 3.75rem);
    border: 1px dashed color-mix(in srgb, var(--tc-accent) 52%, transparent);
    color: #f7f3e9;
    background:
      radial-gradient(
        52rem 38rem at var(--pj-light-pos, 72% 20%),
        color-mix(in srgb, var(--tc-accent) 27%, transparent) 0%,
        transparent 72%
      ),
      var(--tc-deep);
    background-attachment: fixed;
    box-shadow: 11px 12px 0 var(--tc-accent-soft);
  }
  .tc-section--ink .tc-kicker,
  .tc-section--ink .tc-copy { color: inherit; }
  .tc-section--ink .tc-kicker,
  .tc-section--ink .tc-impact__title {
    color: var(--tc-accent);
  }
  .tc-section--ink .tc-copy { opacity: .78; }

  .tc-heading {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(16rem, .72fr);
    gap: clamp(2rem, 6vw, 6rem);
    align-items: end;
    margin-bottom: clamp(2rem, 5vw, 4rem);
  }
  .tc-kicker {
    margin: 0 0 .8rem;
    color: var(--tc-accent-text);
    font-family: var(--font-subtitle), monospace;
    font-weight: var(--offbit-weight);
    font-size: var(--type-micro);
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
  }
  .tc-title {
    max-width: var(--measure-section-title);
    margin: 0;
    font-family: var(--font-head);
    font-weight: 400;
    font-size: clamp(2.2rem, 5.5vw, 5.2rem);
    line-height: .92;
    letter-spacing: -.035em;
    text-transform: lowercase;
    text-wrap: balance;
  }
  .tc-copy {
    max-width: var(--measure-copy);
    margin: 0;
    color: var(--gray-600);
    font-family: var(--font-body);
    font-size: clamp(1.04rem, 1.55vw, 1.2rem);
    line-height: 1.68;
    text-wrap: pretty;
  }
  .tc-copy em, .tc-copy strong {
    font-weight: 700;
    font-style: italic;
    color: var(--tc-ink);
  }
  .tc-section--ink .tc-copy em, .tc-section--ink .tc-copy strong {
    color: inherit;
  }

  .tc-grid { display: grid; gap: clamp(1rem, 3vw, 2.5rem); align-items: start; }
  .tc-grid--two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .tc-grid--three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .tc-grid--asym { grid-template-columns: minmax(0, 1.35fr) minmax(240px, .65fr); }
  .tc-grid--asym-reverse { grid-template-columns: minmax(240px, .65fr) minmax(0, 1.35fr); }
  .tc-grid--stack { grid-template-columns: 1fr; gap: clamp(2rem, 6vw, 5.5rem); }
  .tc-grid--offset > :nth-child(even) { margin-top: clamp(2.5rem, 8vw, 7rem); }

  .tc-figure {
    --tc-tilt: 0deg;
    position: relative;
    min-width: 0;
    margin: 0;
    padding: clamp(.35rem, .8vw, .55rem);
    border: 1px solid var(--tc-line);
    background: var(--tc-paper);
    box-shadow: 8px 9px 0 var(--tc-accent-soft);
    rotate: var(--tc-tilt);
    transition:
      translate var(--duration-normal) var(--ease-out),
      rotate var(--duration-normal) var(--ease-out),
      box-shadow var(--duration-normal) var(--ease-out);
  }
  .tc-figure::before {
    content: "";
    position: absolute;
    z-index: 2;
    top: -.3rem;
    left: 50%;
    width: clamp(3.5rem, 10vw, 6.5rem);
    height: .75rem;
    translate: -50% 0;
    rotate: -1.5deg;
    border: 1px solid rgba(28, 27, 24, .12);
    background: rgba(239, 225, 192, .68);
    pointer-events: none;
  }
  .tc-figure::after {
    content: "";
    position: absolute;
    z-index: 2;
    right: .35rem;
    bottom: .35rem;
    width: 1.15rem;
    height: 1.15rem;
    border-top: 1px solid var(--tc-line);
    border-left: 1px solid var(--tc-line);
    background: color-mix(in srgb, var(--tc-accent) 12%, var(--tc-paper));
    clip-path: polygon(100% 0, 0 100%, 100% 100%);
    pointer-events: none;
  }
  .tc-figure:hover {
    z-index: 3;
    translate: 0 -5px;
    rotate: 0deg;
    box-shadow: 12px 14px 0 var(--tc-accent-soft);
  }
  .tc-figure img {
    display: block;
    width: 100%;
    height: auto;
    transition: filter var(--duration-slow) var(--ease-default);
  }
  .tc-figure__cap {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: .65rem .25rem .15rem;
    font-family: var(--font-subtitle), monospace;
    font-weight: var(--offbit-weight);
    font-size: var(--type-micro);
    line-height: 1.4;
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
    opacity: .66;
  }

  .tc-panel {
    position: relative;
    padding: clamp(1.35rem, 2.7vw, 2rem);
    border: 1px solid var(--tc-line);
    background-color: var(--paper-sheet);
    background-image:
      repeating-linear-gradient(0deg, transparent 0 3px, rgba(28,27,24,.025) 3px 4px),
      repeating-linear-gradient(90deg, transparent 0 4px, rgba(255,255,255,.1) 4px 5px),
      url("/img/paper-noise.webp"),
      linear-gradient(118deg, rgba(255,255,255,.28), transparent 58%);
    background-size: 100% 100%, 100% 100%, 150px 150px, 100% 100%;
    box-shadow:
      4px 5px 0 var(--paper-shadow),
      inset 0 0 0 1px rgba(255,255,255,.15);
    rotate: -.25deg;
  }
  .tc-panel:nth-child(even) { rotate: .3deg; }
  .tc-panel::before {
    content: "";
    position: absolute;
    z-index: 2;
    top: -.38rem;
    left: clamp(1.1rem, 16%, 3.5rem);
    width: 4rem;
    height: .75rem;
    border: 1px solid rgba(28,27,24,.1);
    background:
      repeating-linear-gradient(90deg, transparent 0 4px, rgba(28,27,24,.025) 4px 5px),
      var(--paper-tape);
    rotate: -2deg;
    pointer-events: none;
  }
  .tc-panel::after {
    content: "";
    position: absolute;
    right: .28rem;
    bottom: .28rem;
    width: 1.05rem;
    height: 1.05rem;
    border-top: 1px solid var(--tc-line);
    border-left: 1px solid var(--tc-line);
    background: color-mix(in srgb, var(--paper-sheet) 82%, var(--tc-accent));
    clip-path: polygon(100% 0, 0 100%, 100% 100%);
    pointer-events: none;
  }
  .tc-panel__label {
    display: inline-flex;
    align-items: center;
    min-height: var(--tap-min);
    margin: 0 0 1rem;
    padding: .55rem .75rem;
    color: var(--tc-label-text);
    background: var(--tc-accent);
    box-shadow: 2px 2px 0 color-mix(in srgb, var(--tc-ink) 15%, transparent);
    font-family: var(--font-subtitle), monospace;
    font-weight: var(--offbit-weight);
    font-size: var(--type-label);
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
  }

  .tc-manifest {
    position: relative;
    margin: 0;
    padding: clamp(2rem, 6vw, 5rem);
    font-family: var(--font-head);
    font-size: clamp(2.2rem, 6.5vw, 6.5rem);
    line-height: .9;
    letter-spacing: -.04em;
    text-transform: lowercase;
  }

  .tc-manifest em { 
    color: var(--tc-accent-text); 
    font-weight: 700; 
    font-style: italic; 
  }

  .tc-tape {
    width: fit-content;
    max-width: 100%;
    margin: 0 auto;
    padding: .7rem 1.1rem;
    border: 1px solid var(--tc-line);
    color: var(--tc-ink);
    background: var(--tc-paper);
    box-shadow: 5px 6px 0 var(--tc-accent-soft);
    font-family: var(--font-head);
    font-style: italic;
    font-size: clamp(1.2rem, 3vw, 2rem);
    line-height: 1.2;
    text-align: center;
    rotate: -.6deg;
  }

  .tc-action {
    display: inline-flex;
    align-items: center;
    gap: .65rem;
    min-height: 46px;
    padding: .7rem 1rem;
    border: 1px dashed currentColor;
    color: #f8f3e8;
    background: var(--tc-deep);
    box-shadow: 5px 6px 0 var(--tc-accent-soft);
    font-family: var(--font-subtitle), monospace;
    font-weight: var(--offbit-weight);
    font-size: var(--type-label);
    letter-spacing: var(--offbit-letter-spacing);
    text-decoration: none;
    text-transform: lowercase;
    transition: translate var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out);
  }
  .tc-action:hover,
  .tc-action:focus-visible {
    outline: none;
    translate: -3px -3px;
    box-shadow: 9px 10px 0 var(--tc-accent-soft);
  }

  .tc-credits {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 2.5rem;
  }
  .tc-credits::before {
    content: "--------------------------------------------------------------------------------";
    grid-column: 1 / -1;
    overflow: hidden;
    color: var(--tc-ink);
    font-family: var(--font-mono), monospace;
    font-size: var(--type-ascii-rule);
    line-height: 1;
    letter-spacing: .02em;
    white-space: nowrap;
    opacity: .46;
  }
  .tc-credit {
    position: relative;
    display: grid;
    grid-template-columns: minmax(7rem, .4fr) 1fr;
    gap: 1rem;
    padding: 1rem 0;
  }
  .tc-credit::after {
    content: "------------------------------------------------------------";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    color: var(--tc-ink);
    font-family: var(--font-mono), monospace;
    font-size: var(--type-ascii-rule);
    line-height: 1;
    letter-spacing: .02em;
    white-space: nowrap;
    opacity: .38;
  }
  .tc-credit__label {
    color: var(--tc-accent);
    font-family: var(--font-subtitle), monospace;
    font-weight: var(--offbit-weight);
    font-size: var(--type-micro);
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
  }
  .tc-credit__value {
    font-family: var(--font-body);
    font-size: var(--type-body);
    line-height: 1.55;
  }

  .tc-impact {
    padding-top: clamp(3rem, 6vw, 4.5rem);
    padding-bottom: clamp(3rem, 6vw, 4.5rem);
  }
  .tc-impact__block {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .tc-impact__block--outcome {
    padding-left: clamp(0rem, 4vw, 3rem);
    border-left: 1px dashed color-mix(in srgb, var(--tc-accent) 40%, transparent);
  }
  .tc-impact__kicker {
    margin: 0;
    opacity: 0.8;
  }
  .tc-impact__title {
    font-family: var(--font-head);
    font-size: clamp(1.8rem, 4vw, 3.2rem);
    line-height: 1.05;
    letter-spacing: -.02em;
    font-weight: 700;
    font-style: italic;
    margin: 0;
    color: var(--tc-accent-text);
  }
  .tc-impact__desc {
    font-family: var(--font-body);
    font-size: clamp(1.05rem, 1.5vw, 1.25rem);
    line-height: 1.65;
    margin: 0;
    opacity: 0.9;
    text-wrap: pretty;
  }

  @media (max-width: 780px) {
    .tc-heading,
    .tc-grid--two,
    .tc-grid--three,
    .tc-grid--asym,
    .tc-grid--asym-reverse {
      grid-template-columns: 1fr;
    }
    .tc-grid--offset > :nth-child(even) { margin-top: 0; }
    .tc-credits { grid-template-columns: 1fr; }
    .tc-section--ink { width: calc(100% - 1rem); }
    .tc-impact__block--outcome {
      padding-left: 0;
      padding-top: 2.5rem;
      border-left: none;
      border-top: 1px dashed color-mix(in srgb, var(--tc-accent) 40%, transparent);
    }
  }
  @media (max-width: 520px) {
    .tc-section { padding-inline: 1.25rem; }
    .tc-credit { grid-template-columns: 1fr; gap: .3rem; }
    .tc-figure__cap { flex-direction: column; gap: .15rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    .tc-figure,
    .tc-figure img,
    .tc-action { transition: none; }
    .tc-figure:hover,
    .tc-action:hover,
    .tc-action:focus-visible { translate: 0; rotate: var(--tc-tilt); }
  }
`;

export function CaseCanvas({
  variant,
  children,
}: {
  variant: CaseVariant;
  children: ReactNode;
}) {
  return (
    <div className={`tc tc--${variant}`}>
      <style>{styles}</style>
      <AsciiDivider className="tc-thread" />
      {children}
    </div>
  );
}

export function CaseSection({
  label,
  title,
  intro,
  children,
  compact = false,
  ink = false,
  className = "",
}: {
  label?: string;
  title?: string;
  intro?: ReactNode;
  children: ReactNode;
  compact?: boolean;
  ink?: boolean;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <section
      className={[
        "tc-section",
        compact ? "tc-section--compact" : "",
        ink ? "tc-section--ink" : "",
        className,
      ].filter(Boolean).join(" ")}
    >
      {(label || title || intro) && (
        <motion.div
          className="tc-heading"
          initial={reducedMotion ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: reducedMotion ? 0 : .72, ease }}
        >
          <div>
            {label ? <p className="tc-kicker">{label}</p> : null}
            {title ? <h2 className="tc-title">{title}</h2> : null}
          </div>
          {intro ? <div className="tc-copy">{intro}</div> : null}
        </motion.div>
      )}
      {children}
      <AsciiDivider className="tc-section__rule" />
    </section>
  );
}

export function CaseFigure({
  src,
  width,
  height,
  alt,
  caption,
  index,
  tilt = 0,
  priority = false,
  sizes = "(max-width: 780px) 100vw, 50vw",
  className = "",
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  index?: string;
  tilt?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <motion.figure
        className={`tc-figure ${className}`}
        style={{ "--tc-tilt": `${tilt}deg`, cursor: "zoom-in" } as CSSProperties}
        initial={reducedMotion ? false : { opacity: 0, y: 34, rotate: tilt * 1.8 }}
        whileInView={{ opacity: 1, y: 0, rotate: tilt }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: reducedMotion ? 0 : .78, ease }}
        onClick={() => setIsOpen(true)}
      >
      <PixelReveal
        src={src}
        width={width}
        height={height}
        alt={alt || "Project asset"}
        className="tc-image__img"
        gridSize={40}
      />
        {caption || index ? (
          <figcaption className="tc-figure__cap">
            <span>{index ?? "imagem"}</span>
            {caption ? <span>{caption}</span> : null}
          </figcaption>
        ) : null}
      </motion.figure>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 99999,
                  backgroundColor: "rgba(10, 10, 10, 0.92)",
                  backdropFilter: "blur(12px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "3vw",
                  cursor: "zoom-out",
                }}
                onClick={() => setIsOpen(false)}
              >
                <motion.div
                  initial={reducedMotion ? false : { scale: 0.9, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={reducedMotion ? false : { scale: 0.9, y: 15 }}
                  transition={{ duration: 0.4, ease }}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    maxWidth: width,
                    maxHeight: height,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src={src}
                    alt={alt || "Zoomed image"}
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="100vw"
                    quality={100}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

export function CasePanel({
  label,
  children,
  className = "",
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={`tc-panel ${className}`}
      initial={reducedMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reducedMotion ? 0 : .78, ease }}
    >
      {label ? <span className="tc-panel__label">{label}</span> : null}
      {children}
    </motion.div>
  );
}

export function CaseCredits({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="tc-credits">
      {items.map((item) => (
        <div className="tc-credit" key={`${item.label}-${item.value}`}>
          <span className="tc-credit__label">{item.label}</span>
          <span className="tc-credit__value">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function CaseImpact({
  challengeLabel,
  challengeTitle,
  challengeDesc,
  impactLabel,
  impactTitle,
  impactDesc,
}: {
  challengeLabel: string;
  challengeTitle: string;
  challengeDesc: string;
  impactLabel: string;
  impactTitle: string;
  impactDesc: string;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <CaseSection ink className="tc-impact">
      <div className="tc-grid tc-grid--two">
        <motion.div
          className="tc-impact__block"
          initial={reducedMotion ? false : { opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: reducedMotion ? 0 : 0.6, ease }}
        >
          <p className="tc-kicker tc-impact__kicker">{challengeLabel}</p>
          <h3 className="tc-impact__title">{challengeTitle}</h3>
          <p className="tc-impact__desc">{challengeDesc}</p>
        </motion.div>
        <motion.div
          className="tc-impact__block tc-impact__block--outcome"
          initial={reducedMotion ? false : { opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: reducedMotion ? 0 : 0.6, delay: 0.15, ease }}
        >
          <p className="tc-kicker tc-impact__kicker">{impactLabel}</p>
          <h3 className="tc-impact__title">{impactTitle}</h3>
          <p className="tc-impact__desc">{impactDesc}</p>
        </motion.div>
      </div>
    </CaseSection>
  );
}
