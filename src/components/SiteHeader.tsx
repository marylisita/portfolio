"use client";
import Link from "next/link";
import LangToggle from "./LangToggle";
import { useT } from "@/i18n/LanguageContext";

/**
 * O HEADER CANÔNICO do site (pedido dela 2026-07-23: "padroniza o site todo,
 * deixa o header igual em todas as páginas"). Mesmo desenho do landing:
 * marca "✳ Maria Isabel Lisita" em PF Pixelscript + descritor, e no canto
 * direito status "disponível" + nav (trabalhos · sobre · contato) + idioma.
 *
 * Criado como componente NOVO enquanto o Codex trabalha no tree — as páginas
 * dele (ProjectShell, home, /work) ainda têm headers próprios; trocar por
 * este componente é o passo pós-Codex. Já usado em /colofao e na 404.
 *
 * Nav uniforme em QUALQUER página: trabalhos→/work, sobre→/#about,
 * contato→/#contact (na home os anchors resolvem na própria página).
 */
const styles = `
  .sh {
    position: fixed; top: 1rem; z-index: 1000;
    font-family: var(--font-body), sans-serif;
    font-size: .78rem; text-transform: lowercase; letter-spacing: .1em;
    color: var(--site-ink, #1C1B18);
  }
  .sh--l { left: 1.4rem; display: flex; flex-direction: column; gap: .12rem; line-height: 1.1; }
  .sh__mark {
    font-family: var(--font-pixelscript, cursive);
    font-weight: 400; font-size: 2.3rem; letter-spacing: .02em;
    line-height: 1; text-transform: none;
    color: inherit; text-decoration: none;
  }
  .sh__mark:focus-visible { outline: 2px dotted var(--site-ink, #1C1B18); outline-offset: 4px; }
  .sh__sub { font-size: .62rem; letter-spacing: .08em; opacity: .5; }
  .sh--r { right: 1.4rem; display: flex; align-items: center; gap: 1rem; }
  .sh__status {
    display: inline-flex; align-items: center; gap: .42rem;
    font-size: .68rem; letter-spacing: .06em; opacity: .82; white-space: nowrap;
  }
  .sh__dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--site-ink, #1C1B18);
    animation: sh-pulse 2.4s ease-out infinite;
  }
  @keyframes sh-pulse {
    0% { box-shadow: 0 0 0 0 rgba(28,27,24,.35); }
    70% { box-shadow: 0 0 0 6px rgba(28,27,24,0); }
    100% { box-shadow: 0 0 0 0 rgba(28,27,24,0); }
  }
  .sh__nav { display: inline-flex; align-items: center; gap: .7rem; }
  .sh__nav a {
    color: var(--site-ink, #1C1B18); text-decoration: none; opacity: .7;
    font-size: .72rem; letter-spacing: .04em;
    transition: opacity .2s ease;
  }
  .sh__nav a:hover, .sh__nav a:focus-visible { opacity: 1; text-decoration: underline; text-underline-offset: 3px; }
  .sh__nav a:focus-visible { outline: 2px dotted var(--site-ink, #1C1B18); outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) { .sh__dot { animation: none; } }
  @media (max-width: 860px) {
    .sh__status, .sh__nav, .sh__sub { display: none; }
  }
`;

export default function SiteHeader() {
  const { t, lang } = useT();
  const pt = lang !== "en";

  return (
    <>
      <style>{styles}</style>
      <span className="sh sh--l">
        <Link href="/" className="sh__mark">
          <span className="text-star" aria-hidden="true">✳︎</span> Maria Isabel Lisita
        </Link>
        <span className="sh__sub">
          {pt ? "designer & tecnóloga criativa" : "designer & creative technologist"}
        </span>
      </span>
      <span className="sh sh--r">
        <span className="sh__status">
          <span className="sh__dot" aria-hidden="true" />
          {pt ? "disponível p/ projetos" : "available for work"}
        </span>
        <nav className="sh__nav" aria-label={pt ? "navegação" : "navigation"}>
          <Link href="/work">{t("nav_work").toLowerCase()}</Link>
          <Link href="/#about">{t("rm_menu_about")}</Link>
          <Link href="/#contact">{t("rm_menu_contact")}</Link>
        </nav>
        <LangToggle />
      </span>
    </>
  );
}
