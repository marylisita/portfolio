"use client";

import Link from "next/link";
import Image from "next/image";
import { Fragment, useState, type CSSProperties } from "react";
import { useT } from "@/i18n/LanguageContext";
import { useProjects } from "@/components/useProjects";
import EditorialFooter from "@/components/EditorialFooter";
import SiteHeader from "@/components/SiteHeader";

interface ProjectCardProps {
  num: string;
  title: string;
  tags: string;
  href: string;
  img: string;
  desc: string;
  ratio: number;
  index: number;
  total: string;
}

const DIVIDER_SYMBOLS = [
  "*",
  ".",
  "+",
  ".",
  "*",
  ".",
  "+",
  ".",
  "*",
  ".",
  "+",
  ".",
  "*",
  ".",
  "+",
  ".",
  "*",
  ".",
  "+",
] as const;

function AsciiDivider({ vertical = false }: { vertical?: boolean }) {
  return (
    <span
      className={`wk-ascii-divider ${
        vertical ? "wk-ascii-divider--vertical" : "wk-ascii-divider--horizontal"
      }`}
      aria-hidden="true"
    >
      {DIVIDER_SYMBOLS.map((symbol, symbolIndex) => (
        <span
          key={`${symbol}-${symbolIndex}`}
          style={
            { "--ascii-delay": `${symbolIndex * 58}ms` } as CSSProperties
          }
        >
          {symbol}
        </span>
      ))}
    </span>
  );
}

function ProjectCard({
  num,
  title,
  tags,
  href,
  img,
  desc,
  ratio,
  index,
  total,
}: ProjectCardProps) {
  const { t } = useT();
  const headingId = `project-title-${num}`;

  return (
    <article
      className="wk-project"
      data-reverse={index % 2 === 1 ? "true" : undefined}
      aria-labelledby={headingId}
    >
      <Link
        href={href}
        className="wk-project__visual hover-trigger"
        aria-label={`${t("view_project")}: ${title}`}
        style={{ aspectRatio: `1 / ${ratio}` }}
      >
        <Image
          className="wk-project__image"
          src={img}
          alt=""
          fill
          sizes="(max-width: 900px) calc(100vw - 2.5rem), 66vw"
          loading={index === 0 ? "eager" : "lazy"}
        />
      </Link>

      <div className="wk-project__copy">
        <AsciiDivider vertical />
        <span className="wk-project__count">
          {num} / {total}
          <AsciiDivider />
        </span>
        <h2 className="wk-project__title" id={headingId}>
          {title}
        </h2>
        <p className="wk-project__tags">{tags}</p>
        <p className="wk-project__desc">{desc}</p>
        <Link href={href} className="wk-project__cta hover-trigger">
          <span>{t("view_project")}</span>
          <span className="wk-project__cta-icon" aria-hidden="true">
            ↗
          </span>
        </Link>
      </div>
    </article>
  );
}

/** O núcleo do portfólio, na ordem em que aparece. Cada um cobre um território
 * que nenhum outro cobre. Os demais continuam na fonte completa porque as
 * páginas de case dependem dela para tags e navegação anterior/próximo. */
const CORE_HREFS = [
  "/work/juizo",
  "/work/graduation",
  "/work/ebat",
  "/work/cyber-marinum",
  "/work/magazine",
  "/work/isadora",
  "/work/hologlam",
  "/work/touchdesigner-workshop",
  "/work/ondularis",
];

/** Recorte de produto digital, UX/UI e web. A ordem começa pelos dois cases
 * com processo de produto mais completo e termina nos experimentos de interface. */
const DIGITAL_HREFS = [
  "/work/juizo",
  "/work/vegcoz",
  "/work/genlab",
  "/work/hologlam",
];

/** O eixo das abas é área, nunca contexto. Um projeto pode estar em mais de uma. */
const AREAS: Record<string, string[]> = {
  "/work/juizo": ["digital", "grafico", "pesquisa"],
  "/work/graduation": ["grafico"],
  "/work/ebat": ["grafico"],
  "/work/isadora": ["grafico"],
  "/work/magazine": ["grafico"],
  "/work/pilotis": ["grafico"],
  "/work/chinario": ["grafico"],
  "/work/cyber-marinum": ["arte"],
  "/work/ondularis": ["arte"],
  "/work/hologlam": ["digital", "arte", "pesquisa"],
  "/work/touchdesigner-workshop": ["arte", "pesquisa"],
  "/work/genlab": ["digital", "arte", "pesquisa"],
  "/work/vegcoz": ["digital", "pesquisa"],
};

const TABS = [
  { id: "destaques", key: "wk_tab_featured" },
  { id: "digital", key: "wk_tab_digital", priority: true },
  { id: "grafico", key: "wk_tab_graphic" },
  { id: "arte", key: "wk_tab_art" },
  { id: "pesquisa", key: "wk_tab_research" },
] as const;

export default function Work() {
  const { t, lang } = useT();
  const all = useProjects();
  const [area, setArea] = useState<string>("destaques");
  const pt = lang !== "en";

  const projects =
    area === "destaques"
      ? CORE_HREFS.flatMap((href) => {
          const found = all.find((item) => item.href === href);
          return found ? [found] : [];
        })
      : area === "digital"
        ? DIGITAL_HREFS.flatMap((href) => {
            const found = all.find((item) => item.href === href);
            return found ? [found] : [];
          })
      : all.filter((item) => AREAS[item.href]?.includes(area));

  const countFor = (id: string) =>
    id === "destaques"
      ? CORE_HREFS.length
      : id === "digital"
        ? DIGITAL_HREFS.length
      : all.filter((item) => AREAS[item.href]?.includes(id)).length;

  const getDesc = (href: string) => {
    if (href.endsWith("juizo")) {
      return pt
        ? "App autoral de finanças para renda variável: roda inteiro no aparelho e foi testado contra 285 lançamentos reais de extrato."
        : "A self-initiated finance app for variable income: it runs entirely on device and was tested against 285 real statement entries.";
    }
    if (href.endsWith("isadora")) return t("work_isadora_desc");
    if (href.endsWith("magazine")) return t("work_helvetica_desc");
    if (href.endsWith("genlab")) return t("work_genlab_desc");
    if (href.endsWith("ebat")) return t("work_ebat_desc");
    if (href.endsWith("graduation")) return t("grad_desc_2");
    if (href.endsWith("pilotis")) return t("pilotis_desc_2");
    if (href.endsWith("chinario")) return t("chinario_desc_1");
    if (href.endsWith("hologlam")) return t("holo_question");
    if (href.endsWith("vegcoz")) return t("vegcoz_desc_1");
    if (href.endsWith("ondularis")) {
      return pt
        ? "Exposição imersiva do coletivo Endosymbiosis na intersecção entre arte, ciência e tecnologia."
        : "An immersive exhibition by the Endosymbiosis collective at the intersection of art, science and technology.";
    }
    if (href.endsWith("cyber-marinum")) {
      return pt
        ? "Obra de arte interespécies em que um aquário vivo, sensores e imagens generativas respondem à presença do público."
        : "An interspecies artwork in which a living aquarium, sensors and generative images respond to the audience's presence.";
    }
    if (href.endsWith("touchdesigner-workshop")) {
      return pt
        ? "Oficina introdutória de programação visual, gráficos em tempo real e vídeo mapping com TouchDesigner."
        : "An introductory workshop on visual programming, real-time graphics and video mapping with TouchDesigner.";
    }
    return "";
  };

  const localStyles = `
    .wk-page {
      --wk-ink: var(--site-ink, #1c1b18);
      --wk-paper: #f6f2e9;
      --wk-wine: #843f3a;
      --wk-muted: #777168;
      --wk-line: rgba(28, 27, 24, .18);
      min-height: 100vh;
      overflow-x: hidden;
      color: var(--wk-ink);
      background:
        radial-gradient(circle at 84% 7%, rgba(132, 63, 58, .055), transparent 24rem),
        var(--wk-paper);
    }

    .wk-main {
      width: min(1380px, calc(100% - 5rem));
      margin: 0 auto;
      padding: clamp(7.8rem, 11vh, 9rem) 0 clamp(5rem, 9vw, 9rem);
      position: relative;
      z-index: 10;
    }

    .wk-intro {
      position: relative;
      min-height: clamp(23rem, 37vw, 31rem);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: clamp(3.5rem, 7vw, 6.4rem) 0 clamp(2.8rem, 4.5vw, 4rem);
      border-bottom: 1px solid var(--wk-line);
    }

    .wk-intro__eyebrow {
      margin: 0 0 1.35rem;
      color: var(--wk-wine);
      font-family: var(--font-subtitle), monospace;
      font-size: var(--type-micro);
      font-weight: var(--offbit-weight-active);
      letter-spacing: .14em;
      text-transform: uppercase;
    }

    .wk-heading {
      max-width: 8ch;
      margin: 0;
      font-family: var(--font-editorial), serif;
      font-size: clamp(5.2rem, 10.4vw, 9.2rem);
      font-weight: 400;
      line-height: .76;
      letter-spacing: -.055em;
      text-transform: lowercase;
    }

    .wk-heading span,
    .wk-heading em {
      display: block;
    }

    .wk-heading em {
      color: var(--wk-wine);
      font-weight: 400;
    }

    .wk-filters {
      display: flex;
      align-items: center;
      gap: clamp(1rem, 2.2vw, 2rem);
      padding: 1.4rem 0 clamp(4rem, 7vw, 6.6rem);
      overflow-x: auto;
      scrollbar-width: none;
    }

    .wk-filters::-webkit-scrollbar {
      display: none;
    }

    .wk-tab {
      position: relative;
      flex: 0 0 auto;
      min-height: var(--tap-min);
      padding: .55rem 0;
      border: 0;
      background: transparent;
      color: var(--wk-muted);
      cursor: pointer;
      font-family: var(--font-subtitle), monospace;
      font-size: var(--type-micro);
      font-weight: var(--offbit-weight);
      letter-spacing: .09em;
      text-transform: uppercase;
      transition: color 500ms cubic-bezier(.16, 1, .3, 1);
    }

    .wk-tab::after {
      content: "";
      position: absolute;
      right: 0;
      bottom: .28rem;
      left: 0;
      height: 2px;
      background: var(--wk-wine);
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 500ms cubic-bezier(.16, 1, .3, 1);
    }

    .wk-tab:hover,
    .wk-tab:focus-visible,
    .wk-tab[data-active="true"] {
      color: var(--wk-ink);
    }

    .wk-tab:hover::after,
    .wk-tab:focus-visible::after,
    .wk-tab[data-active="true"]::after {
      transform: scaleX(1);
      transform-origin: left;
    }

    .wk-tab:focus-visible {
      outline: 2px dotted var(--wk-wine);
      outline-offset: 5px;
    }

    .wk-tab__count {
      margin-left: .45rem;
      color: var(--wk-wine);
      font-variant-numeric: tabular-nums;
      letter-spacing: 0;
    }

    .wk-tab--priority {
      min-height: var(--tap-min);
      padding: .55rem .9rem;
      color: var(--wk-paper);
      background: var(--wk-wine);
      box-shadow: 0 0 0 1px var(--wk-wine);
      transition:
        color 180ms cubic-bezier(.2, 0, 0, 1),
        background-color 180ms cubic-bezier(.2, 0, 0, 1),
        box-shadow 180ms cubic-bezier(.2, 0, 0, 1),
        transform 180ms cubic-bezier(.2, 0, 0, 1);
    }

    .wk-tab--priority::after {
      inset: .28rem;
      height: auto;
      border: 1px dashed currentColor;
      background: transparent;
      opacity: 0;
      transform: none;
      transition: opacity 180ms cubic-bezier(.2, 0, 0, 1);
      pointer-events: none;
    }

    .wk-tab--priority .wk-tab__count {
      color: inherit;
      opacity: .72;
    }

    .wk-tab--priority:hover,
    .wk-tab--priority:focus-visible,
    .wk-tab--priority[data-active="true"] {
      color: var(--wk-paper);
      background: var(--wk-ink);
      box-shadow: 0 0 0 1px var(--wk-ink);
    }

    .wk-tab--priority:hover::after,
    .wk-tab--priority:focus-visible::after,
    .wk-tab--priority[data-active="true"]::after {
      opacity: .42;
      transform: none;
    }

    .wk-tab--priority:active {
      transform: scale(.96);
    }

    .wk-filter-dot {
      width: 3px;
      height: 3px;
      flex: 0 0 3px;
      border-radius: 50%;
      background: var(--wk-wine);
    }

    .wk-project {
      display: grid;
      grid-template-columns: minmax(0, 1.55fr) minmax(22rem, .75fr);
      gap: clamp(2rem, 4vw, 4rem);
      align-items: end;
      margin-bottom: clamp(8rem, 15vw, 14rem);
    }

    .wk-project[data-reverse="true"] {
      grid-template-columns: minmax(22rem, .75fr) minmax(0, 1.55fr);
    }

    .wk-project[data-reverse="true"] .wk-project__visual {
      grid-column: 2;
    }

    .wk-project[data-reverse="true"] .wk-project__copy {
      grid-column: 1;
      grid-row: 1;
    }

    .wk-project__visual {
      display: block;
      min-width: 0;
      overflow: hidden;
      position: relative;
      color: inherit;
      background: #111;
      text-decoration: none;
      transition: transform 750ms cubic-bezier(.16, 1, .3, 1);
    }

    .wk-project__visual::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background: linear-gradient(
        135deg,
        transparent 58%,
        rgba(132, 63, 58, .3) 125%
      );
      opacity: 0;
      transition: opacity 700ms cubic-bezier(.16, 1, .3, 1);
    }

    .wk-project__visual::before {
      content: "";
      position: absolute;
      inset: clamp(.85rem, 1.5vw, 1.35rem);
      z-index: 2;
      pointer-events: none;
      border: 2px dashed color-mix(
        in srgb,
        var(--wk-wine) 72%,
        var(--wk-paper)
      );
      box-shadow: inset 0 0 0 1px rgba(246, 242, 233, .18);
      opacity: 0;
      transform: scale(.96);
      transition:
        opacity 580ms cubic-bezier(.16, 1, .3, 1),
        transform 780ms cubic-bezier(.16, 1, .3, 1);
    }

    .wk-project__image {
      object-fit: cover;
      transition:
        filter 900ms cubic-bezier(.16, 1, .3, 1),
        transform 1100ms cubic-bezier(.16, 1, .3, 1);
    }

    .wk-project__visual:focus-visible {
      outline: 2px solid var(--wk-wine);
      outline-offset: 7px;
    }

    .wk-project__copy {
      position: relative;
      padding-bottom: .5rem;
    }

    .wk-ascii-divider {
      --ascii-rest-x: 0rem;
      --ascii-rest-y: 0rem;
      color: var(--wk-wine);
      font-family: var(--font-subtitle), monospace;
      font-size: .88rem;
      font-weight: var(--offbit-weight-active);
      line-height: 1;
      pointer-events: none;
    }

    .wk-ascii-divider span {
      display: inline-block;
      opacity: .46;
      transition:
        opacity 520ms cubic-bezier(.16, 1, .3, 1),
        transform 760ms cubic-bezier(.16, 1, .3, 1);
    }

    .wk-ascii-divider--vertical {
      position: absolute;
      top: 0;
      bottom: 0;
      left: -1.35rem;
      width: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      --ascii-rest-y: .65rem;
    }

    .wk-ascii-divider--vertical span {
      transform: translateY(var(--ascii-rest-y)) scale(.68);
    }

    .wk-ascii-divider--horizontal {
      width: clamp(10rem, 18vw, 14rem);
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      --ascii-rest-x: -.65rem;
    }

    .wk-ascii-divider--horizontal span {
      transform: translateX(var(--ascii-rest-x)) scale(.68);
    }

    .wk-project__count {
      display: flex;
      align-items: center;
      gap: .85rem;
      color: var(--wk-wine);
      font-family: var(--font-subtitle), monospace;
      font-size: var(--type-micro);
      font-weight: var(--offbit-weight-active);
      letter-spacing: .1em;
      text-transform: uppercase;
    }

    .wk-project__title {
      margin: 1.2rem 0 1.55rem;
      font-family: var(--font-editorial), serif;
      font-size: clamp(3.35rem, 4.8vw, 4.75rem);
      font-weight: 400;
      line-height: .86;
      letter-spacing: -.045em;
      overflow-wrap: anywhere;
      text-transform: lowercase;
      transition:
        color 600ms cubic-bezier(.16, 1, .3, 1),
        transform 750ms cubic-bezier(.16, 1, .3, 1);
    }

    .wk-project__tags {
      margin: 0;
      color: var(--wk-muted);
      font-family: var(--font-subtitle), monospace;
      font-size: var(--type-micro);
      font-weight: var(--offbit-weight);
      line-height: 1.45;
      letter-spacing: .11em;
      text-transform: uppercase;
    }

    .wk-project__desc {
      max-width: 46ch;
      margin: 1.8rem 0 2rem;
      color: color-mix(in srgb, var(--wk-ink) 72%, var(--wk-paper));
      font-family: var(--font-body), sans-serif;
      font-size: var(--type-body);
      line-height: 1.65;
      text-wrap: pretty;
    }

    .wk-project__cta {
      display: inline-flex;
      align-items: center;
      gap: .8rem;
      min-height: var(--tap-min);
      color: var(--wk-ink);
      font-family: var(--font-subtitle), monospace;
      font-size: var(--type-micro);
      font-weight: var(--offbit-weight-active);
      letter-spacing: .08em;
      text-decoration: none;
      text-transform: uppercase;
    }

    .wk-project__cta-icon {
      width: 2.2rem;
      height: 2.2rem;
      display: grid;
      place-items: center;
      border-radius: 50%;
      color: var(--wk-paper);
      background: var(--wk-ink);
      transition:
        color 500ms cubic-bezier(.16, 1, .3, 1),
        background-color 500ms cubic-bezier(.16, 1, .3, 1),
        transform 500ms cubic-bezier(.16, 1, .3, 1);
    }

    .wk-project__cta:hover .wk-project__cta-icon,
    .wk-project__cta:focus-visible .wk-project__cta-icon {
      color: var(--wk-paper);
      background: var(--wk-wine);
      transform: translate(.15rem, -.15rem);
    }

    .wk-project__cta:focus-visible {
      outline: 2px dotted var(--wk-wine);
      outline-offset: 5px;
    }

    @media (hover: hover) and (pointer: fine) {
      .wk-project:hover .wk-project__visual,
      .wk-project:focus-within .wk-project__visual {
        transform: translateY(-7px);
      }

      .wk-project:hover .wk-project__visual::after,
      .wk-project:focus-within .wk-project__visual::after {
        opacity: 1;
      }

      .wk-project:hover .wk-project__visual::before,
      .wk-project:focus-within .wk-project__visual::before {
        opacity: 1;
        transform: scale(1);
      }

      .wk-project:hover .wk-project__image,
      .wk-project:focus-within .wk-project__image {
        filter: saturate(.88) contrast(1.04);
        transform: scale(1.025);
      }

      .wk-project:hover .wk-ascii-divider span,
      .wk-project:focus-within .wk-ascii-divider span {
        animation: wk-ascii-wave 2600ms cubic-bezier(.16, 1, .3, 1)
          var(--ascii-delay) infinite;
      }

      .wk-project:hover .wk-project__title,
      .wk-project:focus-within .wk-project__title {
        color: var(--wk-wine);
        transform: translateX(.3rem);
      }
    }

    @keyframes wk-ascii-wave {
      0% {
        opacity: .38;
        transform:
          translate(var(--ascii-rest-x), var(--ascii-rest-y))
          scale(.68);
      }
      24%,
      56% {
        opacity: 1;
        transform: translate(0, 0) scale(1);
      }
      100% {
        opacity: .46;
        transform:
          translate(var(--ascii-rest-x), var(--ascii-rest-y))
          scale(.76);
      }
    }

    @media (max-width: 1050px) {
      .wk-main {
        width: min(100% - 2.5rem, 1320px);
      }

      .wk-intro {
        min-height: 28rem;
      }

      .wk-heading {
        font-size: clamp(5rem, 15vw, 8rem);
      }

      .wk-project,
      .wk-project[data-reverse="true"] {
        grid-template-columns: minmax(0, 1fr);
        gap: 2rem;
      }

      .wk-project[data-reverse="true"] .wk-project__visual,
      .wk-project[data-reverse="true"] .wk-project__copy {
        grid-column: 1;
      }

      .wk-project[data-reverse="true"] .wk-project__visual {
        grid-row: 1;
      }

      .wk-project[data-reverse="true"] .wk-project__copy {
        grid-row: 2;
      }

      .wk-project__copy {
        max-width: 42rem;
        padding-left: 1.65rem;
      }

      .wk-ascii-divider--vertical {
        left: 0;
      }
    }

    @media (max-width: 560px) {
      .wk-main {
        width: calc(100% - 2.25rem);
        padding-top: 6.8rem;
      }

      .wk-intro {
        min-height: 21rem;
        padding-bottom: 2.5rem;
      }

      .wk-heading {
        max-width: none;
        font-size: clamp(4rem, 16vw, 5.6rem);
        line-height: .8;
      }

      .wk-filters {
        margin-right: -1.125rem;
        padding-bottom: 3.8rem;
      }

      .wk-project {
        margin-bottom: 7.5rem;
      }

      .wk-project__title {
        font-size: clamp(3.2rem, 14vw, 4.35rem);
      }

    }

    @media (prefers-reduced-motion: reduce) {
      .wk-tab,
      .wk-tab::after,
      .wk-project__visual,
      .wk-project__visual::before,
      .wk-project__visual::after,
      .wk-project__image,
      .wk-ascii-divider span,
      .wk-project__title,
      .wk-project__cta-icon {
        transition: none;
      }

      .wk-tab--priority:active {
        transform: none;
      }

      .wk-project:hover .wk-project__visual,
      .wk-project:focus-within .wk-project__visual,
      .wk-project:hover .wk-project__visual::before,
      .wk-project:focus-within .wk-project__visual::before,
      .wk-project:hover .wk-project__image,
      .wk-project:focus-within .wk-project__image,
      .wk-project:hover .wk-project__title,
      .wk-project:focus-within .wk-project__title,
      .wk-project__cta:hover .wk-project__cta-icon,
      .wk-project__cta:focus-visible .wk-project__cta-icon {
        transform: none;
      }

      .wk-project:hover .wk-ascii-divider span,
      .wk-project:focus-within .wk-ascii-divider span {
        animation: none;
        opacity: 1;
        transform: none;
      }
    }
  `;

  return (
    <div className="wk-page">
      <style>{localStyles}</style>
      <SiteHeader />

      <main className="wk-main">
        <header className="wk-intro">
          <p className="wk-intro__eyebrow">
            {pt ? "portfólio" : "portfolio"} · 2026
          </p>
          <h1 className="wk-heading">
            <span>{pt ? "trabalhos" : "selected"}</span>
            <em>{pt ? "selecionados" : "work"}</em>
          </h1>
        </header>

        <nav className="wk-filters" aria-label={t("wk_tabs_label")}>
          {TABS.map((tab, index) => (
            <Fragment key={tab.id}>
              {index > 0 ? (
                <span className="wk-filter-dot" aria-hidden="true" />
              ) : null}
              <button
                type="button"
                className={`wk-tab hover-trigger${
                  "priority" in tab && tab.priority ? " wk-tab--priority" : ""
                }`}
                aria-pressed={area === tab.id}
                data-active={area === tab.id ? "true" : undefined}
                onClick={() => setArea(tab.id)}
              >
                <span>{t(tab.key)}</span>
                <span className="wk-tab__count">
                  {countFor(tab.id).toString().padStart(2, "0")}
                </span>
              </button>
            </Fragment>
          ))}
        </nav>

        <section aria-label={t("work_page_title")}>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.href}
              num={String(index + 1).padStart(2, "0")}
              title={project.title}
              tags={project.tags}
              href={project.href}
              img={project.img}
              desc={getDesc(project.href)}
              ratio={project.ratio}
              index={index}
              total={String(projects.length).padStart(2, "0")}
            />
          ))}
        </section>
      </main>

      <div id="contact">
        <EditorialFooter />
      </div>
    </div>
  );
}
