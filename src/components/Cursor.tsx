"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  color: string;
  vx: number;
  vy: number;
  type: "star" | "pixel";
  life: number;
  maxLife: number;
}

export default function Cursor() {
  const [hovered, setHovered] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastPos = useRef({ x: -9999, y: -9999 });
  const mouseCoords = useRef({ x: -100, y: -100 });
  
  // Use framer-motion values for instant tracking
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Main canvas animation loop (updates and draws ASCII particles)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        p.alpha = Math.max(0, p.life / p.maxLife);
        p.size *= 0.97; // gradually shrink

        if (p.life <= 0 || p.size < 0.5) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        
        // Glow effect
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;

        // Render retro ASCII text particles
        ctx.font = `bold ${Math.max(8, Math.round(p.size) + 6)}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (p.type === "star") {
          ctx.fillText("*", p.x, p.y);
        } else {
          const chars = ["+", "x", "•", "."];
          const idx = Math.floor(Math.abs(p.x + p.y) % chars.length);
          ctx.fillText(chars[idx], p.x, p.y);
        }
        
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Listeners for mouse movement, hover state, and particle spawning
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      mouseCoords.current = { x: e.clientX, y: e.clientY };

      const x = e.clientX;
      const y = e.clientY;

      if (lastPos.current.x === -9999) {
        lastPos.current = { x, y };
        return;
      }

      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      const dist = Math.hypot(dx, dy);

      // Spawn particles along the mouse trail
      if (dist > 4) {
        // Neon palette to match the dark aesthetic
        const colors = [
          "#C8F52E", // --acid lime
          "#FFFFFF", // white
          "#8A2BE2", // purple (EBAT)
          "#00E5FF", // electric cyan
          "#39FF14"  // bright green
        ];

        const stepDist = 6;
        const steps = Math.max(1, Math.floor(dist / stepDist));

        for (let i = 0; i < steps; i++) {
          const t = steps === 1 ? 1 : i / (steps - 1);
          const px = lastPos.current.x + dx * t;
          const py = lastPos.current.y + dy * t;

          const jitterX = (Math.random() - 0.5) * 4;
          const jitterY = (Math.random() - 0.5) * 4;

          const type = Math.random() > 0.4 ? "star" : "pixel";
          const size = type === "star" ? Math.random() * 5 + 4 : Math.random() * 3 + 2;
          const maxLife = Math.random() * 20 + 15;

          particlesRef.current.push({
            x: px + jitterX,
            y: py + jitterY,
            size,
            alpha: Math.random() * 0.4 + 0.6,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 0.6,
            vy: Math.random() * 0.3 + 0.1, // float down gently
            type,
            life: maxLife,
            maxLife,
          });
        }

        lastPos.current = { x, y };
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Floating label tracker
      const trigger = target.closest("[data-cursor-label]") as HTMLElement | null;
      if (trigger) {
        setCursorLabel(trigger.getAttribute("data-cursor-label") || "");
      } else {
        setCursorLabel("");
      }

      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("hover-trigger")
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  // Ambient idle sparkles
  useEffect(() => {
    const interval = setInterval(() => {
      if (mouseCoords.current.x !== -100 && mouseCoords.current.y !== -100) {
        const x = mouseCoords.current.x;
        const y = mouseCoords.current.y;

        const colors = [
          "#C8F52E", "#FFFFFF", "#8A2BE2", "#00E5FF", "#39FF14"
        ];
        
        if (Math.random() > 0.4) {
          const type = Math.random() > 0.3 ? "star" : "pixel";
          const size = type === "star" ? Math.random() * 4 + 3 : Math.random() * 2 + 1.5;
          const maxLife = Math.random() * 15 + 15;

          particlesRef.current.push({
            x: x + (Math.random() - 0.5) * 12,
            y: y + (Math.random() - 0.5) * 12,
            size,
            alpha: Math.random() * 0.3 + 0.4,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 0.25,
            vy: Math.random() * 0.15 + 0.05,
            type,
            life: maxLife,
            maxLife,
          });
        }
      }
    }, 180);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Canvas for Glitter Trail Particles Overlay */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />

      {/* Claws Overlay Cursor Tracker */}
      <motion.div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          x: cursorX,
          y: cursorY,
          pointerEvents: "none",
          zIndex: 10000,
        }}
      >
        <motion.div
          style={{ width: "32px", height: "32px", position: "relative" }}
        >
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
          >
            <motion.path
              d="M 6 10 L 2 4 L 8 6"
              fill="#000000"
              stroke="var(--acid, #C8F52E)"
              strokeWidth="0.8"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: hovered ? 1 : 0,
                scale: hovered ? 1 : 0.5,
                x: hovered ? -2 : 0,
                y: hovered ? -2 : 0,
              }}
            />
            <motion.path
              d="M 14 6 L 12 0 L 17 4"
              fill="#000000"
              stroke="var(--acid, #C8F52E)"
              strokeWidth="0.8"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: hovered ? 1 : 0,
                scale: hovered ? 1 : 0.5,
                y: hovered ? -3 : 0,
              }}
            />
            <motion.path
              d="M 22 8 L 24 1 L 26 7"
              fill="#000000"
              stroke="var(--acid, #C8F52E)"
              strokeWidth="0.8"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: hovered ? 1 : 0,
                scale: hovered ? 1 : 0.5,
                x: hovered ? 2 : 0,
                y: hovered ? -2 : 0,
              }}
            />
          </svg>
        </motion.div>

        {/* Dynamic Label next to Claws */}
        <AnimatePresence>
          {cursorLabel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 28, y: 12 }}
              animate={{ opacity: 1, scale: 1, x: 28, y: 12 }}
              exit={{ opacity: 0, scale: 0.8, x: 24, y: 12 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                fontFamily: "monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                background: "#000000",
                color: "var(--acid, #C8F52E)",
                border: "1.5px solid var(--acid, #C8F52E)",
                padding: "2px 6px",
                whiteSpace: "nowrap",
                zIndex: 10001,
              }}
            >
              {cursorLabel}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
