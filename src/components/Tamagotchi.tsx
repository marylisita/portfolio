"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpriteAnimation from "./SpriteAnimation";

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
const GATO_PRETO_SONO = Array.from({ length: 12 }, (_, i) => `/img/sprites/gato-preto-sono/frame_${i + 1}.png`);
const GATO_PRETO_COMENDO = Array.from({ length: 8 }, (_, i) => `/img/sprites/gato-preto-comendo/frame_${i + 1}.png`);
const GATO_PRETO_BRINCANDO = Array.from({ length: 24 }, (_, i) => `/img/sprites/gato-preto-brincando/frame_${i + 1}.png`);
const GATO_PRETO_IDLE = Array.from({ length: 4 }, (_, i) => `/img/sprites/gato-preto-idle/frame_${i + 1}.png`);
const GATO_PRETO_ANDANDO = Array.from({ length: 4 }, (_, i) => `/img/sprites/gato-preto-idle/frame_${i + 5}.png`);

const GATO_MALHADO_SONO = Array.from({ length: 12 }, (_, i) => `/img/sprites/gato-malhado-sono/frame_${i + 1}.png`);
const GATO_MALHADO_ANDANDO = Array.from({ length: 8 }, (_, i) => `/img/sprites/gato-malhado-andando/frame_${i + 1}.png`);
const GATO_MALHADO_COMENDO = Array.from({ length: 9 }, (_, i) => `/img/sprites/gato-malhado-comendo/frame_${i + 1}.png`);
const GATO_MALHADO_BRINCANDO = Array.from({ length: 20 }, (_, i) => `/img/sprites/gato-malhado-brincando/frame_${i + 1}.png`);
const GATO_MALHADO_IDLE = Array.from({ length: 4 }, (_, i) => `/img/sprites/gato-malhado-idle/frame_${i + 1}.png`);
const GATO_MALHADO_WALKING = Array.from({ length: 4 }, (_, i) => `/img/sprites/gato-malhado-idle/frame_${i + 5}.png`);
const GATO_MALHADO_GROOMING = Array.from({ length: 4 }, (_, i) => `/img/sprites/gato-malhado-idle/frame_${i + 9}.png`);
const GATO_MALHADO_STANDING = Array.from({ length: 4 }, (_, i) => `/img/sprites/gato-malhado-idle/frame_${i + 13}.png`);


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

export default function Tamagotchi() {
  const [status, setStatus] = useState<"sleeping" | "idle" | "eating" | "stats" | "walkingOut" | "walkingIn">("idle");
  const [particles, setParticles] = useState<Particle[]>([]);
  const [hunger, setHunger] = useState(20);
  const [happiness, setHappiness] = useState(60);
  const [outfitIndex, setOutfitIndex] = useState(0); // 0: Casual (purple), 1: Bunny (pink), 2: Cyber Star (green with glasses)
  const garotaIdle = getGarotaFrames(outfitIndex, "idle");
  const garotaWalking = getGarotaFrames(outfitIndex, "walking");
  const garotaSono = getGarotaFrames(outfitIndex, "sono");
  const garotaComendo = getGarotaFrames(outfitIndex, "comendo");
  const [cupcakeActive, setCupcakeActive] = useState(false);
  const [starActive, setStarActive] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [blinking, setBlinking] = useState(false);

  // Animation Frame Tick (updates every 200ms for retro pixel animations)
  const [tick, setTick] = useState(0);

  // Cats AI States (adjusted targets and boundary coordinates for larger sizes)
  const [blackCat, setBlackCat] = useState<CatState>({
    x: 14,
    targetX: 14,
    action: "sitting",
    isFlipped: false
  });

  const [tabbyCat, setTabbyCat] = useState<CatState>({
    x: 72,
    targetX: 72,
    action: "standing",
    isFlipped: false
  });

  // Cat Speech Bubble Texts
  const [blackCatMeow, setBlackCatMeow] = useState<string | null>(null);
  const [tabbyCatMeow, setTabbyCatMeow] = useState<string | null>(null);

  // Frame tick loop
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => (t + 1) % 8);
    }, 200);
    return () => clearInterval(timer);
  }, []);

  // Blinking eyes simulation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, 2800);
    return () => clearInterval(blinkInterval);
  }, []);

  // Auto-sleep if idle for 20 seconds
  useEffect(() => {
    if (status !== "sleeping" && status !== "stats" && !status.startsWith("walking")) {
      const timer = setTimeout(() => {
        setStatus("sleeping");
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Cats Random AI Behavior Loop (decides next action when idle/normal)
  useEffect(() => {
    if (status === "sleeping" || status === "eating" || status.startsWith("walking")) return;

    const interval = setInterval(() => {
      // 1. Black Cat AI (left half area: 10% to 36%)
      setBlackCat((prev) => {
        if (prev.action === "walking") return prev; // Do not interrupt walks
        const rand = Math.random();
        if (rand < 0.3) {
          const newTarget = 10 + Math.random() * 26;
          return {
            ...prev,
            action: "walking",
            targetX: newTarget,
            isFlipped: newTarget < prev.x
          };
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

      // 2. Tabby Cat AI (right half area: 54% to 80%)
      setTabbyCat((prev) => {
        if (prev.action === "walking") return prev;
        const rand = Math.random();
        if (rand < 0.3) {
          const newTarget = 54 + Math.random() * 26;
          return {
            ...prev,
            action: "walking",
            targetX: newTarget,
            isFlipped: newTarget < prev.x
          };
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

  // Walk physics loop (~30fps)
  useEffect(() => {
    const walkTimer = setInterval(() => {
      // Move Black Cat
      setBlackCat((prev) => {
        if (prev.action !== "walking") return prev;
        const dx = prev.targetX - prev.x;
        if (Math.abs(dx) < 1.0) {
          let nextAction: CatAction = "sitting";
          if (status === "sleeping") nextAction = "sleeping";
          else if (status === "eating") nextAction = "begging";
          return { ...prev, x: prev.targetX, action: nextAction };
        }
        return {
          ...prev,
          x: prev.x + Math.sign(dx) * 0.8
        };
      });

      // Move Tabby Cat
      setTabbyCat((prev) => {
        if (prev.action !== "walking") return prev;
        const dx = prev.targetX - prev.x;
        if (Math.abs(dx) < 1.0) {
          let nextAction: CatAction = "standing";
          if (status === "sleeping") nextAction = "sleeping";
          else if (status === "eating") nextAction = "begging";
          return { ...prev, x: prev.targetX, action: nextAction };
        }
        return {
          ...prev,
          x: prev.x + Math.sign(dx) * 0.8
        };
      });
    }, 33);

    return () => clearInterval(walkTimer);
  }, [status]);

  // Sync cats' targets with cabinet states (Eating, Sleeping, Outdoors)
  useEffect(() => {
    if (status === "eating") {
      // Begging mode: walk near the dining table (black cat at 25%, tabby cat at 68%)
      setBlackCat((prev) => ({
        ...prev,
        action: "walking",
        targetX: 25,
        isFlipped: false
      }));
      setTabbyCat((prev) => ({
        ...prev,
        action: "walking",
        targetX: 68,
        isFlipped: true
      }));
      setBlackCatMeow("🧁?");
      setTabbyCatMeow("Meow! 😋");
      setTimeout(() => {
        setBlackCatMeow(null);
        setTabbyCatMeow(null);
      }, 1800);
    } 
    
    else if (status === "sleeping") {
      // Sleeping mode: curl up together at the foot of the bed
      setBlackCat((prev) => ({
        ...prev,
        action: "walking",
        targetX: 18,
        isFlipped: false
      }));
      setTabbyCat((prev) => ({
        ...prev,
        action: "walking",
        targetX: 26,
        isFlipped: true
      }));
    } 
    
    else if (status === "walkingOut") {
      // Outdoors mode: walk towards the doorway and wave
      setBlackCat((prev) => ({
        ...prev,
        action: "walking",
        targetX: 70,
        isFlipped: false
      }));
      setTabbyCat((prev) => ({
        ...prev,
        action: "walking",
        targetX: 80,
        isFlipped: false
      }));
      setBlackCatMeow("👋");
      setTabbyCatMeow("Miau! 🌸");
      setTimeout(() => {
        setBlackCatMeow(null);
        setTabbyCatMeow(null);
      }, 2000);
    }
  }, [status]);

  const spawnParticle = (emoji: string) => {
    const id = Date.now() + Math.random();
    const x = 20 + Math.random() * 60;
    const y = 30 + Math.random() * 30;
    setParticles((prev) => [...prev, { id, x, y, emoji }]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 1000);
  };

  const handleSleepToggle = () => {
    if (status.startsWith("walking") || status === "stats") return;
    if (status === "sleeping") {
      setStatus("idle");
      spawnParticle("💤");
      // Wake up the cats and send them back to room exploration
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
    
    setTimeout(() => {
      setOutfitIndex((prev) => (prev + 1) % 3);
    }, 250);

    setTimeout(() => {
      setIsSpinning(false);
      spawnParticle("👗");
    }, 500);
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
      // Reset cats
      setBlackCat((prev) => ({ ...prev, action: "sitting", targetX: prev.x }));
      setTabbyCat((prev) => ({ ...prev, action: "standing", targetX: prev.x }));
    }, 1800);
  };

  const handleOutdoors = () => {
    if (status.startsWith("walking") || status === "stats" || status === "sleeping") return;
    setStatus("walkingOut");
    setHappiness((prev) => Math.min(100, prev + 15));

    setTimeout(() => {
      setStatus("walkingIn");
      spawnParticle("🌸");
    }, 2200);

    setTimeout(() => {
      setStatus("idle");
      spawnParticle("👋");
      // Reset cats
      setBlackCat((prev) => ({ ...prev, action: "sitting", targetX: prev.x }));
      setTabbyCat((prev) => ({ ...prev, action: "standing", targetX: prev.x }));
    }, 3600);
  };

  const handleToggleStats = () => {
    if (status.startsWith("walking")) return;
    if (status === "stats") {
      setStatus("idle");
    } else {
      setStatus("stats");
    }
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

  const handleBlackCatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBlackCat((prev) => ({
      ...prev,
      action: "playing",
      isFlipped: !prev.isFlipped
    }));
    setBlackCatMeow(Math.random() > 0.5 ? "Miau! ❤️" : "Purr...");
    spawnParticle("❤️");
    setTimeout(() => setBlackCatMeow(null), 1500);
  };

  const handleTabbyCatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTabbyCat((prev) => ({
      ...prev,
      action: "playing",
      isFlipped: !prev.isFlipped
    }));
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

  return (
    <div 
      className="relative select-none w-full"
      style={{ 
        maxWidth: "700px", // Increased overall cabinet size for desktop view
        aspectRatio: "1024 / 819"
      }}
    >
      {/* 1. MOCKUP HOUSING IMAGE */}
      <img 
        src="/casinha.png?v=3" 
        alt="Pixel Chix Cabinet" 
        className="w-full h-full object-contain pointer-events-none z-10"
        style={{ imageRendering: "pixelated" }}
      />

      {/* 2. DYNAMIC LCD SCREEN OVERLAY */}
      <div 
        className="absolute overflow-hidden text-slate-800 z-20 cursor-pointer rounded-[2px]"
        style={{
          left: "24%",
          top: "14%",
          width: "56%",
          height: "54%",
        }}
        onClick={handlePet}
      >
        {/* Dynamic Particles */}
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

        {/* Room Graphics */}
        {status === "stats" ? (
          /* TCC STATS VIEW */
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
            <div className="flex justify-between mt-3 pt-1 border-t border-slate-900/10 text-slate-500 uppercase text-[8px]">
              <span>TCC STATUS: CONNECTED</span>
            </div>
          </div>
        ) : (
          /* ROOM ANIMATION VIEW */
          <div className="relative w-full h-full flex items-end justify-center">

            {/* Cupcake eating food animation */}
            {cupcakeActive && (
              <motion.div 
                className="absolute left-[58%] bottom-[15%] text-[12px] z-20"
                animate={{ x: [0, -5, -8], y: [0, -4, 0], scale: [1, 1.1, 0.8], opacity: [1, 1, 0] }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                🧁
              </motion.div>
            )}

            {/* zZZ Sleep text indicator */}
            {status === "sleeping" && (
              <div className="absolute right-12 top-2 text-[7px] font-bold text-slate-400 flex flex-col items-center z-25">
                <motion.span
                  animate={{ y: [0, -6], x: [0, 3], opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, delay: 0 }}
                >z</motion.span>
                <motion.span
                  animate={{ y: [0, -8], x: [0, -3], opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, delay: 0.5 }}
                >Z</motion.span>
              </div>
            )}

            {/* ============================================================== */}
            {/* GATINHA 1: PRETINHA MAGRINHA (Increased Size 16% x 28% & Detailed SVG) */}
            {/* ============================================================== */}
            <motion.div
              onClick={handleBlackCatClick}
              className="absolute bottom-[2px] w-[20%] h-[35%] z-15 cursor-pointer"
              style={{
                left: `${blackCat.x}%`,
                transformOrigin: "bottom center",
              }}
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
              {/* Custom Meow Speech Bubble */}
              {blackCatMeow && (
                <div className="absolute bottom-[110%] left-1/2 -translate-x-1/2 bg-white text-slate-800 text-[5px] font-bold px-1 py-0.5 rounded border border-slate-900 shadow-sm pointer-events-none select-none z-30 font-mono whitespace-nowrap animate-bounce">
                  {blackCatMeow}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[2px] border-x-transparent border-t-[2px] border-t-white" />
                  <div className="absolute top-[calc(100%+0.5px)] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[2.5px] border-x-transparent border-t-[2.5px] border-t-slate-900 -z-10" />
                </div>
              )}

            {blackCat.action === "sleeping" ? (
              <SpriteAnimation
                frames={GATO_PRETO_SONO}
                interval={450}
                mode="pingpong"
                alt="Gato preto dormindo"
                style={{ objectPosition: "center bottom", transform: `scaleX(${blackCat.isFlipped ? -1 : 1})` }}
              />
            ) : blackCat.action === "walking" ? (
              <SpriteAnimation
                frames={GATO_PRETO_ANDANDO}
                interval={300}
                mode="loop"
                alt="Gato preto andando"
                style={{ objectPosition: "center bottom", transform: `scaleX(${blackCat.isFlipped ? -1 : 1})` }}
              />
            ) : blackCat.action === "playing" ? (
              <SpriteAnimation
                frames={GATO_PRETO_BRINCANDO}
                interval={300}
                mode="loop"
                alt="Gato preto brincando"
                style={{ objectPosition: "center bottom", transform: `scaleX(${blackCat.isFlipped ? -1 : 1})` }}
              />
            ) : blackCat.action === "begging" ? (
              <SpriteAnimation
                frames={GATO_PRETO_COMENDO}
                interval={350}
                mode="loop"
                alt="Gato preto comendo"
                style={{ objectPosition: "center bottom", transform: `scaleX(${blackCat.isFlipped ? -1 : 1})` }}
              />
            ) : (
              <SpriteAnimation
                frames={GATO_PRETO_IDLE}
                interval={300}
                mode="loop"
                alt="Gato preto"
                style={{ objectPosition: "center bottom", transform: `scaleX(${blackCat.isFlipped ? -1 : 1})` }}
              />
            )}
            </motion.div>

            {/* ============================================================== */}
            {/* GATINHA 2: TIGRADA GORDINHA (Increased Size 18% x 30% & Detailed SVG) */}
            {/* ============================================================== */}
            <motion.div
              onClick={handleTabbyCatClick}
              className="absolute bottom-[2px] w-[22%] h-[37%] z-15 cursor-pointer"
              style={{
                left: `${tabbyCat.x}%`,
                transformOrigin: "bottom center",
              }}
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
              {/* Custom Meow Speech Bubble */}
              {tabbyCatMeow && (
                <div className="absolute bottom-[110%] left-1/2 -translate-x-1/2 bg-white text-slate-800 text-[5px] font-bold px-1 py-0.5 rounded border border-slate-900 shadow-sm pointer-events-none select-none z-30 font-mono whitespace-nowrap animate-bounce">
                  {tabbyCatMeow}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[2px] border-x-transparent border-t-[2px] border-t-white" />
                  <div className="absolute top-[calc(100%+0.5px)] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[2.5px] border-x-transparent border-t-[2.5px] border-t-slate-900 -z-10" />
                </div>
              )}

              {tabbyCat.action === "sleeping" ? (
                <SpriteAnimation
                  frames={GATO_MALHADO_SONO}
                  interval={450}
                  mode="pingpong"
                  alt="Gato malhado dormindo"
                  style={{ objectPosition: "center bottom", transform: `scaleX(${tabbyCat.isFlipped ? -1 : 1})` }}
                />
              ) : tabbyCat.action === "walking" ? (
                <SpriteAnimation
                  frames={GATO_MALHADO_WALKING}
                  interval={300}
                  mode="loop"
                  alt="Gato malhado andando"
                  style={{ objectPosition: "center bottom", transform: `scaleX(${tabbyCat.isFlipped ? -1 : 1})` }}
                />
              ) : tabbyCat.action === "playing" ? (
                <SpriteAnimation
                  frames={GATO_MALHADO_BRINCANDO}
                  interval={300}
                  mode="loop"
                  alt="Gato malhado brincando"
                  style={{ objectPosition: "center bottom", transform: `scaleX(${tabbyCat.isFlipped ? -1 : 1})` }}
                />
              ) : tabbyCat.action === "begging" ? (
                <SpriteAnimation
                  frames={GATO_MALHADO_COMENDO}
                  interval={350}
                  mode="loop"
                  alt="Gato malhado comendo"
                  style={{ objectPosition: "center bottom", transform: `scaleX(${tabbyCat.isFlipped ? -1 : 1})` }}
                />
              ) : tabbyCat.action === "grooming" ? (
                <SpriteAnimation
                  frames={GATO_MALHADO_GROOMING}
                  interval={300}
                  mode="loop"
                  alt="Gato malhado se limpando"
                  style={{ objectPosition: "center bottom", transform: `scaleX(${tabbyCat.isFlipped ? -1 : 1})` }}
                />
              ) : tabbyCat.action === "standing" ? (
                <SpriteAnimation
                  frames={GATO_MALHADO_STANDING}
                  interval={300}
                  mode="loop"
                  alt="Gato malhado em pe"
                  style={{ objectPosition: "center bottom", transform: `scaleX(${tabbyCat.isFlipped ? -1 : 1})` }}
                />
              ) : (
                <SpriteAnimation
                  frames={GATO_MALHADO_IDLE}
                  interval={300}
                  mode="loop"
                  alt="Gato malhado"
                  style={{ objectPosition: "center bottom", transform: `scaleX(${tabbyCat.isFlipped ? -1 : 1})` }}
                />
              )}
            </motion.div>

            {/* ============================================================== */}
            {/* CORE INTERACTION VIEW: SLEEPING VS TYPING                      */}
            {/* ============================================================== */}
            {status === "sleeping" ? (
              /* GAROTA DORMINDO NA MESA — sprite Gemini (teste) */
              <div
                className="absolute z-[8]"
                style={{
                  left: "50%",
                  bottom: "2px",
                  transform: "translateX(-50%)",
                  height: "54%",
                  aspectRatio: "1 / 1",
                }}
              >
                <SpriteAnimation frames={garotaSono} interval={360} mode="loopLast3" alt="Garota dormindo na mesa" />
              </div>
            ) : (
              /* TYPING GIRL, CHAIR, AND TABLE */
              <>
            {/* The Chix Girl (Increased Size 25% x 55% & Detailed SVG) */}
            <motion.div
              className="absolute left-[35%] bottom-[5%] w-[25%] h-[55%] z-10"
              animate={getChixAnimation()}
              transition={
                status.startsWith("walking")
                  ? { duration: 1.8, ease: "easeInOut" }
                  : { repeat: Infinity, duration: 2.0, ease: "easeInOut" }
              }
              style={{
                transformOrigin: "bottom center",
              }}
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
              </>
            )}

          </div>
        )}
      </div>

      {/* 3. VISIBLE RETRO BUTTONS */}
      <div 
        className="absolute w-full flex justify-around px-8 z-30"
        style={{
          bottom: "4%",
          height: "11%"
        }}
      >
        {/* Button 1: Bed/Sleep */}
        <button 
          onClick={handleSleepToggle}
          className="flex flex-col items-center justify-center bg-pink-100 hover:bg-pink-200 border-2 border-pink-400 active:scale-95 text-slate-800 rounded-lg font-mono text-[9px] font-bold w-[20%] py-1 shadow-md transition-all duration-150"
          title="Dormir / Wakeup"
        >
          <span className="text-base leading-none mb-0.5">💤</span>
          <span>DORMIR</span>
        </button>

        {/* Button 2: Food bowl */}
        <button 
          onClick={handleFeed}
          className="flex flex-col items-center justify-center bg-yellow-100 hover:bg-yellow-200 border-2 border-yellow-400 active:scale-95 text-slate-800 rounded-lg font-mono text-[9px] font-bold w-[20%] py-1 shadow-md transition-all duration-150"
          title="Alimentar / Feed"
        >
          <span className="text-base leading-none mb-0.5">🧁</span>
          <span>COMER</span>
        </button>

        {/* Button 3: Clothes hanger */}
        <button 
          onClick={handleCloset}
          className="flex flex-col items-center justify-center bg-purple-100 hover:bg-purple-200 border-2 border-purple-400 active:scale-95 text-slate-800 rounded-lg font-mono text-[9px] font-bold w-[20%] py-1 shadow-md transition-all duration-150"
          title="Closet / Change Outfit"
        >
          <span className="text-base leading-none mb-0.5">👗</span>
          <span>ROUPA</span>
        </button>

        {/* Button 4: Outdoors/Door */}
        <button 
          onClick={handleOutdoors}
          className="flex flex-col items-center justify-center bg-green-100 hover:bg-green-200 border-2 border-green-400 active:scale-95 text-slate-800 rounded-lg font-mono text-[9px] font-bold w-[20%] py-1 shadow-md transition-all duration-150"
          title="Outdoors / Walk"
        >
          <span className="text-base leading-none mb-0.5">🏃‍♀️</span>
          <span>SAIR</span>
        </button>
      </div>
    </div>
  );
}
