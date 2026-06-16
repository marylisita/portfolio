"use client";

import React, { useEffect, useState } from "react";

interface SpriteAnimationProps {
  frames: string[];
  /** Intervalo entre frames em ms */
  interval?: number;
  /** "loop" reinicia do 0; "pingpong" vai e volta (sem salto no fim); "loopLast3" repete as 3 últimas frames */
  mode?: "loop" | "pingpong" | "loopLast3";
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

export default function SpriteAnimation({
  frames,
  interval = 240,
  mode = "pingpong",
  className,
  style,
  alt = "",
}: SpriteAnimationProps) {
  const [t, setT] = useState(0);

  const framesKey = frames.join(",");

  const version = "6";

  // Pré-carrega todos os quadros pra não piscar/sumir na primeira vez que a
  // animação roda (comer/dormir entravam sem cache e apareciam em branco).
  useEffect(() => {
    frames.forEach((src) => {
      const im = new Image();
      im.src = `${src}?v=${version}`;
    });
  }, [framesKey]);

  useEffect(() => {
    setT(0); // reinicia no frame 0 sempre que a animação muda (evita começar no meio)
    if (frames.length <= 1) return;
    const id = setInterval(() => setT((v) => v + 1), interval);
    return () => clearInterval(id);
  }, [framesKey, interval, mode]);

  const n = frames.length;
  let idx = 0;
  if (n > 1) {
    if (mode === "pingpong") {
      const period = 2 * (n - 1); // ex: 8 frames -> 14 (0..7..1)
      const pos = t % period;
      idx = pos < n ? pos : period - pos;
    } else if (mode === "loopLast3") {
      if (t < n) {
        idx = t;
      } else {
        idx = (n - 3) + ((t - (n - 3)) % 3);
      }
    } else {
      idx = t % n;
    }
  }

  const imgSrc = frames[idx] ? `${frames[idx]}?v=${version}` : "";

  return (
    <img
      src={imgSrc}
      alt={alt}
      draggable={false}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        imageRendering: "pixelated",
        pointerEvents: "none",
        userSelect: "none",
        ...style,
      }}
      className={className}
    />
  );
}
