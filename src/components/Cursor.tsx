"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type InkDot = {
  x: number;
  y: number;
  symbol: string;
  size: number;
  rotation: number;
  spin: number;
  life: number;
  maxLife: number;
  color: string;
  glow: string;
  vx: number;
  vy: number;
};

const Y2K_INKS = [
  { color: "#ff2aa7", glow: "#ff2aa7" },
  { color: "#ff55bd", glow: "#ff55bd" },
  { color: "#ff8fd8", glow: "#ff55bd" },
  { color: "#cbb7ff", glow: "#cbb7ff" },
  { color: "#e0ceff", glow: "#cbb7ff" },
  { color: "#ffffff", glow: "#ff8fd8" },
  { color: "#ffffff", glow: "#cbb7ff" },
  { color: "#09080d", glow: "#cbb7ff" },
] as const;
const SYMBOLS = ["✦", "♡", "⋆", "<3", "+", "×", "∞", "≈", "≠", "∑", "√", "π", "∴", "⊹"];
const MOTION_FAST = 0.2;
const MOTION_EASE_STANDARD = [0, 0, 0.2, 1] as const;

export default function Cursor() {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dots = useRef<InkDot[]>([]);
  const startTrail = useRef<() => void>(() => undefined);
  const lastPos = useRef({ x: -9999, y: -9999 });
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);
    let frame = 0;

    const render = () => {
      frame = 0;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "source-over";

      for (let index = dots.current.length - 1; index >= 0; index -= 1) {
        const dot = dots.current[index];
        dot.x += dot.vx;
        dot.y += dot.vy;
        dot.rotation += dot.spin;
        dot.life -= 1;

        if (dot.life <= 0) {
          dots.current.splice(index, 1);
          continue;
        }

        const progress = dot.life / dot.maxLife;
        ctx.save();
        ctx.translate(dot.x, dot.y);
        ctx.rotate(dot.rotation);
        ctx.globalAlpha = Math.min(1, progress * 1.35) * 0.82;
        ctx.fillStyle = dot.color;
        ctx.shadowColor = dot.glow;
        ctx.shadowBlur = 11 * progress;
        ctx.font = `700 ${Math.max(7, dot.size * (0.72 + progress * 0.28))}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(dot.symbol, 0, 0);
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      if (dots.current.length) frame = requestAnimationFrame(render);
    };

    startTrail.current = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
      startTrail.current = () => undefined;
    };
  }, []);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");

    const handleMove = (event: MouseEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);

      const x = event.clientX;
      const y = event.clientY;
      if (lastPos.current.x === -9999) {
        lastPos.current = { x, y };
        return;
      }

      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      const distance = Math.hypot(dx, dy);

      if (!reduceMotion && finePointer.matches && distance > 9) {
        const steps = Math.min(5, Math.max(1, Math.floor(distance / 12)));
        for (let index = 0; index < steps; index += 1) {
          const t = steps === 1 ? 1 : index / (steps - 1);
          const maxLife = 34 + Math.random() * 18;
          const ink = Y2K_INKS[Math.floor(Math.random() * Y2K_INKS.length)];
          dots.current.push({
            x: lastPos.current.x + dx * t + (Math.random() - 0.5) * 3,
            y: lastPos.current.y + dy * t + (Math.random() - 0.5) * 3,
            symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            size: 9 + Math.random() * 7,
            rotation: (Math.random() - 0.5) * 0.7,
            spin: (Math.random() - 0.5) * 0.025,
            life: maxLife,
            maxLife,
            color: ink.color,
            glow: ink.glow,
            vx: (Math.random() - 0.5) * 0.22,
            vy: -0.04 - Math.random() * 0.12,
          });
        }
        if (dots.current.length > 88) dots.current.splice(0, dots.current.length - 88);
        startTrail.current();
      }

      lastPos.current = { x, y };
    };

    const handleOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const labelTarget = target.closest<HTMLElement>("[data-cursor-label]");
      setCursorLabel(labelTarget?.dataset.cursorLabel ?? "");
      setHovered(Boolean(target.closest("a, button, .hover-trigger")));
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
    };
  }, [cursorX, cursorY, reduceMotion]);

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          html, body, a, button, .hover-trigger { cursor: none !important; }
        }
        @media (pointer: coarse) {
          [data-ink-cursor], [data-ink-trail] { display: none !important; }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        data-ink-trail
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}
      />
      <motion.div
        data-ink-cursor
        aria-hidden="true"
        style={{ position: "fixed", left: 0, top: 0, x: cursorX, y: cursorY, pointerEvents: "none", zIndex: 10000 }}
      >
        <motion.span
          animate={{ width: hovered ? 28 : 13, height: hovered ? 28 : 13, x: hovered ? -14 : -6.5, y: hovered ? -14 : -6.5 }}
          transition={{ duration: MOTION_FAST, ease: MOTION_EASE_STANDARD }}
          style={{
            position: "absolute",
            display: "block",
            border: "1px solid var(--site-ink)",
            borderRadius: "50%",
            background: hovered ? "rgba(237,231,218,.2)" : "var(--site-ink)",
            mixBlendMode: "multiply",
          }}
        />
        <AnimatePresence>
          {cursorLabel && (
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 23 }}
              exit={{ opacity: 0, x: 18 }}
              transition={{ duration: MOTION_FAST, ease: MOTION_EASE_STANDARD }}
              style={{
                position: "absolute",
                top: 12,
                left: 0,
                padding: ".28rem .5rem",
                border: "1px solid rgba(28,27,24,.35)",
                background: "rgba(237,231,218,.92)",
                color: "var(--site-ink)",
                fontFamily: "var(--font-head)",
                fontSize: ".78rem",
                whiteSpace: "nowrap",
              }}
            >
              {cursorLabel}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
