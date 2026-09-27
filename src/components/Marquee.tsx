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
    /* As estrelas entre as palavras: rosa quente sobre a faixa preta, 5.0:1.
       É também a cor de base do glitter e o estado final se o recorte em
       texto não existir. */
    color: var(--site-accent-hot, var(--acid));
    font-size: .82em;
    line-height: 1;
    opacity: .92;
    transform: translateY(.02em);
  }

  /* --- Glitter -------------------------------------------------------------
     Glitter é material especular: só lê como brilho quando um ponto de luz
     PASSA por ele. A esta escala (14-26px, traço fino) textura parada vira
     sujeira, então o efeito é um facho claro viajando pelo glifo, recortado
     no texto, sobre a base rosa. A camada de ruído em "overlay" é o mesmo
     feTurbulence que o site já usa no grão de filme -- sem asset novo.

     Seletor com dois níveis para vencer o ".text-star" do globals.css, que
     força "color: currentColor" no mesmo peso. */
  .mq__item .mq__star {
    /* Sem camada de ruído: a esta escala o feTurbulence em overlay vira cinza
       sujo dentro do traço em vez de brilho -- conferido a 4x. O que lê como
       glitter aqui é só o facho especular viajando. */
    background-image:
      linear-gradient(
        /* Horizontal, não inclinado: a estrela é um glifo quase quadrado, e
           num ladrilho desses a inclinação faz a emenda desencontrar entre o
           topo e a base. Na palavra 100deg funciona porque ela é muito mais
           larga que alta. */
        90deg,
        var(--site-accent-hot) 0%,
        var(--site-accent-hot) 36%,
        #FFE3F1 45%,
        #FFFFFF 50%,
        #FFE3F1 55%,
        var(--site-accent-hot) 64%,
        var(--site-accent-hot) 100%
      );
    /* Ladrilhado, não recortado. Com no-repeat os extremos do percurso mostram
       trechos DIFERENTES do gradiente, e a volta ao inicio vira um salto
       visivel. Repetindo, e deslocando exatamente um ladrilho por ciclo, o
       quadro final é identico ao inicial por construção.
       A conta: com background-size 200%, a imagem tem 2x a largura da caixa,
       então o deslocamento de background-position X% vale (W - 2W)*X/100 =
       -W*X/100. Em X=200% isso dá -2W, exatamente um ladrilho. */
    background-size: 200% 100%;
    background-position: 0 0;
    background-repeat: repeat;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    animation: mq-glint 4.2s ease-in-out infinite;
  }

  /* Glitter de verdade não pisca em uníssono: as estrelas entram defasadas. */
  .mq__item:nth-child(3n) .mq__star { animation-delay: -1.4s; }
  .mq__item:nth-child(3n + 1) .mq__star { animation-delay: -2.8s; }

  @keyframes mq-glint {
    to { background-position: 200% 0; }
  }

  /* --- Glitter das palavras ------------------------------------------------
     A OffBit DotBold é desenhada em pontos, então cada ponto funciona como
     uma lantejoula: o facho atravessando as fileiras acende alguns e deixa
     outros no rosa. É o suporte que a estrela, de traço fino, não tinha.

     O gradiente traz TRÊS brilhos em vez de um: numa palavra longa mais de um
     ponto acende ao mesmo tempo, que é o que separa paetê de reflexo.

     Contraste: a base é o rosa quente (5.0:1 sobre a faixa) e os picos vão
     para o branco (16:1), então a palavra nunca cai abaixo de AA. */
  .mq__word {
    background-image:
      linear-gradient(
        /* Ângulo quase horizontal: quanto mais inclinado, mais a emenda do
           ladrilho desencontra entre o topo e a base da linha. */
        100deg,
        var(--site-accent-hot) 0%,
        var(--site-accent-hot) 8%,
        #FFD9EC 13%,
        #FFFFFF 16%,
        #FFD9EC 19%,
        var(--site-accent-hot) 25%,
        var(--site-accent-hot) 41%,
        #FFE8F4 46%,
        #FFFFFF 49%,
        #FFE8F4 52%,
        var(--site-accent-hot) 58%,
        var(--site-accent-hot) 74%,
        #FFD9EC 79%,
        #FFFFFF 82%,
        #FFD9EC 85%,
        var(--site-accent-hot) 92%,
        var(--site-accent-hot) 100%
      );
    /* Ladrilhado pelo mesmo motivo da estrela. As pontas do gradiente são as
       duas rosa cheio, então a emenda entre ladrilhos não aparece. */
    background-size: 200% 100%;
    background-position: 0 0;
    background-repeat: repeat;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    animation: mq-glint 5.6s linear infinite;
  }

  /* Palavras vizinhas fora de fase, senão a faixa inteira pulsa junto. */
  .mq__item:nth-child(2n) .mq__word { animation-delay: -1.9s; }
  .mq__item:nth-child(3n) .mq__word { animation-delay: -3.7s; }

  /* Sem recorte em texto a palavra sumiria: volta ao creme, que é o estado
     mais legível (16.3:1) e o que a faixa usava antes do teste. */
  @supports not ((background-clip: text) or (-webkit-background-clip: text)) {
    .mq__word {
      background-image: none;
      color: var(--paper);
      -webkit-text-fill-color: currentColor;
      animation: none;
    }
  }

  /* Sem o recorte em texto o glifo ficaria invisível: volta para o rosa chapado. */
  @supports not ((background-clip: text) or (-webkit-background-clip: text)) {
    .mq__item .mq__star {
      background-image: none;
      color: var(--site-accent-hot, var(--acid));
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
  /* Em aparelho fraco o glitter sai inteiro, não só a animação: um facho
     parado no meio do glifo não é glitter, é um borrão claro. */
  html[data-motion="lite"] .mq__item .mq__star {
    background-image: none;
    color: var(--site-accent-hot, var(--acid));
    -webkit-text-fill-color: currentColor;
    animation: none;
  }

  html[data-motion="lite"] .mq__word {
    background-image: none;
    color: var(--paper);
    -webkit-text-fill-color: currentColor;
    animation: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .mq__item .mq__star {
      background-image: none;
      color: var(--site-accent-hot, var(--acid));
      -webkit-text-fill-color: currentColor;
      animation: none;
    }
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
