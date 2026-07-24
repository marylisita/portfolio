"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Scramble Tipográfico Editorial para o Header:
 * - Apenas na letra focada (no hover).
 * - Sem quebrar linha ou alterar a largura do texto (overlay absoluto preservando as métricas exatas da letra).
 * - Transição em 5 passos de metamorfose ASCII.
 * - Cores pasteis/editoriais sutis (lilás, rosa, verde ácido sutil, creme, tinta).
 */

const POOL = ["♡", "✦", "✧", "⋆", "░", "▒", "▓", "≈", "°", "⊹", "·", "⠂", "⠁", "✿", "₊", "˚", "✳"];

const SUBTLE_COLORS = [
  "#d8b4fe", // lilás suave
  "#f472b6", // rosa pastel
  "#a3e635", // verde ácido sutil
  "#fef08a", // dourado/creme
  "#99f6e4", // azul-verde sutil
  "#1c1b18", // tinta escura dominante
  "#5b564a", // cinza quente
];

type MiniCell = {
  symbol: string;
  color: string;
  rotate: number;
  scale: number;
  opacity: number;
};

type CharState = {
  original: string;
  scrambling: boolean;
  grid: MiniCell[];
};

function generateGrid(): MiniCell[] {
  return Array.from({ length: 9 }, () => {
    const symbol = POOL[Math.floor(Math.random() * POOL.length)];
    const color = SUBTLE_COLORS[Math.floor(Math.random() * SUBTLE_COLORS.length)];
    const rotate = (Math.random() - 0.5) * 36;
    const scale = 0.85 + Math.random() * 0.4;
    const opacity = 0.7 + Math.random() * 0.3;
    return { symbol, color, rotate, scale, opacity };
  });
}

function ScrambleTextContent({ text }: { text: string }) {
  const reduceMotion = useReducedMotion();
  const originals = Array.from(text);
  const [states, setStates] = useState<CharState[]>(() =>
    originals.map((c) => ({ original: c, scrambling: false, grid: [] }))
  );
  const busy = useRef<Set<number>>(new Set());
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>[]>>(new Map());

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      activeTimers.forEach((tList) => tList.forEach(clearTimeout));
      activeTimers.clear();
    };
  }, []);

  const scramble = (i: number) => {
    if (reduceMotion) return;
    const original = originals[i];
    if (!original || original.trim() === "" || busy.current.has(i)) return;

    busy.current.add(i);

    const existing = timers.current.get(i);
    if (existing) existing.forEach(clearTimeout);

    const charTimers: ReturnType<typeof setTimeout>[] = [];
    const steps = 5;
    const stepDuration = 85;

    for (let s = 0; s <= steps; s++) {
      const t = setTimeout(() => {
        setStates((prev) => {
          const next = [...prev];
          if (s === steps) {
            next[i] = { original, scrambling: false, grid: [] };
          } else {
            next[i] = {
              original,
              scrambling: true,
              grid: generateGrid(),
            };
          }
          return next;
        });

        if (s === steps) {
          busy.current.delete(i);
          timers.current.delete(i);
        }
      }, s * stepDuration);

      charTimers.push(t);
    }

    timers.current.set(i, charTimers);
  };

  return (
    <span aria-label={text} style={{ display: "inline", whiteSpace: "pre-wrap" }}>
      {states.map((st, i) => {
        const isSpace = st.original === " ";
        if (isSpace) {
          return <span key={i}> </span>;
        }

        return (
          <span
            key={i}
            aria-hidden="true"
            onMouseEnter={() => scramble(i)}
            style={{
              display: "inline-block",
              position: "relative",
              pointerEvents: "auto",
              whiteSpace: "pre",
              cursor: "inherit",
            }}
          >
            {/* Mantém a largura e altura EXATAS da letra original para impedir qualquer quebra de linha */}
            <span style={{ opacity: st.scrambling ? 0 : 1, display: "inline-block" }}>
              {st.original}
            </span>

            {/* Matriz 3x3 desenhada em overlay absoluto dentro dos limites exatos da letra */}
            {st.scrambling && st.grid.length === 9 && (
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "inline-grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: ".02em .04em",
                  fontSize: ".24em",
                  lineHeight: 1,
                  letterSpacing: 0,
                  alignItems: "center",
                  justifyItems: "center",
                  pointerEvents: "none",
                  overflow: "hidden",
                }}
              >
                {st.grid.map((cell, k) => (
                  <span
                    key={k}
                    style={{
                      display: "inline-block",
                      color: cell.color,
                      transform: `rotate(${cell.rotate}deg) scale(${cell.scale})`,
                      opacity: cell.opacity,
                      transition: "all 80ms ease-out",
                      animation: "miniAsciiPulse 120ms ease-out forwards",
                      textAlign: "center",
                      fontFamily: "var(--font-mono), monospace",
                      textShadow: cell.color !== "#1c1b18" ? `0 0 4px ${cell.color}` : "none",
                    }}
                  >
                    {cell.symbol}
                  </span>
                ))}
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

export default function ScrambleText({ text }: { text: string }) {
  return <ScrambleTextContent key={text} text={text} />;
}
