"use client";
import { motion } from "framer-motion";
import PlaygroundHero from "@/components/PlaygroundHero";
import ScatteredWorks from "@/components/ScatteredWorks";
import { useProjects } from "@/components/useProjects";
import Marquee from "@/components/Marquee";
import AsciiAnim from "@/components/AsciiAnim";
import ScatterMenu, { type MenuItem } from "@/components/ScatterMenu";
import { GATO_FRAMES, GAROTA_FRAMES, GATO_PRETO_FRAMES } from "@/components/asciiArt";
import EditorialFooter from "@/components/EditorialFooter";
import LangToggle from "@/components/LangToggle";
import { useT } from "@/i18n/LanguageContext";
import HorizontalTimeline from "@/components/HorizontalTimeline";

/* ==========================================================
   Landing — direção de arte editorial ("reset visual").
   Tokens locais: o resto do site segue usando os tokens do
   globals.css, então tudo aqui fica escopado em .rm.
   Para trocar o verde, mexa só em --acid.
   ========================================================== */
const rmStyles = `
  .rm {
    /* invertido: mundo escuro, lime elétrico (refs: t-ko, barbiana, tiny) */
    --ink: #F2F1EC;
    --paper: #0E0E0E;
    --acid: #C8F52E;
    --font-grotesk: Arial, "Helvetica Neue", Helvetica, sans-serif;
    /* degradê profundo: roxo/azul da id EBAT respirando por baixo do preto */
    background:
      radial-gradient(1100px 700px at 18% -5%, #23103d 0%, transparent 60%),
      radial-gradient(900px 600px at 100% 30%, #0d2036 0%, transparent 55%),
      radial-gradient(1000px 800px at 50% 105%, #1a0f2e 0%, transparent 55%),
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
    opacity: .12;
    mix-blend-mode: overlay;
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
  .rm-corner--l { left: 1.4rem; }
  .rm-corner--r { right: 1.4rem; display: flex; align-items: center; gap: .8rem; }

  /* --- seções --- */
  .rm-sec { padding: 6rem 2rem; }
  .rm-label {
    font-family: var(--font-body); font-size: .8rem;
    text-transform: lowercase; letter-spacing: .12em;
    display: flex; justify-content: space-between;
    padding-bottom: .9rem; margin-bottom: 3rem;
    background-image: repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px);
    background-size: 100% 2px;
    background-position: bottom left;
    background-repeat: no-repeat;
  }
  .rm-statement {
    font-family: var(--font-grotesk); font-weight: 700;
    font-size: clamp(1.6rem, 4.4vw, 3.6rem);
    line-height: 1.03; letter-spacing: -0.035em;
    text-transform: lowercase;
    max-width: 20ch;
  }
  .rm-em { font-family: var(--font-head); font-style: italic; text-transform: none; letter-spacing: -0.01em; }

  /* --- tabela de ferramentas --- */
  .rm-about { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
  .rm-tools { display: flex; flex-direction: column; }
  .rm-tool-row {
    display: grid; grid-template-columns: 40% 1fr; gap: 1.5rem;
    padding: 1rem 0;
    background-image: repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px);
    background-size: 100% 2px;
    background-position: top left;
    background-repeat: no-repeat;
    font-family: var(--font-body); font-size: .82rem;
    text-transform: lowercase; letter-spacing: .06em;
  }
  .rm-tool-row:last-child {
    background-image:
      repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px),
      repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px);
    background-size: 100% 2px, 100% 2px;
    background-position: top left, bottom left;
    background-repeat: no-repeat, no-repeat;
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
  const { t } = useT();

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

  return (
    <div className="rm">
      <style>{rmStyles}</style>

      <span className="rm-corner rm-corner--l">mary l. ✳</span>
      <span className="rm-corner rm-corner--r"><LangToggle /></span>

      <main>
        <PlaygroundHero
          lines={[t("hero_title_1"), t("hero_title_highlight")]}
          location={t("hero_location")}
          sub={t("hero_sub_1")}
          subHighlight={t("hero_sub_highlight")}
          scrollLabel={t("rm_scroll")}
          welcome={t("rm_welcome")}
        >
          <ScatterMenu
            items={[
              { label: t("nav_work").toLowerCase(), href: "#work", left: "18%", top: "26%", rotate: -6 },
              { label: t("rm_menu_about"), href: "#about", left: "64%", top: "62%", rotate: 4 },
              { label: t("rm_menu_contact"), href: "#contact", left: "32%", top: "74%", rotate: -3 },
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
          {/* projetos jogados no canvas (t-i-n-y) — capas nascem nítidas e viram pixel no scroll */}
          <ScatteredWorks items={projects} bgWord={`${t("nav_work").toLowerCase()}!`} />
        </section>

        {/* Sobre */}
        <section id="about" className="rm-sec px-line" style={{ backgroundPosition: "top left", position: "relative" }}>
          <AsciiAnim
            frames={GAROTA_FRAMES}
            interval={260}
            fontSize={6}
            color="var(--acid)"
            opacity={0.35}
            style={{ position: "absolute", right: "5%", bottom: "1rem" }}
          />
          <AsciiAnim
            frames={GATO_PRETO_FRAMES}
            interval={300}
            fontSize={6}
            opacity={0.22}
            style={{ position: "absolute", left: "44%", top: "-1rem" }}
          />
          <div className="rm-label">
            <span>{t("about_title")}</span>
            <span>{t("rm_tools_label")}</span>
          </div>
          <div className="rm-about">
            <h2 className="rm-statement">
              {t("about_text")}
            </h2>
            <div className="rm-tools">
              {tools.map((g) => (
                <div className="rm-tool-row" key={g.cat}>
                  <span>{g.cat}</span>
                  <span>{g.list}</span>
                </div>
              ))}
              <div className="rm-tool-row">
                <span>{t("about_nano_sub")}</span>
                <span>NANO — UFRJ</span>
              </div>
              <div className="rm-tool-row">
                <span>{t("about_laid_sub")}</span>
                <span>LAID — UFRJ</span>
              </div>
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
