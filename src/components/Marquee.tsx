"use client";

import { useEffect, useRef } from "react";

const ORNAMENT = "⋆ ˚｡⋆୨♡୧⋆ ˚｡⋆  ".repeat(24);

const styles = `
  .mq-frame {
    position: relative;
    z-index: 3;
    overflow: hidden;
    /* Faixa preta com a fonte em creme (16.3:1) e as estrelas em rosa quente.
       O rosa entra como pontuação entre as palavras, não como fundo: sobre a
       tinta escura ele rende 5.0:1 e fica mais alto do que quando era o
       fundo inteiro. */
    background: var(--ink);
    color: var(--paper);
    margin-top: calc(0px - var(--hero-art-lift, 0px));
    padding: .72rem 0;
    isolation: isolate;
  }
  .mq__ornament {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 2;
    overflow: hidden;
    font-family: var(--font-mono), monospace;
    font-size: clamp(.48rem, .62vw, .66rem);
    line-height: 1;
    letter-spacing: .08em;
    text-align: center;
    white-space: nowrap;
    color: var(--ascii-edge, var(--site-accent-hot));
    opacity: .5;
    pointer-events: none;
    user-select: none;
  }
  .mq__ornament--top {
    top: .08rem;
  }
  .mq__ornament--bottom {
    bottom: .08rem;
    transform: rotate(180deg);
  }
  .mq {
    overflow: hidden;
    padding: .88rem 0 .84rem;
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
    display: inline-flex;
    align-items: center;
    font-family: var(--font-subtitle), monospace;
    font-size: clamp(1.1rem, 2.4vw, 2rem);
    font-weight: var(--offbit-weight-active);
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
    white-space: nowrap;
  }
  .mq__star {
    display: inline-grid;
    place-items: center;
    margin-inline: clamp(1.05rem, 1.45vw, 1.45rem);
    /* As estrelas entre as palavras: rosa quente sobre a faixa preta, 5.0:1. */
    color: var(--site-accent-hot, var(--acid));
    font-size: .82em;
    line-height: 1;
    opacity: .92;
    transform: translateY(.02em);
  }

  /* A estrela volta ao rosa chapado. O glitter agora vive nos pontos da
     fonte, e o ✳︎ (Arial, traço contínuo) não tem ponto nenhum para acender --
     insistir nele só competia com as palavras. Some de quebra o loop que eu
     não conseguia medir no tamanho dela. */

  /* --- Glitter das palavras ------------------------------------------------
     Faíscas do tamanho de um ponto da fonte, espalhadas sobre a base rosa,
     mais duas camadas largas de fumaça por baixo.

     Não é preciso mirar os pontos: o recorte é no texto e a OffBit DotBold JÁ
     é desenhada em pontos, então cada faísca que cai dentro de um ponto
     acende AQUELE ponto e o resto é aparado pelo glifo. É como glitter se
     comporta de fato -- ponto isolado pegando luz, não faixa varrendo.

     As faíscas têm queda suave em vez de borda dura: borda dura vira pixel
     aceso, queda suave vira brasa. A fumaça são blobs grandes, de alfa baixo,
     que passam por trás e adensam o brilho em trechos da palavra.

     Ladrilho em PIXEL, nunca em porcentagem: assim cada camada anda
     exatamente um ladrilho por ciclo e o fecho é exato, independente da
     largura da palavra -- que foi o defeito do facho anterior. Direções
     opostas evitam que o conjunto pareça deslizar para um lado só.

     Contraste: a base é o rosa quente (5.0:1 sobre a faixa preta) e TODAS as
     camadas por cima são claras -- branco ou rosa pálido. O contraste só
     sobe, nunca desce. Fumaça escura aqui derrubaria a palavra abaixo de AA,
     por isso não existe. */
  .mq__word {
    background-image:
      radial-gradient(circle at 22% 34%, rgba(255,255,255,.95) 0 2%, rgba(255,255,255,.5) 6%, rgba(255,255,255,0) 14%),
      radial-gradient(circle at 71% 66%, rgba(255,255,255,.9) 0 2%, rgba(255,255,255,.45) 5%, rgba(255,255,255,0) 12%),
      radial-gradient(circle at 44% 18%, rgba(255,232,244,.9) 0 2%, rgba(255,232,244,.4) 6%, rgba(255,232,244,0) 13%),
      radial-gradient(circle at 88% 82%, rgba(255,255,255,.85) 0 2%, rgba(255,255,255,.4) 5%, rgba(255,255,255,0) 11%),
      radial-gradient(circle at 34% 58%, rgba(255,255,255,.26) 0 12%, rgba(255,255,255,0) 58%),
      radial-gradient(circle at 76% 32%, rgba(255,217,236,.3) 0 14%, rgba(255,217,236,0) 62%),
      linear-gradient(var(--site-accent-hot), var(--site-accent-hot));
    background-size:
      43px 43px,
      67px 67px,
      37px 37px,
      59px 59px,
      97px 97px,
      113px 113px,
      100% 100%;
    background-position: 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0;
    background-repeat: repeat;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    animation: mq-sparkle 9s linear infinite;
  }

  /* Cada camada percorre exatamente o seu proprio ladrilho. */
  @keyframes mq-sparkle {
    to {
      background-position:
        43px -43px,
        -67px 67px,
        37px 37px,
        -59px -59px,
        97px 97px,
        -113px 113px,
        0 0;
    }
  }

  /* Palavras vizinhas fora de fase, senão a faixa inteira pulsa junto. */
  .mq__item:nth-child(2n) .mq__word { animation-delay: -3s; }
  .mq__item:nth-child(3n) .mq__word { animation-delay: -6s; }

  /* Sem recorte em texto a palavra sumiria: volta ao creme, que é o estado
     mais legível (16.3:1) e o que a faixa usava antes. */
  @supports not ((background-clip: text) or (-webkit-background-clip: text)) {
    .mq__word {
      background-image: none;
      color: var(--paper);
      -webkit-text-fill-color: currentColor;
      animation: none;
    }
  }

  @keyframes mq-roll {
    to { transform: translate3d(-50%, 0, 0); }
  }
  @media (hover: hover) {
    .mq-frame:hover .mq__track { animation-play-state: paused; }
  }
  .mq-frame[data-visible="false"] .mq__track {
    animation-play-state: paused;
  }
  @media (max-width: 640px) {
    .mq-frame { padding-block: .62rem; }
    .mq__ornament { font-size: .46rem; }
    .mq { padding-block: .78rem .75rem; }
  }
  /* Em aparelho fraco o glitter sai inteiro, não só a animação: faísca parada
     não é faísca, é uma mancha clara na letra. */
  html[data-motion="lite"] .mq__word {
    background-image: none;
    color: var(--paper);
    -webkit-text-fill-color: currentColor;
    animation: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .mq__word {
      background-image: none;
      color: var(--paper);
      -webkit-text-fill-color: currentColor;
      animation: none;
    }
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
      <div ref={rootRef} className="mq-frame" data-visible="true" aria-hidden="true">
        <div className="mq__ornament mq__ornament--top">{ORNAMENT}</div>
        <div className="mq">
          <div className="mq__track">
            {[0, 1].map((group) => (
              <div className="mq__group" key={group}>
                {items.map((item, index) => (
                  <span className="mq__item" key={`${group}-${item}-${index}`}>
                    <span className="mq__word">{item}</span>
                    <span className="text-star mq__star">✳︎</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mq__ornament mq__ornament--bottom">{ORNAMENT}</div>
      </div>
    </>
  );
}
