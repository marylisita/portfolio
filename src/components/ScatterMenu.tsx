"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import HeroButton from "./HeroButton";

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
  previews?: { src: string; alt: string }[];
};

const styles = `
  .sm__tag-wrapper {
    position: absolute;
    z-index: 10;
    display: inline-block;
  }
  .sm__tag-wrapper:focus-within {
    outline: 2px dotted var(--site-ink);
    outline-offset: 4px;
  }
  .sm__label {
    font-family: var(--font-subtitle), monospace;
    font-size: .95rem;
    font-weight: var(--offbit-weight-active);
    text-transform: lowercase;
    letter-spacing: var(--offbit-letter-spacing);
  }
  .sm__label {
    display: inline-flex;
    align-items: center;
    gap: .42rem;
  }
  .sm__label::before,
  .sm__label::after {
    content: "╳";
    font-family: var(--font-mono), monospace;
    font-size: .48em;
    font-weight: 400;
    opacity: .56;
  }
  .sm__tag[data-priority="primary"] {
    font-family: var(--font-subtitle), monospace;
    font-size: 1.18rem;
    font-weight: var(--offbit-weight-active);
    letter-spacing: var(--offbit-letter-spacing);
    padding: .75rem 1.45rem;
    box-shadow:
      0 0 0 8px color-mix(in srgb, var(--paper) 86%, transparent),
      7px 7px 0 color-mix(in srgb, var(--ink) 20%, transparent);
  }
  .sm__tag[data-priority="primary"]::after { content: " ↘"; }
  .sm__portal {
    position: absolute;
    top: calc(100% + .8rem);
    right: 0;
    width: min(22rem, 52vw);
    height: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3px;
    padding: 0;
    overflow: hidden;
    opacity: 0;
    background: var(--paper);
    box-shadow: 7px 8px 0 color-mix(in srgb, var(--ink) 15%, transparent);
    transform: scaleY(.15);
    transform-origin: top;
    transition: height .42s cubic-bezier(.16,1,.3,1), opacity .25s ease, transform .42s cubic-bezier(.16,1,.3,1), padding .42s cubic-bezier(.16,1,.3,1);
  }
  .sm__portal-frame {
    position: relative;
    min-width: 0;
    overflow: hidden;
    filter: grayscale(1) contrast(1.08);
  }
  .sm__portal-frame img { object-fit: cover; }
  .sm__tag[data-priority="primary"]:hover .sm__portal,
  .sm__tag[data-priority="primary"]:focus-visible .sm__portal {
    height: 7rem;
    padding: 4px;
    opacity: 1;
    transform: scaleY(1);
  }
  .sm__tag[data-priority="secondary"] {
    font-size: 1.02rem;
    padding: .62rem 1.25rem;
    opacity: .95;
    box-shadow:
      0 0 0 5px color-mix(in srgb, var(--paper) 70%, transparent),
      5px 5px 0 color-mix(in srgb, var(--ink) 16%, transparent);
  }
  .sm__tag[data-priority="tertiary"] {
    font-size: .95rem;
    padding: .58rem 1.18rem;
    opacity: .88;
    box-shadow:
      0 0 0 4px color-mix(in srgb, var(--paper) 62%, transparent),
      4px 4px 0 color-mix(in srgb, var(--ink) 13%, transparent);
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
    min-height: var(--tap-min);
    display: inline-flex;
    align-items: center;
    font-size: var(--type-micro);
    padding: .58rem .75rem;
  }
  .sm__cluster .sm__tag[data-priority="primary"] {
    order: -1;
    font-size: var(--type-micro);
    box-shadow:
      0 0 0 4px color-mix(in srgb, var(--paper) 74%, transparent),
      3px 3px 0 color-mix(in srgb, var(--ink) 14%, transparent);
  }
  .sm__cluster .sm__portal { display: none; }
  @media (max-width: 720px) {
    .sm__tag { font-size: var(--type-label); padding: .55rem .7rem; }
    /* em tela estreita o molhinho vertical tapava as legendas dos projetos:
       vira uma fita horizontal no rodapé, à esquerda do botão de topo */
    .sm__cluster {
      flex-direction: row;
      align-items: center;
      left: .5rem;
      right: .5rem;
      bottom: 7.2rem;
      gap: .28rem;
      /* uma linha só: quebrando em duas ele tapava a legenda dos projetos */
      flex-wrap: nowrap;
      justify-content: center;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .sm__cluster::-webkit-scrollbar { display: none; }
    .sm__cluster .sm__tag {
      flex: 0 0 auto;
      font-size: var(--type-micro);
      padding: .52rem .62rem;
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
      left: 48% !important; top: 64% !important;
      opacity: 1 !important; transform: rotate(2deg) !important;
      font-size: .92rem;
    }
    .sm__tag--hero[data-priority="secondary"] {
      left: 9% !important; top: 76% !important;
      opacity: .95 !important; transform: rotate(-2deg) !important;
      font-size: .88rem;
    }
    .sm__tag--hero[data-priority="tertiary"] {
      left: 55% !important; top: 81% !important;
      opacity: .88 !important; transform: rotate(1deg) !important;
      font-size: .84rem;
    }
    .sm__cluster .sm__tag[data-priority="primary"]::after { content: ""; }
    .sm__portal { display: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .sm__tag { transition: none; }
  }
`;

function go(e: React.MouseEvent, href: string) {
  if (href.startsWith("#")) {
    e.preventDefault();
    if (href === "#about") window.dispatchEvent(new Event("studio:reveal-about"));
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }
  // rotas ("/experiments") seguem o fluxo normal (transição do Curtains)
}

export default function ScatterMenu({ items }: { items: MenuItem[] }) {
  const reduceMotion = useReducedMotion();
  const [pinned, setPinned] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  // além do hero (~1 tela), o menu vira molhinho fixo no canto
  useEffect(() => {
    const onScroll = () => setPinned(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector("#contact");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: .02 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="menu">
      <style>{styles}</style>

      {/* etiquetas espalhadas no hero */}
      {items.map((it, i) => (
        <motion.div
          key={it.label}
          className="sm__tag-wrapper sm__tag--hero"
          style={{ left: it.left, top: it.top }}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.5, rotate: it.rotate }}
          animate={{
            opacity: pinned ? 0 : it.priority === "primary" ? 1 : it.priority === "secondary" ? 0.92 : 0.78,
            scale: pinned ? 0.6 : 1,
            rotate: it.rotate,
          }}
          transition={{ delay: reduceMotion || pinned ? 0 : 1.3 + i * 0.12, duration: reduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeroButton href={it.href} onClick={(e) => go(e as any, it.href)} className="sm__label">
            {`[ ${it.label} ]`}
          </HeroButton>
          {it.previews?.length ? (
            <span className="sm__portal" aria-hidden="true">
              {it.previews.slice(0, 3).map((preview) => (
                <span className="sm__portal-frame" key={preview.src}>
                  <Image src={preview.src} alt="" fill sizes="120px" />
                </span>
              ))}
            </span>
          ) : null}
        </motion.div>
      ))}

      {/* molhinho fixo no canto depois que o hero sai de cena */}
      <AnimatePresence>
        {pinned && !footerVisible && (
          <motion.div
            className="sm__cluster"
            initial={reduceMotion ? false : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {items.map((it, i) => (
              <motion.div
                key={it.label}
                className="sm__tag-wrapper"
                initial={reduceMotion ? false : { opacity: 0, x: 30 }}
                animate={{
                  opacity: it.priority === "primary" ? 1 : it.priority === "secondary" ? 0.92 : 0.78,
                  x: 0,
                  rotate: i % 2 ? 2 : -2,
                }}
                transition={{ delay: reduceMotion ? 0 : i * 0.06 }}
                style={{ position: 'relative', display: 'inline-block' }}
              >
                <HeroButton href={it.href} onClick={(e) => go(e as any, it.href)} className="sm__label">
                  {`[ ${it.label} ]`}
                </HeroButton>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
