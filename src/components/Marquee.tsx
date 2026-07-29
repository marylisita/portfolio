"use client";

import { useEffect, useRef } from "react";

const styles = `
  .mq {
    position: relative;
    z-index: 3;
    overflow: hidden;
    background: var(--acid);
    color: var(--paper);
    margin-top: calc(0px - var(--hero-art-lift, 0px));
    padding: 1rem 0 .95rem;
    isolation: isolate;
  }
  .mq::before,
  .mq::after {
    content: "· . ── ✦ ── . ·   · . ── ✦ ── . ·   · . ── ✦ ── . ·   · . ── ✦ ── . ·   · . ── ✦ ── . ·   · . ── ✦ ── . ·   · . ── ✦ ── . ·   · . ── ✦ ── . ·   · . ── ✦ ── . ·   · . ── ✦ ── . ·";
    position: absolute;
    left: 0;
    right: 0;
    z-index: 2;
    overflow: hidden;
    color: var(--paper);
    font-family: var(--font-mono), monospace;
    font-size: .46rem;
    line-height: 1;
    letter-spacing: .16em;
    text-align: center;
    white-space: nowrap;
    opacity: .3;
    pointer-events: none;
  }
  .mq::before {
    top: .12rem;
  }
  .mq::after {
    bottom: .1rem;
  }
  .mq__track {
    position: relative;
    z-index: 1;
    display: flex;
    width: max-content;
    animation: mq-roll 32s linear infinite;
    will-change: transform;
  }
  .mq__group {
    display: flex;
    flex: 0 0 auto;
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
  @keyframes mq-roll {
    to { transform: translate3d(-50%, 0, 0); }
  }
  @media (hover: hover) {
    .mq:hover .mq__track { animation-play-state: paused; }
  }
  .mq[data-visible="false"] .mq__track {
    animation-play-state: paused;
  }
  @media (prefers-reduced-motion: reduce) {
    .mq__track { animation: none; transform: none; }
    .mq__group:nth-child(2) { display: none; }
  }
`;

export default function Marquee({ items }: { items: string[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        root.dataset.visible = entry.isIntersecting ? "true" : "false";
      },
      { rootMargin: "120px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div ref={rootRef} className="mq" data-visible="true" aria-hidden="true">
        <div className="mq__track">
          {[0, 1].map((group) => (
            <div className="mq__group" key={group}>
              {items.map((item, index) => (
                <span className="mq__item" key={`${group}-${item}-${index}`}>
                  {item} <span className="text-star" style={{ opacity: 0.5 }}>✳︎</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
