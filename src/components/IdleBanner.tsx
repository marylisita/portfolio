"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  GATO_FRAMES,
  GATO_PRETO_FRAMES,
  FLOR,
  ESTRELA,
  BORBOLETA_FRAMES,
} from "./asciiArt";

/**
 * Banner ASCII grande e discreto no header (pedido dela). LEVE de propósito:
 * NÃO roda loop de animação — só troca de cena quando o mouse PAUSA (idle),
 * e a troca é um scramble curtinho (setInterval que morre em ~0.3s). Fora isso
 * fica parado. É texto, não canvas. Fundo faint, atrás do conteúdo do hero.
 */
const SCENES = [
  GATO_FRAMES[0],
  BORBOLETA_FRAMES[0],
  FLOR,
  GATO_PRETO_FRAMES[0],
  ESTRELA,
];
const SCRAMBLE = "░▒▓$#*+=~:.";

export default function IdleBanner() {
  const reduceMotion = useReducedMotion();
  const [scene, setScene] = useState(0);
  const [display, setDisplay] = useState(SCENES[0]);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const scrambleTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // troca de cena SÓ quando o mouse para por um tempinho
  useEffect(() => {
    if (reduceMotion) return;
    const arm = () => {
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setScene((s) => (s + 1) % SCENES.length), 850);
    };
    window.addEventListener("mousemove", arm, { passive: true });
    arm();
    return () => {
      window.removeEventListener("mousemove", arm);
      clearTimeout(idleTimer.current);
    };
  }, [reduceMotion]);

  // transição: scramble curto que resolve na cena nova
  useEffect(() => {
    const target = SCENES[scene];
    if (reduceMotion) {
      setDisplay(target);
      return;
    }
    const chars = Array.from(target);
    const idx: number[] = [];
    chars.forEach((c, i) => {
      if (c !== " " && c !== "\n" && c !== "\t") idx.push(i);
    });
    let step = 0;
    const steps = 8;
    clearInterval(scrambleTimer.current);
    scrambleTimer.current = setInterval(() => {
      step += 1;
      const p = step / steps;
      const out = chars.slice();
      for (const i of idx) {
        if (Math.random() > p) out[i] = SCRAMBLE.charAt((Math.random() * SCRAMBLE.length) | 0);
      }
      setDisplay(out.join(""));
      if (step >= steps) {
        clearInterval(scrambleTimer.current);
        setDisplay(target);
      }
    }, 42);
    return () => clearInterval(scrambleTimer.current);
  }, [scene, reduceMotion]);

  return (
    <pre className="rm-idle" aria-hidden="true">
      {display}
    </pre>
  );
}
