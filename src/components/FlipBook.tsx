"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useT } from "@/i18n/LanguageContext";

const styles = `
  .flipbook {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    color: inherit;
  }
  .flipbook__stage {
    position: relative;
    width: 100%;
    overflow: hidden;
    background: #17151c;
    border: 1px dashed color-mix(in srgb, currentColor 34%, transparent);
  }
  .flipbook__image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #17151c;
  }
  .flipbook__controls {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: .85rem;
    border-top: 1px dashed color-mix(in srgb, currentColor 34%, transparent);
    font-family: var(--font-subtitle), var(--font-mono), monospace;
    font-size: var(--type-label);
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
  }
  .flipbook__button {
    width: fit-content;
    min-height: var(--tap-min);
    padding: .45rem 0;
    border: 0;
    color: inherit;
    background: transparent;
    font: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    cursor: pointer;
    transition:
      color var(--duration-fast) var(--ease-default),
      translate var(--duration-fast) var(--ease-out);
  }
  .flipbook__button:last-child { justify-self: end; }
  .flipbook__button:hover:not(:disabled),
  .flipbook__button:focus-visible:not(:disabled) {
    color: var(--tc-accent);
    translate: 0 -2px;
  }
  .flipbook__button:focus-visible {
    outline: 1px dotted currentColor;
    outline-offset: 3px;
  }
  .flipbook__button:disabled {
    cursor: not-allowed;
    opacity: .3;
  }
  .flipbook__counter {
    min-width: 5ch;
    text-align: center;
    opacity: .72;
  }
  @media (max-width: 520px) {
    .flipbook__controls { gap: .4rem; font-size: var(--type-micro); }
    .flipbook__button { min-height: 40px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .flipbook__button { transition: none; }
  }
`;

export default function FlipBook({
  images,
  aspectRatio = "56.25%",
}: {
  images: string[];
  aspectRatio?: string;
}) {
  const { lang } = useT();
  const pt = lang !== "en";
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const previous = () => {
    if (page === 0) return;
    setDirection(-1);
    setPage((current) => current - 1);
  };

  const next = () => {
    if (page === images.length - 1) return;
    setDirection(1);
    setPage((current) => current + 1);
  };

  const variants = {
    enter: (nextDirection: number) => ({
      x: nextDirection > 0 ? "12%" : "-12%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (nextDirection: number) => ({
      zIndex: 0,
      x: nextDirection < 0 ? "12%" : "-12%",
      opacity: 0,
    }),
  };

  return (
    <div className="flipbook">
      <style>{styles}</style>

      <div className="flipbook__stage" style={{ paddingTop: aspectRatio }}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={`/img/${images[page]}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { duration: .42, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: .22 },
            }}
            className="flipbook__image"
            alt={`${pt ? "Página" : "Page"} ${page + 1} / ${images.length}`}
          />
        </AnimatePresence>
      </div>

      <div className="flipbook__controls">
        <button
          type="button"
          onClick={previous}
          disabled={page === 0}
          className="flipbook__button hover-trigger"
          aria-label={pt ? "Página anterior" : "Previous page"}
        >
          [ ← {pt ? "anterior" : "previous"} ]
        </button>
        <span className="flipbook__counter" aria-live="polite">
          {String(page + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={next}
          disabled={page === images.length - 1}
          className="flipbook__button hover-trigger"
          aria-label={pt ? "Próxima página" : "Next page"}
        >
          [ {pt ? "próxima" : "next"} → ]
        </button>
      </div>
    </div>
  );
}
