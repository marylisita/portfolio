"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpriteAnimation from "./SpriteAnimation";

// ─── SPRITE FRAME DEFINITIONS ───────────────────────────────────────────────

const OUTFIT_0_IDLE = Array.from({ length: 6 }, (_, i) => `/img/sprites/outfit_0/garota-idle/frame_${i + 1}.png`);

const GATO_PRETO_BRINCANDO = Array.from({ length: 19 }, (_, i) => `/img/sprites/gato-preto-brincando/frame_${i + 1}.png`);
const GATO_MALHADO_GROOMING = Array.from({ length: 4 }, (_, i) => `/img/sprites/gato-malhado-idle/frame_${i + 9}.png`);

// LCD screen area (% of casinha image)
const SCREEN = {
  left: 31.8,
  top: 15.0,
  width: 45.6,
  height: 51.8,
};

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

export default function Tamagotchi() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [blackCatMeow, setBlackCatMeow] = useState<string | null>(null);
  const [tabbyCatMeow, setTabbyCatMeow] = useState<string | null>(null);
  const [girlMeow, setGirlMeow] = useState<string | null>(null);

  const spawnParticle = (emoji: string) => {
    const id = Date.now() + Math.random();
    const x = 20 + Math.random() * 60;
    const y = 30 + Math.random() * 30;
    setParticles((prev) => [...prev, { id, x, y, emoji }]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 1000);
  };

  const handleGirlClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    spawnParticle("✨");
    spawnParticle("❤️");
    setGirlMeow("Oi! 😊");
    setTimeout(() => setGirlMeow(null), 1500);
  };

  const handleBlackCatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    spawnParticle("❤️");
    setBlackCatMeow(Math.random() > 0.5 ? "Miau! ❤️" : "Purr...");
    setTimeout(() => setBlackCatMeow(null), 1500);
  };

  const handleTabbyCatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    spawnParticle("🎵");
    setTabbyCatMeow(Math.random() > 0.5 ? "Meow! 😸" : "Ronronar");
    setTimeout(() => setTabbyCatMeow(null), 1500);
  };

  const renderMeowBubble = (text: string | null) => {
    if (!text) return null;
    return (
      <div className="absolute bottom-[110%] left-1/2 -translate-x-1/2 bg-white text-slate-800 text-[5px] font-bold px-1 py-0.5 rounded border border-slate-900 shadow-sm pointer-events-none select-none z-30 font-mono whitespace-nowrap animate-bounce">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[2px] border-x-transparent border-t-[2px] border-t-white" />
      </div>
    );
  };

  return (
    <div
      className="relative select-none w-full"
      style={{
        maxWidth: "700px",
        aspectRatio: "2304 / 1842",
      }}
    >
      {/* 1. CASINHA IMAGE (base layer) */}
      <img
        src="/casinha.png?v=4"
        alt="Pixel Chix Cabinet"
        className="w-full h-full object-contain pointer-events-none"
        style={{ imageRendering: "pixelated" }}
      />

      {/* 2. LCD SCREEN OVERLAY (characters live here) */}
      <div
        className="absolute overflow-hidden z-20 cursor-pointer"
        style={{
          left: `${SCREEN.left}%`,
          top: `${SCREEN.top}%`,
          width: `${SCREEN.width}%`,
          height: `${SCREEN.height}%`,
        }}
        onClick={() => spawnParticle("🌸")}
      >
        {/* Particles */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute text-xs z-35 pointer-events-none"
              initial={{ opacity: 1, scale: 0.5, x: p.x, y: p.y }}
              animate={{ opacity: 0, scale: 1.4, y: p.y - 30, x: p.x + (Math.random() - 0.5) * 10 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              {p.emoji}
            </motion.span>
          ))}
        </AnimatePresence>

        <div className="relative w-full h-full flex items-end justify-center">
          {/* BLACK CAT (Playing) */}
          <motion.div
            onClick={handleBlackCatClick}
            className="absolute bottom-[4%] left-[12%] z-15 cursor-pointer"
            style={{ width: "12%", height: "22%", transformOrigin: "bottom center" }}
          >
            {renderMeowBubble(blackCatMeow)}
            <SpriteAnimation
              frames={GATO_PRETO_BRINCANDO}
              interval={250}
              mode="loop"
              alt="Gato preto brincando"
              style={{ objectPosition: "center bottom" }}
            />
          </motion.div>

          {/* TABBY CAT (Grooming) */}
          <motion.div
            onClick={handleTabbyCatClick}
            className="absolute bottom-[4%] left-[72%] z-15 cursor-pointer"
            style={{ width: "12%", height: "22%", transformOrigin: "bottom center" }}
          >
            {renderMeowBubble(tabbyCatMeow)}
            <SpriteAnimation
              frames={GATO_MALHADO_GROOMING}
              interval={300}
              mode="loop"
              alt="Gato malhado se limpando"
              style={{ objectPosition: "center bottom" }}
            />
          </motion.div>

          {/* GIRL CHARACTER (Idle/Waving/Typing) */}
          <motion.div
            onClick={handleGirlClick}
            className="absolute bottom-[4%] left-[42%] z-10 cursor-pointer"
            style={{ width: "14%", height: "40%", transformOrigin: "bottom center" }}
          >
            {renderMeowBubble(girlMeow)}
            <SpriteAnimation
              frames={OUTFIT_0_IDLE}
              interval={300}
              mode="loop"
              alt="Garota acenando"
              style={{ objectPosition: "center bottom" }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
