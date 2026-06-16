"use client";

import React, { useState, useEffect } from "react";
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
const GATO_PRETO_IDLE = Array.from({ length: 4 }, (_, i) => `/img/sprites/gato-preto-idle/frame_${i + 1}.png`);
const GATO_PRETO_BRINCANDO = Array.from({ length: 19 }, (_, i) => `/img/sprites/gato-preto-brincando/frame_${i + 1}.png`);

const GATO_MALHADO_IDLE = Array.from({ length: 4 }, (_, i) => `/img/sprites/gato-malhado-idle/frame_${i + 1}.png`);
const GATO_MALHADO_GROOMING = Array.from({ length: 4 }, (_, i) => `/img/sprites/gato-malhado-idle/frame_${i + 9}.png`);

interface Particle {
  id: number;
  x: number; // percentage width of screen
  y: number; // percentage height of screen
  emoji: string;
}

export default function Tamagotchi() {
  const [outfitIndex, setOutfitIndex] = useState<number>(0);
  const [isPowerOn, setIsPowerOn] = useState<boolean>(true);
  const [particles, setParticles] = useState<Particle[]>([]);

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

  // Spawn floating particles at click coords (relative to CRT screen)
  const spawnParticles = (e: React.MouseEvent<HTMLDivElement>, type: "mary" | "blackCat" | "tabbyCat") => {
    if (!isPowerOn) return; // No particles if screen is off
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

  // Determine current frame lists for characters
  const girlFrames = getGirlFrames(outfitIndex, "idle");
  const blackCatFrames = GATO_PRETO_BRINCANDO; // Playful kitten
  const tabbyCatFrames = GATO_MALHADO_GROOMING; // Grooming cat

  const cycleOutfit = () => {
    if (!isPowerOn) return;
    setOutfitIndex((prev) => (prev + 1) % 3);
  };

  const togglePower = () => {
    setIsPowerOn((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[400px] mx-auto select-none">
      {/* ─── MONITOR MAIN CABINET (Beige/Cream) ─── */}
      <div
        className="w-full bg-[#E8E2D5] rounded-[36px] border-[4px] border-[#1a1a27] p-5 shadow-[6px_6px_0px_#1a1a27] relative flex flex-col items-center"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Subtle top bezel highlight line */}
        <div className="absolute top-[6px] left-[32px] right-[32px] h-[3px] bg-[#FAF8F5] rounded-full opacity-60" />

        {/* 1. BEZEL INSET FRAME */}
        <div className="w-full bg-[#D8D2C4] border-[3px] border-[#1a1a27] rounded-[24px] p-3 shadow-[inset_3px_3px_0px_rgba(255,255,255,0.6)]">
          
          {/* 2. CRT SCREEN BEZEL (Dark Gray Outer Screen) */}
          <div className="w-full aspect-[4/3] bg-[#2E2A24] rounded-[18px] border-[3px] border-[#1a1a27] p-1.5 flex items-center justify-center relative shadow-[inset_3px_3px_5px_rgba(0,0,0,0.5)]">
            
            {/* 3. CRT GLASS SCREEN (The actual game window) */}
            <div className="w-full h-full bg-[#16082c] rounded-[12px] border-[2px] border-[#1a1a27] overflow-hidden relative shadow-[inset_4px_4px_10px_rgba(0,0,0,0.8)] flex items-end justify-center">
              
              {/* Screen Off State */}
              <div
                className={`absolute inset-0 bg-[#0f0b15] z-50 transition-opacity duration-500 pointer-events-none ${
                  isPowerOn ? "opacity-0" : "opacity-100"
                }`}
              />

              {/* Curved Glass Reflection Overlay */}
              <div
                className="absolute inset-0 pointer-events-none z-30 opacity-15"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 60%)",
                }}
              />

              {/* Scanlines Effect */}
              <div
                className="absolute inset-0 pointer-events-none z-30"
                style={{
                  background: "linear-gradient(rgba(26,26,39,0) 50%, rgba(26,26,39,0.08) 50%)",
                  backgroundSize: "100% 4px",
                }}
              />

              {/* Top Pink Pixel Header Decoration */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#ff6392] border-b-[2px] border-[#1a1a27] z-10">
                <div className="absolute top-full left-[12%] w-3 h-1 bg-[#ff6392] border-b-[2px] border-x-[2px] border-[#1a1a27]" />
                <div className="absolute top-full left-[42%] w-4 h-1.5 bg-[#ff6392] border-b-[2px] border-x-[2px] border-[#1a1a27]" />
                <div className="absolute top-full left-[72%] w-3 h-1 bg-[#ff6392] border-b-[2px] border-x-[2px] border-[#1a1a27]" />
              </div>

              {/* Bottom Pink Pixel Footer Decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-2.5 bg-[#ff6392] border-t-[2px] border-[#1a1a27] z-10">
                <div className="absolute bottom-full left-[22%] w-3 h-1 bg-[#ff6392] border-t-[2px] border-x-[2px] border-[#1a1a27]" />
                <div className="absolute bottom-full left-[55%] w-4 h-1.5 bg-[#ff6392] border-t-[2px] border-x-[2px] border-[#1a1a27]" />
                <div className="absolute bottom-full left-[80%] w-3 h-1 bg-[#ff6392] border-t-[2px] border-x-[2px] border-[#1a1a27]" />
              </div>

              {/* Space Stars (CSS Pixel art) */}
              <div className="absolute top-[18%] left-[16%] text-[8px] text-[#ff6392] opacity-60 font-sans pointer-events-none">+</div>
              <div className="absolute top-[28%] left-[78%] text-[6px] text-white opacity-80 font-sans pointer-events-none">+</div>
              <div className="absolute top-[48%] left-[12%] text-[6px] text-white opacity-40 font-sans pointer-events-none pointer-events-none">+</div>
              <div className="absolute top-[15%] left-[58%] text-[8px] text-[#ff6392] opacity-50 font-sans pointer-events-none pointer-events-none">+</div>
              <div className="absolute top-[35%] left-[88%] text-[8px] text-white opacity-75 font-sans pointer-events-none pointer-events-none">+</div>

              {/* Floating Particles on Click */}
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

              {/* Cozy Dark Purple Rug */}
              <div className="absolute bottom-[4%] w-[84%] h-[18%] bg-[#391d63] border-[2px] border-dashed border-[#ff6392] rounded-full opacity-90 z-0" />

              {/* ─── CHARACTERS LAYER ─── */}

              {/* A. MARY (Center) */}
              <div
                className="absolute bottom-[9%] left-[34%] w-[32%] h-[68%] z-10 cursor-pointer flex items-end justify-center"
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
          </div>
        </div>

        {/* 4. LOWER CONTROL PANEL AREA */}
        <div className="w-full flex items-center justify-between mt-4 px-1.5">
          {/* Left: Two Small Port Rectangles */}
          <div className="flex gap-1.5 opacity-80">
            <div className="w-4 h-2 bg-[#1a1a27] border border-[#ff6392]/20 rounded-[1px] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)]" />
            <div className="w-4 h-2 bg-[#1a1a27] border border-[#ff6392]/20 rounded-[1px] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)]" />
          </div>

          {/* Center: Vent Grill */}
          <div className="flex flex-col gap-1 w-[46%] bg-[#D5CEC0] border-[2px] border-[#1a1a27] rounded-[4px] py-1 px-2.5 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.15)]">
            <div className="h-[2px] bg-[#1a1a27] w-full rounded-[1px]" />
            <div className="h-[2px] bg-[#1a1a27] w-full rounded-[1px]" />
            <div className="h-[2px] bg-[#1a1a27] w-full rounded-[1px]" />
          </div>

          {/* Right: Round Coral Orange Power Button and Gray Dial */}
          <div className="flex items-center gap-2">
            {/* Gray Dial Button (Secret Outfit Cycle) */}
            <button
              onClick={cycleOutfit}
              title="Trocar Outfit (Easter Egg)"
              className="w-5.5 h-5.5 bg-[#cfc9be] border-[3px] border-[#1a1a27] rounded-full shadow-[2px_2px_0px_#1a1a27] cursor-pointer hover:bg-[#c5beb2] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#1a1a27] focus:outline-none"
            />
            {/* Orange Power Button (Screen Toggle) */}
            <button
              onClick={togglePower}
              title="Ligar/Desligar Monitor"
              className="w-5.5 h-5.5 bg-[#ff6333] border-[3px] border-[#1a1a27] rounded-full shadow-[2px_2px_0px_#1a1a27] cursor-pointer hover:bg-[#e65325] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#1a1a27] focus:outline-none"
            />
          </div>
        </div>

        {/* Small pulsing LED status light above the buttons */}
        <div className="absolute bottom-2.5 right-18 flex items-center gap-1">
          <span
            className={`w-1.5 h-1.5 rounded-full border border-[#1a1a27] transition-all duration-300 ${
              isPowerOn ? "bg-[#39FF14] shadow-[0_0_6px_#39FF14]" : "bg-[#9a98a6]"
            } animate-pulse`}
          />
        </div>

      </div>

      {/* ─── SUPPORT STAND ─── */}
      <div className="w-[74%] h-3.5 bg-[#cfc9be] border-[4px] border-t-0 border-[#1a1a27] rounded-b-[16px] shadow-[4px_4px_0px_rgba(26,26,39,0.1)] z-0" />
    </div>
  );
}
