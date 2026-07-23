"use client";
import { Fragment } from "react";
import PlaygroundHero from "@/components/PlaygroundHero";
import ScatteredWorks from "@/components/ScatteredWorks";
import { useProjects } from "@/components/useProjects";
import Marquee from "@/components/Marquee";
import AsciiAnim from "@/components/AsciiAnim";
import BootIntro from "@/components/BootIntro";
import IdleBanner from "@/components/IdleBanner";
import AsciiDivider from "@/components/AsciiDivider";
import ScatterMenu, { type MenuItem } from "@/components/ScatterMenu";
import { GATO_FRAMES } from "@/components/asciiArt";
import EditorialFooter from "@/components/EditorialFooter";
import LangToggle from "@/components/LangToggle";
import { useT } from "@/i18n/LanguageContext";

/* ==========================================================
   Landing — direção de arte editorial ("reset visual").
   Tokens locais: o resto do site segue usando os tokens do
   globals.css, então tudo aqui fica escopado em .rm.
   Para trocar o verde, mexa só em --acid.
   ========================================================== */
const rmStyles = `
  .rm {
    /* invertido: mundo escuro, lime elétrico (refs: t-ko, barbiana, tiny) */
    --ink: var(--site-ink);
    --paper: var(--site-paper);
    --acid: var(--site-accent);
    --font-grotesk: Arial, "Helvetica Neue", Helvetica, sans-serif;
    /* degradê profundo: roxo/azul da id EBAT respirando por baixo do preto */
    background:
      radial-gradient(1100px 700px at 18% -5%, var(--site-tint-a) 0%, transparent 60%),
      radial-gradient(900px 600px at 100% 30%, var(--site-tint-b) 0%, transparent 55%),
      radial-gradient(1000px 800px at 50% 105%, var(--site-tint-c) 0%, transparent 55%),
      var(--paper);
    color: var(--ink);
    overflow-x: hidden;
    position: relative;
  }
  /* grão de filme por cima de tudo (feTurbulence), sem capturar cliques */
  .rm::after {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 5;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: .07;
    mix-blend-mode: multiply;
  }
  .rm ::selection { background: var(--acid); color: #111; }
  .px-line {
    background-image: repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px);
    background-size: 100% 2px;
    background-repeat: no-repeat;
  }

  /* --- sem navbar tradicional: só marcas mínimas nos cantos --- */
  .rm-corner {
    position: fixed; top: 1rem; z-index: 1000;
    font-family: var(--font-body);
    font-size: .78rem; text-transform: lowercase; letter-spacing: .1em;
    color: var(--ink);
  }
  .rm-corner--l { left: 1.4rem; display: flex; flex-direction: column; gap: .12rem; line-height: 1.1; }
  /* wordmark na PF Pixelscript (Adobe) — caligrafia pixelada COM acentos */
  .rm-mark { font-family: var(--font-pixelscript); font-weight: 400; font-size: 2.3rem; letter-spacing: .02em; line-height: 1; text-transform: none; }
  .rm-mark__sub { font-size: .62rem; letter-spacing: .08em; opacity: .5; }
  .rm-corner--r { right: 1.4rem; display: flex; align-items: center; gap: 1rem; }
  .rm-status {
    display: inline-flex; align-items: center; gap: .42rem;
    font-size: .68rem; letter-spacing: .06em; opacity: .82; white-space: nowrap;
  }
  .rm-status__dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--ink);
    animation: rm-pulse 2.4s ease-out infinite;
  }
  @keyframes rm-pulse {
    0% { box-shadow: 0 0 0 0 rgba(28,27,24,.35); }
    70% { box-shadow: 0 0 0 6px rgba(28,27,24,0); }
    100% { box-shadow: 0 0 0 0 rgba(28,27,24,0); }
  }
  .rm-nav { display: inline-flex; align-items: center; gap: .7rem; }
  .rm-nav a {
    color: var(--ink); text-decoration: none; opacity: .7;
    font-size: .72rem; letter-spacing: .04em;
    transition: opacity .2s ease;
  }
  .rm-nav a:hover, .rm-nav a:focus-visible { opacity: 1; text-decoration: underline; text-underline-offset: 3px; }
  /* banner ASCII grande e faint no hero — muda quando o mouse pausa (IdleBanner) */
  .rm-idle {
    position: absolute;
    top: 8%; left: 50%; transform: translateX(-50%);
    z-index: 0; margin: 0; pointer-events: none; user-select: none;
    font-family: var(--font-mono); line-height: 1.05; white-space: pre;
    font-size: clamp(11px, 2.8vw, 28px); color: var(--ink); opacity: .06;
    text-align: center;
  }
  @media (prefers-reduced-motion: reduce) { .rm-status__dot { animation: none; } }
  @media (max-width: 860px) {
    .rm-status, .rm-nav, .rm-mark__sub { display: none; }
    .rm-idle { opacity: .05; font-size: 10px; top: 6%; }
  }

  /* --- seções --- */
  .rm-sec { padding: 6rem 2rem; }
  .rm-label {
    font-family: var(--font-body); font-size: .8rem;
    text-transform: lowercase; letter-spacing: .12em;
    display: flex; justify-content: space-between;
    padding-bottom: .55rem; margin-bottom: 0;
  }
  /* divisor ASCII fofo abaixo do label (no lugar da linha tracejada) */
  .rm-divider { margin-bottom: 3rem; }
  .rm-statement {
    font-family: var(--font-grotesk); font-weight: 700;
    font-size: clamp(1.6rem, 4.4vw, 3.6rem);
    line-height: 1.03; letter-spacing: -0.035em;
    text-transform: lowercase;
    max-width: 20ch;
  }
  .rm-em { font-family: var(--font-head); font-style: italic; text-transform: none; letter-spacing: -0.01em; }
  .rm-about-copy { display: flex; flex-direction: column; gap: 2.5rem; }
  .rm-colophon-row {
    display: grid; grid-template-columns: minmax(6.5rem, .45fr) 1fr; gap: 1rem;
    padding: .6rem 0;
    font-family: var(--font-body); font-size: .72rem;
    letter-spacing: .08em; text-transform: lowercase;
  }
  .rm-colophon-row span:first-child { opacity: .5; }
  .rm-colophon-row span:last-child { font-family: var(--font-head); font-size: 1rem; letter-spacing: 0; }

  /* --- tabela de ferramentas --- */
  /* minmax(0,1fr) + min-width:0: sem isso os divisores ASCII (texto nowrap
     gigante) explodem as colunas no cálculo intrínseco do grid/flex */
  .rm-about { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 4rem; align-items: start; }
  .rm-about-copy { min-width: 0; }
  .rm-tools { display: flex; flex-direction: column; min-width: 0; }
  .rm-tool-row {
    display: grid; grid-template-columns: 40% 1fr; gap: 1.5rem;
    padding: .85rem 0;
    font-family: var(--font-body); font-size: .82rem;
    text-transform: lowercase; letter-spacing: .06em;
  }
  .rm-tool-row span:last-child { font-family: var(--font-body); text-transform: none; letter-spacing: 0; font-size: .85rem; }

  @media (max-width: 900px) {
    .rm-about { grid-template-columns: 1fr; gap: 2.5rem; }
  }
  @media (max-width: 720px) {
    .rm-nav { padding: .75rem 1.25rem; gap: .75rem; }
    .rm-nav__links { gap: 1rem; }
    .rm-sec { padding: 4rem 1.25rem; }
    .rm-label { margin-bottom: 2rem; }
  }

  /* --- cards brutas (Readymag / Brutalist style) --- */
  .rm .hero-card {
    background: #000000 !important;
    color: var(--ink) !important;
    border: 3px solid var(--ink) !important;
    border-radius: 0px !important;
    box-shadow: 8px 8px 0px var(--acid) !important;
    position: relative;
    top: 0;
    left: 0;
    transition: top 0.15s ease, left 0.15s ease, box-shadow 0.15s ease !important;
  }
  .rm .hero-card:hover {
    top: 8px !important;
    left: 8px !important;
    box-shadow: 0px 0px 0px var(--acid) !important;
  }
  .rm .hero-card__icon {
    border-radius: 0px !important;
    border: 2px solid var(--ink) !important;
    background: #111 !important;
    color: var(--acid) !important;
  }
  .rm .hero-card__icon svg {
    stroke: var(--ink) !important;
  }
  .rm .hero-card__desc {
    color: var(--ink) !important;
    opacity: 0.85;
  }
  .rm .hero-card__arrow {
    display: none !important;
  }
`;

export default function Home() {
  const { t, lang } = useT();

  // lista única de projetos (mesma fonte da página /work)
  const projects = useProjects();

  const marquee = [
    t("p04_tag1"), t("p01_tag1"), t("about_cat_web"),
    t("p03_tag2"), t("p01_tag2"), t("p04_tag2"), t("p03_tag1"),
  ];

  const tools = [
    { cat: t("about_cat_visual"), list: "Figma · Illustrator · Photoshop · After Effects · InDesign" },
    { cat: t("about_cat_web"), list: "HTML/CSS · WordPress · Framer · desenvolvimento assistido por IA" },
    { cat: t("about_cat_creative"), list: `TouchDesigner · Blender · ${t("about_tool_gen_ai")}` },
  ];

  const colophon = lang === "pt"
    ? [
        ["edição", "portfólio 2026"],
        ["base", "Rio de Janeiro, Brasil"],
        ["serviços", "identidade visual · direção de arte · web design"],
        ["status", "disponível para projetos e colaborações"],
      ]
    : [
        ["edition", "portfolio 2026"],
        ["based in", "Rio de Janeiro, Brazil"],
        ["services", "visual identity · art direction · web design"],
        ["status", "available for projects and collaborations"],
      ];

  return (
    <div className="rm">
      <style>{rmStyles}</style>
      <BootIntro />

      <span className="rm-corner rm-corner--l">
        <span className="rm-mark">
          <span className="text-star" aria-hidden="true">✳︎</span> Maria Isabel Lisita
        </span>
        <span className="rm-mark__sub">
          {lang === "pt" ? "designer & tecnóloga criativa" : "designer & creative technologist"}
        </span>
      </span>
      <span className="rm-corner rm-corner--r">
        <span className="rm-status">
          <span className="rm-status__dot" aria-hidden="true" />
          {lang === "pt" ? "disponível p/ projetos" : "available for work"}
        </span>
        <nav className="rm-nav" aria-label={lang === "pt" ? "navegação" : "navigation"}>
          <a href="/work">{t("nav_work").toLowerCase()}</a>
          <a href="#about" onClick={(e) => { e.preventDefault(); document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" }); }}>{t("rm_menu_about")}</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}>{t("rm_menu_contact")}</a>
        </nav>
        <LangToggle />
      </span>

      <main>
        <PlaygroundHero
          lines={[t("hero_title_1"), t("hero_title_highlight")]}
          location={t("hero_location")}
          sub={t("hero_sub_1")}
          subHighlight={t("hero_sub_highlight")}
          scrollLabel={t("rm_scroll")}
        >
          <IdleBanner />
          <ScatterMenu
            items={[
              { label: t("nav_work").toLowerCase(), href: "/work", left: "72%", top: "40%", rotate: 2, priority: "primary" },
              { label: t("rm_menu_about"), href: "#about", left: "78%", top: "61%", rotate: -2, priority: "secondary" },
              { label: t("rm_menu_contact"), href: "#contact", left: "66%", top: "73%", rotate: 1, priority: "tertiary" },
            ] satisfies MenuItem[]}
          />
        </PlaygroundHero>

        <Marquee items={marquee} />

        {/* Índice de trabalhos — imagem persegue o cursor com tratamento CFTV */}
        <section id="work" className="rm-sec" style={{ position: "relative" }}>
          <AsciiAnim
            frames={GATO_FRAMES}
            interval={220}
            fontSize={7}
            opacity={0.28}
            style={{ position: "absolute", right: "3%", top: "-2rem" }}
          />
          <div className="rm-label">
            <span>{t("selected_work")}</span>
            <span>{projects.length.toString().padStart(2, "0")} —</span>
          </div>
          <AsciiDivider className="rm-divider" pattern="• . ݁₊ ⊹ . ݁꒰ঌ·✦·໒꒱ ݁ . ⊹ ₊ ݁. •" size=".68rem" opacity={0.5} />
          {/* projetos jogados no canvas (t-i-n-y) — capas nascem nítidas e viram pixel no scroll */}
          <ScatteredWorks items={projects} bgWord={`${t("nav_work").toLowerCase()}!`} />
        </section>

        {/* Sobre */}
        <section id="about" className="rm-sec" style={{ position: "relative" }}>
          <div className="rm-label">
            <span>{t("about_title")}</span>
            <span>{t("rm_tools_label")}</span>
          </div>
          <AsciiDivider className="rm-divider" pattern="︶꒷꒦︶" size=".68rem" opacity={0.5} />
          <div className="rm-about">
            <div className="rm-about-copy">
              <h2 className="rm-statement">
                {t("about_text")}
              </h2>
              <div className="rm-colophon-meta">
                {colophon.map(([label, value]) => (
                  <Fragment key={label}>
                    <AsciiDivider pattern="· ˚ ⊹ ˚ " size=".5rem" opacity={0.42} />
                    <div className="rm-colophon-row">
                      <span>{label}</span>
                      <span>{value}</span>
                    </div>
                  </Fragment>
                ))}
                <AsciiDivider pattern="· ˚ ⊹ ˚ " size=".5rem" opacity={0.42} />
              </div>
            </div>
            <div className="rm-tools">
              {tools.map((g) => (
                <Fragment key={g.cat}>
                  <AsciiDivider pattern="· ˚ ⊹ ˚ " size=".5rem" opacity={0.42} />
                  <div className="rm-tool-row">
                    <span>{g.cat}</span>
                    <span>{g.list}</span>
                  </div>
                </Fragment>
              ))}
              <AsciiDivider pattern="· ˚ ⊹ ˚ " size=".5rem" opacity={0.42} />
              <div className="rm-tool-row">
                <span>{t("about_nano_sub")}</span>
                <span>NANO — UFRJ</span>
              </div>
              <AsciiDivider pattern="· ˚ ⊹ ˚ " size=".5rem" opacity={0.42} />
              <div className="rm-tool-row">
                <span>{t("about_laid_sub")}</span>
                <span>LAID — UFRJ</span>
              </div>
              <AsciiDivider pattern="· ˚ ⊹ ˚ " size=".5rem" opacity={0.42} />
            </div>
          </div>
        </section>
      </main>

      <div id="contact">
        <EditorialFooter />
      </div>
    </div>
  );
}
