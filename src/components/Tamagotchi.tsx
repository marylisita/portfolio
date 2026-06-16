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
    const h = canvas.clientHeight || 230;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const colors = ["#ffffff", "#ffbee3", "#c9a0ff", "#a3f3ff"];
    const numStars = Math.round((w * h) / 780);
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

        ctx.globalAlpha = 0.25 + 0.65 * Math.abs(Math.sin((t / 650) * st.sp + st.ph));
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
    <div className="flex flex-col items-center w-full max-w-[390px] mx-auto select-none relative pb-10">
      
      {/* Dynamic Keyframes injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes holoShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes crtSheen {
          0% { transform: translateY(-70%); }
          100% { transform: translateY(240%); }
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
        .holo-screen-bg {
          background: linear-gradient(125deg, #ff9ec4 0%, #c9a0ff 33%, #54cfe0 66%, #ffbfe3 100%);
          background-size: 300% 300%;
          animation: holoShift 12s ease infinite;
        }
        .crt-sheen-anim {
          animation: crtSheen 8s linear infinite;
        }
      `}} />

      {/* PERSPECTIVE WRAPPER (Fixed 3D rotation, NO Parallax) */}
      <div 
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        
        {/* ─── TRANSLUCENT NEON MONITOR CABINET ─── */}
        <div 
          className="w-full relative rounded-[28px] p-4 pb-1 border-[2.5px] border-white/40 shadow-[0_25px_50px_-12px_rgba(168,85,247,0.45),inset_0_2px_2px_rgba(255,255,255,0.6),inset_0_-8px_20px_-5px_rgba(0,0,0,0.15)]"
          style={{
            background: "linear-gradient(135deg, rgba(236,72,153,0.48) 0%, rgba(168,85,247,0.42) 100%)",
            backdropFilter: "blur(12px) saturate(145%)",
            transform: "rotateY(-12deg) rotateX(8deg) rotateZ(-2deg)",
            transformStyle: "preserve-3d",
            imageRendering: "pixelated",
          }}
        >
          {/* Glass glare highlight */}
          <div 
            className="absolute inset-0 rounded-[28px] pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)"
            }}
          />

          {/* 1. SCREEN MOLD BEZEL (Glossy Dark Translucent Glass) */}
          <div 
            className="rounded-[20px] p-3 border border-white/20"
            style={{
              background: "rgba(15, 10, 25, 0.45)",
              boxShadow: "inset 0 2px 6px rgba(0,0,0,0.5), inset 0 -2px 4px rgba(255,255,255,0.15)"
            }}
          >
            {/* 2. CRT SCREEN (Interactive area) */}
            <div 
              className="crt-screen relative w-full h-[230px] overflow-hidden"
              style={{
                borderRadius: "14px / 18px",
                boxShadow: "inset 0 0 30px rgba(0,0,0,0.7)"
              }}
            >
              {/* Screen Content Wrapper */}
              <div 
                className="crt-pic absolute inset-0 origin-center holo-screen-bg"
                style={picStyle}
              >
                {/* Stars Canvas Background */}
                <canvas 
                  ref={canvasRef} 
                  className="crt-stars absolute inset-0 w-full h-full"
                />

                {/* Glitchy Scanlines */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: "repeating-linear-gradient(rgba(0,0,0,0.15) 0 1px, transparent 1px 3px)",
                    mixBlendMode: "overlay"
                  }}
                />

                {/* Shifting Sheen beam */}
                <div 
                  className="crt-sheen-anim absolute left-0 right-0 h-[46%] pointer-events-none"
                  style={{
                    background: "linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0.08) 50%, rgba(255,255,255,0))"
                  }}
                />

                {/* Glass reflections */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    borderRadius: "14px / 18px",
                    background: "radial-gradient(55% 40% at 28% 18%, rgba(255,255,255,0.2), transparent 60%)"
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

                {/* Cozy Semi-Transparent Holographic Carpet */}
                <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[80%] h-[18%] bg-[#54cfe0]/20 border-[2px] border-dashed border-[#ffbee3]/50 rounded-full opacity-60 z-0 pointer-events-none" />

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

              {/* CRT Shrinking white line */}
              <div 
                className="crt-line absolute left-1/2 top-1/2 w-[84%] h-[3px] rounded-[3px] bg-white pointer-events-none"
                style={{
                  boxShadow: "0 0 14px 4px rgba(255,255,255,0.9)",
                  transform: "translate(-50%, -50%)",
                  ...lineStyle
                }}
              />

              {/* CRT Dark overlay screen */}
              <div 
                className="crt-dark absolute inset-0 bg-[#0c051a] pointer-events-none"
                style={darkStyle}
              />

            </div>
          </div>

          {/* Lower bezel chin panel */}
          <div className="pt-2 px-1 flex justify-between items-center relative">
            {/* LED Power indicator & Dial inside the chin */}
            <div className="flex gap-2.5 items-center ml-auto">
              
              {/* Dial Button (Secret Outfit Cycle) */}
              <button
                onClick={cycleOutfit}
                title="Trocar Look (Easter Egg)"
                className="w-4 h-4 rounded-full border border-white/20 active:scale-90 transition-transform cursor-pointer focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.3), 1px 1px 3px rgba(0,0,0,0.1)",
                }}
              />

              {/* LED power button (Click to power toggle) */}
              <button
                onClick={handlePower}
                title="Ligar/Desligar Monitor"
                className="w-3.5 h-3.5 rounded-full focus:outline-none cursor-pointer border border-white/20 transition-all duration-300"
                style={{
                  ...(isPowerOn 
                    ? {
                        background: "radial-gradient(circle at 35% 30%, #a3f3ff, #06b6d4)",
                        boxShadow: "0 0 8px #06b6d4"
                      }
                    : {
                        background: "rgba(255,255,255,0.1)",
                        boxShadow: "none"
                      }
                  )
                }}
              />

            </div>
          </div>

        </div>

        {/* ─── 3D TRANSLUCENT STAND STEM ─── */}
        <div 
          style={{
            width: "55px",
            height: "65px",
            background: "linear-gradient(to bottom, rgba(236, 72, 153, 0.58), rgba(168, 85, 247, 0.48))",
            border: "2px solid rgba(255, 255, 255, 0.35)",
            transform: "rotateY(-12deg) rotateX(8deg) translateY(-22px) translateZ(-15px)",
            backdropFilter: "blur(6px)",
            boxShadow: "inset 0 2px 2px rgba(255,255,255,0.3), 0 5px 10px rgba(0,0,0,0.1)",
            zIndex: -1,
          }}
          className="rounded-t-[8px] rounded-b-[4px]"
        />

        {/* ─── 3D TRANSLUCENT STAND BASE ─── */}
        <div 
          style={{
            width: "170px",
            height: "60px",
            background: "linear-gradient(to bottom, rgba(236, 72, 153, 0.65), rgba(168, 85, 247, 0.55))",
            border: "2px solid rgba(255, 255, 255, 0.4)",
            transform: "rotateX(70deg) rotateY(-6deg) translateY(-40px) translateZ(-35px)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 15px 30px rgba(168, 85, 247, 0.25), inset 0 2px 2px rgba(255, 255, 255, 0.4)",
            borderRadius: "14px 14px 24px 24px",
            zIndex: -2,
          }}
        />

      </div>

    </div>
  );
}
