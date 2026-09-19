"use client";

import { useState } from "react";

export type ConstellationNode = {
  label: string;
  detail: string;
};

interface Props {
  nodes: ConstellationNode[];
}

/**
 * Índice de atuação — cada linha abre um detalhe.
 *
 * A abertura por mouse é CSS puro (`:hover` em ponteiro fino) e a abertura por
 * toque/teclado é estado. Antes as duas moravam no mesmo `useState`: o `focus`
 * do toque já marcava a linha como aberta e o `click` seguinte a fechava, então
 * o primeiro toque no celular não fazia nada visível. Manter as duas separadas.
 */
export default function SkillConstellation({ nodes }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="rm-skills-index">
      <style>{`
        .rm-skills-index {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 100%;
          font-family: var(--font-body);
          color: var(--ink);
        }

        .rm-skill-row {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: var(--tap-min);
          padding: 1.1rem 0;
          border: 0;
          background: transparent;
          color: inherit;
          font: inherit;
          text-align: left;
          cursor: pointer;
        }

        .rm-skill-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 1rem;
          font-size: var(--type-label);
          text-transform: uppercase;
          letter-spacing: .08em;
          z-index: 2;
        }

        .rm-skill-title {
          display: flex;
          align-items: baseline;
          min-width: 0;
        }

        .rm-skill-number {
          flex: 0 0 auto;
          margin-right: 1.5rem;
          opacity: .5;
          font-family: var(--font-subtitle), monospace;
          font-variant-numeric: tabular-nums;
        }

        .rm-skill-label {
          display: inline-block;
          font-weight: 600;
          transition: transform .3s cubic-bezier(.23, 1, .32, 1);
        }

        .rm-skill-icon {
          flex: 0 0 auto;
          opacity: 0;
          font-size: .8rem;
          transform: rotate(-90deg);
          transition: all .4s cubic-bezier(.23, 1, .32, 1);
        }

        .rm-skill-detail-wrapper {
          display: block;
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition:
            max-height .4s cubic-bezier(.23, 1, .32, 1),
            opacity .3s ease;
        }

        .rm-skill-row[data-open="true"] .rm-skill-detail-wrapper,
        .rm-skill-row:focus-visible .rm-skill-detail-wrapper {
          max-height: 9rem;
          opacity: 1;
        }

        .rm-skill-row[data-open="true"] .rm-skill-icon,
        .rm-skill-row:focus-visible .rm-skill-icon {
          opacity: 1;
          transform: rotate(0deg);
        }

        /* Só onde existe ponteiro fino: no toque, quem manda é o estado. */
        @media (hover: hover) and (pointer: fine) {
          .rm-skill-row:hover .rm-skill-detail-wrapper {
            max-height: 9rem;
            opacity: 1;
          }
          .rm-skill-row:hover .rm-skill-label {
            transform: translateX(8px);
          }
          .rm-skill-row:hover .rm-skill-icon {
            opacity: 1;
            transform: rotate(0deg);
          }
        }

        .rm-skill-row:focus-visible {
          outline: 2px solid var(--ink);
          outline-offset: 4px;
        }

        .rm-skill-detail {
          display: block;
          padding-top: .8rem;
          padding-left: 3rem;
          font-family: var(--font-serif), serif;
          font-size: clamp(.95rem, 1.2vw, 1.15rem);
          font-style: italic;
          line-height: 1.5;
          letter-spacing: normal;
          text-transform: none;
          opacity: .8;
        }

        .rm-skill-divider {
          display: block;
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: repeating-linear-gradient(
            to right,
            color-mix(in srgb, var(--ink) 35%, transparent),
            color-mix(in srgb, var(--ink) 35%, transparent) 3px,
            transparent 3px,
            transparent 8px
          );
        }

        @media (prefers-reduced-motion: reduce) {
          .rm-skill-label,
          .rm-skill-icon,
          .rm-skill-detail-wrapper {
            transition: none;
          }
          .rm-skill-row:hover .rm-skill-label {
            transform: none;
          }
        }
      `}</style>

      {/* Top divider */}
      <div className="rm-skill-divider" style={{ top: 0, bottom: "auto" }} />

      {nodes.map((node, i) => {
        const isOpen = openIndex === i;
        const number = (i + 1).toString().padStart(2, "0");
        const detailId = `rm-skill-detail-${i}`;

        return (
          <button
            key={node.label}
            type="button"
            className="rm-skill-row"
            data-open={isOpen ? "true" : "false"}
            aria-expanded={isOpen}
            aria-controls={detailId}
            onClick={() => setOpenIndex(isOpen ? null : i)}
          >
            <span className="rm-skill-header">
              <span className="rm-skill-title">
                <span className="rm-skill-number">{number} /</span>
                <span className="rm-skill-label">{node.label}</span>
              </span>
              <span className="rm-skill-icon" aria-hidden="true">✳︎</span>
            </span>

            <span className="rm-skill-detail-wrapper" id={detailId}>
              <span className="rm-skill-detail">{node.detail}</span>
            </span>

            <span className="rm-skill-divider" />
          </button>
        );
      })}
    </div>
  );
}
