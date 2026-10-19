"use client";

import Link from "next/link";
import LangToggle from "./LangToggle";
import ScrambleText from "./ScrambleText";
import { sparkBurst } from "./sparkBurst";
import MonogramMark from "./MonogramMark";
import UnderlineButton from "./UnderlineButton";
import { useT } from "@/i18n/LanguageContext";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FocusEvent, type PointerEvent } from "react";

const styles = `
  /* O vidro agora e uma faixa unica que atravessa a tela, e nao duas pilulas.
     Em pilula o nome batia na borda direita no celular e transbordava; dentro
     da faixa ele vive no fluxo, entre os recuos, e nao tem como escapar.
     Os valores ficam aqui como variaveis para o ProjectShell poder inverter a
     faixa nas secoes escuras mexendo so nelas. */
  .sh-bar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: clamp(.6rem, 2vw, 2rem);
    padding: clamp(.7rem, 2.2vh, 1.35rem) clamp(1rem, 5vw, 5.5rem);
    border-bottom: 1px solid transparent;
    background: transparent;
    /* A faixa cobre a largura inteira: se ela capturasse ponteiro, engoliria
       cliques do conteudo que passa por baixo. So os filhos recebem. */
    pointer-events: none;
    --sh-glass-bg: color-mix(in srgb, var(--site-paper, #ede7da) 55%, transparent);
    --sh-glass-edge: color-mix(in srgb, var(--site-paper, #ede7da) 80%, transparent);
    --sh-glass-shadow: 0 .5rem 1.5rem -.7rem color-mix(in srgb, var(--site-ink, #1C1B18) 20%, transparent);
    --sh-glass-blur: blur(14px) saturate(1.6);
    --sh-glass-fade: .32s var(--ease-out, ease);
    transition:
      background-color var(--sh-glass-fade),
      border-color var(--sh-glass-fade),
      box-shadow var(--sh-glass-fade),
      -webkit-backdrop-filter var(--sh-glass-fade),
      backdrop-filter var(--sh-glass-fade);
  }
  .sh-bar > * { pointer-events: auto; }
  /* No heroi a faixa e invisivel: o menu e so texto sobre o papel da abertura.
     Passados os 240px ela materializa e o conteudo passa por tras, borrado. */
  .sh-bar[data-floating="true"] {
    background: var(--sh-glass-bg);
    border-bottom-color: var(--sh-glass-edge);
    box-shadow: var(--sh-glass-shadow);
    -webkit-backdrop-filter: var(--sh-glass-blur);
    backdrop-filter: var(--sh-glass-blur);
  }
  .sh {
    font-family: var(--font-body), sans-serif;
    font-size: var(--type-micro); text-transform: lowercase; letter-spacing: .1em;
    color: var(--site-ink, #1C1B18);
  }
  .sh--l { display: flex; flex-direction: column; gap: .12rem; line-height: 1.1; min-width: 0; }
  .sh__mark {
    font-family: var(--font-pixelscript, cursive);
    /* nowrap no bloco inteiro: dentro da faixa a assinatura divide a linha com
       a navegacao, e sem isto o asterisco quebrava sozinho para cima do nome.
       O tamanho de heroi tambem acompanha a largura -- em 2.3rem fixos o nome
       tem 476px e, somado a navegacao, estourava a linha perto dos 900px. */
    white-space: nowrap;
    font-weight: 400; font-size: clamp(1.6rem, 2.6vw, 2.3rem); letter-spacing: 0;
    line-height: 1; text-transform: none;
    font-kerning: normal;
    font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
    text-rendering: optimizeLegibility;
    color: inherit; text-decoration: none;
  }
  /* A marca ML no lugar do antigo asterisco. É também onde a tela de
     carregamento pousa a logo; enquanto ela toca, a marca fica escondida. */
  .sh__logo {
    height: 1.18em;
    width: auto;
    margin-right: .18em;
    vertical-align: -.2em;
    transform-origin: 50% 60%;
    transition: transform .2s var(--ease-out, ease);
  }
  html[data-intro="play"] .sh__logo { visibility: hidden; }
  .sh__name {
    position: relative;
    white-space: nowrap;
  }
  .sh__name-word { display: inline; }
  .sh__name-word--isabel { letter-spacing: -.035em; }
  /* A explosão do hover: faíscas ASCII que saem de pontos diferentes do nome
     e caem em arco. Antes era uma fileira fixa ("✦ · ♡ ⋆") que subia reta e
     sumia pela borda de cima da janela. O movimento e a forma de cada faísca
     ficam em sparkBurst.ts, compartilhado com a logo. */
  .sh__burst {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .sh__mark:hover .sh__logo,
  .sh__mark:focus-visible .sh__logo { transform: rotate(-6deg) translateY(-1px); }
  .sh__mark:focus-visible { outline: 2px dotted var(--site-ink, #1C1B18); outline-offset: 4px; }
  /* No heroi a assinatura faz parte da composicao e fica grande; passada a
     abertura ela vira chrome e encolhe. O fundo saiu daqui: quem carrega o
     vidro agora e a faixa. */
  .sh__mark { transition: font-size .3s var(--ease-out, ease); }
  @media (min-width: 861px) {
    .sh-bar[data-floating="true"] .sh__mark { font-size: 1.35rem; }
  }
  /* position: relative ancora o menu suspenso do celular, que e absoluto. */
  .sh--r {
    position: relative;
    display: flex; align-items: center; gap: 1rem;
    flex: 0 0 auto;
  }
  .sh__status {
    display: inline-flex; align-items: center; gap: .42rem;
    font-size: var(--type-micro); letter-spacing: .06em; opacity: .82; white-space: nowrap;
  }
  .sh__dot {
    position: relative;
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--selection-bg, #843f3a);
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
  .sh__menu-toggle, .sh__mobile-menu { display: none; }
  .sh__menu-toggle {
    min-width: var(--tap-min); min-height: var(--tap-min);
    align-items: center; justify-content: center;
    border: 1px solid currentColor;
    border-radius: 50%;
    color: inherit;
    cursor: pointer;
  }
  .sh__menu-icon {
    position: relative;
    display: block;
    width: 16px;
    height: 1px;
    background: currentColor;
    box-shadow: 0 -5px currentColor, 0 5px currentColor;
    transition: background-color .2s ease, box-shadow .2s ease;
  }
  .sh__menu-icon::before,
  .sh__menu-icon::after {
    content: "";
    position: absolute;
    inset: 0;
    background: currentColor;
    opacity: 0;
    transition: transform .2s ease, opacity .2s ease;
  }
  .sh__menu-toggle[data-open="true"] .sh__menu-icon {
    background: transparent;
    box-shadow: none;
  }
  .sh__menu-toggle[data-open="true"] .sh__menu-icon::before,
  .sh__menu-toggle[data-open="true"] .sh__menu-icon::after { opacity: 1; }
  .sh__menu-toggle[data-open="true"] .sh__menu-icon::before { transform: rotate(45deg); }
  .sh__menu-toggle[data-open="true"] .sh__menu-icon::after { transform: rotate(-45deg); }
  .sh__menu-toggle:focus-visible,
  .sh__mobile-menu a:focus-visible { outline: 2px dotted currentColor; outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) {
    .sh__dot::after { animation: none; }
    .sh__logo { transition: none; }
    /* O vidro continua; o que cai e so a coreografia da entrada. */
    .sh__mark, .sh-bar { transition: none; }
  }
  @media (max-width: 860px) {
    .sh__status, .sh__nav, .sh--r > .lang-toggle { display: none !important; }
    .sh__menu-toggle { display: inline-flex; }
    /* No celular a faixa vale desde o topo: nao existe heroi em que a
       assinatura fique sobre papel limpo, o conteudo passa por baixo dela
       desde o primeiro pixel. */
    .sh-bar {
      background: var(--sh-glass-bg);
      border-bottom-color: var(--sh-glass-edge);
      box-shadow: var(--sh-glass-shadow);
      -webkit-backdrop-filter: var(--sh-glass-blur);
      backdrop-filter: var(--sh-glass-blur);
    }
    .sh__mobile-menu {
      position: absolute;
      top: calc(100% + .75rem);
      right: 0;
      width: min(17.5rem, calc(100vw - 2.5rem));
      padding: .55rem;
      background: var(--site-paper, #ede7da);
      border: 1px solid color-mix(in srgb, var(--site-ink, #1C1B18) 30%, transparent);
      box-shadow: 5px 5px 0 color-mix(in srgb, var(--site-ink, #1C1B18) 16%, transparent);
    }
    .sh__mobile-menu[data-open="true"] { display: grid; gap: .2rem; }
    .sh__mobile-menu a {
      display: flex;
      align-items: center;
      min-height: var(--tap-min);
      padding: .45rem .6rem;
      font-size: var(--type-label);
      font-weight: 600;
      letter-spacing: .04em;
      text-decoration: none;
    }
    .sh__mobile-menu a:hover { background: color-mix(in srgb, var(--site-ink, #1C1B18) 8%, transparent); }
    .sh__mobile-menu .lang-toggle {
      display: inline-grid !important;
      justify-self: start;
      margin: .25rem .15rem .1rem;
      color: var(--site-ink, #1C1B18) !important;
    }
    /* min-width: 0 deixa o flex encolher a assinatura; sem isso ela empurra o
       botao e volta a estourar a borda. O tamanho tambem cai um degrau, para
       o nome inteiro caber ao lado do botao numa tela de 360px. */
    .sh--l { min-width: 0; }
    .sh__mark { font-size: clamp(.95rem, 4.6vw, 1.35rem); line-height: .98; }
  }
`;

export default function SiteHeader() {
  const { t, lang } = useT();
  const pt = lang !== "en";
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // O menu nao recolhe mais ao descer: pedido dela. O que resolvia a leitura
  // era tirar a barra da frente do texto, e agora quem resolve e o vidro --
  // o conteudo passa por tras dela borrado, entao nao ha motivo para sumir.
  // Ate 240px a assinatura ainda e composicao do heroi; dali em diante e chrome.
  const [floating, setFloating] = useState(false);
  const burstRef = useRef<HTMLSpanElement>(null);
  const lastBurstRef = useRef(0);
  /* Uma explosão por entrada do ponteiro, com folga de 450ms: passar o mouse
     indo e voltando em cima do nome não empilha dezenas de faíscas. Toque não
     dispara (o toque já navega para a home) e movimento reduzido também não. */
  const fireBurst = () => {
    const host = burstRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.dataset.motion === "lite") return;
    const now = performance.now();
    if (now - lastBurstRef.current < 450) return;
    lastBurstRef.current = now;
    sparkBurst(host);
  };
  const onMarkPointerEnter = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "touch") fireBurst();
  };
  const onMarkFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    if (event.currentTarget.matches(":focus-visible")) fireBurst();
  };
  useEffect(() => {
    const sync = () => setFloating(window.scrollY > 240);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);
  const mobileLinks = [
    { href: isHome ? "/work" : "/", label: isHome ? t("nav_work").toLowerCase() : t("pj_home").toLowerCase() },
    { href: "/#about", label: t("rm_menu_about") },
    { href: "/#contact", label: t("rm_menu_contact") },
    { href: "/Curriculo_Maria_Isabel_Lisita.pdf", label: pt ? "currículo ↗" : "resume ↗", external: true },
  ];

  return (
    <>
      <style>{styles}</style>
      <header className="sh-bar" data-floating={floating ? "true" : "false"}>
      <span className="sh sh--l">
        <Link
          href="/"
          className="sh__mark"
          onPointerEnter={onMarkPointerEnter}
          onFocus={onMarkFocus}
        >
          <MonogramMark className="sh__logo" />
          <span className="sh__name" aria-label="Maria Isabel Lisita">
            <span className="sh__name-word">Maria</span>{" "}
            <span className="sh__name-word sh__name-word--isabel">Isabel</span>{" "}
            <span className="sh__name-word">Lisita</span>
            {/* Vazio de propósito: as faíscas entram aqui pelo DOM e saem
                sozinhas; o React não tem filhos para reconciliar neste nó. */}
            <span ref={burstRef} className="sh__burst" aria-hidden="true" />
          </span>
        </Link>
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
          <UnderlineButton
            href="/Curriculo_Maria_Isabel_Lisita.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            {pt ? "currículo" : "resume"}
          </UnderlineButton>
        </nav>
        <LangToggle />
        <button
          type="button"
          className="sh__menu-toggle"
          data-open={mobileMenuOpen}
          aria-label={mobileMenuOpen ? (pt ? "Fechar menu" : "Close menu") : (pt ? "Abrir menu" : "Open menu")}
          aria-controls="mobile-site-menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span className="sh__menu-icon" aria-hidden="true" />
        </button>
        <nav
          id="mobile-site-menu"
          className="sh__mobile-menu"
          data-open={mobileMenuOpen}
          aria-label={pt ? "Navegação móvel" : "Mobile navigation"}
        >
          {mobileLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              onClick={() => setMobileMenuOpen(false)}
            >
              [ {link.label} ]
            </Link>
          ))}
          <LangToggle />
        </nav>
      </span>
      </header>
    </>
  );
}
