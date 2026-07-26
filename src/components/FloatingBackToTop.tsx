"use client";
import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

/**
 * Botão "voltar ao topo" no estilo editorial do site:
 * sem bolha escura genérica — uma etiqueta sutil com borda fina,
 * fundo da página e a seta ↑ na fonte mono do site.
 */

const styles = `
  .btt {
    position: fixed;
    bottom: 1.4rem;
    right: 1.4rem;
    z-index: 900;
    display: inline-flex;
    align-items: center;
    gap: .38rem;
    padding: .45rem .7rem;
    font-family: var(--font-mono), monospace;
    font-size: var(--type-micro, .68rem);
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--ink);
    background: var(--paper);
    border: 1px solid color-mix(in srgb, var(--ink) 30%, transparent);
    cursor: pointer;
    transition: background .25s ease, color .25s ease;
  }
  .btt:hover {
    background: var(--ink);
    color: var(--paper);
  }
  .btt:focus-visible {
    outline: 2px dotted var(--ink);
    outline-offset: 3px;
  }
`;

export default function FloatingBackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Avoid re-renders by checking threshold
    const shouldShow = latest > (typeof window !== 'undefined' ? window.innerHeight : 800);
    if (shouldShow !== isVisible) {
      setIsVisible(shouldShow);
    }
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{styles}</style>
      <AnimatePresence>
        {isVisible && (
          <motion.button
            className="btt hover-trigger"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={scrollToTop}
            aria-label="Voltar ao topo"
          >
            ↑ topo
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
