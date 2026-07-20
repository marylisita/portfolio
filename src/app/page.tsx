"use client";
import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import PlaygroundHero from "@/components/PlaygroundHero";
import EditorialIndex, { type IndexItem } from "@/components/EditorialIndex";
import Marquee from "@/components/Marquee";
import AsciiAnim from "@/components/AsciiAnim";
import { GATO_FRAMES, GAROTA_FRAMES, GATO_PRETO_FRAMES } from "@/components/asciiArt";
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

  /* --- nav --- */
  .rm-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    display: flex; align-items: center; justify-content: space-between;
    gap: 1rem;
    padding: .85rem 2rem;
    background: var(--paper);
    border-bottom: 1px solid var(--ink);
    font-family: var(--font-mono);
    font-size: .7rem; text-transform: uppercase; letter-spacing: .16em;
  }
  .rm-nav__links { display: flex; gap: 1.5rem; align-items: center; list-style: none; }
  .rm-nav a { position: relative; }
  .rm-nav a::after {
    content: ""; position: absolute; left: 0; bottom: -3px;
    width: 100%; height: 2px; background: var(--ink);
    transform: scaleX(0); transform-origin: right;
    transition: transform .35s cubic-bezier(.16,1,.3,1);
  }
  .rm-nav a:hover::after { transform: scaleX(1); transform-origin: left; }

  /* --- seções --- */
  .rm-sec { padding: 6rem 2rem; }
  .rm-label {
    font-family: var(--font-mono); font-size: .7rem;
    text-transform: uppercase; letter-spacing: .16em;
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
    font-family: var(--font-mono); font-size: .72rem;
    text-transform: uppercase; letter-spacing: .1em;
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
`;

export default function Home() {
  const { t } = useT();

  // o índice inclina levemente com a velocidade do scroll — reage ao fluxo,
  // nunca o interrompe (ela odeia scroll travado).
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const skewRaw = useTransform(vel, [-1400, 1400], [-2, 2], { clamp: true });
  const skew = useSpring(skewRaw, { stiffness: 220, damping: 38, mass: 0.6 });

  const flat = (s: string) => s.replace(/\n/g, " ");

  const projects: IndexItem[] = [
    {
      num: "01",
      title: "isadora ruppert press kit",
      tags: `${t("p01_tag1")} / ${t("p01_tag2")}`,
      href: "/work/isadora",
      img: "/img/ISADORA CAPA-THUMBNAIL.webp",
    },
    {
      num: "02",
      title: flat(t("p02_title")),
      tags: `${t("p02_tag1")} / ${t("p02_tag2")}`,
      href: "/work/magazine",
      img: "/img/helvetica/9.jpg",
    },
    {
      num: "03",
      title: "genlab",
      tags: `${t("p03_tag1")} / ${t("p03_tag2")}`,
      href: "/work/genlab",
      img: "/img/genlab.png",
    },
    {
      num: "04",
      title: flat(t("p04_title")),
      tags: `${t("p04_tag1")} / ${t("p04_tag2")}`,
      href: "/work/ebat",
      img: "/img/ebat/manual-capa.jpg",
    },
  ];

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

      <nav className="rm-nav">
        <span>mary l.</span>
        <ul className="rm-nav__links">
          <li><a href="/work" className="hover-trigger">{t("nav_work")}</a></li>
          <li><a href="/experiments" className="hover-trigger">{t("nav_experiments")}</a></li>
          <li><a href="#contact" className="hover-trigger">{t("nav_cta")}</a></li>
          <li><LangToggle /></li>
        </ul>
      </nav>

      <main>
        <PlaygroundHero
          lines={[t("hero_title_1"), t("hero_title_highlight")]}
          location={t("hero_location")}
          sub={t("hero_sub_1")}
          subHighlight={t("hero_sub_highlight")}
          scrollLabel={t("rm_scroll")}
          welcome={t("rm_welcome")}
        />

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
          <motion.div style={{ skewY: skew, transformOrigin: "center" }}>
            <EditorialIndex items={projects} />
          </motion.div>
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
