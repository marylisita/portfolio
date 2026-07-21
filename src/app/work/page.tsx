"use client";
import Link from "next/link";
import PixelScrollImage from "@/components/PixelScrollImage";
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

const WORK_GLOWS = [
  "rgba(232, 175, 56, .34)",
  "rgba(83, 128, 199, .31)",
  "rgba(217, 70, 69, .31)",
  "rgba(175, 48, 228, .3)",
  "rgba(111, 170, 103, .3)",
  "rgba(222, 114, 65, .28)",
  "rgba(202, 28, 58, .3)",
  "rgba(38, 157, 141, .28)",
  "rgba(76, 105, 186, .28)",
];

function ProjectCard({ num, title, tags, href, img, desc, ratio }: ProjectCardProps) {
  const { t } = useT();

  return (
    <div
      id={`project-${num}`}
      className="wk-card"
      data-wk-num={num}
      style={{
        "--wk-glow": WORK_GLOWS[(Number(num) - 1 + WORK_GLOWS.length) % WORK_GLOWS.length],
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
          paddingBottom: "0.8rem",
          backgroundImage: "repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px)",
          backgroundSize: "100% 2px",
          backgroundPosition: "bottom left",
          backgroundRepeat: "no-repeat",
        }}
      >
        <span
          className="wk-card__num"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.8rem",
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
            fontSize: "0.68rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            textAlign: "right",
          }}
        >
          {tags}
        </span>
      </div>

      {/* Project Description */}
      <p
        style={{
          fontFamily: "var(--font-body), sans-serif",
          fontSize: "0.92rem",
          lineHeight: "1.7",
          opacity: 0.8,
          maxWidth: "750px",
          margin: 0,
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
            display: "inline-block",
            fontFamily: "var(--font-subtitle), monospace",
            fontSize: "0.78rem",
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
  const { t } = useT();
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
      position: fixed; top: 1rem; z-index: 1000;
      font-family: var(--font-mono);
      font-size: .7rem; text-transform: lowercase; letter-spacing: .14em;
      color: var(--ink);
    }
    .wk-corner--l { left: 1.4rem; }
    .wk-corner--r { right: 1.4rem; display: flex; align-items: center; gap: .8rem; }
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
      font-size: .68rem;
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
      border-top: 1px solid rgba(28,27,24,.3);
      border-bottom: 1px solid rgba(28,27,24,.3);
      background: rgba(237,231,218,.88);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
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
      font-size: .56rem; letter-spacing: var(--offbit-letter-spacing);
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
      font-family: var(--font-head); font-size: .92rem;
      line-height: .9; text-transform: lowercase;
    }
    .wk-toc__link[data-active="true"] .wk-toc__num { color: var(--acid); }
    .wk-card { position: relative; isolation: isolate; scroll-margin-top: 8rem; }
    .wk-card::before {
      content: "";
      position: absolute;
      z-index: -2;
      inset: -8rem -10vw;
      pointer-events: none;
      background: radial-gradient(closest-side, var(--wk-glow) 0%, transparent 72%);
      opacity: .12;
      transform: scale(.78);
      transition: opacity var(--duration-slow) var(--ease-default), transform var(--duration-slow) var(--ease-out);
    }
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
    .wk-card:hover::before,
    .wk-card:focus-within::before { opacity: .82; transform: scale(1); }
    .wk-card:hover::after,
    .wk-card:focus-within::after { opacity: .075; translate: -1.5vw 1rem; }
    .wk-cover {
      position: relative;
      overflow: visible !important;
      color: inherit;
      text-decoration: none;
      transition: transform var(--duration-slow) var(--ease-out), box-shadow var(--duration-slow) var(--ease-out);
    }
    .wk-cover:focus-visible { outline: 3px solid var(--acid); outline-offset: 7px; }
    .wk-cover::before {
      content: "";
      position: absolute; inset: 0; z-index: -1;
      transform: translate(12px, 12px);
      background: var(--site-tint-b);
      border: 1px solid rgba(28,27,24,.18);
      transition: transform var(--duration-slow) var(--ease-out);
    }
    .wk-cover > * { overflow: hidden; }
    .wk-card:hover .wk-cover,
    .wk-card:focus-within .wk-cover {
      transform: translate(-3px, -3px) rotate(-.15deg);
      box-shadow: -5px 0 0 rgba(229,70,42,.54), 5px 0 0 rgba(81,92,196,.38);
      animation: wk-print-register var(--duration-fast) steps(3, end) 1;
    }
    @keyframes wk-print-register {
      0% { box-shadow: -11px 0 0 rgba(229,70,42,.7), 11px 0 0 rgba(81,92,196,.55); }
      55% { box-shadow: 4px 0 0 rgba(229,70,42,.58), -4px 0 0 rgba(81,92,196,.48); }
      100% { box-shadow: -5px 0 0 rgba(229,70,42,.54), 5px 0 0 rgba(81,92,196,.38); }
    }
    .wk-card:hover .wk-cover::before,
    .wk-card:focus-within .wk-cover::before { transform: translate(5px, 5px); }
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
      .wk-cover::before { transform: translate(7px, 8px); }
      .wk-card::before { inset: -5rem -18vw; opacity: .38; transform: scale(.92); }
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
      .wk-cover, .wk-cover::before, .wk-card::before, .wk-card::after { transition: none; }
      .wk-card__title, .wk-toc__num { transition: none; }
      .wk-card { animation: none; opacity: 1; filter: none; }
      .wk-ornament { animation: none; translate: none; }
      .wk-card:hover .wk-cover, .wk-card:focus-within .wk-cover { transform: none; box-shadow: none; animation: none; }
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

      {/* Navigation corners */}
      <span className="wk-corner wk-corner--l">
        mary l. <span className="text-star" aria-hidden="true">✳︎</span>
      </span>
      <span className="wk-corner wk-corner--r">
        <Link href="/" className="wk-back-btn hover-trigger">
          [ {t("pj_home").toLowerCase()} ]
        </Link>
        <LangToggle />
      </span>

      <main style={{ padding: "8rem 2rem 4rem", maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 10 }}>
        {/* Title row */}
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: "0.9rem",
            marginBottom: "4rem",
            backgroundImage: "repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px)",
            backgroundSize: "100% 2px",
            backgroundPosition: "bottom left",
            backgroundRepeat: "no-repeat",
          }}
        >
          <span>{t("work_page_title")}</span>
          <span>{projects.length.toString().padStart(2, "0")} —</span>
        </div>

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
