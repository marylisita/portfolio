"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GiantFooter from "@/components/GiantFooter";
import Cursor from "@/components/Cursor";
import PixelMotifs from "@/components/PixelMotifs";

/* ─────────────────────────────────────────
   1. FLOW FIELD — Particles that follow a
      Perlin-noise vector field
   ───────────────────────────────────────── */
function FlowField({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = canvas.offsetWidth * 2);
    let h = (canvas.height = canvas.offsetHeight * 2);
    ctx.scale(2, 2);

    const cols = 80, rows = 60;
    const cellW = w / 2 / cols, cellH = h / 2 / rows;
    let time = 0;

    // Tiny simplex-like noise
    const noise = (x: number, y: number, t: number) =>
      Math.sin(x * 0.3 + t) * Math.cos(y * 0.3 + t * 0.7) +
      Math.sin((x + y) * 0.2 + t * 1.3) * 0.5;

    const particles = Array.from({ length: 1200 }, () => ({
      x: Math.random() * w / 2,
      y: Math.random() * h / 2,
      speed: 0.4 + Math.random() * 1.2,
      hue: 250 + Math.random() * 60,
    }));

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; });
    observer.observe(canvas);

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      if (!isVisible) return;

      ctx.fillStyle = "rgba(252,248,255,0.04)";
      ctx.fillRect(0, 0, w / 2, h / 2);
      time += 0.003;

      for (const p of particles) {
        const col = Math.floor(p.x / cellW);
        const row = Math.floor(p.y / cellH);
        const angle = noise(col, row, time) * Math.PI * 2;

        p.x += Math.cos(angle) * p.speed;
        p.y += Math.sin(angle) * p.speed;

        if (p.x < 0 || p.x > w / 2 || p.y < 0 || p.y > h / 2) {
          p.x = Math.random() * w / 2;
          p.y = Math.random() * h / 2;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, 0.6)`;
        ctx.fill();
      }
    };
    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
    };
  }, [active]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", background: "var(--surface)" }} />;
}

/* ─────────────────────────────────────────
   2. REACTION DIFFUSION — Gray-Scott model
   ───────────────────────────────────────── */
function ReactionDiffusion({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 200, H = 150;
    canvas.width = W;
    canvas.height = H;

    let gridA = new Float32Array(W * H).fill(1);
    let gridB = new Float32Array(W * H).fill(0);
    let nextA = new Float32Array(W * H);
    let nextB = new Float32Array(W * H);

    // Seed center blob
    for (let x = W / 2 - 12; x < W / 2 + 12; x++)
      for (let y = H / 2 - 12; y < H / 2 + 12; y++) {
        const i = y * W + x;
        gridB[i] = 1;
      }

    const dA = 1.0, dB = 0.5, feed = 0.055, kill = 0.062;

    const lap = (grid: Float32Array, x: number, y: number) => {
      const i = y * W + x;
      const l = x > 0 ? i - 1 : i, r = x < W - 1 ? i + 1 : i;
      const u = y > 0 ? i - W : i, d = y < H - 1 ? i + W : i;
      return grid[l] + grid[r] + grid[u] + grid[d] - 4 * grid[i];
    };

    const imageData = ctx.createImageData(W, H);

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; });
    observer.observe(canvas);

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      if (!isVisible) return;

      for (let s = 0; s < 6; s++) {
        for (let x = 1; x < W - 1; x++)
          for (let y = 1; y < H - 1; y++) {
            const i = y * W + x;
            const a = gridA[i], b = gridB[i];
            const abb = a * b * b;
            nextA[i] = a + dA * lap(gridA, x, y) - abb + feed * (1 - a);
            nextB[i] = b + dB * lap(gridB, x, y) + abb - (kill + feed) * b;
            nextA[i] = Math.max(0, Math.min(1, nextA[i]));
            nextB[i] = Math.max(0, Math.min(1, nextB[i]));
          }
        [gridA, nextA] = [nextA, gridA];
        [gridB, nextB] = [nextB, gridB];
      }

      for (let i = 0; i < W * H; i++) {
        const v = Math.floor((1 - gridB[i]) * 255);
        const bi = i * 4;
        // Purple-lilac palette
        imageData.data[bi] = Math.floor(v * 0.85 + gridB[i] * 120);
        imageData.data[bi + 1] = Math.floor(v * 0.8 + gridB[i] * 80);
        imageData.data[bi + 2] = v;
        imageData.data[bi + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
    };
    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", imageRendering: "pixelated", background: "#1a1a27" }}
    />
  );
}

/* ─────────────────────────────────────────
   3. RECURSIVE FRACTAL TREE — Mouse-
      controlled branching angle
   ───────────────────────────────────────── */
function FractalTree({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef(0.5);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = (canvas.width = canvas.offsetWidth * 2);
    const h = (canvas.height = canvas.offsetHeight * 2);
    ctx.scale(2, 2);
    const cw = w / 2, ch = h / 2;

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = (e.clientX - rect.left) / rect.width;
    };
    canvas.addEventListener("mousemove", handleMove);

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; });
    observer.observe(canvas);

    let time = 0;
    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      if (!isVisible) return;

      ctx.fillStyle = "var(--surface, #FCF8FF)";
      ctx.fillRect(0, 0, cw, ch);
      time += 0.01;

      const branch = (x: number, y: number, len: number, angle: number, depth: number) => {
        if (depth > 12 || len < 2) return;
        const ex = x + Math.cos(angle) * len;
        const ey = y + Math.sin(angle) * len;

        const hue = 250 + depth * 10;
        const lightness = 40 + depth * 4;
        ctx.strokeStyle = `hsl(${hue}, 50%, ${lightness}%)`;
        ctx.lineWidth = Math.max(0.5, (12 - depth) * 0.8);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        const spread = mouseRef.current * 0.8 + 0.15;
        const wave = Math.sin(time + depth * 0.5) * 0.06;
        branch(ex, ey, len * 0.72, angle - spread + wave, depth + 1);
        branch(ex, ey, len * 0.72, angle + spread + wave, depth + 1);
      };

      branch(cw / 2, ch - 20, ch * 0.28, -Math.PI / 2, 0);
    };
    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("mousemove", handleMove);
      observer.disconnect();
    };
  }, [active]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", background: "var(--surface)" }} />;
}

/* ─────────────────────────────────────────
   4. VORONOI CELLS — Animated seed points
   ───────────────────────────────────────── */
function VoronoiCells({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 320, H = 240;
    canvas.width = W;
    canvas.height = H;

    const seeds = Array.from({ length: 24 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      hue: 220 + Math.random() * 80,
    }));

    const imageData = ctx.createImageData(W, H);

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; });
    observer.observe(canvas);

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      if (!isVisible) return;

      for (const s of seeds) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0 || s.x > W) s.vx *= -1;
        if (s.y < 0 || s.y > H) s.vy *= -1;
      }

      for (let px = 0; px < W; px++) {
        for (let py = 0; py < H; py++) {
          let minD = Infinity, minD2 = Infinity;
          let closestHue = 0;
          for (const s of seeds) {
            const d = (px - s.x) ** 2 + (py - s.y) ** 2;
            if (d < minD) {
              minD2 = minD;
              minD = d;
              closestHue = s.hue;
            } else if (d < minD2) {
              minD2 = d;
            }
          }
          const edge = minD2 - minD < 120 ? 0.3 : 1;
          const i = (py * W + px) * 4;
          const l = edge * 0.85 + 0.15;
          // Convert HSL to a simple approximation
          const h = closestHue / 360;
          const r = Math.floor((0.6 + 0.4 * Math.sin(h * Math.PI * 2)) * 255 * l);
          const g = Math.floor((0.6 + 0.4 * Math.sin(h * Math.PI * 2 + 2)) * 255 * l);
          const b = Math.floor((0.7 + 0.3 * Math.sin(h * Math.PI * 2 + 4)) * 255 * l);
          imageData.data[i] = r;
          imageData.data[i + 1] = g;
          imageData.data[i + 2] = b;
          imageData.data[i + 3] = 255;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    };
    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", imageRendering: "auto", background: "#1a1a27" }}
    />
  );
}

/* ─────────────────────────────────────────
   5. ATTRACTOR — Lorenz system drawn in
      real-time with bloom
   ───────────────────────────────────────── */
function LorenzAttractor({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = (canvas.width = canvas.offsetWidth * 2);
    const h = (canvas.height = canvas.offsetHeight * 2);
    ctx.scale(2, 2);
    const cw = w / 2, ch = h / 2;

    let x = 0.01, y = 0, z = 0;
    const sigma = 10, rho = 28, beta = 8 / 3;
    const dt = 0.005;
    const trail: { x: number; y: number; z: number }[] = [];
    const maxTrail = 6000;

    ctx.fillStyle = "#1a1a27";
    ctx.fillRect(0, 0, cw, ch);

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; });
    observer.observe(canvas);

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      if (!isVisible) return;

      ctx.fillStyle = "rgba(26,26,39,0.015)";
      ctx.fillRect(0, 0, cw, ch);

      for (let i = 0; i < 8; i++) {
        const dx = sigma * (y - x) * dt;
        const dy = (x * (rho - z) - y) * dt;
        const dz = (x * y - beta * z) * dt;
        x += dx;
        y += dy;
        z += dz;
        trail.push({ x, y, z });
      }

      if (trail.length > maxTrail) trail.splice(0, trail.length - maxTrail);

      for (let i = 1; i < trail.length; i++) {
        const p = trail[i];
        const pp = trail[i - 1];
        const sx = cw / 2 + p.x * 8;
        const sy = ch / 2 - p.z * 5 + 120;
        const psx = cw / 2 + pp.x * 8;
        const psy = ch / 2 - pp.z * 5 + 120;

        const alpha = (i / trail.length) * 0.7;
        const hue = 250 + (p.z / 50) * 60;
        ctx.strokeStyle = `hsla(${hue}, 60%, 65%, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(psx, psy);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }
    };
    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
    };
  }, [active]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", background: "#1a1a27" }} />;
}

/* ─────────────────────────────────────────
   MAIN EXPERIMENTS PAGE
   ───────────────────────────────────────── */
const experiments = [
  {
    id: "flow-field",
    title: "Campo de Fluxo",
    description: "1200 partículas navegando em um campo vetorial contínuo de ruído Perlin. Observe padrões emergentes se formarem e dissolverem.",
    tags: ["Ruído Perlin", "Partículas", "Generativo"],
    Component: FlowField,
  },
  {
    id: "reaction-diffusion",
    title: "Reação-Difusão",
    description: "Modelo Gray-Scott simulando dois componentes químicos virtuais que interagem e produzem padrões orgânicos de crescimento.",
    tags: ["Simulação", "Gray-Scott", "Orgânico"],
    Component: ReactionDiffusion,
  },
  {
    id: "fractal-tree",
    title: "Árvore Fractal",
    description: "Uma árvore desenhada recursivamente cujo ângulo de ramificação segue o seu mouse. Mova o cursor para moldar a copa.",
    tags: ["Recursão", "Interativo", "Fractal"],
    Component: FractalTree,
  },
  {
    id: "voronoi",
    title: "Células de Voronoi",
    description: "24 pontos semente animados gerando uma tesselação de Voronoi viva. As bordas emergem a partir de relações de proximidade.",
    tags: ["Geometria", "Tesselação", "Tempo Real"],
    Component: VoronoiCells,
  },
  {
    id: "lorenz",
    title: "Atrator de Lorenz",
    description: "O famoso sistema caótico renderizado em tempo real. Um atrator estranho em forma de borboleta traça o caos determinístico.",
    tags: ["Teoria do Caos", "3D", "Matemática"],
    Component: LorenzAttractor,
  },
];

export default function Experiments() {
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);

  return (
    <>
      <PixelMotifs />

      <nav className="nav">
        <div className="nav__inner">
          <a href="/" className="nav__logo" style={{ textDecoration: "none", color: "var(--fg)" }}>MARY L.</a>
          <ul className="nav__links">
            <li><a href="/work" className="hover-trigger">Trabalhos</a></li>
            <li><a href="/experiments" className="hover-trigger">Experimentos</a></li>
          </ul>
          <a href="#contact" className="nav__cta hover-trigger">Fale Comigo</a>
        </div>
      </nav>

      <main style={{ minHeight: "100vh", backgroundColor: "var(--surface)", paddingTop: "120px" }}>

        {/* Header */}
        <section style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "60px 2rem 40px",
          textAlign: "center"
        }}>
          <h1 style={{
            fontFamily: "var(--font-head)",
            fontSize: "clamp(2.8rem, 6vw, 5rem)",
            color: "var(--fg)",
            margin: "0 0 1rem",
            lineHeight: 1.05,
          }}>
            Experimentos
          </h1>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.15rem",
            color: "var(--gray-600)",
            maxWidth: "560px",
            margin: "0 auto",
            lineHeight: 1.7
          }}>
            Uma biblioteca imersiva de arte generativa e explorações computacionais. Cada experimento roda em tempo real no seu navegador usando algoritmos nativos e Canvas.
          </p>
        </section>

        {/* Experiment Grid */}
        <section style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 2rem 120px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "24px"
        }}>
          {experiments.map((exp) => (
            <motion.div
              key={exp.id}
              layoutId={exp.id}
              onClick={() => setActiveExperiment(exp.id)}
              style={{
                border: "1px solid #1a1a27",
                borderRadius: "var(--r-xl)",
                overflow: "hidden",
                cursor: "none",
                background: "#fff",
              }}
              whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(26,26,39,0.08)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Preview Canvas */}
              <div style={{ height: "220px", position: "relative", overflow: "hidden" }}>
                <exp.Component active={activeExperiment === null} />
              </div>
              {/* Info */}
              <div style={{ padding: "24px 28px 28px" }}>
                <h3 style={{
                  fontFamily: "var(--font-head)",
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  marginBottom: "8px",
                  color: "var(--fg)"
                }}>
                  {exp.title}
                </h3>
                <p style={{
                  fontSize: "0.88rem",
                  color: "var(--gray-600)",
                  lineHeight: 1.6,
                  marginBottom: "14px"
                }}>
                  {exp.description}
                </p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.65rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        padding: "4px 10px",
                        border: "1px solid #1a1a27",
                        borderRadius: "var(--r-pill)",
                        color: "var(--gray-600)"
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Fullscreen Overlay */}
        <AnimatePresence>
          {activeExperiment && (() => {
            const exp = experiments.find((e) => e.id === activeExperiment)!;
            return (
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveExperiment(null)}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 2000,
                  background: "rgba(26,26,39,0.85)",
                  backdropFilter: "blur(12px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2rem",
                  cursor: "none"
                }}
              >
                <motion.div
                  layoutId={activeExperiment}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: "100%",
                    maxWidth: "1000px",
                    borderRadius: "var(--r-xl)",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "#1a1a27"
                  }}
                >
                  <div style={{ height: "70vh", position: "relative" }}>
                    <exp.Component active={true} />
                  </div>
                  <div style={{
                    padding: "24px 32px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid rgba(255,255,255,0.08)"
                  }}>
                    <div>
                      <h3 style={{
                        fontFamily: "var(--font-head)",
                        fontSize: "1.3rem",
                        color: "#fff",
                        marginBottom: "4px"
                      }}>
                        {exp.title}
                      </h3>
                      <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}>
                        {exp.description}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveExperiment(null)}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        color: "#fff",
                        padding: "8px 20px",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "var(--r-pill)",
                        cursor: "none",
                        background: "transparent",
                        flexShrink: 0,
                      }}
                    >
                      Fechar ×
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </main>

      <div id="contact">
        <GiantFooter />
      </div>
    </>
  );
}
