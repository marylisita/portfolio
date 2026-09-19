"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/i18n/LanguageContext";
import type { IndexItem } from "./EditorialIndex";

/**
 * A seleção da home.
 *
 * Antes isto era uma fita horizontal com setas e encaixe automático: um
 * projeto por vez, sempre do mesmo tamanho, com botão de avançar. Lido de
 * fora, isso é uma apresentação de slides — e era o sinal mais forte disso no
 * site inteiro.
 *
 * Agora é uma composição vertical em que a forma vem do conteúdo. Cada
 * projeto declara a sua em `shape`, e a regra é uma só: o espaço precisa ter
 * motivo.
 *
 * - `lead`   — o case com processo de produto mais completo. Imagem grande à
 *   esquerda, resultado por extenso ao lado. Abre a seção porque é o que mais
 *   sustenta leitura demorada.
 * - `half`   — o par comparável. Duas capas de proporções diferentes na mesma
 *   linha, alinhadas pela legenda: as alturas divergem por causa da imagem, e
 *   não de um deslocamento decorativo.
 * - `band`   — obra de instalação/exposição. Recorte largo, porque o que
 *   interessa é a peça no ambiente, não o enquadramento fechado.
 * - `column` — cartaz em pé. Coluna estreita, ao lado do fecho da seleção.
 *
 * As imagens usam a proporção real do arquivo (`ratio`), não uma moldura 3/2
 * comum a todos. A variação de altura da composição vem daí.
 */
export type WorkShape = "lead" | "half" | "band" | "column";

export type WorkEntry = IndexItem & { shape?: WorkShape };

const styles = `
  .sw {
    position: relative;
    width: 100%;
    min-width: 0;
  }
  .sw__set {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    column-gap: clamp(1.5rem, 3vw, 3.25rem);
    row-gap: clamp(4.5rem, 8vw, 8.5rem);
    align-items: end;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .sw__item { min-width: 0; }
  .sw__item--lead { grid-column: span 6; }
  .sw__item--half { grid-column: span 3; }
  .sw__item--band { grid-column: span 6; }
  .sw__item--column { grid-column: span 2; }

  .sw__link {
    position: relative;
    display: grid;
    gap: clamp(1rem, 1.6vw, 1.6rem);
    color: var(--ink);
    text-decoration: none;
  }
  .sw__item--lead .sw__link {
    grid-template-columns: minmax(0, 4fr) minmax(0, 2fr);
    align-items: end;
    gap: clamp(1.5rem, 3vw, 3.25rem);
  }

  .sw__media {
    position: relative;
    display: block;
    overflow: hidden;
    background: color-mix(in srgb, var(--paper) 90%, var(--ink));
    border: 1px solid color-mix(in srgb, var(--ink) 28%, transparent);
  }
  /* Recorte deliberado: a peça no ambiente, em faixa. */
  .sw__item--band .sw__media { aspect-ratio: 21 / 8; }
  .sw__item--band .sw__image { object-fit: cover; }
  .sw__image { object-fit: contain; }
  .sw__media::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: url("/img/paper-noise.webp");
    background-size: 150px 150px;
    mix-blend-mode: multiply;
    opacity: .18;
    transition: opacity var(--duration-normal) var(--ease-out);
  }

  .sw__copy {
    display: grid;
    gap: .55rem;
    min-width: 0;
    padding-top: .9rem;
    border-top: 1px solid color-mix(in srgb, var(--ink) 30%, transparent);
  }
  .sw__item--band .sw__copy {
    grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
    gap: .55rem clamp(1.5rem, 3vw, 3.25rem);
    align-items: start;
  }
  .sw__item--band .sw__head { grid-column: 1; grid-row: 1; }
  .sw__item--band .sw__blurb { grid-column: 2; grid-row: 1; margin: 0; }
  /* A linha de rodapé atravessa a faixa inteira: etiqueta na ponta esquerda,
     chamada na direita, como na legenda dos outros cartões. */
  .sw__item--band .sw__foot { grid-column: 1 / -1; grid-row: 2; }

  .sw__head {
    display: flex;
    align-items: baseline;
    gap: .7rem;
    min-width: 0;
  }
  .sw__num {
    flex: 0 0 auto;
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-label);
    font-weight: var(--offbit-weight-active);
    line-height: 1;
    letter-spacing: var(--offbit-letter-spacing);
    opacity: .55;
    font-variant-numeric: tabular-nums;
  }
  .sw__title {
    min-width: 0;
    font-family: var(--font-head);
    font-size: clamp(1.35rem, 1.05rem + .9vw, 2rem);
    font-weight: 600;
    line-height: 1.04;
    letter-spacing: -.025em;
    text-transform: lowercase;
    text-wrap: balance;
  }
  .sw__item--lead .sw__title { font-size: clamp(1.7rem, 1.1rem + 1.6vw, 2.9rem); }
  .sw__item--column .sw__title { font-size: clamp(1.15rem, .95rem + .5vw, 1.5rem); }

  /* A frase que diz por que vale abrir. Sem ela o cartão só anuncia
     categorias, e categoria não distingue um projeto do outro. */
  .sw__blurb {
    margin: .1rem 0 0;
    font-family: var(--font-body);
    font-size: var(--type-body);
    line-height: 1.5;
    max-width: 46ch;
    opacity: .82;
    text-wrap: pretty;
  }
  .sw__item--half .sw__blurb,
  .sw__item--column .sw__blurb { font-size: var(--type-label); }

  .sw__foot {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: .5rem 1rem;
    margin-top: .35rem;
  }
  .sw__tags {
    min-width: 0;
    font-family: var(--font-body);
    font-size: var(--type-micro);
    line-height: 1.3;
    letter-spacing: .035em;
    opacity: .62;
    text-transform: lowercase;
  }
  .sw__cta {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    gap: .35rem;
    padding-bottom: .1rem;
    border-bottom: 1px solid currentColor;
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-micro);
    font-weight: var(--offbit-weight-active);
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
  }
  .sw__cta-arrow {
    display: inline-block;
    transition: transform var(--duration-normal) var(--ease-out);
  }

  /* Fecho da seleção: em vez de um "fim da seleção" decorativo, a saída para
     o arquivo inteiro, ao lado do cartaz em pé. */
  .sw__more {
    grid-column: span 4;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: .9rem;
    padding-top: .9rem;
    border-top: 1px solid color-mix(in srgb, var(--ink) 30%, transparent);
  }
  .sw__more-label {
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-micro);
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
    opacity: .6;
  }
  .sw__more-link {
    display: inline-flex;
    align-items: baseline;
    gap: .6rem;
    align-self: flex-start;
    max-width: 100%;
    color: var(--ink);
    font-family: var(--font-head);
    font-size: clamp(1.35rem, 1rem + 1.4vw, 2.4rem);
    font-weight: 600;
    line-height: 1.05;
    letter-spacing: -.025em;
    text-decoration: none;
    text-transform: lowercase;
  }
  .sw__more-link::after {
    content: "\\2197";
    font-family: var(--font-mono), monospace;
    font-size: .6em;
    transition: transform var(--duration-normal) var(--ease-out);
  }

  @media (hover: hover) and (pointer: fine) {
    .sw__link .sw__title,
    .sw__more-link {
      background-image: linear-gradient(currentColor, currentColor);
      background-repeat: no-repeat;
      background-position: 0 100%;
      background-size: 0% 1px;
      transition: background-size var(--duration-normal) var(--ease-out);
    }
    .sw__link:hover .sw__title,
    .sw__link:focus-visible .sw__title,
    .sw__more-link:hover,
    .sw__more-link:focus-visible { background-size: 100% 1px; }
    .sw__link:hover .sw__media::after,
    .sw__link:focus-visible .sw__media::after { opacity: .07; }
    .sw__link:hover .sw__cta-arrow,
    .sw__link:focus-visible .sw__cta-arrow { transform: translate(2px, -2px); }
    .sw__more-link:hover::after,
    .sw__more-link:focus-visible::after { transform: translate(3px, -3px); }
  }
  .sw__link:focus-visible,
  .sw__more-link:focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 6px;
  }

  @media (max-width: 1050px) {
    .sw__item--lead .sw__link { grid-template-columns: minmax(0, 1fr); }
    .sw__item--column { grid-column: span 3; }
    .sw__more { grid-column: span 3; }
  }
  @media (max-width: 720px) {
    .sw__set { row-gap: 3.75rem; }
    /* Numa coluna só, a chamada à direita cai debaixo do botão flutuante de
       voltar ao topo. Ela desce para a própria linha, alinhada à esquerda. */
    .sw__foot { flex-direction: column; align-items: flex-start; gap: .6rem; }
    .sw__item--half,
    .sw__item--column,
    .sw__more { grid-column: span 6; }
    .sw__item--band .sw__media { aspect-ratio: 16 / 9; }
    .sw__item--band .sw__copy { grid-template-columns: minmax(0, 1fr); }
    .sw__item--band .sw__blurb,
    .sw__item--band .sw__foot { grid-column: 1; grid-row: auto; }
  }
  @media (prefers-reduced-motion: reduce) {
    .sw__media::after,
    .sw__cta-arrow,
    .sw__more-link::after { transition: none; }
    .sw__link:hover .sw__cta-arrow,
    .sw__link:focus-visible .sw__cta-arrow,
    .sw__more-link:hover::after,
    .sw__more-link:focus-visible::after { transform: none; }
  }
`;

/** Tamanho de renderização por forma — evita servir 2000px para uma coluna. */
const SIZES: Record<WorkShape, string> = {
  lead: "(max-width: 720px) 92vw, (max-width: 1050px) 88vw, 58vw",
  half: "(max-width: 720px) 92vw, 44vw",
  band: "(max-width: 720px) 92vw, 88vw",
  column: "(max-width: 720px) 92vw, (max-width: 1050px) 44vw, 28vw",
};

export default function ScatteredWorks({ items }: { items: WorkEntry[] }) {
  const { lang } = useT();

  const labels = lang === "pt"
    ? {
        region: "seleção de trabalhos",
        open: "ver projeto",
        moreLabel: "o resto do arquivo",
        more: "ver todos os trabalhos",
      }
    : {
        region: "selected work",
        open: "view project",
        moreLabel: "the rest of the archive",
        more: "see all work",
      };

  return (
    <>
      <style>{styles}</style>
      <div className="sw">
        <ul className="sw__set" aria-label={labels.region}>
          {items.map((item) => {
            const shape: WorkShape = item.shape ?? "half";
            const blurb = shape === "lead" ? item.blurb || item.impact : item.impact;
            return (
              <li className={`sw__item sw__item--${shape}`} key={item.href}>
                <Link
                  className="sw__link hover-trigger"
                  href={item.href}
                  data-cursor-label={`↗ ${item.num}`}
                >
                  <span className="sw__media">
                    <Image
                      className="sw__image"
                      src={item.img}
                      alt={item.title}
                      width={1200}
                      height={Math.round(1200 * item.ratio)}
                      sizes={SIZES[shape]}
                      style={
                        shape === "band"
                          ? { width: "100%", height: "100%" }
                          : { width: "100%", height: "auto" }
                      }
                    />
                  </span>
                  <span className="sw__copy">
                    <span className="sw__head">
                      <span className="sw__num">{item.num}</span>
                      <span className="sw__title">{item.title}</span>
                    </span>
                    {blurb ? <span className="sw__blurb">{blurb}</span> : null}
                    <span className="sw__foot">
                      <span className="sw__tags">{item.tags}</span>
                      <span className="sw__cta">
                        <span>{labels.open}</span>
                        <span className="sw__cta-arrow" aria-hidden="true">↗</span>
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
          <li className="sw__more">
            <span className="sw__more-label">{labels.moreLabel}</span>
            <Link className="sw__more-link hover-trigger" href="/work">
              {labels.more}
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
