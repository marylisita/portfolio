"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Scramble Tipográfico Editorial para o Header:
 * - Apenas na letra focada (no hover).
 * - Sem quebrar linha ou alterar a largura do texto (overlay absoluto preservando as métricas exatas da letra).
 * - Transição em passos curtos via requestAnimationFrame e mutação DOM direta (60fps garantido).
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

function ScrambleLetter({ original, reduceMotion }: { original: string; reduceMotion: boolean | null }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const originalRef = useRef<HTMLSpanElement>(null);
  const gridRef = useRef<HTMLSpanElement>(null);
  const cellsRef = useRef<HTMLSpanElement[]>([]);
  const busy = useRef(false);
  const rafId = useRef<number>(0);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  const scramble = () => {
    if (reduceMotion || busy.current) return;
    busy.current = true;

    if (originalRef.current) originalRef.current.style.opacity = "0";
    if (gridRef.current) gridRef.current.style.opacity = "1";

    const steps = 5;
    const stepDuration = 85;
    let currentStep = 0;
    let lastTime = performance.now();

    const tick = (time: number) => {
      if (time - lastTime >= stepDuration) {
        lastTime = time;
        currentStep++;

        if (currentStep > steps) {
          if (originalRef.current) originalRef.current.style.opacity = "1";
          if (gridRef.current) gridRef.current.style.opacity = "0";
          busy.current = false;
          return;
        }

        // Mutate grid directly without React state overhead
        cellsRef.current.forEach((cell) => {
          if (!cell) return;
          const symbol = POOL[Math.floor(Math.random() * POOL.length)];
          const color = SUBTLE_COLORS[Math.floor(Math.random() * SUBTLE_COLORS.length)];
          const rotate = (Math.random() - 0.5) * 36;
          const scale = 0.85 + Math.random() * 0.4;
          const opacity = 0.7 + Math.random() * 0.3;

          cell.innerText = symbol;
          cell.style.color = color;
          cell.style.transform = `rotate(${rotate}deg) scale(${scale})`;
          cell.style.opacity = opacity.toString();
        });
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
  };

  return (
    <span
      ref={containerRef}
      aria-hidden="true"
      onMouseEnter={scramble}
      style={{
        display: "inline-block",
        position: "relative",
        pointerEvents: "auto",
        whiteSpace: "pre",
        cursor: "inherit",
      }}
    >
      <span ref={originalRef} style={{ opacity: 1, display: "inline-block" }}>
        {original}
      </span>

      <span
        ref={gridRef}
        style={{
          opacity: 0,
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
        {Array.from({ length: 9 }).map((_, k) => (
          <span
            key={k}
            ref={(el) => {
              if (el) cellsRef.current[k] = el;
            }}
            style={{
              display: "inline-block",
              textAlign: "center",
              fontFamily: "var(--font-mono), monospace",
            }}
          />
        ))}
      </span>
    </span>
  );
}

function ScrambleTextContent({ text }: { text: string }) {
  const reduceMotion = useReducedMotion();
  const originals = Array.from(text);

  const tokens: ReactNode[] = [];
  let word: ReactNode[] = [];
  
  const flush = () => {
    if (!word.length) return;
    tokens.push(
      <span key={`w${tokens.length}`} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
        {word}
      </span>
    );
    word = [];
  };

  originals.forEach((char, i) => {
    if (char === " ") {
      flush();
      tokens.push(<span key={`s${i}`}> </span>);
    } else {
      word.push(<ScrambleLetter key={`c${i}`} original={char} reduceMotion={reduceMotion} />);
    }
  });
  flush();

  return (
    <span aria-label={text} style={{ display: "inline", whiteSpace: "normal" }}>
      {tokens}
    </span>
  );
}

export default function ScrambleText({ text }: { text: string }) {
  return <ScrambleTextContent key={text} text={text} />;
}
