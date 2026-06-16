"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpriteAnimation from "./SpriteAnimation";

// ─── SPRITE FRAME DEFINITIONS ───────────────────────────────────────────────

const getGirlFrames = (outfit: number, action: string) => {
  const count = action === "sono" ? 9 : 6;
  return Array.from(
    { length: count },
    (_, i) => `/img/sprites/outfit_${outfit}/garota-${action}/frame_${i + 1}.png`
  );
};

// Cat Sprites
const GATO_PRETO_BRINCANDO = Array.from({ length: 19 }, (_, i) => `/img/sprites/gato-preto-brincando/frame_${i + 1}.png`);
const GATO_MALHADO_GROOMING = Array.from({ length: 4 }, (_, i) => `/img/sprites/gato-malhado-idle/frame_${i + 9}.png`);

interface Particle {
  id: number;
  x: number; // percentage width of screen
  y: number; // percentage height of screen
  emoji: string;
}

export default function Tamagotchi() {
  const [outfitIndex, setOutfitIndex] = useState<number>(0);
  const [powerState, setPowerState] = useState<"on" | "turning-off" | "off" | "turning-on">("on");
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Pre-load all character combinations to avoid flickering
  useEffect(() => {
    [0, 1, 2].forEach((outfit) => {
      ["idle", "standing", "comendo", "sono"].forEach((act) => {
        const count = act === "sono" ? 9 : 6;
        for (let i = 1; i <= count; i++) {
          const img = new Image();
          img.src = `/img/sprites/outfit_${outfit}/garota-${act}/frame_${i}.png?v=6`;
        }
      });
    });
  }, []);

  const isPowerOn = powerState === "on" || powerState === "turning-on";

  // Canvas Starfield Effect (excluding shooting stars)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = canvas.clientWidth || 300;
    const h = canvas.clientHeight || 258;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const colors = ["#ffffff", "#ff9ec4", "#c9a0ff"];
    const numStars = Math.round((w * h) / 820);
    const stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      s: Math.random() < 0.18 ? 2 : 1,
      ph: Math.random() * 6.28,
      sp: 0.6 + Math.random() * 0.9,
      dy: 0.04 + Math.random() * 0.14,
      col: colors[Math.floor(Math.random() * colors.length)],
    }));

    let animationId: number;

    const tick = (t: number) => {
      if (!isPowerOn) return;
      ctx.clearRect(0, 0, w, h);

      stars.forEach((st) => {
        st.y += st.dy;
        if (st.y > h) st.y = 0;

        ctx.globalAlpha = 0.22 + 0.62 * Math.abs(Math.sin((t / 650) * st.sp + st.ph));
        ctx.fillStyle = st.col;
        ctx.fillRect(Math.floor(st.x), Math.floor(st.y), st.s, st.s);
      });
      ctx.globalAlpha = 1;

      animationId = requestAnimationFrame(tick);
    };

    if (isPowerOn) {
      animationId = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, w, h);
    }

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPowerOn]);

  const handlePower = () => {
    if (powerState === "turning-off" || powerState === "turning-on") return;
    if (powerState === "on") {
      setPowerState("turning-off");
      setTimeout(() => {
        setPowerState("off");
      }, 440);
    } else {
      setPowerState("turning-on");
      setTimeout(() => {
        setPowerState("on");
      }, 520);
    }
  };

  const cycleOutfit = () => {
    if (!isPowerOn) return;
    setOutfitIndex((prev) => (prev + 1) % 3);
  };

  // Spawn floating particles at click coords (relative to CRT screen)
  const spawnParticles = (e: React.MouseEvent<HTMLDivElement>, type: "mary" | "blackCat" | "tabbyCat") => {
    if (!isPowerOn) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    let emojis: string[] = [];
    if (type === "mary") emojis = ["✨", "💖", "🌸"];
    else if (type === "blackCat") emojis = ["🐾", "❤️", "✨"];
    else if (type === "tabbyCat") emojis = ["🎵", "🐾", "💖"];

    emojis.forEach((emoji, idx) => {
      const id = Date.now() + Math.random() + idx;
      const px = x + (Math.random() - 0.5) * 15;
      const py = y + (Math.random() - 0.5) * 15;

      setParticles((prev) => [...prev, { id, x: px, y: py, emoji }]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 1000);
    });
  };

  const girlFrames = getGirlFrames(outfitIndex, "idle");
  const blackCatFrames = GATO_PRETO_BRINCANDO;
  const tabbyCatFrames = GATO_MALHADO_GROOMING;

  // Determine dynamic animation styles for power transition
  let picStyle: React.CSSProperties = {};
  let lineStyle: React.CSSProperties = { opacity: 0 };
  let darkStyle: React.CSSProperties = { opacity: 0 };

  if (powerState === "on") {
    picStyle = { transform: "scale(1)", opacity: 1, filter: "brightness(1)" };
    darkStyle = { opacity: 0 };
  } else if (powerState === "turning-off") {
    picStyle = {
      transform: "scaleY(0.02) scaleX(0.03)",
      opacity: 0,
      filter: "brightness(3)",
      transition: "transform 440ms cubic-bezier(0.6, 0, 0.85, 1), opacity 440ms cubic-bezier(0.6, 0, 0.85, 1), filter 440ms cubic-bezier(0.6, 0, 0.85, 1)",
    };
    lineStyle = { animation: "crtLineOff 440ms forwards" };
    darkStyle = {
      opacity: 1,
      transition: "opacity 440ms step-end",
    };
  } else if (powerState === "off") {
    picStyle = { transform: "scaleY(0.02) scaleX(0.03)", opacity: 0, filter: "brightness(3)" };
    darkStyle = { opacity: 1 };
  } else if (powerState === "turning-on") {
    picStyle = {
      transform: "scale(1)",
      opacity: 1,
      filter: "brightness(1)",
      transition: "transform 520ms ease-out, opacity 520ms ease-out, filter 520ms ease-out",
    };
    lineStyle = { animation: "crtLineOn 520ms forwards" };
    darkStyle = {
      opacity: 0,
      transition: "opacity 200ms ease-out",
    };
  }

  return (
    <div className="flex flex-col items-center w-full max-w-[380px] mx-auto select-none">
      
      {/* Dynamic Keyframes injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes crtSheen {
          0% { transform: translateY(-70%); }
          100% { transform: translateY(240%); }
        }
        @keyframes crtFlick {
          0%, 100% { opacity: 0.35; }
          48% { opacity: 0.9; }
          52% { opacity: 0.5; }
        }
        @keyframes crtLineOff {
          0% { opacity: 0; transform: translate(-50%, -50%) scaleX(0.03); }
          45% { opacity: 1; transform: translate(-50%, -50%) scaleX(1); }
          80% { opacity: 1; transform: translate(-50%, -50%) scaleX(0.05); }
          100% { opacity: 0; transform: translate(-50%, -50%) scaleX(0.02); }
        }
        @keyframes crtLineOn {
          0% { opacity: 0; transform: translate(-50%, -50%) scaleX(0.05); }
          35% { opacity: 1; transform: translate(-50%, -50%) scaleX(1); }
          70% { opacity: 0; transform: translate(-50%, -50%) scaleX(0.05); }
          100% { opacity: 0; transform: translate(-50%, -50%) scaleX(0); }
        }
        .crt-sheen-anim {
          animation: crtSheen 7s linear infinite;
        }
        .crt-flicker-anim {
          animation: crtFlick 4.5s steps(3) infinite;
        }
      `}} />

      {/* ─── KAWAII CRT MONITOR CABINET ─── */}
      <div 
        className="w-full relative rounded-[24px] p-[26px] pb-0 shadow-[0_30px_50px_-22px_rgba(30,60,70,0.6),inset_0_2px_0_rgba(255,255,255,0.65),inset_0_-14px_30px_-10px_rgba(120,90,50,0.28)]"
        style={{
          background: "linear-gradient(165deg, #f4eee2, #e8dfcc 55%, #dacdb6)",
          imageRendering: "pixelated",
        }}
      >
        {/* Soft shadow gradients */}
        <div 
          className="absolute inset-0 rounded-[24px] pointer-events-none"
          style={{
            background: "radial-gradient(circle at 84% 10%, rgba(150,110,60,0.13), transparent 18%), radial-gradient(circle at 11% 90%, rgba(150,110,60,0.1), transparent 14%)"
          }}
        />

        {/* 1. BEZEL INSET PANEL */}
        <div 
          className="rounded-[17px] p-4"
          style={{
            background: "#d9cdb6",
            boxShadow: "inset 0 2px 6px rgba(90,70,40,0.4), inset 0 -2px 4px rgba(255,255,255,0.4)"
          }}
        >
          {/* 2. CRT SCREEN OUTER CONTAINER */}
          <div 
            className="crt-screen relative w-full h-[258px] overflow-hidden"
            style={{
              borderRadius: "18px / 24px",
              background: "radial-gradient(120% 120% at 50% 45%, #4a2a6a 0%, #2a1747 68%, #1a0e30 100%)",
              boxShadow: "inset 0 0 34px 7px rgba(0,0,0,0.55), inset 0 0 90px rgba(0,0,0,0.42)"
            }}
          >
            {/* Screen Content Wrapper (animates on/off) */}
            <div 
              className="crt-pic absolute inset-0 origin-center"
              style={picStyle}
            >
              {/* Stars Canvas Background */}
              <canvas 
                ref={canvasRef} 
                className="crt-stars absolute inset-0 w-full h-full"
              />

              {/* Static Horizontal Scanlines */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: "repeating-linear-gradient(rgba(0,0,0,0.17) 0 1px, transparent 1px 3px)"
                }}
              />

              {/* Moving glass sheen beam */}
              <div 
                className="crt-sheen-anim absolute left-0 right-0 h-[46%] pointer-events-none"
                style={{
                  background: "linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0.05) 50%, rgba(255,255,255,0))"
                }}
              />

              {/* Top glass bulbous light reflection */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: "18px / 24px",
                  background: "radial-gradient(60% 42% at 26% 18%, rgba(255,255,255,0.15), transparent 60%)"
                }}
              />

              {/* Subtle screen flickering overlay */}
              <div 
                className="crt-flicker-anim absolute inset-0 pointer-events-none"
                style={{
                  background: "rgba(180,150,255,0.04)"
                }}
              />

              {/* Floating click particles */}
              <AnimatePresence>
                {particles.map((p) => (
                  <motion.span
                    key={p.id}
                    className="absolute text-base z-40 pointer-events-none font-sans"
                    initial={{ opacity: 1, scale: 0.5, left: `${p.x}%`, top: `${p.y}%` }}
                    animate={{
                      opacity: 0,
                      scale: 1.4,
                      top: `${p.y - 25}%`,
                      left: `${p.x + (Math.random() - 0.5) * 15}%`,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                  >
                    {p.emoji}
                  </motion.span>
                ))}
              </AnimatePresence>

              {/* Cozy Deep Purple Carpet */}
              <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[80%] h-[18%] bg-[#391d63]/80 border-[2px] border-dashed border-[#ff9ec4]/30 rounded-full opacity-60 z-0 pointer-events-none" />

              {/* ─── CHARACTERS LAYER ─── */}

              {/* A. MARY (Center) */}
              <div
                className="absolute bottom-[8%] left-[34%] w-[32%] h-[68%] z-10 cursor-pointer flex items-end justify-center"
                onClick={(e) => spawnParticles(e, "mary")}
              >
                <SpriteAnimation
                  frames={girlFrames}
                  interval={280}
                  mode="loop"
                  alt="Mary Pixel Art"
                />
              </div>

              {/* B. BLACK KITTEN (Left) */}
              <div
                className="absolute bottom-[6%] left-[6%] w-[25%] h-[32%] z-20 cursor-pointer flex items-end justify-center"
                style={{ transform: "scale(0.72)", transformOrigin: "bottom center" }}
                onClick={(e) => spawnParticles(e, "blackCat")}
              >
                <SpriteAnimation
                  frames={blackCatFrames}
                  interval={250}
                  mode="loop"
                  alt="Gatinha Preta Filhote"
                />
              </div>

              {/* C. TABBY CAT (Right) */}
              <div
                className="absolute bottom-[6%] left-[69%] w-[25%] h-[32%] z-20 cursor-pointer flex items-end justify-center"
                style={{ transform: "scale(0.9)", transformOrigin: "bottom center" }}
                onClick={(e) => spawnParticles(e, "tabbyCat")}
              >
                <SpriteAnimation
                  frames={tabbyCatFrames}
                  interval={280}
                  mode="loop"
                  alt="Gatinha Tigrada"
                />
              </div>

            </div>

            {/* CRT Flare Line */}
            <div 
              className="crt-line absolute left-1/2 top-1/2 w-[84%] h-[3px] rounded-[3px] bg-white pointer-events-none"
              style={{
                boxShadow: "0 0 14px 4px rgba(255,255,255,0.9)",
                transform: "translate(-50%, -50%)",
                ...lineStyle
              }}
            />

            {/* CRT Pitch Black Overlay Mask */}
            <div 
              className="crt-dark absolute inset-0 bg-[#050409] pointer-events-none"
              style={darkStyle}
            />

          </div>
        </div>

        {/* 3. LOWER DIAL / HARDWARE PANEL */}
        <div className="py-[18px] px-2 flex flex-col gap-[13px]">
          
          <div className="flex justify-between items-center">
            {/* Left bezel vents/indents */}
            <div className="flex gap-1.5">
              <div className="w-[30px] h-1.5 rounded-[3px] bg-[#c8bca4]" style={{ boxShadow: "inset 0 1px 1px rgba(90,70,40,0.4)" }} />
              <div className="w-4 h-1.5 rounded-[3px] bg-[#c8bca4]" style={{ boxShadow: "inset 0 1px 1px rgba(90,70,40,0.4)" }} />
            </div>

            {/* Right physical controls */}
            <div className="flex gap-2.5 items-center">
              {/* Orange LED / Power Button (Click to toggle screen) */}
              <button
                onClick={handlePower}
                title="Ligar / Desligar Monitor"
                className="crt-led w-[13px] h-[13px] rounded-full focus:outline-none transition-all duration-300"
                style={{
                  cursor: "pointer",
                  ...(isPowerOn 
                    ? {
                        background: "radial-gradient(circle at 35% 30%, #ff8a5c, #e8431f)",
                        boxShadow: "0 0 10px 1px rgba(255,90,40,0.6)"
                      }
                    : {
                        background: "radial-gradient(circle at 35% 30%, #ff8a5c, #e8431f)",
                        filter: "brightness(0.4) saturate(0.55)",
                        boxShadow: "none"
                      }
                  )
                }}
              />

              {/* Gray Dial (Secret Look Changer) */}
              <button
                onClick={cycleOutfit}
                title="Trocar Look (Easter Egg)"
                className="w-[15px] h-[15px] rounded-full focus:outline-none active:scale-90 transition-transform"
                style={{
                  background: "#cdbfa6",
                  boxShadow: "inset 0 1px 2px rgba(90,70,40,0.5), inset 0 -1px 1px rgba(255,255,255,0.4)",
                  cursor: "pointer"
                }}
              />
            </div>
          </div>

          {/* Bottom grille slot */}
          <div 
            className="h-[50px] rounded-[7px]" 
            style={{
              background: "#d4c8b1",
              boxShadow: "inset 0 1px 3px rgba(90,70,40,0.35)",
              backgroundImage: "repeating-linear-gradient(180deg, #c6ba9f 0 2px, #dbcfb8 2px 8px)"
            }}
          />

        </div>

      </div>

    </div>
  );
}
