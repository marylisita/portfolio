"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * ASCII art ANIMADA — troca frames de texto como um sprite (a "borboletinha"
 * dela, versão máquina). setInterval de propósito: roda mesmo em aba oculta.
 */
export default function AsciiAnim({
  frames,
  interval = 220,
  fontSize = 8,
  color = "var(--ink)",
  opacity = 0.6,
  className,
  style,
}: {
  frames: string[];
  interval?: number;
  fontSize?: number;
  color?: string;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (frames.length <= 1) return;
    const id = setInterval(() => setI((v) => (v + 1) % frames.length), interval);
    return () => clearInterval(id);
  }, [frames.length, interval]);

  return (
    <motion.pre
      aria-hidden="true"
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize,
        lineHeight: 1.05,
        color,
        userSelect: "none",
        pointerEvents: "none",
        whiteSpace: "pre",
        margin: 0,
        ...style,
      }}
    >
      {frames[i]}
    </motion.pre>
  );
}
