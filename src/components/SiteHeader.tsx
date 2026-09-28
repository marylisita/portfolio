"use client";

import Link from "next/link";
import LangToggle from "./LangToggle";
import ScrambleText from "./ScrambleText";
import UnderlineButton from "./UnderlineButton";
import { useT } from "@/i18n/LanguageContext";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useNavTucked } from "./useScrollDirection";

const styles = `
  .sh {
    position: fixed; top: clamp(1.4rem, 3.2vh, 2.4rem); z-index: 1000;
    font-family: var(--font-body), sans-serif;
    font-size: var(--type-micro); text-transform: lowercase; letter-spacing: .1em;
    color: var(--site-ink, #1C1B18);
    pointer-events: auto;
    transition: opacity .3s var(--ease-out, ease), translate .38s var(--ease-out, ease);
  }
  /* Descendo, a assinatura sai da frente do texto; subindo, ela volta. Antes
     ela acompanhava a rolagem inteira e cruzava imagem e paragrafo dos cases. */
  .sh[data-tucked="true"] {
    opacity: 0;
    translate: 0 -.85rem;
    pointer-events: none;
  }
  .sh--l { left: clamp(1.5rem, 5vw, 5.5rem); display: flex; flex-direction: column; gap: .12rem; line-height: 1.1; }
  .sh__mark {
    font-family: var(--font-pixelscript, cursive);
    font-weight: 400; font-size: 2.3rem; letter-spacing: 0;
    line-height: 1; text-transform: none;
    font-kerning: normal;
    font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
    text-rendering: optimizeLegibility;
    color: inherit; text-decoration: none;
  }
  .sh__mark .text-star {
    display: inline-block;
    transform-origin: 50% 52%;
    transition: color .25s ease;
  }
  .sh__name {
    position: relative;
    white-space: nowrap;
  }
  .sh__name-word { display: inline; }
  .sh__name-word--isabel { letter-spacing: -.035em; }
  /* Estas duas decoracoes de hover do wordmark liam var(--green), token do
     sistema visual anterior que saiu na limpeza do globals.css -- passaram a
     cair no teal do fallback. Agora seguem o rosa da casa. */
  .sh__name::after {
    content: "✦  ·  ♡  ⋆";
    position: absolute;
    left: 52%;
    top: -.42rem;
    font-family: var(--font-mono), monospace;
    font-size: .42em;
    font-weight: 400;
    letter-spacing: .08em;
    color: var(--site-accent-hot, var(--acid));
    opacity: 0;
    transform: translate(-50%, .35rem) scale(.82);
    pointer-events: none;
  }
  .sh__mark:hover .text-star,
  .sh__mark:focus-visible .text-star {
    color: var(--site-accent-hot, var(--acid));
    animation: sh-star-dance .72s cubic-bezier(.16, 1, .3, 1) both;
  }
  .sh__mark:hover .sh__name::after,
  .sh__mark:focus-visible .sh__name::after {
    animation: sh-symbols-float .78s cubic-bezier(.16, 1, .3, 1) both;
  }
  .sh__mark:focus-visible { outline: 2px dotted var(--site-ink, #1C1B18); outline-offset: 4px; }
  /* No heroi a assinatura faz parte da composicao e fica grande. Passado o
     heroi ela vira chrome: encolhe e ganha o halo de papel (o mesmo
     tratamento que o celular ja usava) para nao se misturar com o titulo da
     secao que passa por baixo -- "trabalhos selecionados" era atropelado por
     uma faixa de texto de quase 500px de largura. */
  @media (min-width: 861px) {
    .sh__mark { transition: font-size .3s var(--ease-out, ease), padding .3s var(--ease-out, ease); }
    .sh--l[data-floating="true"] .sh__mark {
      font-size: 1.35rem;
      padding: .2rem .5rem;
      /* 96%: o titulo da secao passa POR TRAS da etiqueta sem vazar. No
         celular o halo e 88% porque la ele cobre corpo de texto, nao titulo. */
      background: color-mix(in srgb, var(--site-paper, #ede7da) 96%, transparent);
      box-shadow: 0 0 0 .3rem color-mix(in srgb, var(--site-paper, #ede7da) 96%, transparent);
      -webkit-backdrop-filter: blur(6px);
      backdrop-filter: blur(6px);
    }
  }
  /* No topo a navegacao e so texto sobre o papel do heroi -- nada de moldura.
     Passado o heroi ela vira chrome e ganha a pilula de vidro: o conteudo
     rola POR BAIXO dela, entao o blur e a saturacao seguram a leitura sem
     fechar o topo com uma barra opaca. Mesmo limiar da assinatura (240px). */
  .sh--r {
    right: clamp(1.5rem, 5vw, 5.5rem);
    display: flex; align-items: center; gap: 1rem;
    padding: .45rem .6rem .45rem .85rem;
    border: 1px solid transparent;
    border-radius: 999px;
    background: transparent;
    transition:
      opacity .3s var(--ease-out, ease),
      translate .38s var(--ease-out, ease),
      background-color .32s var(--ease-out, ease),
      border-color .32s var(--ease-out, ease),
      box-shadow .32s var(--ease-out, ease),
      -webkit-backdrop-filter .32s var(--ease-out, ease),
      backdrop-filter .32s var(--ease-out, ease);
  }
  .sh--r[data-floating="true"] {
    background: color-mix(in srgb, var(--site-paper, #ede7da) 55%, transparent);
    /* A borda clara em cima e a sombra difusa embaixo dao a espessura do
       vidro; sem elas a pilula some em fundos claros. */
    border-color: color-mix(in srgb, var(--site-paper, #ede7da) 80%, transparent);
    box-shadow:
      0 .5rem 1.5rem -.6rem color-mix(in srgb, var(--site-ink, #1C1B18) 18%, transparent),
      inset 0 1px 0 color-mix(in srgb, #fff 55%, transparent);
    /* saturate compensa o desbotamento que o blur causa no que passa atras. */
    -webkit-backdrop-filter: blur(14px) saturate(1.6);
    backdrop-filter: blur(14px) saturate(1.6);
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
  @keyframes sh-star-dance {
    0% { transform: rotate(0deg) scale(1); }
    42% { transform: rotate(110deg) scale(1.28); }
    72% { transform: rotate(78deg) scale(.94); }
    100% { transform: rotate(90deg) scale(1); }
  }
  @keyframes sh-symbols-float {
    0% { opacity: 0; transform: translate(-50%, .35rem) scale(.82); }
    34% { opacity: .9; }
    72% { opacity: .68; }
    100% { opacity: 0; transform: translate(-50%, -.8rem) scale(1.08); }
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
    .sh__dot::after,
    .sh__mark .text-star,
    .sh__name::after { animation: none; }
    .sh__mark { transition: none; }
    .sh, .sh--r { transition: opacity .2s linear; }
    .sh[data-tucked="true"] { translate: none; }
  }
  @media (max-width: 860px) {
    .sh--r,
    .sh--r[data-floating="true"] {
      padding: 0;
      border-color: transparent;
      background: transparent;
      box-shadow: none;
      -webkit-backdrop-filter: none;
      backdrop-filter: none;
    }
    .sh__status, .sh__nav, .sh--r > .lang-toggle { display: none !important; }
    /* O botao e o unico chrome do celular, entao ele carrega o vidro sozinho
       -- e sempre, porque o conteudo passa por baixo dele desde o topo. */
    .sh__menu-toggle {
      display: inline-flex;
      background: color-mix(in srgb, var(--site-paper, #ede7da) 62%, transparent);
      box-shadow: 0 .4rem 1.1rem -.5rem color-mix(in srgb, var(--site-ink, #1C1B18) 22%, transparent);
      -webkit-backdrop-filter: blur(12px) saturate(1.6);
      backdrop-filter: blur(12px) saturate(1.6);
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
    .sh--l { max-width: calc(100vw - 8rem); }
    .sh__mark { font-size: clamp(1.15rem, 5.6vw, 1.55rem); line-height: .98; }
    /* Em tela estreita o conteúdo passa por baixo do cabeçalho fixo e a
       assinatura ficava ilegível sobre o texto. O halo de papel é o mesmo
       idioma já usado em .pj-tag e .lang-toggle — resolve a leitura sem
       fechar o topo da página com uma barra sólida. */
    .sh__mark {
      padding: .2rem .45rem;
      background: color-mix(in srgb, var(--site-paper, #ede7da) 88%, transparent);
      box-shadow: 0 0 0 .3rem color-mix(in srgb, var(--site-paper, #ede7da) 88%, transparent);
      -webkit-backdrop-filter: blur(5px);
      backdrop-filter: blur(5px);
    }
  }
`;

export default function SiteHeader() {
  const { t, lang } = useT();
  const pt = lang !== "en";
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Com o menu aberto a barra fica: some no meio de um toque seria pior.
  // .rm-label e o rotulo de secao do site ("Trabalhos Selecionados", "Sobre"):
  // quando um deles entra na faixa da assinatura, ela recolhe mesmo subindo.
  const markRef = useRef<HTMLSpanElement>(null);
  const tucked = useNavTucked(!mobileMenuOpen, markRef, ".rm-label");
  // Mesmo limiar do useNavTucked: ate 240px a assinatura ainda e composicao.
  const [floating, setFloating] = useState(false);
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
  ];

  return (
    <>
      <style>{styles}</style>
      <span
        ref={markRef}
        className="sh sh--l"
        data-tucked={tucked ? "true" : "false"}
        data-floating={floating ? "true" : "false"}
      >
        <Link href="/" className="sh__mark">
          <span className="text-star" aria-hidden="true">✳︎</span>{" "}
          <span className="sh__name" aria-label="Maria Isabel Lisita">
            <span className="sh__name-word">Maria</span>{" "}
            <span className="sh__name-word sh__name-word--isabel">Isabel</span>{" "}
            <span className="sh__name-word">Lisita</span>
          </span>
        </Link>
      </span>
      <span
        className="sh sh--r"
        data-tucked={tucked ? "true" : "false"}
        data-floating={floating ? "true" : "false"}
      >
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
            <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
              [ {link.label} ]
            </Link>
          ))}
          <LangToggle />
        </nav>
      </span>
    </>
  );
}
