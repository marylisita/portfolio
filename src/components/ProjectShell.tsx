"use client";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import EditorialFooter from "./EditorialFooter";
import LangToggle from "./LangToggle";
import BrailleDeco from "./BrailleDeco";
import { COELHOS, ESTRELA, QUIMERA } from "./brailleArt";
import { ANJOS, ESFERA, ORNAMENTAL } from "./brailleEditorial";
import { EDGE_RIGHT, FILLER_COLUMN, FILLER_GROUP } from "./foundBrailleArt";
import { useProjects } from "./useProjects";
import { useT } from "@/i18n/LanguageContext";
import type { CSSProperties } from "react";

const PROJECT_GLOWS = [
  "rgba(232, 175, 56, .3)",
  "rgba(83, 128, 199, .28)",
  "rgba(217, 70, 69, .28)",
  "rgba(175, 48, 228, .27)",
  "rgba(111, 170, 103, .27)",
  "rgba(222, 114, 65, .26)",
  "rgba(202, 28, 58, .28)",
  "rgba(38, 157, 141, .26)",
  "rgba(76, 105, 186, .26)",
];
const MOTION_SLOW = 0.5;
const MOTION_EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Casca das páginas de projeto na identidade nova (mesma linguagem da landing):
 * degradê roxo/azul sob preto + grão, marcas mínimas nos cantos (sem navbar),
 * molhinho de etiquetas fixo no canto, linhas pixeladas e EditorialFooter.
 *
 * IMPORTANTE: redefine os tokens globais (--fg, --gray-400/600, --border)
 * dentro do escopo .pj para componentes antigos aninhados (FlipBook etc.)
 * se adaptarem ao fundo escuro sem precisar de fork.
 */
const styles = `
  .pj {
    --ink: var(--site-ink);
    --paper: var(--site-paper);
    --acid: var(--site-accent);
    --font-grotesk: Arial, "Helvetica Neue", Helvetica, sans-serif;
    /* tokens globais re-mapeados p/ dark (FlipBook, textos antigos) */
    --fg: var(--site-ink);
    --gray-400: #8b8578;
    --gray-600: #55524a;
    --surface: transparent;
    --border: 1px solid rgba(28,27,24,.35);
    background:
      radial-gradient(900px 680px at 86% 5%, var(--pj-glow) 0%, transparent 68%),
      radial-gradient(1100px 700px at 18% -5%, var(--site-tint-a) 0%, transparent 60%),
      radial-gradient(900px 600px at 100% 30%, var(--site-tint-b) 0%, transparent 55%),
      radial-gradient(1000px 800px at 50% 105%, var(--site-tint-c) 0%, transparent 55%),
      var(--paper);
    color: var(--ink);
    overflow-x: hidden;
    position: relative;
    min-height: 100vh;
  }
  .pj::after {
    content: "";
    position: fixed; inset: 0; z-index: 5; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: .07;
    mix-blend-mode: multiply;
  }
  .pj ::selection { background: var(--acid); color: #111; }
  .pj-progress {
    position: fixed; top: 0; left: 0; z-index: 1200;
    width: 100%; height: 3px;
    background: var(--ink);
    transform: scaleX(0); transform-origin: left center;
    pointer-events: none;
  }
  .pj-ornament {
    position: absolute; z-index: 1; top: clamp(30rem, 56vw, 43rem);
    pointer-events: none; mix-blend-mode: multiply;
  }
  .pj-ornament--right { right: -3rem; }
  .pj-ornament--left { left: -3rem; }
  @supports (animation-timeline: view()) {
    .pj-ornament {
      animation: pj-ornament-drift linear both;
      animation-timeline: view();
      animation-range: entry 0% exit 100%;
    }
    @keyframes pj-ornament-drift {
      from { translate: 0 -12px; }
      to { translate: 0 12px; }
    }
  }
  @supports (animation-timeline: scroll()) {
    .pj-progress {
      animation: pj-reading-progress linear both;
      animation-timeline: scroll(root);
    }
    @keyframes pj-reading-progress { to { transform: scaleX(1); } }
  }

  .pj-corner {
    position: fixed; top: 1rem; z-index: 1000;
    font-family: var(--font-body);
    font-size: .78rem; text-transform: lowercase; letter-spacing: .1em;
    color: var(--ink); text-decoration: none;
  }
  .pj-corner--l { left: 1.4rem; }
  .pj-corner--r { right: 1.4rem; display: flex; align-items: center; gap: .8rem; }

  .pj-cluster {
    /* acima do botão flutuante de voltar ao topo, que cobria a etiqueta do meio */
    position: fixed; right: 1.2rem; bottom: 5.5rem; z-index: 900;
    display: flex; flex-direction: column; align-items: flex-end; gap: .45rem;
  }
  @media (max-width: 720px) {
    /* em tela estreita vira fita horizontal, como na landing */
    .pj-cluster {
      flex-direction: row; align-items: center; flex-wrap: nowrap;
      left: 4.5rem; right: .6rem; bottom: 1rem; gap: .28rem;
      justify-content: flex-start;
      overflow-x: auto; scrollbar-width: none;
    }
    .pj-cluster::-webkit-scrollbar { display: none; }
    .pj-tag { font-size: .58rem; padding: .3rem .45rem; }
  }
  .pj-tag {
    font-family: var(--font-body); font-size: .76rem;
    text-transform: lowercase; letter-spacing: .08em;
    background: var(--ink); color: var(--paper);
    padding: .38rem .72rem; text-decoration: none;
    transition: background var(--duration-fast) var(--ease-default);
  }
  .pj-tag:hover { background: var(--acid); }

  .pj-head {
    max-width: 1100px; margin: 0 auto;
    padding: 7.5rem 2rem 4.5rem;
    position: relative; z-index: 10;
  }
  .pj-kicker {
    display: flex; justify-content: space-between; gap: 1rem;
    padding-bottom: .75rem; margin-bottom: 2.4rem;
    border-bottom: 1px solid rgba(28,27,24,.45);
    font-family: var(--font-subtitle), monospace;
    font-weight: var(--offbit-weight);
    font-size: clamp(.52rem, .8vw, .68rem);
    line-height: 1.35; letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
  }
  .pj-folio {
    position: absolute; z-index: -1;
    right: 1.2rem; top: 3.6rem;
    font-family: var(--font-subtitle), monospace;
    font-weight: var(--offbit-weight-active);
    font-size: clamp(7rem, 22vw, 18rem);
    line-height: .75; letter-spacing: var(--offbit-letter-spacing);
    color: var(--ink); opacity: .055;
    user-select: none; pointer-events: none;
  }
  .pj-back {
    display: inline-block;
    font-family: var(--font-hand); font-size: 1.25rem;
    text-transform: lowercase; letter-spacing: .01em;
    color: var(--acid); text-decoration: none;
    margin-bottom: 2.2rem;
  }
  .pj-back:hover { text-decoration: underline; }
  .pj-title {
    font-family: var(--font-head); font-weight: 400;
    font-size: clamp(3.2rem, 9vw, 8.5rem);
    line-height: .82; letter-spacing: -0.045em;
    text-transform: lowercase;
    max-width: 11ch; margin: 0 0 1.8rem;
  }
  .pj-desc {
    font-family: var(--font-body);
    font-size: clamp(1rem, 1.6vw, 1.25rem);
    color: var(--gray-600);
    max-width: 800px; line-height: 1.6;
  }
  .pj-desc .pj-em { font-family: var(--font-head); font-style: italic; color: var(--acid); }
  .pj-meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
    margin-top: 2.6rem;
    padding: 1.6rem 0;
    background-image:
      repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px),
      repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px);
    background-size: 100% 2px, 100% 2px;
    background-position: top left, bottom left;
    background-repeat: no-repeat, no-repeat;
  }
  .pj-meta__label {
    font-family: var(--font-body); font-size: .76rem;
    text-transform: lowercase; letter-spacing: .1em;
    color: var(--gray-400); margin-bottom: 6px;
  }
  .pj-meta__value { font-family: var(--font-body); font-size: .95rem; color: var(--ink); }
  .pj-notes {
    display: flex; flex-wrap: wrap; gap: .55rem;
    width: 100%; max-width: 100%; min-width: 0;
    margin-top: 1.2rem; padding-left: .45rem;
  }
  .pj-meta__card {
    --meta-r: -.55deg;
    position: relative;
    min-width: 0;
    padding: 1rem 1.05rem 1.1rem;
    border: 1px solid rgba(28,27,24,.22);
    background-color: rgba(246,241,230,.82);
    background-image: linear-gradient(120deg, rgba(255,255,255,.4), transparent 62%);
    box-shadow: 4px 4px 0 var(--pj-glow);
    transform: rotate(var(--meta-r));
    transition: transform var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-default), background-color var(--duration-normal) var(--ease-default);
  }
  .pj-meta__card:nth-child(2n) { --meta-r: .7deg; }
  .pj-meta__card:nth-child(3n) { --meta-r: -1deg; }
  .pj-meta__card:hover,
  .pj-meta__card:focus-visible {
    z-index: 2;
    outline: none;
    transform: translateY(-5px) rotate(0deg);
    background-color: rgba(250,247,239,.96);
    box-shadow: 7px 8px 0 var(--pj-glow), 0 0 0 1px rgba(28,27,24,.12);
  }
  .pj-note {
    --note-r: -.4deg;
    display: inline-flex; align-items: center; min-height: 2rem;
    padding: .42rem .72rem;
    border: 1px solid rgba(28,27,24,.28);
    background-color: rgba(246,241,230,.86);
    background-image: linear-gradient(115deg, rgba(255,255,255,.35), transparent 55%);
    box-shadow: 3px 3px 0 rgba(28,27,24,.09);
    font-family: var(--font-subtitle), monospace;
    font-weight: var(--offbit-weight);
    font-size: clamp(.5rem, .7vw, .62rem);
    letter-spacing: var(--offbit-letter-spacing); text-transform: lowercase;
    max-width: 100%; overflow-wrap: anywhere;
    transform: rotate(var(--note-r));
    transition: transform var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-default), background-color var(--duration-normal) var(--ease-default);
  }
  .pj-note:nth-child(2n) { --note-r: 1deg; }
  .pj-note:nth-child(3n) { --note-r: -1.2deg; }
  .pj-note:hover {
    transform: translateY(-4px) rotate(0deg);
    background-color: rgba(250,247,239,.97);
    box-shadow: 5px 6px 0 var(--pj-glow);
  }
  .pj-kicker > span,
  .pj-folio,
  .pj-note,
  .pj-main > section::before,
  .pj-turn__heading > span,
  .pj-turn__num {
    letter-spacing: var(--offbit-letter-spacing);
    scale: var(--offbit-condense) 1;
    transform-origin: left center;
  }

  .pj-h2 {
    font-family: var(--font-grotesk); font-weight: 700;
    font-size: clamp(1.7rem, 4vw, 3rem);
    letter-spacing: -0.035em; text-transform: lowercase;
    margin: 0 0 1rem;
  }
  .pj-sub {
    color: var(--gray-600); font-family: var(--font-body);
    font-size: 1.05rem; max-width: 760px; margin: 0 auto; line-height: 1.6;
  }
  .pj-frame {
    border: 1px solid rgba(28,27,24,.3);
    clip-path: polygon(0 8px, 8px 8px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 8px), 0 calc(100% - 8px));
    overflow: hidden;
  }
  .pj-main { counter-reset: pj-figure; }
  .pj-main > section {
    position: relative;
    counter-increment: pj-figure;
  }
  .pj-main > section::before {
    content: "fig. " counter(pj-figure, decimal-leading-zero);
    position: absolute; z-index: 2;
    top: .65rem; left: max(.65rem, calc((100% - 1180px) / 2));
    padding: .28rem .48rem;
    background: rgba(246,241,230,.88);
    border: 1px solid rgba(28,27,24,.2);
    font-family: var(--font-subtitle), monospace;
    font-weight: var(--offbit-weight);
    font-size: .5rem; line-height: 1;
    letter-spacing: var(--offbit-letter-spacing); text-transform: lowercase;
    pointer-events: none;
  }
  .pj-main > section:nth-child(even)::before { left: auto; right: .65rem; transform: rotate(1deg); }

  .pj-turn {
    max-width: 1300px; margin: 2rem auto 7rem; padding: 0 2rem;
    position: relative; z-index: 10;
  }
  .pj-turn__heading {
    display: flex; justify-content: space-between; gap: 1rem;
    margin-bottom: 1.3rem; padding-bottom: .7rem;
    border-bottom: 1px solid rgba(28,27,24,.35);
    font-family: var(--font-subtitle), monospace;
    font-weight: var(--offbit-weight);
    font-size: .58rem; letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
  }
  .pj-turn__grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(1.2rem, 4vw, 4rem); }
  .pj-turn__card {
    --turn-x: 9px; --turn-y: 10px;
    position: relative; display: grid; min-height: clamp(15rem, 31vw, 28rem);
    color: var(--paper); text-decoration: none; isolation: isolate;
    transition: transform var(--duration-slow) var(--ease-out);
  }
  .pj-turn__card:nth-child(2) { --turn-x: -10px; --turn-y: 8px; margin-top: 3.5rem; }
  .pj-turn__card::before {
    content: ""; position: absolute; inset: 0; z-index: -1;
    transform: translate(var(--turn-x), var(--turn-y));
    background: var(--site-tint-b);
    border: 1px solid rgba(28,27,24,.2);
    transition: transform var(--duration-slow) var(--ease-out);
  }
  .pj-turn__card:hover, .pj-turn__card:focus-visible { transform: translate(-3px, -3px) rotate(-.25deg); }
  .pj-turn__card:hover::before, .pj-turn__card:focus-visible::before { transform: translate(4px, 4px); }
  .pj-turn__card:focus-visible { outline: 2px solid var(--ink); outline-offset: 9px; }
  .pj-turn__image { position: absolute; inset: 0; z-index: -1; overflow: hidden; background: var(--ink); }
  .pj-turn__image::after {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(180deg, transparent 25%, rgba(15,14,12,.82));
  }
  .pj-turn__image img { object-fit: cover; transition: transform var(--duration-slow) var(--ease-out); }
  .pj-turn__card:hover .pj-turn__image img { transform: scale(1.025); }
  .pj-turn__copy {
    align-self: end; padding: clamp(1rem, 3vw, 2rem);
    display: grid; grid-template-columns: auto 1fr; gap: .8rem 1.2rem; align-items: end;
  }
  .pj-turn__num {
    grid-row: 1 / span 2;
    font-family: var(--font-subtitle), monospace;
    font-weight: var(--offbit-weight);
    font-size: clamp(2rem, 5vw, 4.5rem); line-height: .75; letter-spacing: var(--offbit-letter-spacing);
    transition: font-weight var(--duration-normal) var(--ease-out);
  }
  .pj-turn__card:hover .pj-turn__num,
  .pj-turn__card:focus-visible .pj-turn__num {
    font-weight: var(--offbit-weight-active);
  }
  .pj-turn__title { font-family: var(--font-head); font-size: clamp(1.6rem, 3.4vw, 3.4rem); line-height: .9; }
  .pj-turn__dir { font-family: var(--font-body); font-size: .66rem; letter-spacing: .14em; text-transform: uppercase; }

  @media (max-width: 720px) {
    .pj-head { width: 100%; max-width: 100%; min-width: 0; padding: 5.5rem 1.25rem 2.5rem; }
    .pj-head > :not(.pj-folio) { width: calc(100vw - 2.5rem); max-width: calc(100vw - 2.5rem); min-width: 0; }
    .pj-folio { top: 4.1rem; right: .7rem; }
    .pj-title { max-width: 12ch; }
    .pj-desc { max-width: 100%; overflow-wrap: anywhere; }
    .pj-meta { grid-template-columns: 1fr; gap: 1rem; width: 100%; }
    .pj-meta > div { min-width: 0; }
    .pj-notes { padding-left: 0; }
    .pj-tag { min-height: 44px; display: inline-flex; align-items: center; flex: 0 0 auto; }
    .pj-turn { padding: 0 1.25rem; margin-bottom: 4rem; }
    .pj-turn__grid { grid-template-columns: 1fr; gap: 2.6rem; }
    .pj-turn__card, .pj-turn__card:nth-child(2) { min-height: 19rem; margin-top: 0; transform: rotate(-1deg); }
    .pj-turn__card:nth-child(2) { transform: rotate(1deg); }
    .pj-main > section::before { left: .35rem; }
    .pj-main > section:nth-child(even)::before { left: auto; right: .35rem; }
    .pj-ornament { top: 29rem; }
    .pj-ornament--right { right: -5rem; }
    .pj-ornament--left { left: -5rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    .pj-progress { display: none; }
    .pj-turn__card, .pj-turn__card::before, .pj-turn__image img { transition: none; }
    .pj-turn__num { transition: none; }
    .pj-meta__card, .pj-note { transition: none; }
    .pj-meta__card:hover, .pj-meta__card:focus-visible, .pj-note:hover { transform: none; }
    .pj-ornament { animation: none; translate: none; }
    .pj-turn__card:hover, .pj-turn__card:focus-visible,
    .pj-turn__card:nth-child(2) { transform: none; }
  }
`;

export type ProjectMeta = { label: string; value: string };

export default function ProjectShell({
  title,
  desc,
  meta = [],
  children,
}: {
  title: string;
  desc: React.ReactNode;
  meta?: ProjectMeta[];
  children: React.ReactNode;
}) {
  const { t, lang } = useT();
  const pathname = usePathname();
  const projects = useProjects();
  const reduceMotion = useReducedMotion();
  const currentIndex = projects.findIndex((project) => project.href === pathname);
  const current = currentIndex >= 0 ? projects[currentIndex] : null;
  const neighbours = currentIndex >= 0
    ? [
        projects[(currentIndex - 1 + projects.length) % projects.length],
        projects[(currentIndex + 1) % projects.length],
      ]
    : [];
  const notes = current?.tags.split("/").map((tag) => tag.trim()).filter(Boolean).slice(0, 3) ?? [];
  const archiveLabel = lang === "pt" ? "arquivo de projeto" : "project archive";
  const notesLabel = lang === "pt" ? "etiquetas do projeto" : "project labels";
  const turnLabel = lang === "pt" ? "continue folheando" : "keep browsing";
  const directions = lang === "pt" ? ["projeto anterior", "próximo projeto"] : ["previous project", "next project"];
  const entrance = reduceMotion ? false : { opacity: 0, y: 26 };
  const projectOrnaments = [
    FILLER_COLUMN,
    QUIMERA,
    ESFERA,
    COELHOS,
    ORNAMENTAL,
    FILLER_GROUP,
    ESTRELA,
    EDGE_RIGHT,
    ANJOS,
  ];
  const ornamentIndex = currentIndex >= 0 ? currentIndex : 0;
  const ornamentArt = projectOrnaments[ornamentIndex % projectOrnaments.length];
  const ornamentSide = ornamentIndex === 7 || ornamentIndex % 2 === 0 ? "right" : "left";
  const ornamentSize = ornamentIndex === 7 || ornamentIndex === 8
    ? "clamp(2.5px, .36vw, 5.2px)"
    : "clamp(3px, .42vw, 6px)";

  return (
    <div
      className="pj"
      style={{ "--pj-glow": PROJECT_GLOWS[(currentIndex >= 0 ? currentIndex : 0) % PROJECT_GLOWS.length] } as CSSProperties}
    >
      <style>{styles}</style>
      <div className="pj-progress" aria-hidden="true" />
      <BrailleDeco
        art={ornamentArt}
        fontSize={ornamentSize}
        opacity={0.2}
        className={`pj-ornament pj-ornament--${ornamentSide}`}
        style={{ transformOrigin: `${ornamentSide} center` }}
      />

      <Link href="/" className="pj-corner pj-corner--l hover-trigger">mary l. <span className="text-star" aria-hidden="true">✳︎</span></Link>
      <span className="pj-corner pj-corner--r"><LangToggle /></span>

      {/* molhinho de navegação fixo */}
      <nav className="pj-cluster" aria-label="menu">
        <Link className="pj-tag hover-trigger" href="/">[ {t("pj_home")} ]</Link>
        <Link className="pj-tag hover-trigger" href="/work">[ {t("nav_work").toLowerCase()} ]</Link>
        <a className="pj-tag hover-trigger" href="#contact">[ {t("rm_menu_contact")} ]</a>
      </nav>

      <header className="pj-head">
        <div className="pj-folio" aria-hidden="true">{current?.num ?? "—"}</div>
        <motion.div
          initial={entrance}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : MOTION_SLOW, ease: MOTION_EASE_OUT }}
        >
          <Link href="/work" className="pj-back hover-trigger">← {t("pj_back")}</Link>
          <div className="pj-kicker">
            <span>{current?.num ?? "—"} / {projects.length.toString().padStart(2, "0")}</span>
            <span>{archiveLabel}</span>
          </div>
          <h1 className="pj-title">{title}</h1>
          <p className="pj-desc">{desc}</p>
        </motion.div>

        {meta.length > 0 && (
          <div className="pj-meta">
            {meta.map((m) => (
              <div className="pj-meta__card" tabIndex={0} key={m.label}>
                <div className="pj-meta__label">{m.label}</div>
                <div className="pj-meta__value">{m.value}</div>
              </div>
            ))}
          </div>
        )}

        {current && (
          <aside className="pj-notes" aria-label={notesLabel}>
            <span className="pj-note">{archiveLabel} {current.num}/{projects.length.toString().padStart(2, "0")}</span>
            {notes.map((note) => <span className="pj-note" key={note}>{note}</span>)}
          </aside>
        )}
      </header>

      <main className="pj-main" style={{ position: "relative", zIndex: 10 }}>{children}</main>

      {neighbours.length === 2 && (
        <nav className="pj-turn" aria-label={turnLabel}>
          <div className="pj-turn__heading">
            <span>{turnLabel}</span>
            <span>{current?.num} / {projects.length.toString().padStart(2, "0")}</span>
          </div>
          <div className="pj-turn__grid">
            {neighbours.map((project, index) => (
              <Link className="pj-turn__card hover-trigger" href={project.href} key={project.href}>
                <span className="pj-turn__image">
                  <Image
                    src={project.img}
                    alt=""
                    fill
                    sizes="(max-width: 720px) 100vw, 50vw"
                  />
                </span>
                <span className="pj-turn__copy">
                  <span className="pj-turn__num">{project.num}</span>
                  <span className="pj-turn__title">{project.title}</span>
                  <span className="pj-turn__dir">{directions[index]} ↗</span>
                </span>
              </Link>
            ))}
          </div>
        </nav>
      )}

      <div id="contact">
        <EditorialFooter />
      </div>
    </div>
  );
}
