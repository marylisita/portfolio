"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

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
  priority: "primary" | "secondary" | "tertiary";
};

const styles = `
  .sm__tag {
    position: absolute;
    z-index: 10;
    display: inline-block;
    font-family: var(--font-body);
    font-size: .78rem;
    font-weight: 600;
    text-transform: lowercase;
    letter-spacing: .04em;
    /* bloco sólido chapado, sem borda nem sombra (referência barbianaliu) */
    background: var(--ink);
    color: var(--paper);
    padding: .42rem .8rem;
    text-decoration: none;
    cursor: pointer;
    animation: sm-float 5s ease-in-out infinite;
    transition: background var(--duration-fast) var(--ease-default), color var(--duration-fast) var(--ease-default), box-shadow var(--duration-fast) var(--ease-out);
  }
  .sm__tag:hover {
    background: var(--acid);
    color: var(--paper);
  }
  .sm__tag:focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 5px;
  }
  .sm__tag[data-priority="primary"] {
    font-family: var(--font-subtitle), monospace;
    font-size: .9rem;
    font-weight: var(--offbit-weight-active);
    letter-spacing: var(--offbit-letter-spacing);
    padding: .58rem 1rem;
    box-shadow: 0 0 0 7px rgba(237,231,218,.76), 5px 5px 0 rgba(28,27,24,.14);
  }
  .sm__tag[data-priority="primary"]::after { content: " ↘"; }
  .sm__tag[data-priority="secondary"] { opacity: .92; }
  .sm__tag[data-priority="tertiary"] { opacity: .78; }
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
  .sm__cluster .sm__tag[data-priority="primary"] {
    order: -1;
    font-size: .72rem;
    box-shadow: 0 0 0 4px rgba(237,231,218,.72), 3px 3px 0 rgba(28,27,24,.12);
  }
  @media (max-width: 720px) {
    .sm__tag { font-size: .68rem; padding: .4rem .65rem; }
    /* em tela estreita o molhinho vertical tapava as legendas dos projetos:
       vira uma fita horizontal no rodapé, à esquerda do botão de topo */
    .sm__cluster {
      flex-direction: row;
      align-items: center;
      left: .6rem;
      right: 4.6rem;
      bottom: 1rem;
      gap: .28rem;
      /* uma linha só: quebrando em duas ele tapava a legenda dos projetos */
      flex-wrap: nowrap;
      justify-content: flex-start;
    }
    .sm__cluster .sm__tag {
      font-size: .56rem;
      padding: .3rem .42rem;
      letter-spacing: .04em;
    }
    /* No mobile, a navegação é uma trilha visual estável abaixo do título.
       O !important também evita que o estado inicial do Motion a deixe invisível
       em navegadores que suspendem animações durante a primeira pintura. */
    .sm__tag--hero {
      display: inline-block !important;
      visibility: visible !important;
      animation: none !important;
    }
    .sm__tag--hero[data-priority="primary"] {
      left: 52% !important; top: 66% !important;
      opacity: 1 !important; transform: rotate(2deg) !important;
      font-size: .82rem;
    }
    .sm__tag--hero[data-priority="secondary"] {
      left: 64% !important; top: 74% !important;
      opacity: .92 !important; transform: rotate(-2deg) !important;
    }
    .sm__tag--hero[data-priority="tertiary"] {
      left: 38% !important; top: 82% !important;
      opacity: .78 !important; transform: rotate(1deg) !important;
    }
    .sm__cluster .sm__tag[data-priority="primary"]::after { content: ""; }
  }
  @media (prefers-reduced-motion: reduce) {
    .sm__tag { animation: none; transition: none; }
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
  const reduceMotion = useReducedMotion();
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
          className="sm__tag sm__tag--hero hover-trigger"
          data-priority={it.priority}
          href={it.href}
          onClick={(e) => go(e, it.href)}
          style={{ left: it.left, top: it.top, animationDelay: `${i * 0.7}s` }}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.5, rotate: it.rotate }}
          animate={{
            opacity: pinned ? 0 : it.priority === "primary" ? 1 : it.priority === "secondary" ? 0.92 : 0.78,
            scale: pinned ? 0.6 : 1,
            rotate: it.rotate,
          }}
          transition={{ delay: reduceMotion || pinned ? 0 : 1.3 + i * 0.12, duration: reduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          whileHover={reduceMotion ? undefined : { scale: it.priority === "primary" ? 1.06 : 1.1, rotate: 0 }}
        >
          [ {it.label} ]
        </motion.a>
      ))}

      {/* molhinho fixo no canto depois que o hero sai de cena */}
      <AnimatePresence>
        {pinned && (
          <motion.div
            className="sm__cluster"
            initial={reduceMotion ? false : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {items.map((it, i) => (
              <motion.a
                key={it.label}
                className="sm__tag hover-trigger"
                data-priority={it.priority}
                href={it.href}
                onClick={(e) => go(e, it.href)}
                initial={reduceMotion ? false : { opacity: 0, x: 30 }}
                animate={{
                  opacity: it.priority === "primary" ? 1 : it.priority === "secondary" ? 0.92 : 0.78,
                  x: 0,
                  rotate: i % 2 ? 2 : -2,
                }}
                transition={{ delay: reduceMotion ? 0 : i * 0.06 }}
                whileHover={reduceMotion ? undefined : { scale: 1.08, rotate: 0 }}
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
