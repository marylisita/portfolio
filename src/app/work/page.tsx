"use client";

import Link from "next/link";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useT } from "@/i18n/LanguageContext";
import { useProjects } from "@/components/useProjects";
import type { IndexItem } from "@/components/EditorialIndex";
import { getProjectStory, type ProjectStory } from "@/content/projectStories";
import EditorialFooter from "@/components/EditorialFooter";
import SiteHeader from "@/components/SiteHeader";
import { useVisitedProjects } from "@/lib/visitedProjects";
import ScrambleText, {
  COLORS as SCRAMBLE_COLORS,
  GLYPHS as SCRAMBLE_GLYPHS,
} from "@/components/ScrambleText";

/** O núcleo do portfólio, na ordem em que aparece. Cada um cobre um território
 * que nenhum outro cobre. Os demais continuam na fonte completa porque as
 * páginas de case dependem dela para tags e navegação anterior/próximo. */
const CORE_HREFS = [
  "/work/juizo",
  "/work/graduation",
  "/work/ebat",
  "/work/cyber-marinum",
  "/work/magazine",
  "/work/isadora",
  "/work/touchdesigner-workshop",
  "/work/ondularis",
];

/** Recorte de produto digital, UX/UI e web. A ordem começa pelos dois cases
 * com processo de produto mais completo e termina nos experimentos de interface. */
const DIGITAL_HREFS = [
  "/work/juizo",
  "/work/vegcoz",
  "/work/genlab",
];

/** O eixo dos recortes é área, nunca contexto. Um projeto pode estar em mais de um. */
const AREAS: Record<string, string[]> = {
  "/work/juizo": ["digital", "grafico", "pesquisa"],
  "/work/graduation": ["grafico"],
  "/work/ebat": ["grafico"],
  "/work/isadora": ["grafico"],
  "/work/magazine": ["grafico"],
  "/work/pilotis": ["grafico"],
  "/work/chinario": ["grafico"],
  "/work/cyber-marinum": ["arte"],
  "/work/ondularis": ["arte"],
  "/work/touchdesigner-workshop": ["arte", "pesquisa"],
  "/work/genlab": ["digital", "arte", "pesquisa"],
  "/work/vegcoz": ["digital", "pesquisa"],
};

/* O recorte completa o título. Antes havia um título fixo e uma fileira de
   abas embaixo, com duas abas parecendo ligadas ao mesmo tempo (a prioritária
   tinha contorno). Agora existe um único estado: a palavra que fecha a frase.
   A ordem das opções continua dando a UX/UI o primeiro lugar depois da
   seleção, que era o motivo do contorno. */
const TABS = [
  { id: "destaques", key: "wk_tab_featured", pt: "selecionados", en: "selected" },
  { id: "digital", key: "wk_tab_digital", pt: "de UX/UI & web design", en: "UX/UI & web design" },
  { id: "grafico", key: "wk_tab_graphic", pt: "de design gráfico", en: "graphic design" },
  { id: "arte", key: "wk_tab_art", pt: "de arte & tecnologia", en: "art & technology" },
  { id: "pesquisa", key: "wk_tab_research", pt: "de pesquisa & educação", en: "research & teaching" },
] as const;

type AreaId = (typeof TABS)[number]["id"];
const DEFAULT_AREA: AreaId = "destaques";

/* O recorte vive na URL (?area=grafico) para poder ir num e-mail de
   candidatura já filtrado. Sem useSearchParams de propósito: numa página
   pré-renderizada ele obriga um Suspense e tiraria a lista do HTML inicial.
   O HTML sai com a seleção e o recorte do link entra na hidratação. */
const AREA_EVENT = "wk:area";

function isArea(value: string | null): value is AreaId {
  return TABS.some((tab) => tab.id === value);
}

function readArea(): AreaId {
  const value = new URLSearchParams(window.location.search).get("area");
  return isArea(value) ? value : DEFAULT_AREA;
}

function subscribeArea(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(AREA_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(AREA_EVENT, onChange);
  };
}

function writeArea(next: AreaId) {
  const url = new URL(window.location.href);
  if (next === DEFAULT_AREA) url.searchParams.delete("area");
  else url.searchParams.set("area", next);
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  window.dispatchEvent(new Event(AREA_EVENT));
}

/* A troca de recorte usa a mesma grade colorida que a home mostra no hover
   do título: cada letra que ainda não se refez vira uma grade 3×3 de glifos
   nas cores do ScrambleText, e as letras voltam da esquerda para a direita.
   A palavra nova ocupa o lugar desde o primeiro quadro (as letras ficam
   transparentes por baixo da grade), então a linha não pula enquanto troca. */
type DecodeFrame = { source: string; revealed: number; tick: number };

/** Os glifos mudam a cada 85ms, o mesmo passo do ScrambleText. */
const DECODE_SWAP = 85;
const DECODE_LEAD = 140;
const DECODE_STEP = 34;

function useDecode(text: string, animate: boolean) {
  const [frame, setFrame] = useState<DecodeFrame | null>(null);
  const previous = useRef(text);

  useEffect(() => {
    if (previous.current === text) return;
    previous.current = text;
    if (!animate) return;

    const length = Array.from(text).length;
    const end = DECODE_LEAD + length * DECODE_STEP;
    const start = performance.now();
    let raf = 0;
    let lastRevealed = -1;
    let lastTick = -1;

    const loop = (now: number) => {
      const elapsed = now - start;
      if (elapsed >= end) {
        setFrame(null);
        return;
      }
      const revealed =
        elapsed < DECODE_LEAD ? 0 : Math.floor((elapsed - DECODE_LEAD) / DECODE_STEP) + 1;
      const tick = Math.floor(elapsed / DECODE_SWAP);
      /* Só redesenha quando algo muda: render a cada quadro para trocar
         glifo a cada 85ms seria trabalho jogado fora. */
      if (revealed !== lastRevealed || tick !== lastTick) {
        lastRevealed = revealed;
        lastTick = tick;
        setFrame({ source: text, revealed, tick });
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [text, animate]);

  return frame && frame.source === text ? frame : null;
}

/** Aleatório estável por quadro: o mesmo seed dá o mesmo glifo, então a grade
 *  só muda quando o passo de 85ms vira, e não a cada render. */
function noise(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function DecodingWord({ text, frame }: { text: string; frame: DecodeFrame }) {
  return (
    <>
      {Array.from(text).map((char, index) => {
        if (char === " " || index < frame.revealed) {
          return <span key={index}>{char}</span>;
        }
        return (
          <span key={index} className="wk-dl">
            {char}
            <span className="wk-dl__grid">
              {Array.from({ length: 9 }, (_, cell) => {
                const seed = frame.tick * 131 + index * 17 + cell * 5;
                const turn = ((noise(seed + 2) - 0.5) * 36).toFixed(1);
                const size = (0.85 + noise(seed + 3) * 0.4).toFixed(2);
                return (
                  <span
                    key={cell}
                    style={{
                      color: SCRAMBLE_COLORS[Math.floor(noise(seed) * SCRAMBLE_COLORS.length)],
                      opacity: 0.7 + noise(seed + 1) * 0.3,
                      transform: `rotate(${turn}deg) scale(${size})`,
                    }}
                  >
                    {SCRAMBLE_GLYPHS[Math.floor(noise(seed + 4) * SCRAMBLE_GLYPHS.length)]}
                  </span>
                );
              })}
            </span>
          </span>
        );
      })}
    </>
  );
}

/* A fileira ASCII que ondula quando o capítulo é tocado. Era o divisor da
   versão anterior da página e ela gosta dele: a coluna vertical saiu porque a
   linha costurada ocupa esse lugar, a fileira horizontal ficou ao lado do nº. */
const ASCII_ROW = ["*", ".", "+", ".", "*", ".", "+", ".", "*", ".", "+", ".", "*", ".", "+", ".", "*"];

function AsciiRow() {
  return (
    <span className="wk-ascii" aria-hidden="true">
      {ASCII_ROW.map((symbol, index) => (
        <span key={index} style={{ "--ascii-delay": `${index * 58}ms` } as CSSProperties}>
          {symbol}
        </span>
      ))}
    </span>
  );
}

type ChapterProps = {
  project: IndexItem;
  story?: ProjectStory;
  sewn: boolean;
  /** o capítulo que está na agulha agora */
  active: boolean;
  first: boolean;
  still: boolean;
  observe: (element: HTMLElement | null) => (() => void) | void;
};

/* Um capítulo: a pergunta do case, a peça, o que mudou. O texto é o mesmo
   que abre a página do projeto (projectStories), com os mesmos rótulos, então
   quem entra no case reconhece por onde já passou. */
function WorkChapter({ project, story, sewn, active, first, still, observe }: ChapterProps) {
  const { t, lang } = useT();
  const visitedProjects = useVisitedProjects();
  const isVisited = visitedProjects.has(project.href);
  const pt = lang !== "en";
  const chapterRef = useRef<HTMLElement | null>(null);

  /* A ponta da linha fica sempre na altura da agulha, no meio da tela: o
     trecho costurado é exatamente o que já passou por ela. */
  const { scrollYProgress } = useScroll({
    target: chapterRef,
    offset: ["start center", "end center"],
  });
  const clipPath = useTransform(scrollYProgress, (value) =>
    still ? "none" : `inset(0 0 ${(100 - value * 100).toFixed(2)}% 0)`,
  );

  const setRef = useCallback(
    (element: HTMLElement | null) => {
      chapterRef.current = element;
      return observe(element);
    },
    [observe],
  );

  const headingId = `chapter-${project.href.split("/").at(-1)}`;
  const line = project.accent ?? "var(--site-accent)";

  return (
    <article
      ref={setRef}
      className="wk-ch"
      data-href={project.href}
      data-sewn={sewn ? "true" : undefined}
      data-active={active ? "true" : undefined}
      aria-labelledby={headingId}
      style={
        {
          "--wk-ch-line": line,
          "--r": project.ratio,
          ...(project.imgPocket ? { "--r-pocket": 736 / 1104 } : {}),
        } as CSSProperties
      }
    >
      <span className="wk-ch__thread" aria-hidden="true">
        <span className="wk-ch__holes" />
        <motion.span className="wk-ch__line" style={{ clipPath }} />
        <span className="wk-ch__knot">╳</span>
      </span>

      <div className="wk-ch__story">
        <header className="wk-ch__head">
          <p className="wk-ch__kicker">
            <span className="wk-ch__count">
              <span className="wk-ch__num">nº {project.num}</span>
              {isVisited ? (
                <span className="wk-ch__read">[ {pt ? "lido ✓" : "read ✓"} ]</span>
              ) : null}
              <AsciiRow />
            </span>
            <span>{project.tags}</span>
          </p>
          <h2 className="wk-ch__title" id={headingId}>
            {project.title}
          </h2>
        </header>

        {story ? (
          <dl className="wk-ch__beats">
            <div className="wk-ch__beat wk-ch__beat--q">
              <dt className="wk-ch__label">{pt ? "a pergunta" : "the question"}</dt>
              <dd className="wk-ch__question">{story.challenge}</dd>
            </div>
            <div className="wk-ch__beat wk-ch__beat--a">
              <dt className="wk-ch__label">{pt ? "o que mudou" : "what changed"}</dt>
              <dd className="wk-ch__answer">{story.impact}</dd>
            </div>
          </dl>
        ) : null}

        <Link
          href={project.href}
          className="wk-ch__cta hover-trigger"
          aria-label={`${t("view_project")}: ${project.title}`}
        >
          <span>{t("view_project").toLowerCase()}</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>

      {/* A imagem repete o destino do botão: fica fora da ordem do teclado
          para o Tab não parar duas vezes no mesmo projeto. */}
      <Link
        href={project.href}
        className="wk-ch__visual hover-trigger"
        data-pocket={project.imgPocket ? "true" : undefined}
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          className="wk-ch__img wk-ch__img--wide"
          src={project.img}
          alt=""
          fill
          sizes="(max-width: 1050px) calc(100vw - 4.5rem), 56vw"
          loading={first ? "eager" : "lazy"}
          fetchPriority={first ? "high" : undefined}
        />
        {project.imgPocket ? (
          <Image
            className="wk-ch__img wk-ch__img--pocket"
            src={project.imgPocket}
            alt=""
            fill
            sizes="calc(100vw - 4.5rem)"
          />
        ) : null}
      </Link>
    </article>
  );
}

const styles = `
  .wk-page {
    /* Os tokens que o rodapé e os botões leem (--ink, --paper, --acid). A home
       declara os três no .rm; aqui eles não existiam e o rodapé caía na cor
       padrão do navegador. */
    --ink: var(--site-ink);
    --paper: var(--site-paper);
    --acid: var(--site-accent);
    --wk-pink-text: color-mix(in srgb, var(--site-accent) 82%, var(--site-ink));
    --wk-muted: color-mix(in srgb, var(--site-ink) 66%, var(--site-paper));
    --wk-rule: color-mix(in srgb, var(--site-ink) 24%, transparent);
    /* A linha do capítulo que está passando pela agulha. Fora da lista o papel
       volta ao creme; dentro, ele pega 7% da cor do case -- o bastante para o
       capítulo ter clima, pouco para competir com a peça. */
    --wk-line: var(--site-accent);
    --wk-paper-now: var(--site-paper);
    --wk-head: 76px;
    --wk-bar: 60px;
    --wk-gutter: clamp(2.6rem, 4.2vw, 4rem);
    position: relative;
    min-height: 100vh;
    /* clip, não hidden: hidden transforma a página num contêiner de rolagem
       e a barra de recortes deixaria de grudar no topo. */
    overflow-x: clip;
    color: var(--site-ink);
    background: var(--site-paper);
  }
  .wk-page[data-chapter="true"] {
    --wk-paper-now: color-mix(in srgb, var(--wk-line) 7%, var(--site-paper));
  }
  .wk-page .sh-bar {
    --sh-glass-bg: color-mix(in srgb, var(--wk-paper-now) 62%, transparent);
  }

  .wk-backdrop {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-color: var(--wk-paper-now);
    transition: background-color 900ms var(--ease-default);
  }
  /* O mesmo grão da home, por cima do papel e por baixo das peças. */
  .wk-page::after {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 5;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: .07;
    mix-blend-mode: multiply;
  }

  .wk-sr {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }

  .wk-main {
    position: relative;
    z-index: 10;
    width: min(1380px, calc(100% - 5rem));
    margin: 0 auto;
    padding-top: clamp(7.5rem, 15vh, 10rem);
  }

  /* --- abertura: a frase que é o filtro --- */
  .wk-intro {
    padding: 0 0 clamp(1.4rem, 2.6vw, 2.2rem) var(--wk-gutter);
  }
  .wk-eyebrow {
    margin: 0 0 1.25rem;
    color: var(--wk-pink-text);
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-micro);
    font-weight: var(--offbit-weight-active);
    letter-spacing: .12em;
    text-transform: lowercase;
  }
  .wk-title {
    margin: 0;
    font-family: var(--font-pixelscript);
    font-size: clamp(2.9rem, min(7.2vw, 11.5vh), 6.6rem);
    font-weight: 400;
    line-height: 1.02;
    letter-spacing: -.015em;
    text-transform: none;
  }
  .wk-title__line { display: block; }
  .wk-title__var { color: var(--wk-pink-text); }
  /* Letra ainda não refeita: ela continua ali, transparente, segurando a
     largura; a grade colorida fica por cima. Mesmas medidas da grade do
     ScrambleText (globals.css), relativas ao corpo do título. */
  .wk-dl {
    position: relative;
    color: transparent;
  }
  /* A caixa de uma letra inline é a área de conteúdo da fonte, bem mais alta
     que a linha na Pixelscript: com inset 0 a grade invadia a linha de cima e
     a de baixo. Aqui ela fica com a altura do corpo, centrada na letra. */
  .wk-dl__grid {
    position: absolute;
    top: 50%;
    right: 0;
    left: 0;
    /* em aqui é o corpo da grade (.245 do título): 3.7em dá ~.9 da letra. */
    height: 3.7em;
    translate: 0 -50%;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: center;
    justify-items: center;
    gap: .02em .04em;
    font-family: var(--font-mono), monospace;
    font-size: .245em;
    line-height: 1;
    letter-spacing: 0;
    pointer-events: none;
  }
  .wk-dl__grid > span {
    display: inline-block;
    text-align: center;
  }

  /* --- barra de recortes: gruda embaixo do menu e diz onde você está --- */
  .wk-bar-sentinel { height: 1px; }
  .wk-bar {
    position: sticky;
    top: var(--wk-head);
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem;
    margin-bottom: clamp(3rem, 6vw, 5.5rem);
    padding: .45rem 0 .45rem var(--wk-gutter);
    background-color: var(--wk-paper-now);
    /* A sombra larga estende o fundo até as bordas da tela; o clip corta em
       cima e embaixo. Assim a barra sangra sem sair do grid. */
    box-shadow: 0 0 0 100vmax var(--wk-paper-now);
    clip-path: inset(0 -100vmax);
    border-bottom: 1px dashed transparent;
    transition:
      background-color 900ms var(--ease-default),
      box-shadow 900ms var(--ease-default),
      border-color 300ms ease;
  }
  .wk-bar[data-stuck="true"] { border-bottom-color: var(--wk-rule); }
  .wk-options {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    gap: .3rem;
    min-width: 0;
    /* O respiro de 5px deixa o contorno de foco caber: overflow-x corta nos
       dois eixos. A margem negativa devolve o alinhamento do texto. */
    margin: -5px 0 -5px calc(-.8rem - 5px);
    padding: 5px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .wk-options::-webkit-scrollbar { display: none; }
  .wk-opt {
    flex: 0 0 auto;
    min-height: var(--tap-min);
    padding: .5rem .8rem;
    color: var(--wk-muted);
    background: transparent;
    cursor: pointer;
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-micro);
    font-weight: var(--offbit-weight);
    letter-spacing: .05em;
    text-transform: lowercase;
    white-space: nowrap;
    /* Sem transição no fundo: no meio do fade as duas opções ficavam meio
       rosas ao mesmo tempo, que era o defeito das abas antigas. */
    transition:
      color 200ms var(--ease-out),
      transform 160ms var(--ease-out);
  }
  .wk-opt__n {
    margin-left: .45rem;
    color: var(--wk-pink-text);
    font-variant-numeric: tabular-nums;
  }
  .wk-opt:hover,
  .wk-opt:focus-visible { color: var(--site-ink); }
  .wk-opt:hover .wk-opt__label {
    text-decoration: underline dashed 1px;
    text-underline-offset: .38em;
  }
  /* Um só sinal para "ligado": o rosa quente de fundo, com a tinta por cima
     (5.0:1). O mesmo par dos botões da galeria da home no hover. */
  .wk-opt[aria-pressed="true"] {
    color: var(--site-ink);
    background: var(--site-accent-hot);
  }
  .wk-opt[aria-pressed="true"] .wk-opt__label { text-decoration: none; }
  .wk-opt[aria-pressed="true"] .wk-opt__n { color: inherit; opacity: .72; }
  .wk-opt:focus-visible {
    outline: 2px solid var(--site-ink);
    outline-offset: 2px;
  }
  .wk-opt:active { transform: scale(0.96); }

  .wk-where {
    flex: none;
    display: flex;
    align-items: baseline;
    gap: .55rem;
    min-width: 0;
    max-width: 36%;
    margin: 0;
    color: var(--wk-muted);
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-micro);
    font-weight: var(--offbit-weight);
    letter-spacing: .05em;
    text-transform: lowercase;
    white-space: nowrap;
  }
  .wk-where__spool {
    color: var(--wk-line);
    transition: color 900ms var(--ease-default);
  }
  .wk-where__pos {
    color: var(--site-ink);
    font-variant-numeric: tabular-nums;
  }
  .wk-where__slash { display: none; }
  .wk-where__title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* --- a lista: cada capítulo leva o próprio trecho de linha --- */
  .wk-list {
    position: relative;
    margin-bottom: clamp(5rem, 9vw, 8rem);
  }

  /* A agulha fica parada no meio da tela e a página passa por baixo dela,
     como o tecido numa máquina de costura. Sticky dentro da lista: espera
     no primeiro nó, acompanha a leitura e para no último ponto. */
  .wk-needle {
    position: sticky;
    top: 50svh;
    z-index: 4;
    height: 0;
    pointer-events: none;
  }
  .wk-needle__body {
    position: absolute;
    bottom: 0;
    left: .75rem;
    width: 10px;
    height: 46px;
    margin-left: -5px;
    color: var(--site-ink);
  }
  .wk-needle__body svg { display: block; width: 100%; height: 100%; overflow: visible; }

  .wk-ch {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    column-gap: clamp(2rem, 4.5vw, 5rem);
    align-items: start;
    padding: 0 0 clamp(6.5rem, 11vw, 10rem) var(--wk-gutter);
  }

  .wk-ch__thread {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 1.5rem;
    pointer-events: none;
  }
  /* Os furos são o caminho que ainda vai ser costurado. */
  .wk-ch__holes {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 2px;
    margin-left: -1px;
    background: repeating-linear-gradient(
      180deg,
      color-mix(in srgb, var(--site-ink) 32%, transparent) 0 2px,
      transparent 2px 10px
    );
  }
  /* A linha é um ponto corrido em onda, repetido a cada 96px. A cor sai da
     máscara, então cada capítulo troca a linha só mudando uma variável. */
  .wk-ch__line {
    position: absolute;
    inset: 0;
    background-color: var(--wk-ch-line);
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='96' viewBox='0 0 24 96'%3E%3Cpath d='M12 0C5 32 19 64 12 96' fill='none' stroke='%23000' stroke-width='1.9' stroke-linecap='round' stroke-dasharray='7 4.6'/%3E%3C/svg%3E") top center / 24px 96px repeat-y;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='96' viewBox='0 0 24 96'%3E%3Cpath d='M12 0C5 32 19 64 12 96' fill='none' stroke='%23000' stroke-width='1.9' stroke-linecap='round' stroke-dasharray='7 4.6'/%3E%3C/svg%3E") top center / 24px 96px repeat-y;
  }
  .wk-ch__knot {
    position: absolute;
    top: 0;
    left: 50%;
    display: grid;
    place-items: center;
    width: 1.3rem;
    height: 1.3rem;
    translate: -50% -50%;
    color: color-mix(in srgb, var(--site-ink) 45%, transparent);
    background: var(--wk-paper-now);
    border: 1px solid color-mix(in srgb, var(--site-ink) 24%, transparent);
    font-family: var(--font-mono), monospace;
    font-size: .68rem;
    line-height: 1;
    scale: .86;
    transition:
      color 400ms var(--ease-out),
      border-color 400ms var(--ease-out),
      background-color 900ms var(--ease-default),
      scale 520ms var(--ease-spring);
  }
  .wk-ch[data-sewn="true"] .wk-ch__knot {
    color: var(--wk-ch-line);
    border-color: var(--wk-ch-line);
    scale: 1;
  }

  .wk-ch__story { min-width: 0; }
  @media (min-width: 1051px) and (min-height: 760px) {
    .wk-ch__story {
      position: sticky;
      top: calc(var(--wk-head) + var(--wk-bar) + 2.25rem);
    }
  }
  .wk-ch__head { margin-top: -.35rem; }
  .wk-ch__kicker {
    display: flex;
    flex-wrap: wrap;
    gap: .2rem .75rem;
    margin: 0 0 1.1rem;
    color: var(--wk-muted);
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-micro);
    font-weight: var(--offbit-weight);
    line-height: 1.45;
    letter-spacing: .05em;
    text-transform: lowercase;
  }
  .wk-ch__count {
    display: flex;
    flex-basis: 100%;
    align-items: center;
    gap: .85rem;
  }
  .wk-ascii {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    width: clamp(9rem, 15vw, 13rem);
    color: var(--wk-ch-line);
    font-size: .88rem;
    font-weight: var(--offbit-weight-active);
    line-height: 1;
    pointer-events: none;
  }
  .wk-ascii span {
    display: inline-block;
    opacity: .46;
    transform: translateX(-.65rem) scale(.68);
    transition:
      opacity 520ms var(--ease-default),
      transform 760ms var(--ease-default);
  }
  /* Com mouse: ondula no hover e no foco do teclado. Sem mouse não existe
     hover, então ela ondula quando o capítulo passa pela agulha. */
  @media (hover: hover) and (pointer: fine) {
    .wk-ch:hover .wk-ascii span,
    .wk-ch:focus-within .wk-ascii span {
      animation: wk-ascii-wave 2600ms var(--ease-default) var(--ascii-delay) infinite;
    }
    .wk-ch:hover .wk-ch__title,
    .wk-ch:focus-within .wk-ch__title { color: var(--wk-pink-text); }
  }
  @media (hover: none) {
    .wk-ch[data-active="true"] .wk-ascii span {
      animation: wk-ascii-wave 2600ms var(--ease-default) var(--ascii-delay) infinite;
    }
  }
  @keyframes wk-ascii-wave {
    0% { opacity: .38; transform: translateX(-.65rem) scale(.68); }
    24%, 56% { opacity: 1; transform: translate(0, 0) scale(1); }
    100% { opacity: .46; transform: translateX(-.65rem) scale(.76); }
  }
  .wk-ch__num {
    color: var(--wk-pink-text);
    font-variant-numeric: tabular-nums;
  }
  .wk-ch__read {
    color: var(--wk-ch-line);
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-micro);
    font-weight: var(--offbit-weight-active);
    letter-spacing: .04em;
    white-space: nowrap;
  }
  .wk-page .wk-ch__title {
    margin: 0 0 clamp(1.6rem, 2.6vw, 2.4rem);
    transition: color 600ms var(--ease-default);
    font-size: clamp(2.5rem, 3.7vw, 3.75rem);
    line-height: .92;
    letter-spacing: -.035em !important;
    text-transform: lowercase;
    text-wrap: balance;
    overflow-wrap: anywhere;
  }
  .wk-ch__beats {
    display: grid;
    gap: 1.5rem;
    margin: 0;
  }
  .wk-ch__beat {
    padding-top: .95rem;
    border-top: 1px dashed var(--wk-rule);
  }
  .wk-ch__label {
    margin: 0 0 .6rem;
    color: var(--wk-muted);
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-micro);
    font-weight: var(--offbit-weight);
    letter-spacing: .05em;
    text-transform: lowercase;
  }
  /* Os colchetes são a moldura de rótulo do site (pj-meta__label nos cases).
     Aqui pegam a linha do capítulo. */
  .wk-ch__label::before { content: "[ "; color: var(--wk-ch-line); }
  .wk-ch__label::after { content: " ]"; color: var(--wk-ch-line); }
  .wk-ch__question {
    margin: 0;
    color: var(--site-ink);
    font-family: var(--font-head), serif;
    font-size: clamp(1.3rem, 1.02rem + .78vw, 1.78rem);
    font-style: italic;
    line-height: 1.18;
    letter-spacing: -.012em;
    text-wrap: pretty;
  }
  .wk-ch__answer {
    max-width: 48ch;
    margin: 0;
    color: color-mix(in srgb, var(--site-ink) 80%, var(--site-paper));
    font-family: var(--font-body), sans-serif;
    font-size: var(--type-body);
    line-height: 1.6;
    text-wrap: pretty;
  }
  .wk-ch__cta {
    display: inline-flex;
    align-items: center;
    gap: .55rem;
    min-height: var(--tap-min);
    margin-top: 2rem;
    padding: .62rem .9rem;
    color: var(--site-paper);
    background: var(--site-ink);
    border: 1px solid var(--site-ink);
    font-family: var(--font-body), sans-serif;
    font-size: var(--type-label);
    font-weight: 600;
    line-height: 1;
    letter-spacing: .04em;
    text-decoration: none;
    transition:
      color var(--duration-fast) var(--ease-out),
      background-color var(--duration-fast) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out),
      transform var(--duration-fast) var(--ease-out);
  }
  .wk-ch__cta:hover,
  .wk-ch__cta:focus-visible {
    color: var(--site-ink);
    background: var(--site-accent-hot);
    border-color: var(--site-accent-hot);
    transform: translateY(-2px);
  }
  .wk-ch__cta:focus-visible {
    outline: 2px solid var(--site-ink);
    outline-offset: 3px;
  }

  .wk-ch__visual {
    position: relative;
    display: block;
    justify-self: end;
    width: min(100%, calc(78svh / var(--r)));
    aspect-ratio: 1 / var(--r);
    overflow: hidden;
    background: color-mix(in srgb, var(--site-ink) 8%, transparent);
    /* Alinhavo: no hover a peça ganha um ponto tracejado em volta, por fora,
       na linha do capítulo -- por fora porque por dentro sumia nas capas
       escuras ou da mesma cor. */
    outline: 2px dashed transparent;
    outline-offset: 2px;
    transition:
      outline-color 380ms var(--ease-out),
      outline-offset 520ms var(--ease-default);
  }
  .wk-ch__img {
    object-fit: cover;
    transition: transform 1000ms var(--ease-default);
  }
  .wk-ch__img--pocket { display: none; }

  @media (hover: hover) and (pointer: fine) {
    .wk-ch:hover .wk-ch__visual {
      outline-color: var(--wk-ch-line);
      outline-offset: 9px;
    }
    .wk-ch:hover .wk-ch__img { transform: scale(1.022); }
  }

  /* O último capítulo não precisa do vão até o próximo: a linha desce só
     um pouco além do texto e fecha no nó de arremate. */
  .wk-ch:last-child { padding-bottom: clamp(3.5rem, 6vw, 5.5rem); }
  .wk-tie {
    position: absolute;
    bottom: 0;
    left: .75rem;
    display: grid;
    place-items: center;
    width: 1.3rem;
    height: 1.3rem;
    translate: -50% 50%;
    color: var(--wk-line);
    background: var(--wk-paper-now);
    border: 1px solid var(--wk-line);
    font-family: var(--font-mono), monospace;
    font-size: .68rem;
    line-height: 1;
    transition:
      color 900ms var(--ease-default),
      border-color 900ms var(--ease-default),
      background-color 900ms var(--ease-default);
  }

  /* Abaixo disso o nome do capítulo disputa a linha com os recortes; fica só
     a posição, que é o que orienta. */
  @media (max-width: 1280px) {
    .wk-where { max-width: none; }
    .wk-where__title { display: none; }
  }

  @media (max-width: 1050px) {
    .wk-main { width: min(100% - 2.5rem, 1320px); }
    .wk-ch {
      display: flex;
      flex-direction: column;
      padding-bottom: 5.5rem;
    }
    /* No celular a peça entra entre a pergunta e a resposta: lido de cima a
       baixo, o capítulo fica pergunta, imagem, o que mudou. */
    .wk-ch__story,
    .wk-ch__beats { display: contents; }
    .wk-ch__head { order: 1; }
    .wk-ch__beat--q { order: 2; }
    .wk-ch__visual {
      order: 3;
      width: 100%;
      margin: 1.6rem 0;
      justify-self: auto;
    }
    .wk-ch__beat--a { order: 4; }
    .wk-ch__cta { order: 5; align-self: flex-start; }
    .wk-ch__visual[data-pocket="true"] { aspect-ratio: 1 / var(--r-pocket); }
    .wk-ch__visual[data-pocket="true"] .wk-ch__img--wide { display: none; }
    .wk-ch__visual[data-pocket="true"] .wk-ch__img--pocket { display: block; }
  }

  @media (max-width: 560px) {
    .wk-main {
      width: calc(100% - 1.75rem);
      padding-top: 6.6rem;
    }
    .wk-page { --wk-gutter: 2.1rem; }
    .wk-title { font-size: clamp(2.3rem, 10.6vw, 3.2rem); }
    .wk-bar {
      gap: .6rem;
      margin-bottom: 2.6rem;
    }
    .wk-where__label,
    .wk-where__spool { display: none; }
    .wk-where__slash { display: inline; }
    .wk-page .wk-ch__title { font-size: clamp(2.2rem, 10.5vw, 2.9rem); }
    .wk-needle__body { width: 8px; height: 36px; margin-left: -4px; }
  }

  @media (max-width: 860px) {
    /* A fileira rola de lado; o esmaecido na borda avisa que tem mais. */
    .wk-options {
      padding-right: 2rem;
      -webkit-mask-image: linear-gradient(90deg, #000 calc(100% - 2.4rem), transparent);
      mask-image: linear-gradient(90deg, #000 calc(100% - 2.4rem), transparent);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .wk-backdrop,
    .wk-bar,
    .wk-ch__knot,
    .wk-ch__visual,
    .wk-ch__img,
    .wk-where__spool,
    .wk-ascii span { transition: none; }
    .wk-ch .wk-ascii span {
      animation: none !important;
      opacity: .8;
      transform: none;
    }
    .wk-ch:hover .wk-ch__img { transform: none; }
  }
`;

export default function Work() {
  const { t, lang } = useT();
  const pt = lang !== "en";
  const all = useProjects();
  const reduceMotion = useReducedMotion();
  const still = Boolean(reduceMotion);
  /* A agulha só pica enquanto o tecido anda: o movimento vem da rolagem,
     então página parada é agulha parada. */
  const { scrollY } = useScroll();
  const needleY = useTransform(scrollY, (value) => (still ? 0 : Math.sin(value / 9) * 3));

  const area = useSyncExternalStore(subscribeArea, readArea, () => DEFAULT_AREA);
  const tab = TABS.find((item) => item.id === area) ?? TABS[0];

  const pick = (hrefs: string[]) =>
    hrefs.flatMap((href) => {
      const found = all.find((item) => item.href === href);
      return found ? [found] : [];
    });
  const listFor = (id: AreaId) =>
    id === "destaques"
      ? pick(CORE_HREFS)
      : id === "digital"
        ? pick(DIGITAL_HREFS)
        : all.filter((item) => AREAS[item.href]?.includes(id));
  const projects = listFor(area);

  /* --- qual capítulo está passando pela agulha --- */
  const visibleRef = useRef(new Set<string>());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [activeHref, setActiveHref] = useState<string | null>(null);

  const syncActive = useCallback(() => {
    const [first] = visibleRef.current;
    setActiveHref(first ?? null);
  }, []);

  const observe = useCallback(
    (element: HTMLElement | null) => {
      if (!element) return;
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              const href = (entry.target as HTMLElement).dataset.href;
              if (!href) continue;
              if (entry.isIntersecting) visibleRef.current.add(href);
              else visibleRef.current.delete(href);
            }
            syncActive();
          },
          /* uma faixa fina no meio da tela, na altura da agulha */
          { rootMargin: "-49.5% 0px -49.5% 0px" },
        );
      }
      const observer = observerRef.current;
      const href = element.dataset.href ?? "";
      observer.observe(element);
      return () => {
        observer.unobserve(element);
        visibleRef.current.delete(href);
        syncActive();
      };
    },
    [syncActive],
  );

  useEffect(() => () => observerRef.current?.disconnect(), []);

  const activeIndex = projects.findIndex((project) => project.href === activeHref);
  const activeProject = activeIndex >= 0 ? projects[activeIndex] : null;

  /* --- medidas: a barra gruda embaixo do menu fixo, e a história do
     capítulo gruda embaixo da barra --- */
  const pageRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const [switched, setSwitched] = useState(false);

  useEffect(() => {
    const page = pageRef.current;
    const bar = barRef.current;
    const header = document.querySelector<HTMLElement>(".sh-bar");
    if (!page || !bar) return;

    const measure = () => {
      if (header) page.style.setProperty("--wk-head", `${Math.round(header.offsetHeight)}px`);
      page.style.setProperty("--wk-bar", `${Math.round(bar.offsetHeight)}px`);
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(bar);
    if (header) resize.observe(header);

    const sentinel = sentinelRef.current;
    let stuckObserver: IntersectionObserver | undefined;
    if (sentinel) {
      const headHeight = header?.offsetHeight ?? 76;
      stuckObserver = new IntersectionObserver(
        ([entry]) => setStuck(!entry.isIntersecting && entry.boundingClientRect.top < headHeight + 1),
        { rootMargin: `-${headHeight + 1}px 0px 0px 0px` },
      );
      stuckObserver.observe(sentinel);
    }

    return () => {
      resize.disconnect();
      stuckObserver?.disconnect();
    };
  }, []);

  const chooseArea = (next: AreaId) => {
    if (next === area) return;
    /* Quem troca de recorte lá embaixo volta para o começo da lista nova, e
       não para o meio de um capítulo qualquer. */
    const page = pageRef.current;
    const list = listRef.current;
    if (page && list) {
      const offset =
        Number.parseFloat(page.style.getPropertyValue("--wk-head") || "76") +
        Number.parseFloat(page.style.getPropertyValue("--wk-bar") || "60");
      const top = list.getBoundingClientRect().top + window.scrollY - offset - 24;
      if (window.scrollY > top + 1) window.scrollTo({ top, behavior: "instant" });
    }
    /* O capítulo que estava na agulha pertence à lista que está saindo. Se
       ele também existir na nova, o contador mostraria a posição dele lá
       ("7 de 7") até a troca terminar. */
    visibleRef.current.clear();
    setActiveHref(null);
    setSwitched(true);
    writeArea(next);
  };

  const countFor = (id: AreaId) => listFor(id).length;
  const word = pt ? tab.pt : tab.en;
  const decoding = useDecode(word, !still);
  /* Parado, o título responde ao mouse letra por letra, como o da home. */
  const variable = decoding ? (
    <DecodingWord text={word} frame={decoding} />
  ) : (
    <ScrambleText text={word} />
  );
  const fullTitle = pt ? `trabalhos ${tab.pt}` : `${tab.en} work`;
  const announcement = pt
    ? `${projects.length} trabalhos ${tab.pt}`
    : `${projects.length} ${tab.en} projects`;

  const options = (ids: readonly AreaId[]) =>
    ids.map((id) => {
      const item = TABS.find((entry) => entry.id === id) ?? TABS[0];
      return (
        <button
          key={id}
          type="button"
          className="wk-opt hover-trigger"
          aria-pressed={area === id}
          onClick={() => chooseArea(id)}
        >
          <span className="wk-opt__label">{t(item.key)}</span>
          <span className="wk-opt__n">{countFor(id).toString().padStart(2, "0")}</span>
        </button>
      );
    });

  return (
    <div
      ref={pageRef}
      className="wk-page"
      data-chapter={activeProject ? "true" : undefined}
      style={
        activeProject?.accent
          ? ({ "--wk-line": activeProject.accent } as CSSProperties)
          : undefined
      }
    >
      <style>{styles}</style>
      <div className="wk-backdrop" aria-hidden="true" />
      <SiteHeader />

      <main className="wk-main">
        <header className="wk-intro">
          <p className="wk-eyebrow">{pt ? "portfólio" : "portfolio"} · 2026</p>
          <h1 className="wk-title">
            <span className="wk-sr">{fullTitle}</span>
            {pt ? (
              <span aria-hidden="true">
                <span className="wk-title__line">
                  <ScrambleText text="trabalhos" />
                </span>
                <span className="wk-title__line wk-title__var">{variable}</span>
              </span>
            ) : (
              <span aria-hidden="true">
                <span className="wk-title__line wk-title__var">{variable}</span>
                <span className="wk-title__line">
                  <ScrambleText text="work" />
                </span>
              </span>
            )}
          </h1>
        </header>

        <div ref={sentinelRef} className="wk-bar-sentinel" aria-hidden="true" />
        <div ref={barRef} className="wk-bar" data-stuck={stuck ? "true" : undefined}>
          <div className="wk-options" role="group" aria-label={t("wk_tabs_label")}>
            {options(TABS.map((item) => item.id))}
          </div>
          <p className="wk-where" aria-hidden="true">
            <span className="wk-where__spool">╳</span>
            {activeProject ? (
              <>
                <span className="wk-where__pos">
                  {activeIndex + 1}
                  <span className="wk-where__label">{pt ? " de " : " of "}</span>
                  <span className="wk-where__slash">/</span>
                  {projects.length}
                </span>
                <span className="wk-where__title">{activeProject.title}</span>
              </>
            ) : (
              <span className="wk-where__pos">
                {projects.length} {pt ? "trabalhos" : "projects"}
              </span>
            )}
          </p>
        </div>
        <p className="wk-sr" aria-live="polite">
          {announcement}
        </p>

        <div ref={listRef} className="wk-list">
          <div className="wk-needle" aria-hidden="true">
            <motion.span className="wk-needle__body" style={{ y: needleY }}>
              <svg viewBox="0 0 10 46">
                <path
                  d="M5 0C7.4 0 7.8 3.2 7.8 6.4L6.3 40.5 5 46 3.7 40.5 2.2 6.4C2.2 3.2 2.6 0 5 0Z"
                  fill="currentColor"
                />
                <ellipse cx="5" cy="6.6" rx=".95" ry="2.6" fill="var(--wk-paper-now)" />
              </svg>
            </motion.span>
          </div>

          {/* Sem AnimatePresence: a saída da lista que chega no HTML ficava presa
              no meio quando um link com ?area= trocava o recorte na hidratação.
              A lista nova só anima quando foi um clique que pediu a troca. */}
          <motion.div
              key={area}
              initial={switched && !still ? { opacity: 0, y: 18 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              {projects.map((project, index) => (
                <WorkChapter
                  key={project.href}
                  project={project}
                  story={getProjectStory(project.href, lang)}
                  sewn={activeIndex >= index}
                  active={activeIndex === index}
                  first={index === 0}
                  still={still}
                  observe={observe}
                />
              ))}
            </motion.div>
          {/* O arremate: a costura termina num nó, como termina um ponto à mão. */}
          <span className="wk-tie" aria-hidden="true">╳</span>
        </div>

      </main>

      <div id="contact" style={{ position: "relative", zIndex: 10 }}>
        <EditorialFooter />
      </div>
    </div>
  );
}
