"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PIXEL_CLIP } from "./PlaygroundHero";

/**
 * Menu criativo (referência: os rótulos soltos do barbianaliu.com, na NOSSA
 * linguagem): etiquetas lime de canto pixelado espalhadas pelo hero, cada uma
 * balançando no próprio ritmo. Surpresa: ao rolar além do hero, o menu se
 * "descola" e vira um molhinho fixo no canto, acompanhando a visita.
 * Sem barra de navegação tradicional.
 */

export type MenuItem = {
  label: string;
  href: string;        // "#ancora" ou "/rota"
  left: string;        // posição no hero
  top: string;
  rotate: number;
};

const styles = `
  .sm__tag {
    position: absolute;
    z-index: 10;
    display: inline-block;
    font-family: var(--font-mono);
    font-size: .8rem;
    font-weight: 700;
    text-transform: lowercase;
    letter-spacing: .08em;
    background: var(--acid);
    color: #000000;
    border: 3px solid #000000;
    box-shadow: 6px 6px 0px #000000;
    padding: .5rem .9rem;
    text-decoration: none;
    clip-path: ${PIXEL_CLIP};
    cursor: pointer;
    animation: sm-float 5s ease-in-out infinite;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
  }
  .sm__tag:hover {
    background: #000000;
    color: var(--acid);
    border-color: var(--acid);
    box-shadow: 0px 0px 0px #000000;
  }
  @keyframes sm-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-7px); }
  }
  .sm__cluster {
    position: fixed;
    right: 1.2rem;
    /* acima do botão flutuante de voltar ao topo, que ficava por cima */
    bottom: 5.5rem;
    z-index: 900;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: .45rem;
  }
  .sm__cluster .sm__tag {
    position: static;
    animation: none;
    font-size: .68rem;
    padding: .38rem .7rem;
  }
  @media (max-width: 720px) {
    .sm__tag { font-size: .68rem; padding: .4rem .65rem; }
    /* em tela estreita o molhinho vertical tapava as legendas dos projetos:
       vira uma fita horizontal no rodapé, à esquerda do botão de topo */
    .sm__cluster {
      flex-direction: row;
      align-items: center;
      left: .75rem;
      right: 4.8rem;
      bottom: 1rem;
      gap: .35rem;
      flex-wrap: wrap;
      justify-content: flex-start;
    }
    .sm__cluster .sm__tag { font-size: .62rem; padding: .32rem .5rem; }
  }
`;

function go(e: React.MouseEvent, href: string) {
  if (href.startsWith("#")) {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }
  // rotas ("/experiments") seguem o fluxo normal (transição do Curtains)
}

export default function ScatterMenu({ items }: { items: MenuItem[] }) {
  const [pinned, setPinned] = useState(false);

  // além do hero (~1 tela), o menu vira molhinho fixo no canto
  useEffect(() => {
    const onScroll = () => setPinned(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav aria-label="menu">
      <style>{styles}</style>

      {/* etiquetas espalhadas no hero */}
      {items.map((it, i) => (
        <motion.a
          key={it.label}
          className="sm__tag hover-trigger"
          href={it.href}
          onClick={(e) => go(e, it.href)}
          style={{ left: it.left, top: it.top, animationDelay: `${i * 0.7}s` }}
          initial={{ opacity: 0, scale: 0.5, rotate: it.rotate }}
          animate={{ opacity: pinned ? 0 : 1, scale: pinned ? 0.6 : 1, rotate: it.rotate }}
          transition={{ delay: pinned ? 0 : 1.3 + i * 0.12, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.12, rotate: 0 }}
        >
          [ {it.label} ]
        </motion.a>
      ))}

      {/* molhinho fixo no canto depois que o hero sai de cena */}
      <AnimatePresence>
        {pinned && (
          <motion.div
            className="sm__cluster"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {items.map((it, i) => (
              <motion.a
                key={it.label}
                className="sm__tag hover-trigger"
                href={it.href}
                onClick={(e) => go(e, it.href)}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0, rotate: (i % 2 ? 2 : -2) }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.1, rotate: 0 }}
              >
                [ {it.label} ]
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
