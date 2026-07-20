"use client";
import { useEffect, useState } from "react";

/** Mensagem datilografada letra a letra, com cursor de bloco piscando. */
export default function Typewriter({
  text,
  speed = 48,
  startDelay = 600,
  style,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  style?: React.CSSProperties;
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    setN(0);
    let id: ReturnType<typeof setInterval> | undefined;
    const boot = setTimeout(() => {
      id = setInterval(() => {
        setN((v) => {
          if (v >= text.length) {
            if (id) clearInterval(id);
            return v;
          }
          return v + 1;
        });
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(boot);
      if (id) clearInterval(id);
    };
  }, [text, speed, startDelay]);

  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: ".78rem",
        textTransform: "lowercase",
        letterSpacing: ".08em",
        color: "var(--acid)",
        ...style,
      }}
    >
      {text.slice(0, n)}
      <span className="blink" style={{ marginLeft: 2 }}>▌</span>
    </span>
  );
}
