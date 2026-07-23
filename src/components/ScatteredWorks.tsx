"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import AsciiDivider from "./AsciiDivider";
import PixelScrollImage from "./PixelScrollImage";
import PixelScrollText from "./PixelScrollText";
import BrailleDeco from "./BrailleDeco";
import { DRAGAO, QUIMERA, COELHOS } from "./brailleArt";
import { ANJOS, ORNAMENTAL, ANJOS_DUO, ESFERA } from "./brailleEditorial";
import { FILLER_COLUMN, FILLER_GROUP } from "./foundBrailleArt";
import type { IndexItem } from "./EditorialIndex";
import { useT } from "@/i18n/LanguageContext";

/**
 * Projetos "jogados" num canvas, estilo t-i-n-y.com (pedido dela): nada de
 * coluna/tabela — cada peça em posição e tamanho próprios, legenda em mono
 * embaixo. Cada capa nasce nítida e vira pixel conforme sobe (PixelScrollImage).
 *
 * Layout: posições em % da largura e `top` em vh dentro de um canvas alto, com
 * scroll NATIVO (ela odeia scroll travado). No mobile vira coluna simples.
 */

// Posições à mão pra dar ritmo de colagem (não é grid).
// `ratio` aqui é só um PALPITE inicial pra não dar pulo de layout — ao carregar,
// o PixelScrollImage mede o arquivo e assume a proporção real. Trocar uma capa
// não quebra nada, mesmo que o número aqui fique desatualizado.
// Regra de posicionamento: peças próximas na vertical NÃO podem dividir faixa
// de X, senão a legenda de uma cai em cima da outra (aprendido vendo o print).
// Espaçamento COMPRIMIDO e padronizado (pedido dela 2026-07-23: "tão muito
// separados") — ritmo de ~6-8rem entre o pé de uma peça e o topo da próxima,
// mantendo a alternância esq/dir da colagem (cara de readymag).
const SPOTS = [
  { left: "2%",  top: "0rem",   w: "clamp(300px, 46vw, 700px)", ratio: 0.562, rot: -2 }, // isadora 1920x1080
  { left: "62%", top: "30rem",  w: "clamp(224px, 38.4vw, 576px)", ratio: 0.667, rot: 3 },  // helvetica 948x632
  { left: "30%", top: "64rem",  w: "clamp(320px, 52vw, 780px)", ratio: 0.498, rot: 1 },  // genlab 1743x868
  { left: "2%",  top: "98rem",  w: "clamp(300px, 38.4vw, 564px)", ratio: 0.562, rot: -4 }, // ebat 2400x1350
  { left: "52%", top: "127rem", w: "clamp(280px, 40vw, 600px)", ratio: 0.494, rot: 2 },  // graduation animacao.webp 1000x494
  { left: "6%",  top: "156rem", w: "clamp(340px, 58vw, 880px)", ratio: 0.319, rot: -1 }, // pilotis 1600x511
  { left: "66%", top: "184rem", w: "clamp(250px, 30vw, 460px)", ratio: 0.667, rot: 4 },  // chinario 1600x1068
  { left: "8%",  top: "213rem", w: "clamp(320px, 54vw, 820px)", ratio: 0.562, rot: -2 }, // hologlam trio 1600x900 (recorte dela)
  { left: "56%", top: "251rem", w: "clamp(280px, 42vw, 640px)", ratio: 0.708, rot: 3 },  // vegcoz capa.png 1400x991 (recorte dela)
];

// Uma cor por projeto, DERIVADA da capa real (tom característico, clampado pra
// faixa média de brilho pra aparecer no fundo bege). Aparece como glow atrás do
// card ativo, posicionado no próprio card (ver --sw-glow-x/y). Trocou uma capa?
// re-amostra o tom dela e atualiza aqui. Ordem = índice do projeto (useProjects).
const PROJECT_GLOWS = [
  "rgba(140, 99, 63, .22)",   // isadora — marrom quente vintage
  "rgba(172, 171, 171, .22)", // magazine — editorial p&b, cinza
  "rgba(198, 190, 195, .22)", // genlab — claro/pastel
  "rgba(180, 156, 198, .22)", // ebat — lilás da identidade
  "rgba(140, 42, 126, .22)",  // graduation — magenta/roxo da capa animada
  "rgba(82, 140, 131, .22)",  // pilotis — verde-água
  "rgba(186, 56, 86, .22)",   // chinario — vermelho china-rio
  "rgba(62, 95, 140, .22)",   // hologlam — azul
  "rgba(159, 159, 97, .22)",  // vegcoz — verde-oliva
];

const MOTION_ENTER = 0.9;
const MOTION_EASE_OUT = [0.16, 1, 0.3, 1] as const;

const styles = `
  .sw {
    --sw-paper-grain: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='.46'/%3E%3C/svg%3E");
    --duration-ambient-a: 80s;
    --duration-ambient-b: 95s;
    position: relative;
    /* altura do canvas em rem para ser imune a redimensionamentos verticais de viewport */
    height: clamp(288rem, calc(272rem + 34vw), 291rem);
    margin: 0 auto;
    max-width: 1500px;
    isolation: isolate;
  }
  .sw::after {
    content: "";
    position: absolute;
    inset: -10rem -8vw;
    z-index: -1;
    pointer-events: none;
    background: radial-gradient(46rem 46rem at var(--sw-glow-x, 50%) var(--sw-glow-y, 48%), var(--sw-glow, transparent), transparent 72%);
    opacity: var(--sw-glow-opacity, 0);
    transition: opacity var(--duration-slow) var(--ease-default), background var(--duration-slow) var(--ease-default);
  }
  .sw__mode {
    position: relative;
    z-index: 20;
    display: flex;
    justify-content: flex-end;
    gap: .35rem;
    max-width: 1500px;
    margin: 0 auto 2rem;
    padding: 0 2%;
  }
  .sw__mode button {
    min-height: 38px;
    padding: .42rem .72rem;
    border: 1px solid rgba(28,27,24,.35);
    background: rgba(237,231,218,.75);
    color: var(--ink);
    font-family: var(--font-body);
    font-size: .67rem;
    letter-spacing: .11em;
    text-transform: lowercase;
    transition: background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
  }
  .sw__mode button[aria-pressed="true"] { background: var(--ink); color: var(--paper); transform: translateY(-2px); }
  .sw__mode button:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
  .sw__item { position: absolute; z-index: 1; text-decoration: none; color: var(--ink); }
  .sw__item[data-sw-project] {
    isolation: isolate;
  }
  .sw__item[data-sw-project]::after {
    content: attr(data-sw-num);
    position: absolute;
    z-index: 0;
    right: -1.2rem;
    bottom: -1.2rem;
    pointer-events: none;
    font-family: var(--font-subtitle), monospace;
    font-weight: var(--offbit-weight-active);
    font-size: clamp(6rem, 16vw, 13rem);
    line-height: .72;
    letter-spacing: var(--offbit-letter-spacing);
    color: var(--ink);
    opacity: 0;
    scale: var(--offbit-condense) 1;
    transform-origin: right bottom;
    transition: opacity var(--duration-normal) var(--ease-out), scale var(--duration-normal) var(--ease-out);
  }
  .sw__item[data-sw-project]:hover::after,
  .sw__item[data-sw-project]:focus-within::after {
    opacity: .065;
    scale: 1.04 1;
  }
  .sw__link {
    position: relative;
    z-index: 1;
    display: block;
    color: inherit;
    text-decoration: none;
    transition:
      opacity var(--duration-normal) var(--ease-default),
      filter var(--duration-normal) var(--ease-default);
  }
  .sw__link:focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 10px;
  }
  @media (hover: hover) {
    .sw:has(.sw__item[data-sw-project]:hover) .sw__item[data-sw-project] .sw__link {
      opacity: .42;
      filter: saturate(.72);
    }
    .sw:has(.sw__item[data-sw-project]:hover) .sw__item[data-sw-project]:hover .sw__link,
    .sw:has(.sw__item[data-sw-project]:focus-within) .sw__item[data-sw-project]:focus-within .sw__link {
      opacity: 1;
      filter: none;
    }
  }

  /* palavra gigante deslizando ao fundo (referência t-i-n-y: o "Bienvenue!"),
     opacidade baixíssima pra não roubar legibilidade de nada */
  .sw__bg {
    position: absolute;
    z-index: 0;
    font-family: var(--font-hand);
    white-space: nowrap;
    pointer-events: none;
    user-select: none;
    line-height: 1;
  }
  .sw__bg--a {
    top: 12%;
    left: -6%;
    color: var(--ink);
    opacity: .13;
    animation: sw-drift-a var(--duration-ambient-a) var(--ease-default) infinite alternate;
  }
  .sw__bg--b {
    top: 70%;
    left: 14%;
    color: var(--acid);
    opacity: .115;
    animation: sw-drift-b var(--duration-ambient-b) var(--ease-default) infinite alternate;
  }
  @keyframes sw-drift-a {
    from { transform: rotate(-10deg) translate(0, 0); }
    to   { transform: rotate(-10deg) translate(7vw, 3vh); }
  }
  @keyframes sw-drift-b {
    from { transform: rotate(-8deg) translate(0, 0); }
    to   { transform: rotate(-8deg) translate(-6vw, -2vh); }
  }
  @media (prefers-reduced-motion: reduce) {
    .sw__bg, .sw__bg--a, .sw__bg--b { animation: none; }
  }
  /* desenhos ASCII grandes ocupando os vazios */
  .sw__deco { position: absolute; z-index: 0; pointer-events: none; mix-blend-mode: multiply; }
  @supports (animation-timeline: view()) {
    .sw__deco {
      animation: sw-ornament-drift linear both;
      animation-timeline: view();
      animation-range: entry 0% exit 100%;
    }
    @keyframes sw-ornament-drift {
      from { translate: 0 -12px; }
      to { translate: 0 12px; }
    }
  }
  @media (max-width: 860px) {
    .sw__deco { display: none; }
  }
  /* fecho horizontal: divisória editorial entre trabalhos e rodapé */
  .sw__final {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.4rem;
    width: 100%;
    max-width: 1500px;
    margin: 0 auto;
    padding: 1.5rem 1.25rem 2.75rem;
    overflow: hidden;
  }
  .sw__divider { flex: 0 0 auto; max-width: 100%; }

  /* moldura = um PRINT de papel: margem de papel granulado ao redor da foto,
     sombra PROJETADA de verdade (não o offset chapado), cantos retos de foto.
     A foto vive dentro de .sw__photo com grão por cima — dá a textura tátil. */
  .sw__frame {
    position: relative;
    overflow: visible;
    padding: clamp(9px, 1.3vw, 15px);
    padding-bottom: clamp(12px, 1.7vw, 20px);
    border-radius: 2px;
    background-color: rgba(237, 231, 218, .97);
    background-image:
      var(--sw-paper-grain),
      linear-gradient(122deg, rgba(255,255,255,.42), transparent 44%, rgba(28,27,24,.1));
    background-size: 160px 160px, 100% 100%;
    background-blend-mode: multiply, soft-light;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.3), inset 0 0 26px rgba(28,27,24,.05);
    filter: drop-shadow(0 8px 14px rgba(0,0,0,.22)) drop-shadow(0 2px 3px rgba(0,0,0,.14));
    transition: transform var(--duration-slow) var(--ease-out), filter var(--duration-slow) var(--ease-default), box-shadow var(--duration-slow) var(--ease-out);
  }
  .sw__photo {
    position: relative;
    display: block;
    overflow: hidden;
    border: 1px solid rgba(28, 27, 24, .18);
  }
  .sw__photo::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    background: var(--sw-paper-grain), radial-gradient(125% 125% at 50% 0%, transparent 60%, rgba(20,19,16,.16));
    background-size: 150px 150px, 100% 100%;
    mix-blend-mode: overlay;
    opacity: .62;
  }
  .sw__item[data-sw-project]:hover::before,
  .sw__item[data-sw-project]:focus-within::before {
    transform: translate(4px, 4px);
  }
  @supports (animation-timeline: view()) {
    .sw__item[data-sw-project]::before {
      animation: sw-paper-parallax linear both;
      animation-timeline: view();
      animation-range: entry 0% exit 100%;
    }
    @keyframes sw-paper-parallax {
      from { transform: translate(var(--sw-layer-x), calc(var(--sw-layer-y) - 9px)); }
      to { transform: translate(var(--sw-layer-x), calc(var(--sw-layer-y) + 9px)); }
    }
  }
  .sw__item[data-sw-project]:hover .sw__frame,
  .sw__item[data-sw-project]:focus-within .sw__frame {
    transform: translate(-3px, -4px);
    filter: saturate(1.02) contrast(1.02) drop-shadow(0 16px 22px rgba(0,0,0,.3)) drop-shadow(0 3px 5px rgba(0,0,0,.2));
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.3);
  }
  .sw__cap {
    position: relative;
    z-index: 3;
    /* centralizada (pedido dela): número + título numa linha só, no centro do card */
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .6rem;
    width: max-content;
    max-width: calc(100% - 1.5rem);
    margin: -.65rem auto 0;
    padding: .48rem .8rem .52rem;
    background-color: rgba(237, 231, 218, .88);
    background-image:
      var(--sw-paper-grain),
      linear-gradient(105deg, rgba(255,255,255,.2), transparent 48%, rgba(28,27,24,.045));
    background-size: 130px 130px, 100% 100%;
    background-blend-mode: multiply, soft-light;
    border: 1px solid rgba(28, 27, 24, .22);
    box-shadow: 0 5px 12px rgba(20,19,16,.16), inset 0 0 0 1px rgba(255,255,255,.14);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    text-transform: lowercase;
    text-align: center;
    transition: color var(--duration-normal) var(--ease-default), background-color var(--duration-normal) var(--ease-default), box-shadow var(--duration-normal) var(--ease-default);
  }
  .sw__item:hover .sw__cap,
  .sw__item:focus-within .sw__cap {
    color: var(--acid);
    background-color: rgba(246, 241, 230, .96);
    box-shadow: 0 8px 16px rgba(20,19,16,.2), inset 0 0 0 1px rgba(255,255,255,.18);
  }
  /* PixelPoiiz NAO e usada: alem de nao ter acentos, o zero dela e desenhado
     parecendo um simbolo (01 saia como "@1"). Fica carregada mas sem uso. */
  .sw__num {
    font-family: var(--font-subtitle);
    font-weight: var(--offbit-weight);
    font-size: clamp(1.65rem, 3vw, 2.8rem);
    line-height: .78;
    letter-spacing: var(--offbit-letter-spacing);
    scale: var(--offbit-condense) 1;
    transform-origin: left center;
    opacity: .68;
  }
  .sw__title {
    font-family: var(--font-head);
    font-size: clamp(1.02rem, 1.7vw, 1.5rem);
    font-weight: 400;
    line-height: .95;
    letter-spacing: -.025em;
  }
  .sw__tags {
    grid-column: 2;
    display: block;
    font-family: var(--font-subtitle);
    font-weight: var(--offbit-weight);
    font-size: clamp(.48rem, .72vw, .62rem);
    line-height: 1.35;
    letter-spacing: var(--offbit-letter-spacing);
    scale: var(--offbit-condense) 1;
    transform-origin: left center;
  }
  .sw__num,
  .sw__tags {
    transition: font-weight var(--duration-normal) var(--ease-out);
  }
  .sw__item:hover .sw__num,
  .sw__item:hover .sw__tags,
  .sw__item:focus-within .sw__num,
  .sw__item:focus-within .sw__tags,
  .sw__item[data-sw-active="true"] .sw__num,
  .sw__item[data-sw-active="true"] .sw__tags {
    font-weight: var(--offbit-weight-active);
  }

  @media (min-width: 861px) {
    .sw[data-view="desk"] {
      height: auto;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 4.5rem 2.4rem;
      padding: 1rem 2% 5rem;
    }
    .sw[data-view="desk"] .sw__item {
      position: relative !important;
      inset: auto !important;
      width: auto !important;
      transform: none !important;
      opacity: 1 !important;
    }
    .sw[data-view="desk"] .sw__link { transform: none !important; }
    .sw[data-view="desk"] .sw__item[data-sw-project]::before {
      animation: none;
      background-image: linear-gradient(118deg, rgba(255,255,255,.16), transparent 46%, rgba(28,27,24,.06));
      background-blend-mode: normal;
      box-shadow: none;
    }
    .sw[data-view="desk"] .sw__item[data-sw-project]::after { display: none; }
    .sw[data-view="desk"] .sw__cap {
      background-image: none;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
    }
    .sw[data-view="desk"] .sw__frame,
    .sw[data-view="desk"] .sw__link {
      filter: none !important;
    }
    .sw[data-view="desk"] .sw__frame {
      padding: clamp(7px, 1vw, 11px);
      box-shadow: inset 0 0 0 1px rgba(255,255,255,.22);
    }
    .sw[data-view="desk"] .sw__deco,
    .sw[data-view="desk"] .sw__bg { display: none; }
  }

  @media (max-width: 860px) {
    /* no mobile a colagem vira coluna — legível e sem sobreposição */
    .sw { height: auto; display: flex; flex-direction: column; gap: 4.25rem; padding: 0 1.25rem; }
    .sw__item { position: static !important; width: calc(100% - .8rem) !important; transform: none !important; }
    .sw__item[data-sw-project="0"],
    .sw__item[data-sw-project="2"],
    .sw__item[data-sw-project="4"],
    .sw__item[data-sw-project="6"],
    .sw__item[data-sw-project="8"] { align-self: flex-start; }
    .sw__item[data-sw-project="1"],
    .sw__item[data-sw-project="3"],
    .sw__item[data-sw-project="5"],
    .sw__item[data-sw-project="7"] { align-self: flex-end; }
    .sw__item[data-sw-project="0"] .sw__link,
    .sw__item[data-sw-project="2"] .sw__link,
    .sw__item[data-sw-project="4"] .sw__link,
    .sw__item[data-sw-project="6"] .sw__link,
    .sw__item[data-sw-project="8"] .sw__link { transform: rotate(-1.2deg); }
    .sw__item[data-sw-project="1"] .sw__link,
    .sw__item[data-sw-project="3"] .sw__link,
    .sw__item[data-sw-project="5"] .sw__link,
    .sw__item[data-sw-project="7"] .sw__link { transform: rotate(1.2deg); }
    .sw__cap { max-width: calc(100% - .75rem); }
    .sw__mode { display: none; }
    .sw[data-mobile-focus="true"] .sw__item[data-sw-project] .sw__link {
      opacity: .5;
      filter: saturate(.7);
    }
    .sw[data-mobile-focus="true"] .sw__item[data-sw-active="true"] .sw__link {
      opacity: 1;
      filter: none;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .sw__item[data-sw-project]::before,
    .sw__link,
    .sw__frame,
    .sw__cap,
    .sw__num,
    .sw__tags { transition: none; }
    .sw__item[data-sw-project]::before { animation: none; }
    .sw__deco { animation: none; translate: none; }
    .sw::after { transition: none; }
    .sw__item[data-sw-project]::after { transition: none; }
    .sw__item[data-sw-project]:hover .sw__frame,
    .sw__item[data-sw-project]:focus-within .sw__frame { transform: none; box-shadow: none; }
  }
`;

export default function ScatteredWorks({ items, bgWord }: { items: IndexItem[]; bgWord: string }) {
  const { lang } = useT();
  const reduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [mobileActive, setMobileActive] = useState<number | null>(null);
  const [desktopActive, setDesktopActive] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"collage" | "desk">("collage");
  const [glowPos, setGlowPos] = useState<{ x: number; y: number } | null>(null);
  const activeIndex = desktopActive ?? mobileActive;

  // posiciona o glow no CENTRO do card ativo (relativo ao canvas .sw), pra ele
  // acender perto de qualquer card — não mais fixo no meio da colagem.
  const glowFrom = (el: HTMLElement | null) => {
    const canvas = canvasRef.current;
    if (!canvas || !el) return;
    setGlowPos({
      x: ((el.offsetLeft + el.offsetWidth / 2) / (canvas.offsetWidth || 1)) * 100,
      y: ((el.offsetTop + el.offsetHeight / 2) / (canvas.offsetHeight || 1)) * 100,
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const media = window.matchMedia("(max-width: 860px)");
    let observer: IntersectionObserver | null = null;

    const startObserver = () => {
      observer?.disconnect();
      if (!media.matches) {
        setMobileActive(null);
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          const centered = entries.find((entry) => entry.isIntersecting);
          if (!centered) return;

          const value = (centered.target as HTMLElement).dataset.swProject;
          setMobileActive(value == null ? null : Number(value));
          if (value != null) glowFrom(centered.target as HTMLElement);
        },
        { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
      );

      canvas.querySelectorAll<HTMLElement>("[data-sw-project]").forEach((item) => observer?.observe(item));
    };

    startObserver();
    media.addEventListener("change", startObserver);

    return () => {
      observer?.disconnect();
      media.removeEventListener("change", startObserver);
    };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="sw__mode" role="group" aria-label={lang === "pt" ? "modo de visualização" : "view mode"}>
        <button type="button" aria-pressed={viewMode === "collage"} onClick={() => setViewMode("collage")}>
          {lang === "pt" ? "colagem" : "collage"}
        </button>
        <button type="button" aria-pressed={viewMode === "desk"} onClick={() => setViewMode("desk")}>
          {lang === "pt" ? "mesa" : "desk"}
        </button>
      </div>
      <div
        className="sw"
        ref={canvasRef}
        data-view={viewMode}
        data-mobile-focus={mobileActive !== null ? "true" : "false"}
        style={{
          "--sw-glow": activeIndex == null ? "transparent" : PROJECT_GLOWS[activeIndex % PROJECT_GLOWS.length],
          "--sw-glow-opacity": activeIndex == null ? 0 : 1,
          "--sw-glow-x": glowPos ? `${glowPos.x}%` : "50%",
          "--sw-glow-y": glowPos ? `${glowPos.y}%` : "48%",
        } as React.CSSProperties}
      >
        <PixelScrollText className="sw__bg sw__bg--a" text={bgWord} fontSize={420} color="var(--ink)" />

        {/* Ornamentos nos vazios entre as peças — as artes que ela escolheu.
            Saíram: coração e asas (pedido dela), sparkle e rosa (colidiam com as
            peças em viewport baixa) e o beijo (já é o frontispício do rodapé, em
            tamanho maior — estava duplicado na mesma página).

            POSIÇÕES MEDIDAS NO PIOR CASO, 1440x700: é lá que os vãos encolhem,
            porque a peça tem altura em px (clamp de vw) mas o `top` é em vh.
            Conferir a 700 E a 900 antes de mexer. Vãos livres a 1440x700:
              coluna direita (x>1160): 0-182, 525-896, 1321-1470
              coluna esquerda (x<250): 427-756, 1037-1260, 1581-1785 */}
        {/* Reposicionados pro layout COMPRIMIDO (2026-07-23): cards alternam
            esq/dir, então cada ornamento vive no lado oposto do card da sua
            faixa — sempre visível ao rolar. Faixas (y em rem): c0 esq 0-27 ·
            c1 dir 30-57 · c2 centro 64-91 · c3 esq 98-121 · c4 dir 127-149 ·
            c5 esq 156-177 · c6 dir 184-206 · c7 esq 213-244 · c8 dir 251-282 */}
        <BrailleDeco art={ESFERA} fontSize={10} opacity={0.38} color="var(--ink)"
          className="sw__deco" style={{ left: "62%", top: "3rem" }} />
        {/* voluta DE VOLTA ao lugar original dela (ela: "volta o outro pro lugar") */}
        <BrailleDeco art={ORNAMENTAL} fontSize={8.5} opacity={0.42} color="var(--ink)"
          className="sw__deco" style={{ left: "48%", top: "101rem" }} />
        <BrailleDeco art={COELHOS} fontSize={8.5} opacity={0.45} color="var(--ink)"
          className="sw__deco" style={{ left: "87%", top: "68rem" }} />
        <BrailleDeco art={QUIMERA} fontSize={8} opacity={0.5} color="var(--acid)"
          className="sw__deco" style={{ left: "2%", top: "130rem" }} />
        <BrailleDeco art={FILLER_GROUP} fontSize="clamp(3.2px, 0.42vw, 6.2px)" opacity={0.2} color="var(--ink)"
          className="sw__deco" style={{ left: "4%", top: "38rem" }} />
        {/* coluna fina: centralizada VERTICALMENTE com o hologlam (pedido dela);
            fonte levemente menor + colada na borda pra caber no vão de 8% */}
        <BrailleDeco art={FILLER_COLUMN} fontSize="clamp(2.4px, 0.33vw, 5px)" opacity={0.24} color="var(--ink)"
          className="sw__deco" style={{ left: "0.5%", top: "223rem" }} />
        {/* dragão: centrado na horizontal, no vão entre pilotis e hologlam
            (china fica à direita dele) — saiu de cima do bg word (pedido dela) */}
        <div className="sw__deco" style={{ position: "absolute", left: "22%", transform: "translateX(-50%)", top: "186rem", zIndex: 0, pointerEvents: "none" }}>
          <BrailleDeco art={DRAGAO} fontSize="clamp(2.6px, 0.35vw, 5px)" opacity={0.22} color="var(--ink)" />
        </div>
        {/* Centered wide background illustration wrapped in div to prevent transform collision with Framer Motion */}
        {/* o grandão ("esse q eu tava falando!"): DO LADO do vegcoz, centrado
            no vão livre à esquerda da fileira dele */}
        <div className="sw__deco" style={{ position: "absolute", left: "27%", transform: "translateX(-50%)", top: "254rem", zIndex: 0, pointerEvents: "none" }}>
          <BrailleDeco art={ANJOS} fontSize="clamp(3.5px, 0.55vw, 8.5px)" opacity={0.32} color="var(--ink)" />
        </div>
        <PixelScrollText className="sw__bg sw__bg--b" text={bgWord} fontSize={330} color="var(--acid)" />
        {items.map((item, i) => {
          const s = SPOTS[i % SPOTS.length];
          return (
            <motion.div
              key={item.href}
              className="sw__item"
              data-sw-project={i}
              data-sw-num={item.num}
              data-sw-active={activeIndex === i ? "true" : "false"}
              style={{ left: s.left, top: s.top, width: s.w }}
              initial={reduceMotion ? false : { opacity: 0, y: 40, rotate: s.rot * 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: s.rot }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: reduceMotion ? 0 : MOTION_ENTER, ease: MOTION_EASE_OUT }}
              whileHover={reduceMotion ? undefined : { scale: 1.02, rotate: 0 }}
              onMouseEnter={(e) => { setDesktopActive(i); glowFrom(e.currentTarget); }}
              onMouseLeave={() => setDesktopActive(null)}
              onFocus={(e) => { setDesktopActive(i); glowFrom(e.currentTarget); }}
              onBlur={() => setDesktopActive(null)}
            >
              <Link href={item.href} className="sw__link hover-trigger">
                {/* sem aspect-ratio fixo aqui: quem manda é a proporção real
                    do arquivo, definida pelo próprio PixelScrollImage */}
                <div className="sw__frame">
                  <div className="sw__photo">
                    <PixelScrollImage src={item.img} alt={item.title} ratio={s.ratio} style={{ width: "100%" }} />
                  </div>
                </div>
                {/* só número + título na home: as categorias (cliente/faculdade
                    /etc.) vivem na página de cada trabalho, não aqui */}
                <span className="sw__cap">
                  <span className="sw__num">{item.num}</span>
                  <span className="sw__title">{item.title}</span>
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* A dupla horizontal encerra a seção como um filete de impressão. */}
      <div className="sw__final">
        {/* maior de propósito: é o PONTO FINAL da página (pedido dela) */}
        <BrailleDeco
          art={ANJOS_DUO}
          fontSize="clamp(2.3px, 0.5vw, 7px)"
          opacity={0.36}
          color="var(--ink)"
          className="sw__divider"
        />
      </div>
    </>
  );
}
