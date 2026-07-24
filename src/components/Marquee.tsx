"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Faixa lime que reage à velocidade do scroll (pedido dela): rolar acelera o
 * corre-corre e inclina/estica a faixa; parada, ela só deriva devagar. Sem
 * travar nada — é rAF puro modulando um translateX próprio (não o keyframe CSS).
 */
const styles = `
  .mq {
    overflow: hidden;
    border-top: 1px solid var(--ink);
    border-bottom: 1px solid var(--ink);
    background: var(--acid);
    color: var(--paper);
    padding: .75rem 0;
  }
  .mq__track {
    display: flex;
    width: max-content;
    will-change: transform;
    transform-origin: center;
  }
  .mq__item {
    font-family: var(--font-subtitle), monospace;
    font-size: clamp(1.1rem, 2.4vw, 2rem);
    font-weight: var(--offbit-weight-active);
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
    padding-right: 2.5rem;
    white-space: nowrap;
  }
  @media (prefers-reduced-motion: reduce) {
    .mq__track { transform: none !important; }
  }
`;

export default function Marquee({ items }: { items: string[] }) {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduceMotion) return;

    let offset = 0; // px; envolve em metade da largura (a lista é duplicada)
    let half = track.scrollWidth / 2 || 1;
    let velocity = 0; // velocidade do scroll acumulada, decai a cada frame
    let lastY = window.scrollY;
    let paused = false;
    let raf = 0;
    let running = false;

    const BASE = 0.55; // deriva parada (px/frame)

    const measure = () => { half = track.scrollWidth / 2 || 1; };
    const onScroll = () => {
      const y = window.scrollY;
      velocity += y - lastY;
      lastY = y;
    };
    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };

    const band = track.parentElement;
    band?.addEventListener("mouseenter", onEnter);
    band?.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    const tick = () => {
      velocity *= 0.86; // decaimento suave
      const speed = Math.abs(velocity);
      const boost = Math.min(70, speed) * 0.16; // rolar rápido acelera
      if (!paused) offset += BASE + boost;
      if (offset >= half) offset -= half;
      // inclina/estica conforme a direção e a força do scroll
      const skew = Math.max(-7, Math.min(7, velocity * 0.11));
      const stretch = 1 + Math.min(0.05, speed * 0.001);
      track.style.transform = `translateX(${-offset}px) skewX(${skew}deg) scaleY(${1 / stretch}) scaleX(${stretch})`;
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const startTick = () => { if (running) return; running = true; raf = requestAnimationFrame(tick); };
    const stopTick = () => { running = false; cancelAnimationFrame(raf); raf = 0; };

    // pausa o rAF quando a faixa sai da tela (regra da skill: pause off-screen)
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) startTick(); else stopTick(); },
      { rootMargin: "120px" },
    );
    if (band) io.observe(band); else startTick();

    measure();

    return () => {
      stopTick();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      band?.removeEventListener("mouseenter", onEnter);
      band?.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
    };
  }, [reduceMotion]);

  return (
    <>
      <style>{styles}</style>
      <div className="mq" aria-hidden="true">
        <div className="mq__track" ref={trackRef}>
          {[...items, ...items].map((it, i) => (
            <span className="mq__item" key={i}>
              {it} <span className="text-star" style={{ opacity: 0.5 }}>✳︎</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
