"use client";
import Link from "next/link";
import PixelScrollImage from "@/components/PixelScrollImage";
import AsciiDivider from "@/components/AsciiDivider";
import BrailleDeco from "@/components/BrailleDeco";
import { EDGE_RIGHT, EDGE_TOP, FILLER_COLUMN } from "@/components/foundBrailleArt";
import { useT } from "@/i18n/LanguageContext";
import { useProjects } from "@/components/useProjects";
import EditorialFooter from "@/components/EditorialFooter";
import LangToggle from "@/components/LangToggle";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

interface ProjectCardProps {
  num: string;
  title: string;
  tags: string;
  href: string;
  img: string;
  desc: string;
  ratio: number;
}

function ProjectCard({ num, title, tags, href, img, desc, ratio }: ProjectCardProps) {
  const { t } = useT();

  return (
    <div
      id={`project-${num}`}
      className="wk-card"
      data-wk-num={num}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        width: "100%",
        marginBottom: "6rem",
      } as CSSProperties}
    >
      {/* Card Header (horizontal info line) */}
      <div
        className="wk-card__head"
        style={{
          display: "grid",
          gridTemplateColumns: "3rem 1fr auto",
          alignItems: "baseline",
          gap: "1rem",
          paddingBottom: "0.2rem",
        }}
      >
        <span
          className="wk-card__num"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "var(--type-micro)",
            color: "var(--acid)",
            fontWeight: 700,
          }}
        >
          {num}
        </span>
        <h2
          className="wk-card__title"
          style={{
            fontFamily: "var(--font-subtitle), monospace",
            fontSize: "clamp(1.4rem, 4vw, 2.5rem)",
            fontWeight: 400,
            textTransform: "lowercase",
            letterSpacing: "var(--offbit-letter-spacing)",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {title}
        </h2>
        <span
          className="wk-card__tags"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "var(--type-micro)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            textAlign: "right",
          }}
        >
          {tags}
        </span>
        <AsciiDivider opacity={0.5} style={{ gridColumn: "1 / -1", marginTop: ".25rem" }} />
      </div>

      {/* Project Description */}
      <p
        style={{
          fontFamily: "var(--font-body), sans-serif",
          fontSize: "var(--type-body)",
          lineHeight: "1.7",
          opacity: 0.8,
          maxWidth: "var(--measure-project-copy)",
          margin: 0,
          textWrap: "pretty",
        }}
      >
        {desc}
      </p>

      {/* capa: mesma revelação em pixels da landing, sem borda */}
      <Link
        href={href}
        className="wk-cover hover-trigger"
        aria-label={`${t("view_project")}: ${title}`}
        style={{ width: "100%", overflow: "hidden", backgroundColor: "var(--site-tint-b)", display: "block" }}
      >
        <PixelScrollImage src={img} alt={title} ratio={ratio} style={{ width: "100%" }} />
      </Link>

      {/* Brutalist Button link to project */}
      <div>
        <Link
          href={href}
          className="hover-trigger"
          style={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: "var(--tap-min)",
            fontFamily: "var(--font-subtitle), monospace",
            fontSize: "var(--type-label)",
            fontWeight: "var(--offbit-weight-active)",
            letterSpacing: "var(--offbit-letter-spacing)",
            background: "var(--ink)",
            color: "var(--paper)",
            padding: "0.5rem 1rem",
            textDecoration: "none",
            cursor: "pointer",
            transition: "background var(--duration-fast) var(--ease-default), color var(--duration-fast) var(--ease-default), border-color var(--duration-fast) var(--ease-default)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--acid)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--ink)";
          }}
        >
          [ {t("view_project").toLowerCase()} ↗ ]
        </Link>
      </div>
    </div>
  );
}

export default function Work() {
  const { t, lang } = useT();
  const projects = useProjects();
  const [activeProject, setActiveProject] = useState(projects[0]?.num ?? "01");

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".wk-card"));
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const num = (visible[0]?.target as HTMLElement | undefined)?.dataset.wkNum;
        if (num) setActiveProject(num);
      },
      { rootMargin: "-24% 0px -56% 0px", threshold: [0, 0.05, 0.15, 0.3] },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [projects.length]);

  const getDesc = (href: string) => {
    if (href.endsWith("isadora")) return t("work_isadora_desc");
    if (href.endsWith("magazine")) return t("work_helvetica_desc");
    if (href.endsWith("genlab")) return t("work_genlab_desc");
    if (href.endsWith("ebat")) return t("work_ebat_desc");
    if (href.endsWith("graduation")) return t("grad_desc_2");
    if (href.endsWith("pilotis")) return t("pilotis_desc_2");
    if (href.endsWith("chinario")) return t("chinario_desc_1");
    // hologlam e vegcoz entraram depois e ficavam sem texto nenhum no card
    if (href.endsWith("hologlam")) return t("holo_question");
    if (href.endsWith("vegcoz")) return t("vegcoz_desc_1");
    if (href.endsWith("ondularis")) {
      return lang === "pt"
        ? "Exposição imersiva do coletivo Endosymbiosis na intersecção entre arte, ciência e tecnologia."
        : "An immersive exhibition by the Endosymbiosis collective at the intersection of art, science and technology.";
    }
    return "";
  };

  const localStyles = `
    .wk-page {
      --ink: var(--site-ink);
      --paper: var(--site-paper);
      --acid: var(--site-accent);
      --font-grotesk: Arial, "Helvetica Neue", Helvetica, sans-serif;
      background:
        radial-gradient(1100px 700px at 18% -5%, var(--site-tint-a) 0%, transparent 60%),
      radial-gradient(900px 600px at 100% 30%, var(--site-tint-b) 0%, transparent 55%),
      radial-gradient(1000px 800px at 50% 105%, var(--site-tint-c) 0%, transparent 55%),
        var(--paper);
      color: var(--ink);
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
    }
    .wk-page::after {
      content: "";
      position: fixed;
      inset: 0;
      z-index: 5;
      pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      opacity: .07;
      mix-blend-mode: multiply;
    }
    .wk-corner {
      position: fixed; top: clamp(1.4rem, 3.2vh, 2.4rem); z-index: 1000;
      font-family: var(--font-body);
      font-size: var(--type-micro); text-transform: lowercase; letter-spacing: .1em;
      color: var(--ink);
    }
    .wk-corner--l { left: clamp(1.5rem, 5vw, 5.5rem); display: flex; flex-direction: column; gap: .12rem; line-height: 1.1; }
    .wk-mark { font-family: var(--font-pixelscript); font-weight: 400; font-size: 2.3rem; letter-spacing: .02em; line-height: 1; text-transform: none; color: inherit; text-decoration: none; }
    .wk-mark__sub { font-size: var(--type-micro); letter-spacing: .08em; opacity: .62; }
    .wk-corner--r { right: clamp(1.5rem, 5vw, 5.5rem); display: flex; align-items: center; gap: 1rem; }
    .wk-status { display: inline-flex; align-items: center; gap: .42rem; font-size: var(--type-micro); letter-spacing: .06em; opacity: .82; white-space: nowrap; }
    .wk-status__dot { width: 7px; height: 7px; border-radius: 50%; background: var(--ink); animation: wk-pulse 2.4s ease-out infinite; }
    @keyframes wk-pulse {
      0% { box-shadow: 0 0 0 0 rgba(28,27,24,.35); }
      70% { box-shadow: 0 0 0 6px rgba(28,27,24,0); }
      100% { box-shadow: 0 0 0 0 rgba(28,27,24,0); }
    }
    .wk-nav { display: inline-flex; align-items: center; gap: .7rem; }
    .wk-nav a { color: var(--ink); text-decoration: none; opacity: .7; font-size: var(--type-micro); letter-spacing: .04em; transition: opacity .2s ease; }
    .wk-nav a:hover, .wk-nav a:focus-visible { opacity: 1; text-decoration: underline; text-underline-offset: 3px; }
    @media (prefers-reduced-motion: reduce) { .wk-status__dot { animation: none; } }
    @media (max-width: 860px) { .wk-status, .wk-nav, .wk-mark__sub { display: none; } }
    .wk-ornament {
      position: absolute; z-index: 1; pointer-events: none;
      mix-blend-mode: multiply;
    }
    .wk-ornament--corner {
      position: fixed;
      top: 4.5rem;
      left: 1.4rem;
      z-index: 6;
      animation: none;
    }
    .wk-ornament--edge { top: 88rem; right: -13rem; }
    .wk-ornament--left { top: 232rem; left: -3.5rem; }
    @supports (animation-timeline: view()) {
      .wk-ornament:not(.wk-ornament--corner) {
        animation: wk-ornament-drift linear both;
        animation-timeline: view();
        animation-range: entry 0% exit 100%;
      }
      @keyframes wk-ornament-drift {
        from { translate: 0 -10px; }
        to { translate: 0 10px; }
      }
    }
    .wk-back-btn {
      font-family: var(--font-mono);
      font-size: var(--type-label);
      text-transform: lowercase;
      letter-spacing: .08em;
      background: var(--ink);
      color: var(--paper);
      padding: 0.35rem 0.7rem;
      text-decoration: none;
      transition: background var(--duration-fast) var(--ease-default), color var(--duration-fast) var(--ease-default);
    }
    .wk-back-btn:hover {
      background: var(--acid);
      color: var(--paper);
    }
    .wk-toc {
      position: sticky; top: 3.5rem; z-index: 30;
      display: grid; grid-template-columns: repeat(5, minmax(0, 1fr));
      margin: -2rem 0 5rem;
      border: 1px solid var(--paper-edge);
      background-color: var(--paper-sheet);
      background-image:
        repeating-linear-gradient(0deg, transparent 0 3px, rgba(28,27,24,.025) 3px 4px),
        url("/img/paper-noise.png");
      background-size: 100% 100%, 140px 140px;
      box-shadow: 4px 5px 0 var(--paper-shadow);
      rotate: -.08deg;
    }
    .wk-toc__link {
      display: grid; grid-template-columns: auto 1fr; align-items: baseline; gap: .55rem;
      min-width: 0; min-height: 3.5rem; padding: .72rem .8rem;
      border-right: 1px solid rgba(28,27,24,.24);
      border-bottom: 1px solid rgba(28,27,24,.18);
      color: var(--ink); text-decoration: none;
      transition: background-color var(--duration-fast) var(--ease-default), color var(--duration-fast) var(--ease-default);
    }
    .wk-toc__link:hover, .wk-toc__link:focus-visible { background: var(--ink); color: var(--paper); }
    .wk-toc__link[data-active="true"] {
      background: var(--ink);
      color: var(--paper);
      box-shadow: inset 0 -3px 0 var(--acid);
    }
    .wk-toc__link:focus-visible { outline: 2px solid var(--ink); outline-offset: -3px; }
    .wk-toc__num {
      font-family: var(--font-subtitle), monospace;
      font-weight: var(--offbit-weight);
      font-size: var(--type-micro); letter-spacing: var(--offbit-letter-spacing);
      scale: var(--offbit-condense) 1; transform-origin: left center;
    }
    .wk-card__title,
    .wk-toc__num {
      transition: font-weight var(--duration-normal) var(--ease-out);
    }
    .wk-card:hover .wk-card__title,
    .wk-card:focus-within .wk-card__title,
    .wk-toc__link:hover .wk-toc__num,
    .wk-toc__link:focus-visible .wk-toc__num {
      font-weight: var(--offbit-weight-active) !important;
    }
    .wk-toc__title {
      font-family: var(--font-head); font-size: var(--type-body);
      line-height: .9; text-transform: lowercase;
    }
    .wk-cover {
      position: relative;
      padding: clamp(.35rem, .8vw, .55rem);
      border: 1px solid var(--paper-edge);
      background-color: var(--paper-sheet) !important;
      background-image:
        repeating-linear-gradient(0deg, transparent 0 3px, rgba(28,27,24,.025) 3px 4px),
        url("/img/paper-noise.png");
      background-size: 100% 100%, 150px 150px;
      box-shadow: 8px 9px 0 var(--paper-shadow);
      rotate: -.12deg;
      transition: translate var(--duration-normal) var(--ease-out), rotate var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-default);
    }
    .wk-cover::before {
      content: "";
      position: absolute;
      z-index: 4;
      top: .2rem;
      left: 50%;
      width: clamp(3.5rem, 9vw, 6rem);
      height: .72rem;
      translate: -50% 0;
      rotate: -1.5deg;
      border: 1px solid rgba(28,27,24,.1);
      background: var(--paper-tape);
      pointer-events: none;
    }
    .wk-cover::after {
      content: "";
      position: absolute;
      z-index: 4;
      right: .4rem;
      bottom: .4rem;
      width: 1rem;
      height: 1rem;
      border-top: 1px solid var(--paper-edge);
      border-left: 1px solid var(--paper-edge);
      background: color-mix(in srgb, var(--paper-sheet) 82%, var(--site-tint-b));
      clip-path: polygon(100% 0, 0 100%, 100% 100%);
      pointer-events: none;
    }
    .wk-cover:hover,
    .wk-cover:focus-visible {
      z-index: 2;
      outline: none;
      translate: 0 -4px;
      rotate: 0deg;
      box-shadow: 12px 13px 0 var(--paper-shadow);
    }
    .wk-toc__link[data-active="true"] .wk-toc__num { color: var(--acid); }
    .wk-card { position: relative; isolation: isolate; scroll-margin-top: 8rem; }
    .wk-card::after {
      content: attr(data-wk-num);
      position: absolute;
      z-index: -1;
      right: -.02em;
      top: .04em;
      pointer-events: none;
      user-select: none;
      color: var(--ink);
      opacity: .025;
      font-family: var(--font-subtitle), monospace;
      font-weight: var(--offbit-weight-active);
      font-size: clamp(10rem, 30vw, 27rem);
      line-height: .7;
      letter-spacing: var(--offbit-letter-spacing);
      scale: var(--offbit-condense) 1;
      transform-origin: right top;
      transition: opacity var(--duration-normal) var(--ease-default), translate var(--duration-slow) var(--ease-out);
    }
    .wk-card:hover::after,
    .wk-card:focus-within::after { opacity: .075; translate: -1.5vw 1rem; }
    .wk-cover {
      overflow: hidden;
      color: inherit;
      text-decoration: none;
    }
    .wk-cover:focus-visible { outline: 3px solid var(--ink); outline-offset: 7px; }
    .wk-cover > * { overflow: hidden; }
    .wk-card:hover .wk-cover,
    .wk-card:focus-within .wk-cover {
      translate: 0 -4px;
      rotate: 0deg;
      box-shadow: 12px 13px 0 var(--paper-shadow);
    }
    @media (max-width: 1000px) {
      .wk-toc { position: relative; top: auto; grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }
    @media (max-width: 720px) {
      .wk-toc { grid-template-columns: repeat(2, minmax(0, 1fr)); margin-bottom: 4rem; }
      .wk-toc__link { min-height: 44px; }
      .wk-card { transform: rotate(-.7deg); }
      .wk-card:nth-child(even) { transform: rotate(.7deg); }
      .wk-card__head { grid-template-columns: 2.5rem minmax(0, 1fr) !important; gap: .75rem !important; }
      .wk-card__title { min-width: 0; overflow-wrap: anywhere; }
      .wk-card__tags { grid-column: 1 / -1; text-align: left !important; line-height: 1.45; }
      .wk-card::after { opacity: .045; font-size: clamp(9rem, 55vw, 17rem); top: 1.1rem; }
      .wk-back-btn { min-height: 44px; display: inline-flex; align-items: center; }
      .wk-ornament--corner { top: 5rem; left: 1.4rem; }
      .wk-ornament--edge { right: -7rem; }
      .wk-ornament--left { left: -4rem; }
    }
    @supports (animation-timeline: view()) {
      @media (max-width: 720px) {
        .wk-card {
          animation: wk-mobile-focus linear both;
          animation-timeline: view();
          animation-range: entry 0% exit 100%;
        }
        @keyframes wk-mobile-focus {
          0%, 100% { opacity: .62; filter: saturate(.72); }
          35%, 65% { opacity: 1; filter: none; }
        }
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .wk-cover, .wk-card::after { transition: none; }
      .wk-card__title, .wk-toc__num { transition: none; }
      .wk-card { animation: none; opacity: 1; filter: none; }
      .wk-ornament { animation: none; translate: none; }
      .wk-card:hover .wk-cover,
      .wk-card:focus-within .wk-cover {
        translate: 0;
        rotate: -.12deg;
        box-shadow: 8px 9px 0 var(--paper-shadow);
        animation: none;
      }
    }
  `;

  return (
    <div className="wk-page">
      <style>{localStyles}</style>

      <BrailleDeco
        art={EDGE_TOP}
        fontSize="clamp(2.8px, .4vw, 5.8px)"
        opacity={0.54}
        className="wk-ornament wk-ornament--corner"
      />
      <BrailleDeco
        art={EDGE_RIGHT}
        fontSize="clamp(2.6px, .38vw, 5.5px)"
        opacity={0.2}
        className="wk-ornament wk-ornament--edge"
      />
      <BrailleDeco
        art={FILLER_COLUMN}
        fontSize="clamp(2.8px, .4vw, 5.8px)"
        opacity={0.19}
        className="wk-ornament wk-ornament--left"
      />

      {/* Header — mesmo do landing (marca + status + nav + idioma) */}
      <span className="wk-corner wk-corner--l">
        <Link href="/" className="wk-mark hover-trigger">
          <span className="text-star" aria-hidden="true">✳︎</span> Maria Isabel Lisita
        </Link>
        <span className="wk-mark__sub">
          {lang === "pt" ? "designer & tecnóloga criativa" : "designer & creative technologist"}
        </span>
      </span>
      <span className="wk-corner wk-corner--r">
        <span className="wk-status">
          <span className="wk-status__dot" aria-hidden="true" />
          {lang === "pt" ? "disponível p/ projetos" : "available for work"}
        </span>
        <nav className="wk-nav" aria-label={lang === "pt" ? "navegação" : "navigation"}>
          <Link href="/">{t("pj_home").toLowerCase()}</Link>
          <Link href="/#about">{t("rm_menu_about")}</Link>
          <Link href="/#contact">{t("rm_menu_contact")}</Link>
        </nav>
        <LangToggle />
      </span>

      <main style={{ padding: "clamp(7.5rem, 11vh, 9.5rem) var(--project-gutter) 4rem", maxWidth: "var(--project-shell-max)", margin: "0 auto", position: "relative", zIndex: 10 }}>
        {/* Title row */}
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "var(--type-micro)",
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: "0.55rem",
          }}
        >
          <span>{t("work_page_title")}</span>
          <span>{projects.length.toString().padStart(2, "0")} —</span>
        </div>
        <AsciiDivider opacity={0.55} style={{ marginBottom: "4rem" }} />

        <nav className="wk-toc" aria-label={t("work_page_title")}>
          {projects.map((project) => (
            <a
              className="wk-toc__link hover-trigger"
              href={`#project-${project.num}`}
              key={project.href}
              data-active={activeProject === project.num ? "true" : undefined}
              aria-current={activeProject === project.num ? "location" : undefined}
            >
              <span className="wk-toc__num">{project.num}</span>
              <span className="wk-toc__title">{project.title}</span>
            </a>
          ))}
        </nav>

        {/* Vertical list of projects with full image pixel disintegration */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {projects.map((proj) => (
            <ProjectCard
              key={proj.href}
              num={proj.num}
              title={proj.title}
              tags={proj.tags}
              href={proj.href}
              img={proj.img}
              desc={getDesc(proj.href)}
              ratio={proj.ratio}
            />
          ))}
        </div>
      </main>

      <div id="contact">
        <EditorialFooter />
      </div>
    </div>
  );
}
