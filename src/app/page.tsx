"use client";
import { useEffect, useState } from "react";
import PlaygroundHero from "@/components/PlaygroundHero";
import ScatteredWorks from "@/components/ScatteredWorks";
import { useProjects } from "@/components/useProjects";
import Marquee from "@/components/Marquee";
import AsciiAnim from "@/components/AsciiAnim";
import BootIntro from "@/components/BootIntro";
import AsciiKanagawa from "@/components/AsciiKanagawa";
import AsciiDivider from "@/components/AsciiDivider";
import ScatterMenu, { type MenuItem } from "@/components/ScatterMenu";
import { GATO_FRAMES } from "@/components/asciiArt";
import EditorialFooter from "@/components/EditorialFooter";
import SiteHeader from "@/components/SiteHeader";
import LangToggle from "@/components/LangToggle";
import { useT } from "@/i18n/LanguageContext";
import {
  CreativeStudioControls,
  CreativeStudioProvider,
  useCreativeStudio,
} from "@/components/CreativeStudio";
import SkillConstellation from "@/components/SkillConstellation";
import ScrambleText from "@/components/ScrambleText";

const STITCH_DIVIDER = "------  ";

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
    --hero-highlight: #9c554f;
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
    transition: background-color .65s ease, color .65s ease;
  }
  .rm[data-paper="cyanotype"] {
    --site-paper: #12344d;
    --site-ink: #c8eff2;
    --site-accent: #8edbe5;
    --site-tint-a: #173e59;
    --site-tint-b: #0c263d;
    --site-tint-c: #1a4961;
    --site-accent-rgb: 142, 219, 229;
    --hero-highlight: #e38b82;
  }
  .rm[data-paper="vellum"] {
    --site-paper: #e6e9e6;
    --site-ink: #242725;
    --site-accent: #55605b;
    --site-tint-a: #f4f6f3;
    --site-tint-b: #d4dad6;
    --site-tint-c: #edf0ed;
    --site-accent-rgb: 85, 96, 91;
    --hero-highlight: #914d48;
  }
  .rm[data-paper="cyanotype"]::after {
    opacity: .11;
    mix-blend-mode: screen;
  }
  .rm[data-paper="vellum"]::after { opacity: .045; }
  .rm .rm-idle {
    color: color-mix(in srgb, var(--ink) 17%, transparent);
  }
  .rm .sw__deco { opacity: .78 !important; }
  .rm .rm-thread { opacity: .36; }
  .rm .ph__sticker { filter: contrast(1.12); }
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
  .rm *::selection { background: #843f3a; color: #fff8ec; }
  .px-line {
    background-image: repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px);
    background-size: 100% 2px;
    background-repeat: no-repeat;
  }

  /* --- sem navbar tradicional: só marcas mínimas nos cantos --- */
  .rm-corner {
    position: fixed; top: 2.2rem; z-index: 1000;
    font-family: var(--font-body);
    font-size: .78rem; text-transform: lowercase; letter-spacing: .1em;
    color: var(--ink);
    isolation: isolate;
    transition: opacity .32s ease, translate .42s cubic-bezier(.16,1,.3,1);
  }
  .rm-corner::before {
    content: "";
    position: absolute;
    z-index: -1;
    inset: -.45rem -.7rem;
    background: color-mix(in srgb, var(--paper) 82%, transparent);
    box-shadow: 0 0 14px 9px color-mix(in srgb, var(--paper) 72%, transparent);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    opacity: .74;
    pointer-events: none;
  }
  .rm[data-contact-visible="true"] .rm-corner {
    opacity: 0;
    translate: 0 -1rem;
    pointer-events: none;
  }
  .rm-corner--l { left: 5.5rem; display: flex; flex-direction: column; gap: .12rem; line-height: 1.1; }
  /* wordmark na PF Pixelscript (Adobe) — caligrafia pixelada COM acentos */
  .rm-mark { font-family: var(--font-pixelscript); font-weight: 400; font-size: 2.3rem; letter-spacing: .02em; line-height: 1; text-transform: none; }
  .rm-mark__sub { font-size: var(--type-micro); letter-spacing: .08em; opacity: .75; color: var(--ink); }
  .rm-corner--r { right: 5.5rem; display: flex; align-items: center; gap: 1rem; }
  .rm-status {
    display: inline-flex; align-items: center; gap: .42rem;
    font-size: var(--type-micro); letter-spacing: .06em; opacity: .88; white-space: nowrap;
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
    font-size: var(--type-micro); letter-spacing: .04em;
    transition: opacity .2s ease;
  }
  .rm-nav a:hover, .rm-nav a:focus-visible { opacity: 1; text-decoration: underline; text-underline-offset: 3px; }
  .rm a:focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 4px;
  }
  /* campo de costura — malha de traços ASCII em fluxo, atrás de tudo no hero.
     A cor e a fonte saem daqui: o AsciiField lê o color/font-family computados
     do canvas, então os temas de papel continuam mandando na tinta. */
  .rm-field {
    position: absolute;
    inset: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    color: var(--ink);
    font-family: var(--font-mono), monospace;
  }
  .rm-thread {
    position: absolute;
    z-index: 2;
    top: 100svh;
    left: .85rem;
    width: 4.1rem;
    height: calc(100% - 100svh - 22rem);
    color: var(--ink);
    opacity: .24;
    pointer-events: none;
    transition: opacity .55s ease;
  }
  .rm-thread svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .rm-thread__holes { opacity: .34; }
  .rm-thread__line {
    opacity: .76;
    filter: drop-shadow(1px 0 0 color-mix(in srgb, var(--paper) 86%, transparent));
  }
  /* Lombada Costurada na borda da página — encadernação em zine artesanal */
  .rm-spine {
    position: fixed;
    top: 0; bottom: 0; left: 1.8rem;
    width: 1px;
    z-index: 80;
    pointer-events: none;
    user-select: none;
    opacity: .28;
    background-image: repeating-linear-gradient(180deg, var(--ink) 0 5px, transparent 5px 12px);
  }
  .rm-thread__knot {
    position: absolute;
    left: 50%;
    translate: -50% -50%;
    display: grid;
    place-items: center;
    width: 1.05rem;
    height: 1.05rem;
    color: var(--ink);
    background: var(--paper);
    border: 1px solid color-mix(in srgb, var(--ink) 20%, transparent);
    font-family: var(--font-mono), monospace;
    font-size: .62rem;
    line-height: 1;
    box-shadow: 2px 2px 0 color-mix(in srgb, var(--ink) 8%, transparent);
  }
  .rm-guide {
    position: absolute;
    z-index: 4;
    font-family: var(--font-mono), monospace;
    font-size: 1.15rem;
    color: var(--ink);
    opacity: .46;
    animation: rm-guide 9s ease-in-out infinite;
  }
  @keyframes rm-guide {
    0%, 100% { rotate: 0deg; scale: 1; }
    50% { rotate: 70deg; scale: 1.14; }
  }
  @media (prefers-reduced-motion: reduce) {
    .rm-status__dot { animation: none; }
  }
  @media (max-width: 860px) {
    .rm-status, .rm-nav, .rm-mark__sub { display: none; }
    .rm-corner { top: 1.25rem; }
    .rm-corner--l { left: 1.25rem; max-width: calc(100vw - 6rem); }
    .rm-corner--r { right: 1.25rem; }
    .rm-mark { display: block; font-size: clamp(1.55rem, 8vw, 2rem); line-height: .92; }
    .rm-thread {
      left: -.2rem;
      width: 1.9rem;
      opacity: .15;
    }
    .rm-thread__knot { width: .78rem; height: .78rem; font-size: .45rem; }
  }

  /* --- seções --- */
  .rm-sec { padding: 6rem 5.5rem; scroll-margin-top: 6.5rem; }
  .rm-label {
    font-family: var(--font-body); font-size: var(--type-micro);
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
  .rm-about-copy { display: flex; flex-direction: column; }

  /* --- tabela de ferramentas --- */
  /* minmax(0,1fr) + min-width:0: sem isso os divisores ASCII (texto nowrap
     gigante) explodem as colunas no cálculo intrínseco do grid/flex */
  .rm-about { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 4rem; align-items: start; }
  .rm-about-copy { min-width: 0; }
  .rm-tools { display: flex; flex-direction: column; min-width: 0; }
  .rm-tool-row {
    display: grid; grid-template-columns: 40% 1fr; gap: 1.5rem;
    padding: .85rem 0;
    font-family: var(--font-body); font-size: var(--type-label);
    text-transform: lowercase; letter-spacing: .06em;
  }
  .rm-tool-row span:last-child { font-family: var(--font-body); text-transform: none; letter-spacing: 0; font-size: var(--type-body); }

  @media (max-width: 900px) {
    .rm-about { grid-template-columns: 1fr; gap: 2.5rem; }
  }
  @media (max-width: 720px) {
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
  return (
    <CreativeStudioProvider>
      <HomeContent />
    </CreativeStudioProvider>
  );
}

function HomeContent() {
  const { t, lang } = useT();
  const { paper } = useCreativeStudio();
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const contact = document.querySelector("#contact");
    if (!contact) return;
    const observer = new IntersectionObserver(
      ([entry]) => setContactVisible(entry.isIntersecting),
      { threshold: .02 },
    );
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  // lista única de projetos (mesma fonte da página /work)
  const projects = useProjects();

  const marquee = [
    t("p04_tag1"), t("p01_tag1"), t("about_cat_web"),
    t("p03_tag2"), t("p01_tag2"), t("p04_tag2"), t("p03_tag1"),
  ];

  const constellation = lang === "pt"
    ? [
        { label: "identidade", detail: "sistemas visuais, marcas e direção de arte" },
        { label: "web", detail: "interfaces responsivas, protótipos e experiências digitais" },
        { label: "direção", detail: "conceito, linguagem visual e coerência entre meios" },
        { label: "estratégia", detail: "pesquisa, arquitetura e decisões de comunicação" },
        { label: "movimento", detail: "animação, ritmo, interação e imagem em transformação" },
        { label: "tecnologia", detail: "código criativo, IA generativa e experimentação" },
      ]
    : [
        { label: "identity", detail: "visual systems, brands and art direction" },
        { label: "web", detail: "responsive interfaces, prototypes and digital experiences" },
        { label: "direction", detail: "concept, visual language and cross-media consistency" },
        { label: "strategy", detail: "research, architecture and communication decisions" },
        { label: "motion", detail: "animation, rhythm, interaction and transforming images" },
        { label: "technology", detail: "creative coding, generative AI and experimentation" },
      ];

  return (
    <div
      className="rm"
      data-paper={paper}
      data-contact-visible={contactVisible ? "true" : "false"}
    >
      <style>{rmStyles}</style>
      <BootIntro />
      <CreativeStudioControls />
      <div className="rm-spine" aria-hidden="true" />

      <div className="rm-thread" aria-hidden="true">
        <svg viewBox="0 0 24 100" preserveAspectRatio="none">
          <path
            className="rm-thread__holes"
            d="M12 0 L12 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeDasharray=".14 1.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="rm-thread__line"
            d="M12 0 C7 6 17 11 12 18 C7 25 17 31 12 39 C7 47 17 54 12 62 C7 70 17 76 12 84 C8 91 15 96 12 100"
            fill="none"
            stroke="currentColor"
            strokeWidth=".85"
            strokeDasharray=".82 .62"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className="rm-thread__knot" style={{ top: "18%" }}>╳</span>
        <span className="rm-thread__knot" style={{ top: "62%" }}>╳</span>
        <span className="rm-thread__knot" style={{ top: "84%" }}>╳</span>
      </div>

      <SiteHeader />

      <main>
        <PlaygroundHero
          lines={[t("hero_title_1"), t("hero_title_highlight")]}
          sub={t("hero_sub_1")}
          subHighlight={t("hero_sub_highlight")}
          scrollLabel={t("rm_scroll")}
        >
          <AsciiKanagawa className="rm-field" opacity={0.3} />
          <ScatterMenu
            items={[
              {
                label: lang === "pt" ? "ver projetos" : "view work",
                href: "/work",
                left: "74%",
                top: "20%",
                rotate: 3,
                priority: "primary",
                previews: projects.slice(0, 3).map((project) => ({ src: project.img, alt: project.title })),
              },
              { label: t("rm_menu_about"), href: "#about", left: "6%", top: "70%", rotate: -3, priority: "secondary" },
              { label: t("rm_menu_contact"), href: "#contact", left: "72%", top: "78%", rotate: 2, priority: "tertiary" },
            ] satisfies MenuItem[]}
          />
        </PlaygroundHero>

        <Marquee items={marquee} />

        {/* Índice de trabalhos — imagem persegue o cursor com tratamento CFTV */}
        <section id="work" className="rm-sec" style={{ position: "relative" }}>
          <span className="rm-guide" aria-hidden="true" style={{ left: "51%", top: "3.4rem" }}>✳︎</span>
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
          <AsciiDivider className="rm-divider" pattern={STITCH_DIVIDER} fullWidth opacity={0.52} />
          {/* projetos jogados no canvas (t-i-n-y) — capas nascem nítidas e viram pixel no scroll */}
          <ScatteredWorks items={projects} bgWord={`${t("nav_work").toLowerCase()}!`} />
        </section>

        {/* Sobre */}
        <section id="about" className="rm-sec" style={{ position: "relative" }}>
          <span className="rm-guide" aria-hidden="true" style={{ right: "7%", top: "4.5rem", animationDelay: "-3s" }}>✳︎</span>
          <div className="rm-label">
            <span>{t("about_title")}</span>
            <span>{t("rm_tools_label")}</span>
          </div>
          <AsciiDivider className="rm-divider" pattern={STITCH_DIVIDER} fullWidth opacity={0.52} />
          <div className="rm-about">
            <div className="rm-about-copy">
              <h2 className="rm-statement">
                {t("about_text")}
              </h2>
            </div>
            <div className="rm-tools">
              <SkillConstellation nodes={constellation} />
              <div className="rm-tool-row">
                <span>{t("about_nano_sub")}</span>
                <span>NANO — UFRJ</span>
              </div>
              <AsciiDivider opacity={0.45} />
              <div className="rm-tool-row">
                <span>{t("about_laid_sub")}</span>
                <span>LAID — UFRJ</span>
              </div>
              <AsciiDivider opacity={0.45} />
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
