"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpriteAnimation from "./SpriteAnimation";

// ─── SPRITE FRAME DEFINITIONS ───────────────────────────────────────────────

const getGarotaFrames = (outfitIndex: number, type: "idle" | "walking" | "sono" | "comendo" | "standing") => {
  if (type === "comendo") {
    return [
      `/img/sprites/outfit_${outfitIndex}/garota-comendo/frame_1.png`,
      `/img/sprites/outfit_${outfitIndex}/garota-comendo/frame_2.png`,
      `/img/sprites/outfit_${outfitIndex}/garota-comendo/frame_3.png`,
      `/img/sprites/outfit_${outfitIndex}/garota-comendo/frame_4.png`,
      `/img/sprites/outfit_${outfitIndex}/garota-comendo/frame_5.png`,
      `/img/sprites/outfit_${outfitIndex}/garota-comendo/frame_4.png`,
      `/img/sprites/outfit_${outfitIndex}/garota-comendo/frame_5.png`,
      `/img/sprites/outfit_${outfitIndex}/garota-comendo/frame_4.png`,
      `/img/sprites/outfit_${outfitIndex}/garota-comendo/frame_5.png`,
      `/img/sprites/outfit_${outfitIndex}/garota-comendo/frame_6.png`,
    ];
  }
  return Array.from({ length: 6 }, (_, i) => `/img/sprites/outfit_${outfitIndex}/garota-${type}/frame_${i + 1}.png`);
};

const GATO_PRETO_SONO = Array.from({ length: 8 }, (_, i) => `/img/sprites/gato-preto-sono/frame_${i + 1}.png`);
const GATO_PRETO_COMENDO = Array.from({ length: 8 }, (_, i) => `/img/sprites/gato-preto-comendo/frame_${i + 1}.png`);
const GATO_PRETO_BRINCANDO = Array.from({ length: 19 }, (_, i) => `/img/sprites/gato-preto-brincando/frame_${i + 1}.png`);
const GATO_PRETO_IDLE = Array.from({ length: 8 }, (_, i) => `/img/sprites/gato-preto-idle/frame_${i + 1}.png`);
const GATO_PRETO_ANDANDO = Array.from({ length: 8 }, (_, i) => `/img/sprites/gato-preto-idle/frame_${i + 1}.png`);

const GATO_MALHADO_SONO = Array.from({ length: 8 }, (_, i) => `/img/sprites/gato-malhado-sono/frame_${i + 1}.png`);
const GATO_MALHADO_ANDANDO = Array.from({ length: 8 }, (_, i) => `/img/sprites/gato-malhado-andando/frame_${i + 1}.png`);
const GATO_MALHADO_COMENDO = Array.from({ length: 9 }, (_, i) => `/img/sprites/gato-malhado-comendo/frame_${i + 1}.png`);
const GATO_MALHADO_BRINCANDO = Array.from({ length: 2 }, (_, i) => `/img/sprites/gato-malhado-brincando/frame_${i + 1}.png`);
const GATO_MALHADO_IDLE = Array.from({ length: 4 }, (_, i) => `/img/sprites/gato-malhado-idle/frame_${i + 1}.png`);
const GATO_MALHADO_WALKING = Array.from({ length: 4 }, (_, i) => `/img/sprites/gato-malhado-idle/frame_${i + 5}.png`);
const GATO_MALHADO_GROOMING = Array.from({ length: 4 }, (_, i) => `/img/sprites/gato-malhado-idle/frame_${i + 9}.png`);
const GATO_MALHADO_STANDING = Array.from({ length: 4 }, (_, i) => `/img/sprites/gato-malhado-idle/frame_${i + 13}.png`);

// ─── BOUNDARY CONSTANTS ─────────────────────────────────────────────────────
// All positions are in % of the LCD screen div (not the full casinha image)
const BLACK_CAT_MIN_X = 0;
const BLACK_CAT_MAX_X = 35;
const TABBY_CAT_MIN_X = 40;
const TABBY_CAT_MAX_X = 78;

const clampX = (x: number, min: number, max: number) => Math.max(min, Math.min(max, x));

// ─── BUTTON POSITIONS (% of casinha image, from pixel analysis) ─────────────
// These map to the 4 circular icons drawn into casinha.png
const BUTTONS = [
  { id: "sleep",   cx: 35.5, cy: 77.5, r: 5.5, label: "Dormir" },
  { id: "eat",     cx: 46.3, cy: 77.5, r: 5.5, label: "Comer" },
  { id: "closet",  cx: 57.3, cy: 77.5, r: 5.5, label: "Roupa" },
  { id: "outdoor", cx: 68.4, cy: 77.5, r: 5.5, label: "Sair" },
];

// LCD screen area (% of casinha image)
const SCREEN = {
  left: 31.8,
  top: 15.0,
  width: 45.6,
  height: 51.8,
};

// ─── TYPES ──────────────────────────────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

type CatAction = "sitting" | "standing" | "walking" | "playing" | "grooming" | "sleeping" | "begging";

interface CatState {
  x: number;
  targetX: number;
  action: CatAction;
  isFlipped: boolean;
}

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export default function Tamagotchi() {
  const [status, setStatus] = useState<"sleeping" | "idle" | "eating" | "stats" | "walkingOut" | "walkingIn">("idle");
  const [particles, setParticles] = useState<Particle[]>([]);
  const [hunger, setHunger] = useState(20);
  const [happiness, setHappiness] = useState(60);
  const [outfitIndex, setOutfitIndex] = useState(0);
  const garotaIdle = getGarotaFrames(outfitIndex, "idle");
  const garotaWalking = getGarotaFrames(outfitIndex, "walking");
  const garotaSono = getGarotaFrames(outfitIndex, "sono");
  const garotaComendo = getGarotaFrames(outfitIndex, "comendo");
  const [cupcakeActive, setCupcakeActive] = useState(false);
  const [starActive, setStarActive] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  // Cats AI States
  const [blackCat, setBlackCat] = useState<CatState>({
    x: 14,
    targetX: 14,
    action: "sitting",
    isFlipped: false
  });

  const [tabbyCat, setTabbyCat] = useState<CatState>({
    x: 60,
    targetX: 60,
    action: "standing",
    isFlipped: false
  });

  // Cat Speech Bubbles
  const [blackCatMeow, setBlackCatMeow] = useState<string | null>(null);
  const [tabbyCatMeow, setTabbyCatMeow] = useState<string | null>(null);

  // Auto-sleep if idle for 20 seconds
  useEffect(() => {
    if (status !== "sleeping" && status !== "stats" && !status.startsWith("walking")) {
      const timer = setTimeout(() => {
        setStatus("sleeping");
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Cats Random AI Behavior Loop
  useEffect(() => {
    if (status === "sleeping" || status === "eating" || status.startsWith("walking")) return;

    const interval = setInterval(() => {
      setBlackCat((prev) => {
        if (prev.action === "walking") return prev;
        const rand = Math.random();
        if (rand < 0.3) {
          const newTarget = clampX(BLACK_CAT_MIN_X + 5 + Math.random() * (BLACK_CAT_MAX_X - BLACK_CAT_MIN_X - 5), BLACK_CAT_MIN_X, BLACK_CAT_MAX_X);
          return { ...prev, action: "walking", targetX: newTarget, isFlipped: newTarget < prev.x };
        } else if (rand < 0.55) {
          return { ...prev, action: "grooming" };
        } else if (rand < 0.7) {
          return { ...prev, action: "playing" };
        } else if (rand < 0.8) {
          setBlackCatMeow(Math.random() > 0.5 ? "Miau! ❤️" : "Purr...");
          setTimeout(() => setBlackCatMeow(null), 1500);
          return { ...prev, action: "sitting" };
        } else {
          return { ...prev, action: "sitting" };
        }
      });

      setTabbyCat((prev) => {
        if (prev.action === "walking") return prev;
        const rand = Math.random();
        if (rand < 0.3) {
          const newTarget = clampX(TABBY_CAT_MIN_X + 5 + Math.random() * (TABBY_CAT_MAX_X - TABBY_CAT_MIN_X - 5), TABBY_CAT_MIN_X, TABBY_CAT_MAX_X);
          return { ...prev, action: "walking", targetX: newTarget, isFlipped: newTarget < prev.x };
        } else if (rand < 0.55) {
          return { ...prev, action: "grooming" };
        } else if (rand < 0.7) {
          return { ...prev, action: "playing" };
        } else if (rand < 0.8) {
          setTabbyCatMeow(Math.random() > 0.5 ? "Meow! 😸" : "Ronronar");
          setTimeout(() => setTabbyCatMeow(null), 1500);
          return { ...prev, action: "standing" };
        } else {
          return { ...prev, action: "standing" };
        }
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [status]);

  // Walk physics loop
  useEffect(() => {
    const walkTimer = setInterval(() => {
      setBlackCat((prev) => {
        if (prev.action !== "walking") return prev;
        const target = clampX(prev.targetX, BLACK_CAT_MIN_X, BLACK_CAT_MAX_X);
        const dx = target - prev.x;
        if (Math.abs(dx) < 1.0) {
          let nextAction: CatAction = "sitting";
          if (status === "sleeping") nextAction = "sleeping";
          else if (status === "eating") nextAction = "begging";
          return { ...prev, x: target, action: nextAction };
        }
        return { ...prev, x: clampX(prev.x + Math.sign(dx) * 0.8, BLACK_CAT_MIN_X, BLACK_CAT_MAX_X) };
      });

      setTabbyCat((prev) => {
        if (prev.action !== "walking") return prev;
        const target = clampX(prev.targetX, TABBY_CAT_MIN_X, TABBY_CAT_MAX_X);
        const dx = target - prev.x;
        if (Math.abs(dx) < 1.0) {
          let nextAction: CatAction = "standing";
          if (status === "sleeping") nextAction = "sleeping";
          else if (status === "eating") nextAction = "begging";
          return { ...prev, x: target, action: nextAction };
        }
        return { ...prev, x: clampX(prev.x + Math.sign(dx) * 0.8, TABBY_CAT_MIN_X, TABBY_CAT_MAX_X) };
      });
    }, 33);

    return () => clearInterval(walkTimer);
  }, [status]);

  // Sync cats with status changes
  useEffect(() => {
    if (status === "eating") {
      setBlackCat((prev) => ({ ...prev, action: "walking", targetX: clampX(25, BLACK_CAT_MIN_X, BLACK_CAT_MAX_X), isFlipped: false }));
      setTabbyCat((prev) => ({ ...prev, action: "walking", targetX: clampX(65, TABBY_CAT_MIN_X, TABBY_CAT_MAX_X), isFlipped: true }));
      setBlackCatMeow("🧁?");
      setTabbyCatMeow("Meow! 😋");
      setTimeout(() => { setBlackCatMeow(null); setTabbyCatMeow(null); }, 1800);
    } else if (status === "sleeping") {
      setBlackCat((prev) => ({ ...prev, action: "walking", targetX: clampX(18, BLACK_CAT_MIN_X, BLACK_CAT_MAX_X), isFlipped: false }));
      setTabbyCat((prev) => ({ ...prev, action: "walking", targetX: clampX(42, TABBY_CAT_MIN_X, TABBY_CAT_MAX_X), isFlipped: true }));
    } else if (status === "walkingOut") {
      setBlackCat((prev) => ({ ...prev, action: "walking", targetX: clampX(34, BLACK_CAT_MIN_X, BLACK_CAT_MAX_X), isFlipped: false }));
      setTabbyCat((prev) => ({ ...prev, action: "walking", targetX: clampX(75, TABBY_CAT_MIN_X, TABBY_CAT_MAX_X), isFlipped: false }));
      setBlackCatMeow("👋");
      setTabbyCatMeow("Miau! 🌸");
      setTimeout(() => { setBlackCatMeow(null); setTabbyCatMeow(null); }, 2000);
    }
  }, [status]);

  // ─── ACTION HANDLERS ───────────────────────────────────────────────────────

  const spawnParticle = (emoji: string) => {
    const id = Date.now() + Math.random();
    const x = 20 + Math.random() * 60;
    const y = 30 + Math.random() * 30;
    setParticles((prev) => [...prev, { id, x, y, emoji }]);
    setTimeout(() => { setParticles((prev) => prev.filter((p) => p.id !== id)); }, 1000);
  };

  const handleSleepToggle = () => {
    if (status.startsWith("walking") || status === "stats") return;
    if (status === "sleeping") {
      setStatus("idle");
      spawnParticle("💤");
      setBlackCat((prev) => ({ ...prev, action: "sitting", targetX: prev.x }));
      setTabbyCat((prev) => ({ ...prev, action: "standing", targetX: prev.x }));
    } else {
      setStatus("sleeping");
      spawnParticle("🌙");
    }
  };

  const handleCloset = () => {
    if (status.startsWith("walking") || status === "stats" || status === "sleeping") return;
    setIsSpinning(true);
    spawnParticle("✨");
    setTimeout(() => { setOutfitIndex((prev) => (prev + 1) % 3); }, 250);
    setTimeout(() => { setIsSpinning(false); spawnParticle("👗"); }, 500);
  };

  const handleFeed = () => {
    if (status.startsWith("walking") || status === "stats" || status === "sleeping") return;
    setStatus("eating");
    setCupcakeActive(true);
    setHunger((prev) => Math.max(0, prev - 20));
    setHappiness((prev) => Math.min(100, prev + 5));
    setTimeout(() => {
      spawnParticle("🧁");
      spawnParticle("❤️");
      setStatus("idle");
      setCupcakeActive(false);
      setBlackCat((prev) => ({ ...prev, action: "sitting", targetX: prev.x }));
      setTabbyCat((prev) => ({ ...prev, action: "standing", targetX: prev.x }));
    }, 1800);
  };

  const handleOutdoors = () => {
    if (status.startsWith("walking") || status === "stats" || status === "sleeping") return;
    setStatus("walkingOut");
    setHappiness((prev) => Math.min(100, prev + 15));
    setTimeout(() => { setStatus("walkingIn"); spawnParticle("🌸"); }, 2200);
    setTimeout(() => {
      setStatus("idle");
      spawnParticle("👋");
      setBlackCat((prev) => ({ ...prev, action: "sitting", targetX: prev.x }));
      setTabbyCat((prev) => ({ ...prev, action: "standing", targetX: prev.x }));
    }, 3600);
  };

  const handlePet = () => {
    if (status === "sleeping") {
      setStatus("idle");
      spawnParticle("💤");
      setBlackCat((prev) => ({ ...prev, action: "sitting", targetX: prev.x }));
      setTabbyCat((prev) => ({ ...prev, action: "standing", targetX: prev.x }));
      return;
    }
    if (status.startsWith("walking") || status === "stats") return;
    spawnParticle("❤️");
    setHappiness((prev) => Math.min(100, prev + 10));
    setStarActive(true);
    setTimeout(() => setStarActive(false), 500);
  };

  const handleButtonClick = (btnId: string) => {
    switch (btnId) {
      case "sleep": handleSleepToggle(); break;
      case "eat": handleFeed(); break;
      case "closet": handleCloset(); break;
      case "outdoor": handleOutdoors(); break;
    }
  };

  const handleBlackCatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBlackCat((prev) => ({ ...prev, action: "playing", isFlipped: !prev.isFlipped }));
    setBlackCatMeow(Math.random() > 0.5 ? "Miau! ❤️" : "Purr...");
    spawnParticle("❤️");
    setTimeout(() => setBlackCatMeow(null), 1500);
  };

  const handleTabbyCatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTabbyCat((prev) => ({ ...prev, action: "playing", isFlipped: !prev.isFlipped }));
    setTabbyCatMeow(Math.random() > 0.5 ? "Meow! 😸" : "Ronronar");
    spawnParticle("✨");
    setTimeout(() => setTabbyCatMeow(null), 1500);
  };

  const getChixAnimation = () => {
    switch (status) {
      case "eating":
        return { x: [0, -10, -10, 0], y: [0, -2, 0] };
      case "walkingOut":
        return { x: [0, 80], opacity: [1, 1, 0] };
      case "walkingIn":
        return { x: [-80, 0], opacity: [0, 1, 1] };
      default:
        return starActive
          ? { y: [0, -10, 0], rotate: [0, -8, 8, 0] }
          : { y: [0, -1, 0] };
    }
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────

  const renderCatSprite = (cat: CatState, type: "black" | "tabby") => {
    const isBlack = type === "black";
    if (cat.action === "sleeping") {
      return <SpriteAnimation frames={isBlack ? GATO_PRETO_SONO : GATO_MALHADO_SONO} interval={450} mode="pingpong" alt={`Gato ${type} dormindo`} style={{ objectPosition: "center bottom", transform: `scaleX(${cat.isFlipped ? -1 : 1})` }} />;
    } else if (cat.action === "walking") {
      return <SpriteAnimation frames={isBlack ? GATO_PRETO_ANDANDO : GATO_MALHADO_WALKING} interval={300} mode="loop" alt={`Gato ${type} andando`} style={{ objectPosition: "center bottom", transform: `scaleX(${cat.isFlipped ? -1 : 1})` }} />;
    } else if (cat.action === "playing") {
      return <SpriteAnimation frames={isBlack ? GATO_PRETO_BRINCANDO : GATO_MALHADO_BRINCANDO} interval={300} mode="loop" alt={`Gato ${type} brincando`} style={{ objectPosition: "center bottom", transform: `scaleX(${cat.isFlipped ? -1 : 1})` }} />;
    } else if (cat.action === "begging") {
      return <SpriteAnimation frames={isBlack ? GATO_PRETO_COMENDO : GATO_MALHADO_COMENDO} interval={350} mode="loop" alt={`Gato ${type} comendo`} style={{ objectPosition: "center bottom", transform: `scaleX(${cat.isFlipped ? -1 : 1})` }} />;
    } else if (!isBlack && cat.action === "grooming") {
      return <SpriteAnimation frames={GATO_MALHADO_GROOMING} interval={300} mode="loop" alt="Gato malhado se limpando" style={{ objectPosition: "center bottom", transform: `scaleX(${cat.isFlipped ? -1 : 1})` }} />;
    } else if (!isBlack && cat.action === "standing") {
      return <SpriteAnimation frames={GATO_MALHADO_STANDING} interval={300} mode="loop" alt="Gato malhado em pe" style={{ objectPosition: "center bottom", transform: `scaleX(${cat.isFlipped ? -1 : 1})` }} />;
    } else {
      return <SpriteAnimation frames={isBlack ? GATO_PRETO_IDLE : GATO_MALHADO_IDLE} interval={300} mode="loop" alt={`Gato ${type}`} style={{ objectPosition: "center bottom", transform: `scaleX(${cat.isFlipped ? -1 : 1})` }} />;
    }
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
        onClick={handlePet}
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

        {status === "stats" ? (
          <div className="w-full h-full flex flex-col justify-center px-6 pt-6 text-[10px] leading-[1.3] text-slate-700 font-mono z-10 bg-[#8be4eb]/90 rounded border-2 border-slate-700 m-2 shadow-inner">
            <div className="font-bold border-b-2 border-slate-900 pb-1 mb-2 flex justify-between uppercase text-xs">
              <span>CHIX STATS</span>
              <span className="text-pink-600">HAPPY</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>COMIDA:</span>
              <span>{hunger < 40 ? "FRIDGE OK" : "NEED 🧁"}</span>
            </div>
            <div className="w-full bg-slate-300 h-2 rounded overflow-hidden mb-3 border-2 border-slate-700">
              <div className="bg-[#b6f23e] h-full" style={{ width: `${100 - hunger}%` }}></div>
            </div>
            <div className="flex justify-between">
              <span>GATINHAS:</span>
              <span>2 IN_ROOM</span>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-end justify-center">
            {/* Cupcake animation */}
            {cupcakeActive && (
              <motion.div
                className="absolute left-[58%] bottom-[15%] text-[12px] z-20"
                animate={{ x: [0, -5, -8], y: [0, -4, 0], scale: [1, 1.1, 0.8], opacity: [1, 1, 0] }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                🧁
              </motion.div>
            )}

            {/* Sleep ZZZ */}
            {status === "sleeping" && (
              <div className="absolute right-12 top-2 text-[7px] font-bold text-slate-400 flex flex-col items-center z-25">
                <motion.span animate={{ y: [0, -6], x: [0, 3], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>z</motion.span>
                <motion.span animate={{ y: [0, -8], x: [0, -3], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.5 }}>Z</motion.span>
              </div>
            )}

            {/* BLACK CAT */}
            <motion.div
              onClick={handleBlackCatClick}
              className="absolute bottom-[4%] z-15 cursor-pointer"
              style={{ left: `${blackCat.x}%`, width: "12%", height: "22%", transformOrigin: "bottom center" }}
              animate={
                blackCat.action === "sleeping"
                  ? { y: [0, 0.4, 0], scaleY: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2.2, ease: "easeInOut" } }
                  : blackCat.action === "walking"
                  ? { y: [0, -1.5, 0], transition: { repeat: Infinity, duration: 0.2, ease: "linear" } }
                  : blackCat.action === "playing"
                  ? { y: [0, -6, 0, -4, 0], scaleY: [1, 0.6, 1.2, 0.7, 1], transition: { duration: 0.8 } }
                  : blackCat.action === "begging"
                  ? { y: [0, -2.5, 0], transition: { repeat: Infinity, duration: 0.4, ease: "easeOut" } }
                  : { y: 0 }
              }
            >
              {renderMeowBubble(blackCatMeow)}
              {renderCatSprite(blackCat, "black")}
            </motion.div>

            {/* TABBY CAT */}
            <motion.div
              onClick={handleTabbyCatClick}
              className="absolute bottom-[4%] z-15 cursor-pointer"
              style={{ left: `${tabbyCat.x}%`, width: "12%", height: "22%", transformOrigin: "bottom center" }}
              animate={
                tabbyCat.action === "sleeping"
                  ? { y: [0, 0.4, 0], scaleY: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2.0, ease: "easeInOut" } }
                  : tabbyCat.action === "walking"
                  ? { y: [0, -1.5, 0], transition: { repeat: Infinity, duration: 0.2, ease: "linear" } }
                  : tabbyCat.action === "playing"
                  ? { y: [0, -3, 0], rotate: [0, 360], transition: { duration: 0.65 } }
                  : tabbyCat.action === "begging"
                  ? { y: [0, -2.5, 0], transition: { repeat: Infinity, duration: 0.4, ease: "easeOut", delay: 0.1 } }
                  : { y: 0 }
              }
            >
              {renderMeowBubble(tabbyCatMeow)}
              {renderCatSprite(tabbyCat, "tabby")}
            </motion.div>

            {/* GIRL CHARACTER */}
            {status === "sleeping" ? (
              <div
                className="absolute z-[8]"
                style={{
                  left: "50%",
                  bottom: "4%",
                  transform: "translateX(-50%)",
                  height: "38%",
                  aspectRatio: "1 / 1.4",
                }}
              >
                <SpriteAnimation frames={garotaSono} interval={360} mode="loopLast3" alt="Garota dormindo" />
              </div>
            ) : (
              <motion.div
                className="absolute bottom-[4%] z-10"
                style={{ left: "40%", width: "14%", height: "40%", transformOrigin: "bottom center" }}
                animate={getChixAnimation()}
                transition={
                  status.startsWith("walking")
                    ? { duration: 1.8, ease: "easeInOut" }
                    : { repeat: Infinity, duration: 2.0, ease: "easeInOut" }
                }
              >
                <motion.div
                  style={{ width: "100%", height: "100%" }}
                  animate={isSpinning ? { rotateY: [0, 360, 720] } : {}}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <SpriteAnimation
                    frames={
                      status === "eating"
                        ? garotaComendo
                        : status.startsWith("walking")
                        ? garotaWalking
                        : garotaIdle
                    }
                    interval={300}
                    mode="loop"
                    alt={
                      status === "eating"
                        ? "Garota comendo"
                        : status.startsWith("walking")
                        ? "Garota andando"
                        : "Garota digitando"
                    }
                  />
                </motion.div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* 3. INVISIBLE BUTTON HITBOXES (overlaid on casinha button icons) */}
      {BUTTONS.map((btn) => (
        <button
          key={btn.id}
          onClick={() => handleButtonClick(btn.id)}
          onMouseEnter={() => setHoveredButton(btn.id)}
          onMouseLeave={() => setHoveredButton(null)}
          className="absolute z-30 rounded-full cursor-pointer transition-all duration-150"
          style={{
            left: `${btn.cx - btn.r}%`,
            top: `${btn.cy - btn.r}%`,
            width: `${btn.r * 2}%`,
            height: `${btn.r * 2}%`,
            background: hoveredButton === btn.id ? "rgba(255,255,255,0.25)" : "transparent",
            border: "none",
            outline: "none",
            transform: hoveredButton === btn.id ? "scale(1.08)" : "scale(1)",
          }}
          title={btn.label}
          aria-label={btn.label}
        />
      ))}
    </div>
  );
}
