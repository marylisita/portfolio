"use client";

import Link from "next/link";
import React from "react";

const styles = `
.hero-btn {
  --btn-bg: var(--ink);
  --btn-border: var(--ink);
  --btn-text: var(--paper);
  /* Era var(--blue, #DCF0FF), sobra do sistema visual anterior: --blue nao
     existe mais, entao caia direto no azul claro do fallback. Rosa quente com
     a tinta escura por cima da 5.0:1. */
  --btn-hover-bg: var(--site-accent-hot, var(--acid));
  --btn-hover-text: var(--ink);
  
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6em 1em;
  border: 4px solid var(--btn-border);
  background-color: var(--btn-bg);
  color: var(--btn-text);
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  text-decoration: none;
  /* 140ms: o retorno de cor precisa chegar junto com o ponteiro. Em 300ms o
     botao parecia responder depois do gesto. */
  transition:
    transform .12s var(--ease-out, ease-out),
    background-color .14s ease-out,
    border-color .14s ease-out,
    color .14s ease-out;
  overflow: visible;
}

/* O hover era scale(1.1) rotate(5deg) em 300ms. A inclinacao ja vem do pai
   (--tag-rotate), entao girar mais 5deg desmanchava a composicao da abertura,
   e o gesto se repetia em controle comum demais para chamar tanta atencao.
   Quem responde agora e a cor; o movimento fica para o clique. */
.hero-btn:hover, .hero-btn:focus-visible {
  background-color: var(--btn-hover-bg);
  border-color: var(--btn-hover-bg);
  color: var(--btn-hover-text);
}

/* Pressao discreta: confirma o toque sem deslocar o que esta em volta. */
.hero-btn:active {
  transform: scale(.97);
}

.hero-btn p {
  display: inline-block;
  margin: 0;
  position: relative;
  color: inherit;
}

.hero-btn p::after {
  position: absolute;
  content: "";
  width: 0;
  left: 0;
  bottom: -2px; 
  background: var(--btn-hover-text);
  height: 2px; 
  transition: width .16s ease-out;
}.hero-btn:hover p::after, .hero-btn:focus-visible p::after {
  width: 100%;
}

.hero-btn:focus-visible {
  outline: none;
}

@media (prefers-reduced-motion: reduce) {
  .hero-btn { transition: background-color .14s ease-out, border-color .14s ease-out, color .14s ease-out; }
  .hero-btn:active { transform: none; }
}
`;

export default function HeroButton({
  children,
  href,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
}) {
  const content = (
    <p>{children}</p>
  );

  if (href) {
    if (href.startsWith("#")) {
      return (
        <a href={href} onClick={onClick} className={`hero-btn hover-trigger ${className}`}>
          <style>{styles}</style>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={`hero-btn hover-trigger ${className}`} onClick={onClick}>
        <style>{styles}</style>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`hero-btn hover-trigger ${className}`}>
      <style>{styles}</style>
      {content}
    </button>
  );
}
