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

// Posições à mão pra dar ritmo de colagem (não é grid). Regra que aprendi
// vendo o print: peças verticalmente próximas NÃO podem dividir faixa de X,
// senão a legenda de uma cai por cima da outra.
const SPOTS = [
  { left: "3%",  top: "0vh",   w: "clamp(200px, 24vw, 340px)", ratio: 1.25, rot: -2 },
  { left: "60%", top: "8vh",   w: "clamp(170px, 20vw, 280px)", ratio: 1.4,  rot: 3 },
  { left: "30%", top: "56vh",  w: "clamp(220px, 28vw, 400px)", ratio: 0.62, rot: 1 },
  { left: "72%", top: "82vh",  w: "clamp(150px, 17vw, 250px)", ratio: 1.15, rot: -4 },
  { left: "4%",  top: "116vh", w: "clamp(180px, 22vw, 320px)", ratio: 0.75, rot: 2 },
  { left: "45%", top: "146vh", w: "clamp(210px, 26vw, 380px)", ratio: 1.1,  rot: -1 },
  { left: "9%",  top: "194vh", w: "clamp(190px, 23vw, 340px)", ratio: 0.7,  rot: 4 },
];

const styles = `
  .sw {
    position: relative;
    /* altura do canvas: última peça (194vh) + sua altura + legenda */
    height: 236vh;
    margin: 0 auto;
    max-width: 1500px;
  }
  .sw__item { position: absolute; text-decoration: none; color: var(--ink); }
  .sw__frame {
    border: 1px solid rgba(242,241,236,.35);
    overflow: hidden;
    background: #000;
    clip-path: polygon(0 8px, 8px 8px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 8px), 0 calc(100% - 8px));
    transition: border-color .3s ease;
  }
  .sw__item:hover .sw__frame { border-color: var(--acid); }
  .sw__cap {
    display: block;
    margin-top: .7rem;
    font-family: var(--font-mono);
    font-size: .72rem;
    line-height: 1.5;
    letter-spacing: .04em;
    text-transform: lowercase;
    text-align: center;
    transition: color .3s ease;
  }
  .sw__item:hover .sw__cap { color: var(--acid); }
  .sw__num { opacity: .5; }

  @media (max-width: 860px) {
    /* no mobile a colagem vira coluna — legível e sem sobreposição */
    .sw { height: auto; display: flex; flex-direction: column; gap: 3rem; padding: 0 1.25rem; }
    .sw__item { position: static !important; width: 100% !important; transform: none !important; }
  }
`;

export default function ScatteredWorks({ items }: { items: IndexItem[] }) {
  return (
    <>
      <style>{styles}</style>
      <div className="sw">
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
              whileHover={{ scale: 1.03, rotate: 0 }}
            >
              <Link href={item.href} className="sw__item hover-trigger" style={{ position: "static", display: "block" }}>
                <div className="sw__frame" style={{ aspectRatio: String(1 / s.ratio) }}>
                  <PixelScrollImage src={item.img} alt={item.title} style={{ width: "100%", height: "100%" }} />
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
