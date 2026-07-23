"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Scramble POR LETRA no hover — na linguagem editorial/orgânica (pedido dela,
 * 2026-07-23), NÃO na de terminal: nada de #$@%. A letra "derrete" devagar por
 * 2-3 símbolos de preenchimento (blocos de densidade, ondas e os nossos
 * fofinhos, coraçãozinho incluso) e se consolida de volta. Passos lentos
 * (~110ms) de propósito: transição suave, não glitch piscando.
 *
 * Leve: só age no mouseenter da letra; sem loop rodando. Acessível: o texto
 * real fica no aria-label do wrapper, as letras animadas são aria-hidden.
 */
const POOL = ["♡", "✦", "✧", "⋆", "░", "▒", "~", "≈", "°", "⊹", "·"];

export default function ScrambleText({ text }: { text: string }) {
  const reduceMotion = useReducedMotion();
  const [chars, setChars] = useState<string[]>(() => Array.from(text));
  const busy = useRef<Set<number>>(new Set());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    setChars(Array.from(text));
    busy.current.clear();
  }, [text]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const scramble = (i: number) => {
    if (reduceMotion) return;
    const original = Array.from(text)[i];
    if (!original || original.trim() === "" || busy.current.has(i)) return;
    busy.current.add(i);
    const steps = 3 + ((Math.random() * 2) | 0); // 3-4 quadros de estampa
    for (let s = 0; s <= steps; s++) {
      const t = setTimeout(() => {
        setChars((prev) => {
          const next = prev.slice();
          // ESTAMPA (pedido dela): 2 símbolos repetidos em xadrez 3x3 no
          // espaço da letra, regenerados a cada quadro — todos "piscam" juntos
          next[i] =
            s === steps
              ? original
              : (() => {
                  const a = POOL[(Math.random() * POOL.length) | 0];
                  let b = POOL[(Math.random() * POOL.length) | 0];
                  if (b === a) b = POOL[(POOL.indexOf(a) + 3) % POOL.length];
                  return Array.from({ length: 9 }, (_, k) => (k % 2 === 0 ? a : b)).join("");
                })();
          return next;
        });
        if (s === steps) busy.current.delete(i);
      }, 80 + s * 110);
      timers.current.push(t);
    }
  };

  const originals = Array.from(text);

  return (
    <span aria-label={text}>
      {chars.map((c, i) => {
        const scrambling = c !== originals[i];
        return (
          <span
            key={i}
            aria-hidden="true"
            onMouseEnter={() => scramble(i)}
            style={{ pointerEvents: "auto" }}
          >
            {scrambling ? (
              <span
                style={{
                  display: "inline-grid",
                  gridTemplateColumns: "repeat(3, auto)",
                  gap: ".06em .12em",
                  fontSize: ".2em",
                  lineHeight: 1,
                  letterSpacing: 0,
                  verticalAlign: "middle",
                }}
              >
                {Array.from(c).map((s, k) => (
                  <span key={k}>{s}</span>
                ))}
              </span>
            ) : (
              c
            )}
          </span>
        );
      })}
    </span>
  );
}
