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
const GATO_PRETO_COMENDO = Array.from({ length: 8 }, (_, i) => `/img/sprites/gato-preto-comendo/frame_${i + 1}.png`);
const GATO_PRETO_SONO = Array.from({ length: 8 }, (_, i) => `/img/sprites/gato-preto-sono/frame_${i + 1}.png`);
const GATO_PRETO_BRINCANDO = Array.from({ length: 19 }, (_, i) => `/img/sprites/gato-preto-brincando/frame_${i + 1}.png`);

const GATO_MALHADO_IDLE = Array.from({ length: 4 }, (_, i) => `/img/sprites/gato-malhado-idle/frame_${i + 1}.png`);
const GATO_MALHADO_COMENDO = Array.from({ length: 9 }, (_, i) => `/img/sprites/gato-malhado-comendo/frame_${i + 1}.png`);
const GATO_MALHADO_SONO = Array.from({ length: 8 }, (_, i) => `/img/sprites/gato-malhado-sono/frame_${i + 1}.png`);
const GATO_MALHADO_GROOMING = Array.from({ length: 4 }, (_, i) => `/img/sprites/gato-malhado-idle/frame_${i + 9}.png`);

interface Particle {
  id: number;
  x: number; // percentage width of screen
  y: number; // percentage height of screen
  emoji: string;
}

export default function Tamagotchi() {
  const [outfitIndex, setOutfitIndex] = useState<number>(0);
  const [currentAction, setCurrentAction] = useState<"idle" | "standing" | "comendo" | "sono">("idle");
  const [particles, setParticles] = useState<Particle[]>([]);

  // Timer reference to clear timeouts when switching actions manually
  const [actionTimeout, setActionTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleAction = (action: "standing" | "comendo" | "sono") => {
    // Clear any pending timeout resetting action to idle
    if (actionTimeout) {
      clearTimeout(actionTimeout);
      setActionTimeout(null);
    }

    if (action === "sono") {
      setCurrentAction("sono");
    } else {
      setCurrentAction(action);
      // Automatically return to idle after 2.5 seconds
      const timeout = setTimeout(() => {
        setCurrentAction("idle");
      }, 2500);
      setActionTimeout(timeout);
    }
  };

  const handleWakeUp = () => {
    if (actionTimeout) {
      clearTimeout(actionTimeout);
    }
    setCurrentAction("idle");
  };

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

  const isSleeping = currentAction === "sono";

  // Determine current frame lists for characters
  const girlFrames = getGirlFrames(outfitIndex, currentAction);

  let blackCatFrames = GATO_PRETO_IDLE;
  let blackCatMode: "loop" | "pingpong" = "loop";
  if (isSleeping) {
    blackCatFrames = GATO_PRETO_SONO;
    blackCatMode = "pingpong";
  } else if (currentAction === "comendo") {
    blackCatFrames = GATO_PRETO_COMENDO;
    blackCatMode = "loop";
  } else {
    // Playful by default
    blackCatFrames = GATO_PRETO_BRINCANDO;
    blackCatMode = "loop";
  }

  let tabbyCatFrames = GATO_MALHADO_IDLE;
  let tabbyCatMode: "loop" | "pingpong" = "loop";
  if (isSleeping) {
    tabbyCatFrames = GATO_MALHADO_SONO;
    tabbyCatMode = "pingpong";
  } else if (currentAction === "comendo") {
    tabbyCatFrames = GATO_MALHADO_COMENDO;
    tabbyCatMode = "loop";
  } else {
    // Grooming/cleaning by default
    tabbyCatFrames = GATO_MALHADO_GROOMING;
    tabbyCatMode = "loop";
  }

  return (
    <div
      className="w-full max-w-[420px] bg-[#FAF5EE] rounded-[24px] border-[4px] border-[#1a1a27] p-5 shadow-[6px_6px_0px_#1a1a27] relative flex flex-col items-center select-none"
      style={{ imageRendering: "pixelated" }}
    >
      {/* 1. CRT MONITOR BEZEL / DECORATIONS */}
      <div className="absolute top-2.5 left-6 bg-[#E3E0F3] border border-[#1a1a27] text-[#1a1a27] text-[8px] px-1.5 py-0.5 rounded font-mono font-bold tracking-widest">
        CRT SYSTEM
      </div>
      <div className="absolute top-2.5 right-6 text-[#9a98a6] text-[8px] font-mono font-bold">
        MODEL M-26
      </div>

      {/* 2. CRT SCREEN (Interactive area) */}
      <div className="w-full aspect-[4/3] bg-gradient-to-b from-[#E6E1FA] to-[#c5b8f0] rounded-[16px] border-[3px] border-[#1a1a27] overflow-hidden relative shadow-[inset_4px_4px_10px_rgba(26,26,39,0.25)] flex items-end justify-center mt-3">
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
            background: "linear-gradient(rgba(26,26,39,0) 50%, rgba(26,26,39,0.1) 50%)",
            backgroundSize: "100% 4px",
          }}
        />

        {/* Floating Particles */}
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

        {/* Sleeping Zzz Particle Effect */}
        {isSleeping && (
          <div className="absolute top-[15%] left-[45%] z-20 pointer-events-none flex flex-col gap-1 font-mono font-bold text-xs text-[#1a1a27] animate-pulse">
            <span className="animate-[bounce_2s_infinite] delay-100 opacity-80">Z</span>
            <span className="animate-[bounce_2s_infinite] delay-300 opacity-60 text-[10px] ml-2">z</span>
            <span className="animate-[bounce_2s_infinite] delay-500 opacity-40 text-[8px] ml-4">z</span>
          </div>
        )}

        {/* Cozy Pixel Rug */}
        <div className="absolute bottom-[2%] w-[84%] h-[20%] bg-[#E6E1FA] border-[2px] border-dashed border-[#1a1a27] rounded-full opacity-80 z-0" />

        {/* ─── CHARACTERS LAYER ─── */}

        {/* A. MARY (Center) */}
        <div
          className="absolute bottom-[8%] left-[34%] w-[32%] h-[68%] z-10 cursor-pointer flex items-end justify-center"
          onClick={(e) => spawnParticles(e, "mary")}
        >
          <SpriteAnimation
            frames={girlFrames}
            interval={isSleeping ? 320 : 280}
            mode={isSleeping ? "pingpong" : "loop"}
            alt="Mary Pixel Art"
          />
        </div>

        {/* B. BLACK KITTEN (Left, scaled down to 72% size) */}
        <div
          className="absolute bottom-[6%] left-[6%] w-[25%] h-[32%] z-20 cursor-pointer flex items-end justify-center"
          style={{ transform: "scale(0.72)", transformOrigin: "bottom center" }}
          onClick={(e) => spawnParticles(e, "blackCat")}
        >
          <SpriteAnimation
            frames={blackCatFrames}
            interval={isSleeping ? 350 : 250}
            mode={blackCatMode}
            alt="Gatinha Preta Filhote"
          />
        </div>

        {/* C. TABBY CAT (Right, regular scale) */}
        <div
          className="absolute bottom-[6%] left-[69%] w-[25%] h-[32%] z-20 cursor-pointer flex items-end justify-center"
          style={{ transform: "scale(0.9)", transformOrigin: "bottom center" }}
          onClick={(e) => spawnParticles(e, "tabbyCat")}
        >
          <SpriteAnimation
            frames={tabbyCatFrames}
            interval={isSleeping ? 350 : 280}
            mode={tabbyCatMode}
            alt="Gatinha Tigrada"
          />
        </div>
      </div>

      {/* 3. MONITOR LOWER BEZEL & PULSING STATUS LED */}
      <div className="w-full flex items-center justify-between mt-3 px-1 text-[#1a1a27] font-mono text-[9px] font-bold">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full border border-[#1a1a27] transition-all duration-500 ${
              isSleeping ? "bg-amber-400 shadow-[0_0_8px_#fbbf24]" : "bg-[#39FF14] shadow-[0_0_8px_#39FF14]"
            } animate-pulse`}
          />
          <span>{isSleeping ? "STANDBY" : "ONLINE"}</span>
        </div>
        <div className="tracking-widest">POCKET DISPLAY v1.0</div>
      </div>

      {/* Grid separator line */}
      <div className="w-full h-[2px] bg-[#1a1a27] my-4" />

      {/* 4. CONTROLS PANEL */}
      <div className="w-full flex flex-col gap-4">
        {/* LOOKS SELECTION */}
        <div>
          <div className="text-[9px] font-mono text-[#9a98a6] mb-2 uppercase tracking-wider font-bold">
            Selecionar Look
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 0, label: "Look 1" },
              { id: 1, label: "Look 2" },
              { id: 2, label: "Look 3" },
            ].map((look) => {
              const active = outfitIndex === look.id;
              return (
                <button
                  key={look.id}
                  onClick={() => setOutfitIndex(look.id)}
                  disabled={isSleeping}
                  className={`py-1.5 px-2 border-2 border-[#1a1a27] font-mono text-xs font-bold transition-all ${
                    isSleeping ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                  } ${
                    active
                      ? "bg-[#c5b8f0] translate-x-[2px] translate-y-[2px] shadow-none"
                      : "bg-white hover:bg-[#F5F2FF] shadow-[2px_2px_0px_#1a1a27]"
                  }`}
                >
                  {look.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIONS SELECTION */}
        <div>
          <div className="text-[9px] font-mono text-[#9a98a6] mb-2 uppercase tracking-wider font-bold">
            Interações
          </div>
          <div className="grid grid-cols-3 gap-2">
            {/* Wave Button */}
            <button
              onClick={() => handleAction("standing")}
              disabled={isSleeping}
              className={`py-2 px-2 border-2 border-[#1a1a27] font-mono text-xs font-bold transition-all bg-white hover:bg-[#F5F2FF] ${
                isSleeping
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[2px_2px_0px_#1a1a27]"
              }`}
            >
              Acenar 👋
            </button>

            {/* Snack Button */}
            <button
              onClick={() => handleAction("comendo")}
              disabled={isSleeping}
              className={`py-2 px-2 border-2 border-[#1a1a27] font-mono text-xs font-bold transition-all bg-white hover:bg-[#F5F2FF] ${
                isSleeping
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[2px_2px_0px_#1a1a27]"
              }`}
            >
              Lanche 🧁
            </button>

            {/* Sleep/Wakeup Toggle Button */}
            {isSleeping ? (
              <button
                onClick={handleWakeUp}
                className="py-2 px-2 border-2 border-[#1a1a27] font-mono text-xs font-bold transition-all bg-[#E6E1FA] hover:bg-[#c5b8f0] cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[2px_2px_0px_#1a1a27]"
              >
                Acordar ☀️
              </button>
            ) : (
              <button
                onClick={() => handleAction("sono")}
                className="py-2 px-2 border-2 border-[#1a1a27] font-mono text-xs font-bold transition-all bg-white hover:bg-[#F5F2FF] cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[2px_2px_0px_#1a1a27]"
              >
                Dormir 😴
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
