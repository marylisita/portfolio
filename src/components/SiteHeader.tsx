"use client";

import Link from "next/link";
import LangToggle from "./LangToggle";
import ScrambleText from "./ScrambleText";
import UnderlineButton from "./UnderlineButton";
import { useT } from "@/i18n/LanguageContext";
import { usePathname } from "next/navigation";

const styles = `
  .sh {
    position: fixed; top: clamp(1.4rem, 3.2vh, 2.4rem); z-index: 1000;
    font-family: var(--font-body), sans-serif;
    font-size: var(--type-micro); text-transform: lowercase; letter-spacing: .1em;
    color: var(--site-ink, #1C1B18);
    pointer-events: auto;
  }
  .sh--l { left: clamp(1.5rem, 5vw, 5.5rem); display: flex; flex-direction: column; gap: .12rem; line-height: 1.1; }
  .sh__mark {
    font-family: var(--font-pixelscript, cursive);
    font-weight: 400; font-size: 2.3rem; letter-spacing: .02em;
    line-height: 1; text-transform: none;
    color: inherit; text-decoration: none;
  }
  .sh__mark:focus-visible { outline: 2px dotted var(--site-ink, #1C1B18); outline-offset: 4px; }
  .sh__sub { font-size: var(--type-micro); letter-spacing: .08em; opacity: .62; color: var(--site-ink, #1C1B18); }
  .sh--r { right: clamp(1.5rem, 5vw, 5.5rem); display: flex; align-items: center; gap: 1rem; }
  .sh__status {
    display: inline-flex; align-items: center; gap: .42rem;
    font-size: var(--type-micro); letter-spacing: .06em; opacity: .82; white-space: nowrap;
  }
  .sh__dot {
    position: relative;
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--site-ink, #1C1B18);
  }
  .sh__dot::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: currentColor;
    opacity: .35;
    animation: sh-pulse 2.4s ease-out infinite;
    will-change: transform, opacity;
  }
  @keyframes sh-pulse {
    0% { transform: scale(1); opacity: .35; }
    70%, 100% { transform: scale(2.7); opacity: 0; }
  }
  .sh__nav { display: inline-flex; align-items: center; gap: .7rem; }
  .sh__nav a { font-size: var(--type-micro); letter-spacing: .04em; }
  @media (prefers-reduced-motion: reduce) { .sh__dot::after { animation: none; opacity: 0; } }
  @media (max-width: 860px) {
    .sh__status, .sh__nav, .sh__sub { display: none; }
    .sh--l { max-width: calc(100vw - 8rem); }
    .sh__mark { font-size: clamp(1.15rem, 5.6vw, 1.55rem); line-height: .98; }
  }
`;

export default function SiteHeader() {
  const { t, lang } = useT();
  const pt = lang !== "en";
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "";

  return (
    <>
      <style>{styles}</style>
      <span className="sh sh--l">
        <Link href="/" className="sh__mark">
          <span className="text-star" aria-hidden="true">✳︎</span>{" "}
          <ScrambleText text="Maria Isabel Lisita" />
        </Link>
        <span className="sh__sub">
          <ScrambleText
            text={pt ? "designer & tecnóloga criativa" : "designer & creative technologist"}
          />
        </span>
      </span>
      <span className="sh sh--r">
        <span className="sh__status">
          <span className="sh__dot" aria-hidden="true" />
          <ScrambleText
            text={pt ? "disponível p/ projetos" : "available for work"}
          />
        </span>
        <nav className="sh__nav" aria-label={pt ? "navegação" : "navigation"}>
          {isHome ? (
            <UnderlineButton href="/work">
              {t("nav_work").toLowerCase()}
            </UnderlineButton>
          ) : (
            <UnderlineButton href="/">
              {t("pj_home").toLowerCase()}
            </UnderlineButton>
          )}
          <UnderlineButton href="/#about">
            {t("rm_menu_about")}
          </UnderlineButton>
          <UnderlineButton href="/#contact">
            {t("rm_menu_contact")}
          </UnderlineButton>
        </nav>
        <LangToggle />
      </span>
    </>
  );
}
