"use client";

const styles = `
  .mq {
    overflow: hidden;
    border-top: 1px solid var(--ink);
    border-bottom: 1px solid var(--ink);
    background: var(--acid);
    color: #111111;
    padding: .75rem 0;
  }
  .mq__track {
    display: flex;
    width: max-content;
    animation: mq-scroll 38s linear infinite;
  }
  .mq:hover .mq__track { animation-play-state: paused; }
  .mq__item {
    font-family: var(--font-grotesk);
    font-size: clamp(1.1rem, 2.4vw, 2rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    text-transform: lowercase;
    padding-right: 2.5rem;
    white-space: nowrap;
  }
  /* Duas cópias da lista → o loop fecha em -50%. */
  @keyframes mq-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @media (prefers-reduced-motion: reduce) {
    .mq__track { animation: none; }
  }
`;

export default function Marquee({ items }: { items: string[] }) {
  return (
    <>
      <style>{styles}</style>
      <div className="mq" aria-hidden="true">
        <div className="mq__track">
          {[...items, ...items].map((it, i) => (
            <span className="mq__item" key={i}>
              {it} <span style={{ opacity: 0.5 }}>✳</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
