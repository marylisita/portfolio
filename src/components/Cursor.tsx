"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  color: string;
  vx: number;
  vy: number;
  type: "star" | "pixel";
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
}

export default function Cursor() {
  const [hovered, setHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastPos = useRef({ x: -9999, y: -9999 });
  const mouseCoords = useRef({ x: -100, y: -100 });
  
  // Use framer-motion values for instant tracking of hover claws
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Main canvas animation loop (updates and draws particles)
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
        p.rotation += p.rotationSpeed;
        p.size *= 0.98; // gradually shrink

        if (p.life <= 0 || p.size < 0.5) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        
        // Beautiful premium glow effect
        ctx.shadowBlur = 5;
        ctx.shadowColor = p.color;

        if (p.type === "star") {
          // Draw a 4-pointed micro-star
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.beginPath();
          const spikes = 4;
          const outerRadius = p.size;
          const innerRadius = p.size / 3.5;
          let rot = Math.PI / 2 * 3;
          let step = Math.PI / spikes;

          ctx.moveTo(0, -outerRadius);
          for (let s = 0; s < spikes; s++) {
            let sx = Math.cos(rot) * outerRadius;
            let sy = Math.sin(rot) * outerRadius;
            ctx.lineTo(sx, sy);
            rot += step;

            sx = Math.cos(rot) * innerRadius;
            sy = Math.sin(rot) * innerRadius;
            ctx.lineTo(sx, sy);
            rot += step;
          }
          ctx.closePath();
          ctx.fill();
        } else {
          // Draw a pixel (retro square particle)
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
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

      // Spawn particles along the mouse trail to make it super smooth ("suave")
      if (dist > 4) {
        const colors = [
          "#ffd3e8", // light cotton candy pink
          "#ff8ebb", // soft strawberry pink
          "#ff2a85", // neon glow pink
          "#ff62b0", // bubblegum pink
          "#ffffff", // pure glitter white
          "#ffd2ec"  // pastel rose
        ];

        // Determine particle density. Spawn one every 6 pixels of movement.
        const stepDist = 6;
        const steps = Math.max(1, Math.floor(dist / stepDist));

        for (let i = 0; i < steps; i++) {
          const t = steps === 1 ? 1 : i / (steps - 1);
          const px = lastPos.current.x + dx * t;
          const py = lastPos.current.y + dy * t;

          // Tiny offset so they don't form a perfect straight line
          const jitterX = (Math.random() - 0.5) * 5;
          const jitterY = (Math.random() - 0.5) * 5;

          const type = Math.random() > 0.4 ? "star" : "pixel";
          const size = type === "star" ? Math.random() * 5 + 3.5 : Math.random() * 2.5 + 1.2;
          const maxLife = Math.random() * 25 + 20; // 20 to 45 frames

          particlesRef.current.push({
            x: px + jitterX,
            y: py + jitterY,
            size,
            alpha: Math.random() * 0.4 + 0.6,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 0.8,
            vy: Math.random() * 0.4 + 0.1, // gently float down
            type,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.08,
            life: maxLife,
            maxLife,
          });
        }

        lastPos.current = { x, y };
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
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

  // Ambient sparkles when cursor is resting (adds a magical feeling!)
  useEffect(() => {
    const interval = setInterval(() => {
      if (mouseCoords.current.x !== -100 && mouseCoords.current.y !== -100) {
        const x = mouseCoords.current.x;
        const y = mouseCoords.current.y;

        const colors = [
          "#ffd3e8", "#ff8ebb", "#ff2a85", "#ff62b0", "#ffffff", "#ffd2ec"
        ];
        
        // 50% chance to spawn an ambient sparkle when idle
        if (Math.random() > 0.5) {
          const type = Math.random() > 0.3 ? "star" : "pixel";
          const size = type === "star" ? Math.random() * 4 + 2.5 : Math.random() * 2 + 1;
          const maxLife = Math.random() * 20 + 20;

          particlesRef.current.push({
            x: x + (Math.random() - 0.5) * 8,
            y: y + (Math.random() - 0.5) * 8,
            size,
            alpha: Math.random() * 0.3 + 0.4,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 0.3,
            vy: Math.random() * 0.2 + 0.1,
            type,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.05,
            life: maxLife,
            maxLife,
          });
        }
      }
    }, 150);

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
          zIndex: 9999, // Under the claws overlay but over general content
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
              fill="#1A1A27"
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
              fill="#1A1A27"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: hovered ? 1 : 0,
                scale: hovered ? 1 : 0.5,
                y: hovered ? -3 : 0,
              }}
            />
            <motion.path
              d="M 22 8 L 24 1 L 26 7"
              fill="#1A1A27"
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
      </motion.div>
    </>
  );
}
