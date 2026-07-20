"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import EditorialFooter from "./EditorialFooter";
import LangToggle from "./LangToggle";
import { useT } from "@/i18n/LanguageContext";

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

  .pj-corner {
    position: fixed; top: 1rem; z-index: 1000;
    font-family: var(--font-body);
    font-size: .78rem; text-transform: lowercase; letter-spacing: .1em;
    color: var(--ink); text-decoration: none;
  }
  .pj-corner--l { left: 1.4rem; }
  .pj-corner--r { right: 1.4rem; display: flex; align-items: center; gap: .8rem; }

  .pj-cluster {
    position: fixed; right: 1.2rem; bottom: 1.2rem; z-index: 900;
    display: flex; flex-direction: column; align-items: flex-end; gap: .45rem;
  }
  .pj-tag {
    font-family: var(--font-body); font-size: .76rem;
    text-transform: lowercase; letter-spacing: .08em;
    background: #000000; color: #ffffff;
    border: 1.5px solid var(--acid);
    padding: .38rem .7rem; text-decoration: none;
    clip-path: polygon(0 8px, 8px 8px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 8px), 0 calc(100% - 8px));
    transition: background .25s ease, color .25s ease, border-color .25s ease;
  }
  .pj-tag:hover { background: var(--acid); color: #000000; border-color: var(--acid); }

  .pj-head {
    max-width: 1100px; margin: 0 auto;
    padding: 7.5rem 2rem 3.5rem;
    position: relative; z-index: 10;
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
    font-family: var(--font-grotesk); font-weight: 700;
    font-size: clamp(2.4rem, 7.5vw, 6.5rem);
    line-height: .9; letter-spacing: -0.04em;
    text-transform: lowercase;
    margin: 0 0 1.4rem;
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

  @media (max-width: 720px) {
    .pj-head { padding: 5.5rem 1.25rem 2.5rem; }
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
  const { t } = useT();

  return (
    <div className="pj">
      <style>{styles}</style>

      <Link href="/" className="pj-corner pj-corner--l hover-trigger">mary l. ✳</Link>
      <span className="pj-corner pj-corner--r"><LangToggle /></span>

      {/* molhinho de navegação fixo */}
      <nav className="pj-cluster" aria-label="menu">
        <Link className="pj-tag hover-trigger" href="/">[ {t("pj_home")} ]</Link>
        <Link className="pj-tag hover-trigger" href="/work">[ {t("nav_work").toLowerCase()} ]</Link>
        <a className="pj-tag hover-trigger" href="#contact">[ {t("rm_menu_contact")} ]</a>
      </nav>

      <header className="pj-head">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href="/work" className="pj-back hover-trigger">← {t("pj_back")}</Link>
          <h1 className="pj-title">{title}</h1>
          <p className="pj-desc">{desc}</p>
        </motion.div>

        {meta.length > 0 && (
          <motion.div
            className="pj-meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {meta.map((m) => (
              <div key={m.label}>
                <div className="pj-meta__label">{m.label}</div>
                <div className="pj-meta__value">{m.value}</div>
              </div>
            ))}
          </motion.div>
        )}
      </header>

      <main style={{ position: "relative", zIndex: 10 }}>{children}</main>

      <div id="contact">
        <EditorialFooter />
      </div>
    </div>
  );
}
