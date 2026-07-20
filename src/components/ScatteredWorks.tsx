"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import PixelScrollImage from "./PixelScrollImage";
import type { IndexItem } from "./EditorialIndex";

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
const SPOTS = [
  { left: "2%",  top: "0vh",   w: "clamp(300px, 46vw, 700px)", ratio: 0.562, rot: -2 }, // isadora 1920x1080
  { left: "62%", top: "26vh",  w: "clamp(240px, 30vw, 440px)", ratio: 0.667, rot: 3 },  // helvetica 948x632
  { left: "30%", top: "70vh",  w: "clamp(320px, 52vw, 780px)", ratio: 0.498, rot: 1 },  // genlab 1743x868
  { left: "2%",  top: "108vh", w: "clamp(230px, 28vw, 420px)", ratio: 0.562, rot: -4 }, // ebat 2400x1350
  { left: "52%", top: "128vh", w: "clamp(280px, 40vw, 600px)", ratio: 0.643, rot: 2 },  // graduation 1401x901
  { left: "6%",  top: "180vh", w: "clamp(340px, 58vw, 880px)", ratio: 0.319, rot: -1 }, // pilotis 1600x511
  { left: "66%", top: "210vh", w: "clamp(250px, 30vw, 460px)", ratio: 0.667, rot: 4 },  // chinario 1600x1068
];

const styles = `
  .sw {
    position: relative;
    /* altura do canvas: última peça (210vh) + sua altura + legenda */
    height: 255vh;
    margin: 0 auto;
    max-width: 1500px;
  }
  .sw__item { position: absolute; z-index: 1; text-decoration: none; color: var(--ink); }

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
    font-size: clamp(200px, 30vw, 540px);
    color: var(--ink);
    opacity: .05;
    animation: sw-drift-a 80s ease-in-out infinite alternate;
  }
  .sw__bg--b {
    top: 62%;
    left: 14%;
    font-size: clamp(160px, 24vw, 430px);
    color: var(--acid);
    opacity: .045;
    animation: sw-drift-b 95s ease-in-out infinite alternate;
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
    .sw__bg { animation: none; }
  }
  .sw__frame {
    border: 1px solid rgba(28,27,24,.35);
    overflow: hidden;
    background: var(--site-tint-b);
    clip-path: polygon(0 8px, 8px 8px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 8px), 0 calc(100% - 8px));
    transition: border-color .3s ease;
  }
  .sw__item:hover .sw__frame { border-color: var(--acid); }
  .sw__cap {
    display: block;
    margin-top: .7rem;
    font-family: var(--font-body);
    font-size: .82rem;
    line-height: 1.65;
    letter-spacing: .02em;
    text-transform: lowercase;
    text-align: center;
    transition: color .3s ease;
  }
  .sw__item:hover .sw__cap { color: var(--acid); }
  /* PixelPoiiz NAO e usada: alem de nao ter acentos, o zero dela e desenhado
     parecendo um simbolo (01 saia como "@1"). Fica carregada mas sem uso. */
  .sw__num { opacity: .55; }

  @media (max-width: 860px) {
    /* no mobile a colagem vira coluna — legível e sem sobreposição */
    .sw { height: auto; display: flex; flex-direction: column; gap: 3rem; padding: 0 1.25rem; }
    .sw__item { position: static !important; width: 100% !important; transform: none !important; }
  }
`;

export default function ScatteredWorks({ items, bgWord }: { items: IndexItem[]; bgWord: string }) {
  return (
    <>
      <style>{styles}</style>
      <div className="sw">
        <div className="sw__bg sw__bg--a" aria-hidden="true">{bgWord}</div>
        <div className="sw__bg sw__bg--b" aria-hidden="true">{bgWord}</div>
        {items.map((item, i) => {
          const s = SPOTS[i % SPOTS.length];
          return (
            <motion.div
              key={item.href}
              className="sw__item"
              style={{ left: s.left, top: s.top, width: s.w }}
              initial={{ opacity: 0, y: 40, rotate: s.rot * 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: s.rot }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02, rotate: 0 }}
            >
              <Link href={item.href} className="sw__item hover-trigger" style={{ position: "static", display: "block" }}>
                {/* sem aspect-ratio fixo aqui: quem manda é a proporção real
                    do arquivo, definida pelo próprio PixelScrollImage */}
                <div className="sw__frame">
                  <PixelScrollImage src={item.img} alt={item.title} ratio={s.ratio} style={{ width: "100%" }} />
                </div>
                <span className="sw__cap">
                  <span className="sw__num">{item.num}</span> {item.title}
                  <br />
                  {item.tags}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
