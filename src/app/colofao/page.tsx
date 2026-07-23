"use client";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { useT } from "@/i18n/LanguageContext";

/**
 * Colofão — a página de "edição" do site, como nos livros finos (ideia
 * aprovada por ela, 2026-07-23): tipografia com espécimes reais, técnicas,
 * tiragem. AUTOCONTIDA de propósito (criada com o Codex trabalhando no
 * tree): não importa componentes que ele esteja editando; o link no rodapé
 * entra depois que ele commitar.
 */

const styles = `
  .cf {
    min-height: 100svh;
    background: var(--site-paper, #EDE7DA);
    color: var(--site-ink, #1C1B18);
    padding: 7rem 1.5rem 5rem;
  }
  .cf__miolo { max-width: 640px; margin: 0 auto; }
  .cf__voltar {
    font-family: var(--font-body), sans-serif;
    font-size: .72rem;
    letter-spacing: .1em;
    text-transform: lowercase;
    color: var(--site-ink);
    text-decoration: none;
    opacity: .6;
  }
  .cf__voltar:hover { opacity: 1; text-decoration: underline; text-underline-offset: 3px; }
  .cf__voltar:focus-visible { outline: 2px dotted var(--site-ink); outline-offset: 4px; }
  .cf__titulo {
    font-family: var(--font-pixelscript), var(--font-hand), cursive;
    font-weight: 400;
    font-size: clamp(2.6rem, 8vw, 4.2rem);
    line-height: 1.05;
    margin: 1.6rem 0 .6rem;
  }
  .cf__abre {
    font-family: var(--font-head), serif;
    font-style: italic;
    font-size: 1.05rem;
    line-height: 1.55;
    opacity: .8;
    margin: 0 0 3rem;
    max-width: 46ch;
  }
  .cf__fio {
    font-family: var(--font-braille), monospace;
    font-size: .64rem;
    letter-spacing: 0;
    opacity: .5;
    overflow: hidden;
    white-space: nowrap;
    margin: 2.6rem 0 1.2rem;
    user-select: none;
  }
  .cf__rotulo {
    font-family: var(--font-body), sans-serif;
    font-size: .72rem;
    text-transform: lowercase;
    letter-spacing: .14em;
    opacity: .55;
    margin: 0 0 1.2rem;
  }
  .cf__linha {
    display: grid;
    grid-template-columns: minmax(7rem, .4fr) 1fr;
    gap: 1.2rem;
    align-items: baseline;
    padding: .7rem 0;
  }
  .cf__meta {
    font-family: var(--font-body), sans-serif;
    font-size: .72rem;
    letter-spacing: .08em;
    text-transform: lowercase;
    opacity: .55;
  }
  .cf__valor {
    font-family: var(--font-body), sans-serif;
    font-size: .92rem;
    line-height: 1.55;
  }
  /* espécimes: cada fonte se apresenta na própria voz */
  .cf__esp { font-size: 1.25rem; line-height: 1.3; }
  .cf__esp--pixelscript { font-family: var(--font-pixelscript), cursive; font-size: 1.5rem; }
  .cf__esp--serif { font-family: var(--font-head), serif; font-style: italic; }
  .cf__esp--body { font-family: var(--font-body), sans-serif; }
  .cf__esp--pixel { font-family: var(--font-subtitle), monospace; font-weight: 700; font-size: 1.05rem; }
  .cf__esp--hand { font-family: var(--font-hand), cursive; font-size: 1.45rem; }
  .cf__esp--braille { font-family: var(--font-braille), monospace; font-size: 1rem; letter-spacing: 0; }
  .cf__fecho {
    margin-top: 3.4rem;
    text-align: center;
    font-family: var(--font-hand), cursive;
    font-size: 1.25rem;
    opacity: .8;
  }
  .cf__estrelas {
    text-align: center;
    font-family: var(--font-mono), monospace;
    font-size: .72rem;
    letter-spacing: .08em;
    opacity: .45;
    margin-top: .8rem;
    user-select: none;
  }
  @media (max-width: 560px) {
    .cf { padding: 5rem 1.25rem 4rem; }
    .cf__linha { grid-template-columns: 1fr; gap: .25rem; }
  }
`;

const FIO = "⠂⠄⠄⠂⠁⠁⠂ ".repeat(40);

export default function Colofao() {
  const { lang } = useT();
  const pt = lang !== "en";

  const edicao: [string, string][] = pt
    ? [
        ["edição", "1ª edição — portfólio 2026"],
        ["impresso em", "rio de janeiro, brasil"],
        ["tiragem", "ilimitada, uma por visita"],
        ["papel", "bege quente #EDE7DA · tinta #1C1B18"],
      ]
    : [
        ["edition", "1st edition — portfolio 2026"],
        ["printed in", "rio de janeiro, brazil"],
        ["print run", "unlimited, one per visit"],
        ["paper", "warm beige #EDE7DA · ink #1C1B18"],
      ];

  const tipos: { meta: string; classe: string; amostra: string }[] = [
    { meta: "display", classe: "cf__esp cf__esp--pixelscript", amostra: "PF Pixelscript" },
    { meta: pt ? "editorial" : "editorial", classe: "cf__esp cf__esp--serif", amostra: "ITC Garamond Condensed" },
    { meta: pt ? "texto" : "body", classe: "cf__esp cf__esp--body", amostra: "Aeonik" },
    { meta: pt ? "números & etiquetas" : "numbers & labels", classe: "cf__esp cf__esp--pixel", amostra: "OffBit DotBold" },
    { meta: pt ? "manuscrita" : "handwriting", classe: "cf__esp cf__esp--hand", amostra: "Seratonin" },
    { meta: pt ? "gravuras" : "engravings", classe: "cf__esp cf__esp--braille", amostra: "⠎⠑⠗⠁⠋⠊⠝⠁ ⠃⠗⠁⠊⠇⠇⠑" },
  ];

  const tecnicas: [string, string][] = pt
    ? [
        ["estrutura", "Next.js · React"],
        ["movimento", "Framer Motion · Lenis"],
        ["processo", "desenvolvimento web assistido por IA"],
        ["ornamentos", "braille, unicode e ASCII como gravura"],
      ]
    : [
        ["structure", "Next.js · React"],
        ["motion", "Framer Motion · Lenis"],
        ["process", "AI-assisted web development"],
        ["ornaments", "braille, unicode & ASCII as engraving"],
      ];

  return (
    <main className="cf">
      <style>{styles}</style>
      <SiteHeader />
      <div className="cf__miolo">
        <Link href="/" className="cf__voltar">← {pt ? "voltar" : "back"}</Link>

        <h1 className="cf__titulo">{pt ? "Colofão" : "Colophon"}</h1>
        <p className="cf__abre">
          {pt
            ? "Como nos livros de antigamente: a página que conta com o que — e com quanto carinho — esta edição foi feita."
            : "Like in old books: the page that tells what — and with how much care — this edition was made."}
        </p>

        <div className="cf__fio" aria-hidden="true">{FIO}</div>
        <p className="cf__rotulo">{pt ? "a edição" : "the edition"}</p>
        {edicao.map(([m, v]) => (
          <div className="cf__linha" key={m}>
            <span className="cf__meta">{m}</span>
            <span className="cf__valor">{v}</span>
          </div>
        ))}

        <div className="cf__fio" aria-hidden="true">{FIO}</div>
        <p className="cf__rotulo">{pt ? "as vozes tipográficas" : "the typographic voices"}</p>
        {tipos.map((tipo) => (
          <div className="cf__linha" key={tipo.meta}>
            <span className="cf__meta">{tipo.meta}</span>
            <span className={tipo.classe}>{tipo.amostra}</span>
          </div>
        ))}

        <div className="cf__fio" aria-hidden="true">{FIO}</div>
        <p className="cf__rotulo">{pt ? "as técnicas" : "the techniques"}</p>
        {tecnicas.map(([m, v]) => (
          <div className="cf__linha" key={m}>
            <span className="cf__meta">{m}</span>
            <span className="cf__valor">{v}</span>
          </div>
        ))}

        <p className="cf__fecho">
          {pt ? "feito com café e ASCII, no Rio." : "made with coffee and ASCII, in Rio."}
        </p>
        <p className="cf__estrelas" aria-hidden="true">.・。.・゜✭・.・✫・゜・。.</p>
      </div>
    </main>
  );
}
