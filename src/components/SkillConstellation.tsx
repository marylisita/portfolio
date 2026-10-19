"use client";

import Link from "next/link";
import { useState } from "react";

export type ConstellationNode = {
  label: string;
  detail: string;
  href?: string;
  refLabel?: string;
};

interface Props {
  nodes: ConstellationNode[];
}

/**
 * Índice de atuação — cada linha abre um detalhe e aponta para o recorte no arquivo.
 *
 * A abertura por mouse é CSS puro (`:hover` em ponteiro fino), a abertura por
 * teclado acompanha `:focus-within` (para permitir Tab até o link do recorte)
 * e a abertura por toque usa `useState`.
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
          padding: 1.1rem 0;
          color: inherit;
        }

        .rm-skill-trigger {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 1rem;
          width: 100%;
          min-height: calc(var(--tap-min) - 1rem);
          padding: 0;
          border: 0;
          background: transparent;
          color: inherit;
          font: inherit;
          font-size: var(--type-label);
          text-transform: uppercase;
          letter-spacing: .08em;
          text-align: left;
          cursor: pointer;
          z-index: 2;
        }

        .rm-skill-trigger:focus-visible {
          outline: 2px solid var(--ink);
          outline-offset: 4px;
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
          transition: color .25s ease, opacity .25s ease;
        }

        .rm-skill-label {
          display: inline-block;
          font-weight: 600;
          transition: transform .3s cubic-bezier(.23, 1, .32, 1), color .25s ease;
        }

        .rm-skill-icon {
          flex: 0 0 auto;
          opacity: .5;
          font-size: 1rem;
          line-height: 1;
          transform: rotate(0deg);
          transition:
            opacity .25s cubic-bezier(.23, 1, .32, 1),
            transform .4s cubic-bezier(.23, 1, .32, 1),
            color .25s ease;
        }

        /* Acordeão em grid-template-rows: 0fr -> 1fr para medir a altura real
           do texto sem folga sobrando nem corte em telas estreitas. */
        .rm-skill-detail-wrapper {
          display: grid;
          grid-template-rows: 0fr;
          opacity: 0;
          transition:
            grid-template-rows .42s cubic-bezier(.16, 1, .3, 1),
            opacity .3s ease;
        }

        .rm-skill-detail-inner {
          min-height: 0;
          overflow: hidden;
        }

        .rm-skill-row[data-open="true"] .rm-skill-detail-wrapper,
        .rm-skill-row:focus-within .rm-skill-detail-wrapper {
          grid-template-rows: 1fr;
          opacity: 1;
        }

        .rm-skill-row[data-open="true"] .rm-skill-icon,
        .rm-skill-row:focus-within .rm-skill-icon {
          opacity: 1;
          color: var(--acid);
          transform: rotate(45deg);
        }

        .rm-skill-row[data-open="true"] .rm-skill-number,
        .rm-skill-row:focus-within .rm-skill-number {
          opacity: .9;
          color: var(--acid);
        }

        /* Só onde existe ponteiro fino: no toque, quem manda é o estado. */
        @media (hover: hover) and (pointer: fine) {
          .rm-skill-row:hover .rm-skill-detail-wrapper {
            grid-template-rows: 1fr;
            opacity: 1;
          }
          .rm-skill-row:hover .rm-skill-label {
            transform: translateX(8px);
          }
          .rm-skill-row:hover .rm-skill-icon {
            opacity: 1;
            color: var(--acid);
            transform: rotate(45deg);
          }
          .rm-skill-row:hover .rm-skill-number {
            opacity: .9;
            color: var(--acid);
          }
        }

        .rm-skill-detail-body {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          justify-content: space-between;
          gap: .55rem 1.2rem;
          padding-top: .75rem;
          padding-left: 3rem;
        }

        .rm-skill-detail {
          display: block;
          font-family: var(--font-serif), serif;
          font-size: clamp(.95rem, 1.2vw, 1.15rem);
          font-style: italic;
          line-height: 1.5;
          letter-spacing: normal;
          text-transform: none;
          opacity: .82;
        }

        .rm-skill-ref {
          display: inline-flex;
          align-items: center;
          gap: .28rem;
          font-family: var(--font-subtitle), monospace;
          font-size: var(--type-micro);
          font-weight: var(--offbit-weight-active);
          letter-spacing: .06em;
          text-transform: lowercase;
          text-decoration: none;
          color: var(--acid);
          white-space: nowrap;
          transition: transform .22s cubic-bezier(.16, 1, .3, 1), color .2s ease;
        }

        .rm-skill-ref:hover,
        .rm-skill-ref:focus-visible {
          color: var(--ink);
          transform: translateX(3px);
          text-decoration: underline dashed 1px;
          text-underline-offset: .28em;
        }

        .rm-skill-ref:active {
          transform: scale(0.96);
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

        @media (max-width: 520px) {
          .rm-skill-detail-body {
            padding-left: 2.2rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rm-skill-label,
          .rm-skill-icon,
          .rm-skill-number,
          .rm-skill-ref,
          .rm-skill-detail-wrapper {
            transition: none;
          }
          .rm-skill-row:hover .rm-skill-label,
          .rm-skill-ref:hover,
          .rm-skill-ref:focus-visible {
            transform: none;
          }
          .rm-skill-row[data-open="true"] .rm-skill-icon,
          .rm-skill-row:hover .rm-skill-icon,
          .rm-skill-row:focus-within .rm-skill-icon {
            transform: none;
            opacity: 1;
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
          <div
            key={node.label}
            className="rm-skill-row"
            data-open={isOpen ? "true" : "false"}
          >
            <button
              type="button"
              className="rm-skill-trigger"
              aria-expanded={isOpen}
              aria-controls={detailId}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span className="rm-skill-title">
                <span className="rm-skill-number">{number} /</span>
                <span className="rm-skill-label">{node.label}</span>
              </span>
              <span className="rm-skill-icon" aria-hidden="true">+</span>
            </button>

            <div className="rm-skill-detail-wrapper" id={detailId}>
              <div className="rm-skill-detail-inner">
                <div className="rm-skill-detail-body">
                  <span className="rm-skill-detail">{node.detail}</span>
                  {node.href && node.refLabel ? (
                    <Link href={node.href} className="rm-skill-ref hover-trigger">
                      [ {node.refLabel} ↗ ]
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>

            <span className="rm-skill-divider" />
          </div>
        );
      })}
    </div>
  );
}
