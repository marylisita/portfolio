"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpriteAnimation from "./SpriteAnimation";

const GAROTA_SONO = Array.from({ length: 8 }, (_, i) => `/img/sprites/garota-sono/frame_${i + 1}.png`);
const GATO_PRETO_SONO = Array.from({ length: 8 }, (_, i) => `/img/sprites/gato-preto-sono/frame_${i + 1}.png`);
const GATO_MALHADO_SONO = Array.from({ length: 8 }, (_, i) => `/img/sprites/gato-malhado-sono/frame_${i + 1}.png`);

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
        maxWidth: "540px", // Increased overall cabinet size for desktop view
        aspectRatio: "1024 / 819"
      }}
    >
      {/* 1. MOCKUP HOUSING IMAGE */}
      <img 
        src="/img/pixel_chix_bg.png" 
        alt="Pixel Chix Cabinet" 
        className="w-full h-full object-contain pointer-events-none z-10"
        style={{ imageRendering: "pixelated" }}
      />

      {/* 2. DYNAMIC LCD SCREEN OVERLAY */}
      <div 
        className="absolute overflow-hidden text-slate-800 z-20 cursor-pointer rounded-[2px]"
        style={{
          left: "34.38%",
          top: "42.12%",
          width: "35.25%",
          height: "22.83%",
          backgroundColor: "#8be4eb",
        }}
        onClick={handlePet}
      >
        {/* LCD Overlay Grid Texture */}
        <div className="absolute inset-0 pointer-events-none z-30" style={{
          backgroundImage: "radial-gradient(rgba(26,22,38,0.12) 1.2px, transparent 1.2px)",
          backgroundSize: "4px 4px",
          opacity: 0.85
        }} />

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
          <div className="w-full h-full flex flex-col justify-center px-2 pt-2 text-[6.5px] leading-[1.25] text-slate-700 font-mono z-10">
            <div className="font-bold border-b border-slate-900/10 pb-0.5 mb-1 flex justify-between uppercase">
              <span>CHIX STATS</span>
              <span className="text-pink-500">HAPPY</span>
            </div>
            <div className="flex justify-between">
              <span>COMIDA:</span>
              <span>{hunger < 40 ? "FRIDGE OK" : "NEED 🧁"}</span>
            </div>
            <div className="w-full bg-slate-300 h-0.5 rounded overflow-hidden mb-1 border border-slate-900/10">
              <div className="bg-[#b6f23e] h-full" style={{ width: `${100 - hunger}%` }}></div>
            </div>
            <div className="flex justify-between">
              <span>GATINHAS:</span>
              <span>2 IN_ROOM</span>
            </div>
            <div className="flex justify-between mt-1 pt-0.5 border-t border-slate-900/5 text-slate-500 uppercase text-[4.5px]">
              <span>TCC STATUS: DATA GLITCHED</span>
            </div>
          </div>
        ) : (
          /* ROOM ANIMATION VIEW */
          <div className="relative w-full h-full flex items-end justify-center">
            
            {/* Room Background SVG */}
            <svg viewBox="0 0 180 95" className="absolute inset-0 w-full h-full z-0 pointer-events-none">
              {/* Floor line */}
              <rect x="0" y="80" width="180" height="15" fill="#58ccd4" />
              <line x1="0" y1="80" x2="180" y2="80" stroke="#1a1a27" strokeWidth="1.2" />

              {/* Drawer (left) */}
              <rect x="4" y="45" width="22" height="35" fill="#ca8464" stroke="#1a1a27" strokeWidth="1.2" />
              <line x1="4" y1="56" x2="26" y2="56" stroke="#1a1a27" strokeWidth="1.2" />
              <line x1="4" y1="67" x2="26" y2="67" stroke="#1a1a27" strokeWidth="1.2" />
              {/* Drawer knobs */}
              <rect x="13" y="50" width="3" height="2" fill="#1a1a27" />
              <rect x="13" y="60" width="3" height="2" fill="#1a1a27" />
              <rect x="13" y="71" width="3" height="2" fill="#1a1a27" />

              {/* Shelf (left top) */}
              <line x1="30" y1="38" x2="60" y2="38" stroke="#1a1a27" strokeWidth="1.5" />
              <rect x="38" y="28" width="10" height="10" fill="#f8b0d0" stroke="#1a1a27" strokeWidth="1.2" />

              {/* Arched Window with Moon (center top) */}
              <path d="M 76 38 A 14 14 0 0 1 104 38 Z" fill="#182354" stroke="#1a1a27" strokeWidth="1.2" />
              <rect x="76" y="37" width="28" height="5" fill="#182354" />
              <path d="M 76 38 H 104" stroke="#1a1a27" strokeWidth="1.2" />
              {/* Moon */}
              <path d="M 86 18 A 6 6 0 1 0 94 26 A 4 4 0 1 1 86 18" fill="#ffe57d" />
              
              {/* TV (right wall) */}
              <rect x="120" y="22" width="24" height="20" fill="#a48beb" stroke="#1a1a27" strokeWidth="1.2" />
              <rect x="123" y="25" width="18" height="14" fill="#c3b8f0" />
              <rect x="125" y="27" width="14" height="10" fill="#8870c2" />
              
              {/* Door (right) */}
              <rect x="152" y="20" width="24" height="60" fill="#a48beb" stroke="#1a1a27" strokeWidth="1.2" />
              <line x1="156" y1="20" x2="156" y2="80" stroke="#1a1a27" strokeWidth="1" />
              <circle cx="159" cy="50" r="2" fill="#1a1a27" />
            </svg>

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
              className="absolute bottom-[2px] w-[16%] h-[28%] z-15 cursor-pointer"
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
                  interval={320}
                  mode="pingpong"
                  alt="Gato preto dormindo"
                  style={{ objectPosition: "center bottom", transform: `scaleX(${blackCat.isFlipped ? -1 : 1})` }}
                />
              ) : (
              <svg
                viewBox="0 0 10 10"
                width="100%"
                height="100%"
                style={{
                  imageRendering: "pixelated",
                  transform: `scaleX(${blackCat.isFlipped ? -1 : 1})`
                }}
              >
                {/* Outlined and detailed SVG for black cat */}
                {blackCat.action === "grooming" ? (
                  /* GROOMING FRAME: Licking paw */
                  <>
                    {/* Outlines */}
                    <rect x="1" y="3" width="7" height="7" fill="#121215" />
                    <rect x="2" y="1" width="6" height="5" fill="#121215" />
                    {/* Inner Body */}
                    <rect x="2" y="4" width="5" height="5" fill="#282830" />
                    <rect x="3" y="2" width="4" height="4" fill="#282830" />
                    {/* Ears inner pink */}
                    <rect x="4" y="2" width="1" height="1" fill="#ff9ad5" />
                    <rect x="6" y="2" width="1" height="1" fill="#ff9ad5" />
                    {/* Eyes closed */}
                    <rect x="4" y="3.5" width="1" height="0.5" fill="#111" />
                    <rect x="6" y="3.5" width="1" height="0.5" fill="#111" />
                    {/* Licking paw movement */}
                    {tick % 2 === 0 ? (
                      <>
                        <rect x="1.2" y="2.5" width="2" height="2" fill="#282830" />
                        <rect x="3" y="3" width="1.2" height="0.8" fill="#ff9ad5" /> {/* Tongue */}
                      </>
                    ) : (
                      <rect x="1" y="4.5" width="2" height="2" fill="#282830" />
                    )}
                    {/* Tail */}
                    <rect x="0" y="4" width="1" height="2" fill="#121215" />
                    <rect x="3" y="9" width="1" height="1" fill="#282830" />
                    <rect x="6" y="9" width="1" height="1" fill="#282830" />
                  </>
                ) : blackCat.action === "begging" ? (
                  /* BEGGING FRAME: Stand on hind legs looking up */
                  <>
                    {/* Outlines */}
                    <rect x="2" y="2" width="6" height="8" fill="#121215" />
                    <rect x="3" y="-1" width="6" height="5" fill="#121215" />
                    {/* Inner Body */}
                    <rect x="3" y="3" width="4" height="6" fill="#282830" />
                    <rect x="4" y="0" width="4" height="4" fill="#282830" />
                    {/* Ears inner pink */}
                    <rect x="5" y="0" width="1" height="1" fill="#ff9ad5" />
                    <rect x="7" y="0" width="1" height="1" fill="#ff9ad5" />
                    {/* Green Eyes looking up */}
                    <rect x="5" y="1" width="1" height="1" fill="#4ade80" />
                    <rect x="7" y="1" width="1" height="1" fill="#4ade80" />
                    {/* Paws waving */}
                    {tick % 2 === 0 ? (
                      <>
                        <rect x="1" y="2" width="2.2" height="1.2" fill="#282830" />
                        <rect x="1.5" y="1" width="1.2" height="1.2" fill="#282830" />
                      </>
                    ) : (
                      <rect x="1" y="2.5" width="2" height="1.2" fill="#282830" />
                    )}
                    <rect x="3" y="9" width="1.2" height="1" fill="#282830" />
                    <rect x="6" y="9" width="1.2" height="1" fill="#282830" />
                    <rect x="7.5" y="4" width="1" height="3" fill="#282830" />
                  </>
                ) : blackCat.action === "walking" ? (
                  /* WALKING FRAME: Alternating legs */
                  <>
                    {/* Outlines */}
                    <rect x="1" y="3" width="7" height="7" fill="#121215" />
                    <rect x="3" y={tick % 2 === 0 ? 0 : 1} width="6" height="5" fill="#121215" />
                    {/* Inner Body */}
                    <rect x="2" y="4" width="5" height="5" fill="#282830" />
                    <rect x="4" y={tick % 2 === 0 ? 1 : 2} width="4" height="4" fill="#282830" />
                    {/* Ears inner pink */}
                    <rect x="5" y={tick % 2 === 0 ? 1 : 2} width="1" height="1" fill="#ff9ad5" />
                    <rect x="7" y={tick % 2 === 0 ? 1 : 2} width="1" height="1" fill="#ff9ad5" />
                    {/* Green Eyes */}
                    <rect x="5" y={tick % 2 === 0 ? 2 : 3} width="1" height="1" fill="#4ade80" />
                    <rect x="7" y={tick % 2 === 0 ? 2 : 3} width="1" height="1" fill="#4ade80" />
                    {/* Legs */}
                    {tick % 2 === 0 ? (
                      <>
                        <rect x="3" y="8.5" width="1" height="1.2" fill="#282830" />
                        <rect x="6" y="9.2" width="1" height="1" fill="#282830" />
                      </>
                    ) : (
                      <>
                        <rect x="3" y="9.2" width="1" height="1.2" fill="#282830" />
                        <rect x="6" y="8.5" width="1" height="1" fill="#282830" />
                      </>
                    )}
                    <rect x="0" y={tick % 2 === 0 ? 4 : 5} width="2" height="1" fill="#121215" />
                  </>
                ) : (
                  /* DEFAULT SITTING / IDLE */
                  <>
                    {/* Outlines */}
                    <rect x="1" y="3" width="7" height="7" fill="#121215" />
                    <rect x="3" y="0" width="6" height="5" fill="#121215" />
                    {/* Inner Body */}
                    <rect x="2" y="4" width="5" height="5" fill="#282830" />
                    <rect x="4" y="1" width="4" height="4" fill="#282830" />
                    {/* Ears inner pink */}
                    <rect x="5" y="1" width="1" height="1" fill="#ff9ad5" />
                    <rect x="7" y="1" width="1" height="1" fill="#ff9ad5" />
                    {/* Eyes */}
                    {blinking ? (
                      <>
                        <rect x="5" y="2.5" width="1" height="0.5" fill="#111" />
                        <rect x="7" y="2.5" width="1" height="0.5" fill="#111" />
                      </>
                    ) : (
                      <>
                        <rect x="5" y="2" width="1" height="1" fill="#4ade80" />
                        <rect x="7" y="2" width="1" height="1" fill="#4ade80" />
                      </>
                    )}
                    {/* Tail */}
                    <motion.rect 
                      x="0" y="4" width="2" height="1" 
                      fill="#121215" 
                      animate={{ rotate: [0, 15, -15, 0], originY: 0.5 }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                    />
                    <rect x="3" y="9" width="1" height="1" fill="#282830" />
                    <rect x="6" y="9" width="1" height="1" fill="#282830" />
                  </>
                )}
              </svg>
              )}
            </motion.div>

            {/* ============================================================== */}
            {/* BIRD STAND AND YELLOW BIRD                                     */}
            {/* ============================================================== */}
            <div className="absolute left-[66%] bottom-[2px] w-[8%] h-[35%] z-5">
              <svg viewBox="0 0 8 20" width="100%" height="100%" style={{ imageRendering: "pixelated" }}>
                <rect x="3" y="0" width="2" height="20" fill="#58ccd4" stroke="#1a1a27" strokeWidth="1" />
                <rect x="1" y="0" width="6" height="2" fill="#58ccd4" stroke="#1a1a27" strokeWidth="1" />
              </svg>
            </div>
            <motion.div
              className="absolute left-[64%] bottom-[30%] w-[10%] h-[15%] z-10"
              animate={
                status === "sleeping" 
                  ? { y: [0, 0.4, 0] } 
                  : { y: [0, -1, 0] }
              }
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            >
              <svg viewBox="0 0 8 8" width="100%" height="100%" style={{ imageRendering: "pixelated" }}>
                {/* Body */}
                <rect x="2" y="2" width="4" height="4" fill="#facc15" />
                {/* Beak */}
                <rect x="6" y="3" width="1" height="1" fill="#f97316" />
                {/* Eye */}
                <rect x="4" y="3" width="1" height="1" fill="#1a1a27" />
                {/* Tail */}
                <rect x="0" y="3" width="2" height="2" fill="#eab308" />
                {/* Legs */}
                <rect x="3" y="6" width="1" height="2" fill="#f97316" />
                <rect x="5" y="6" width="1" height="2" fill="#f97316" />
              </svg>
            </motion.div>

            {/* ============================================================== */}
            {/* GATINHA 2: TIGRADA GORDINHA (Increased Size 18% x 30% & Detailed SVG) */}
            {/* ============================================================== */}
            <motion.div
              onClick={handleTabbyCatClick}
              className="absolute bottom-[2px] w-[18%] h-[30%] z-15 cursor-pointer"
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
                  interval={320}
                  mode="pingpong"
                  alt="Gato malhado dormindo"
                  style={{ objectPosition: "center bottom", transform: `scaleX(${tabbyCat.isFlipped ? -1 : 1})` }}
                />
              ) : (
              <svg
                viewBox="0 0 12 10"
                width="100%"
                height="100%"
                style={{
                  imageRendering: "pixelated",
                  transform: tabbyCat.action === "playing" ? "none" : `scaleX(${tabbyCat.isFlipped ? -1 : 1})`
                }}
              >
                {/* Outlined and detailed SVG for tabby cat */}
                {tabbyCat.action === "grooming" ? (
                  /* GROOMING FRAME: Licking paw */
                  <>
                    {/* Outline */}
                    <rect x="2" y="2" width="9" height="8" fill="#3a2a1d" />
                    <rect x="1" y="0" width="7" height="6" fill="#3a2a1d" />
                    {/* Inner Body */}
                    <rect x="3" y="3" width="7" height="6" fill="#9f9fa8" />
                    <rect x="4" y="5.5" width="4.5" height="3.5" fill="#ffffff" />
                    <rect x="8" y="4.5" width="1.5" height="1" fill="#6e4f37" />
                    {/* Head */}
                    <rect x="2" y="1" width="5" height="4.2" fill="#9f9fa8" />
                    {/* Ears inner pink */}
                    <rect x="2.2" y="1" width="1" height="1" fill="#ff9ad5" />
                    <rect x="4.8" y="1" width="1" height="1" fill="#ff9ad5" />
                    {/* Eyes closed */}
                    <rect x="3" y="2.5" width="1" height="0.5" fill="#111" />
                    <rect x="5" y="2.5" width="1" height="0.5" fill="#111" />
                    {/* Tongue & Paw licking */}
                    {tick % 2 === 0 ? (
                      <>
                        <rect x="1" y="2.5" width="1.8" height="1.8" fill="#9f9fa8" />
                        <rect x="2.2" y="2.2" width="1" height="0.8" fill="#ff9ad5" />
                      </>
                    ) : (
                      <rect x="1.5" y="4.5" width="1.8" height="1.8" fill="#9f9fa8" />
                    )}
                    <rect x="10" y="5" width="1" height="3" fill="#3a2a1d" />
                  </>
                ) : tabbyCat.action === "playing" ? (
                  /* PLAYING FRAME: Rolling on back */
                  <>
                    {/* Outline */}
                    <rect x="1.5" y="3" width="9" height="7" fill="#3a2a1d" />
                    <rect x="1" y="0.5" width="7" height="5.2" fill="#3a2a1d" />
                    {/* Inner Body */}
                    <rect x="2" y="4" width="7.5" height="5" fill="#9f9fa8" />
                    <rect x="3.5" y="4" width="4.5" height="3" fill="#ffffff" />
                    {/* Stripes */}
                    <rect x="2.5" y="5" width="1.5" height="1" fill="#6e4f37" />
                    <rect x="7" y="6" width="1.5" height="1" fill="#6e4f37" />
                    {/* Head */}
                    <rect x="2" y="1" width="5" height="4.2" fill="#9f9fa8" />
                    {/* Ears inner pink */}
                    <rect x="2.5" y="1" width="1" height="1" fill="#ff9ad5" />
                    <rect x="4.5" y="1" width="1" height="1" fill="#ff9ad5" />
                    {/* Yellow Eyes wide open */}
                    <rect x="3" y="2.5" width="1.2" height="1.2" fill="#fbbf24" />
                    <rect x="5" y="2.5" width="1.2" height="1.2" fill="#fbbf24" />
                    {/* Waving paws */}
                    {tick % 2 === 0 ? (
                      <>
                        <rect x="4.5" y="7" width="1.2" height="2" fill="#ffffff" />
                        <rect x="7.5" y="7" width="1.2" height="2" fill="#ffffff" />
                      </>
                    ) : (
                      <>
                        <rect x="3.5" y="7.5" width="1.2" height="1.5" fill="#ffffff" />
                        <rect x="6.5" y="7.5" width="1.2" height="1.5" fill="#ffffff" />
                      </>
                    )}
                    <rect x="9.5" y={tick % 2 === 0 ? 3 : 5} width="1.2" height="2" fill="#3a2a1d" />
                  </>
                ) : tabbyCat.action === "begging" ? (
                  /* BEGGING FRAME: Sitting looking up */
                  <>
                    {/* Outline */}
                    <rect x="2" y="1.5" width="9" height="8" fill="#3a2a1d" />
                    <rect x="1.5" y="-1.5" width="7.2" height="5" fill="#3a2a1d" />
                    {/* Inner Body */}
                    <rect x="3" y="2.5" width="7" height="6.5" fill="#9f9fa8" />
                    <rect x="4.5" y="4.5" width="4" height="4.5" fill="#ffffff" />
                    {/* Head */}
                    <rect x="2.5" y="-0.5" width="5.2" height="4" fill="#9f9fa8" />
                    {/* Ears inner pink */}
                    <rect x="3" y="-0.5" width="1" height="1" fill="#ff9ad5" />
                    <rect x="6" y="-0.5" width="1" height="1" fill="#ff9ad5" />
                    {/* Yellow eyes looking up */}
                    <rect x="3.5" y="0.8" width="1.2" height="1.2" fill="#fbbf24" />
                    <rect x="5.5" y="0.8" width="1.2" height="1.2" fill="#fbbf24" />
                    {/* Waving Paws */}
                    {tick % 2 === 0 ? (
                      <>
                        <rect x="1" y="2.2" width="2" height="1.2" fill="#9f9fa8" />
                        <rect x="1.5" y="1.2" width="1" height="1.2" fill="#9f9fa8" />
                      </>
                    ) : (
                      <rect x="1.5" y="2.5" width="2.2" height="1.2" fill="#9f9fa8" />
                    )}
                    <rect x="3.5" y="9" width="1.5" height="1" fill="#9f9fa8" />
                    <rect x="7" y="9" width="1.5" height="1" fill="#9f9fa8" />
                    <rect x="10" y="4.5" width="1" height="3" fill="#3a2a1d" />
                  </>
                ) : tabbyCat.action === "walking" ? (
                  /* WALKING FRAME: Alternating legs */
                  <>
                    {/* Outline */}
                    <rect x="1" y="2" width="9.5" height="8" fill="#3a2a1d" />
                    <rect x="0" y={tick % 2 === 0 ? -1 : 0} width="7.2" height="5" fill="#3a2a1d" />
                    {/* Inner Body */}
                    <rect x="2" y="3" width="7.5" height="5.2" fill="#9f9fa8" />
                    <rect x="3" y="5" width="4.5" height="3" fill="#ffffff" />
                    {/* Stripes */}
                    <rect x="2" y="4" width="1.5" height="1" fill="#6e4f37" />
                    <rect x="6" y="3" width="1.5" height="1" fill="#6e4f37" />
                    {/* Head */}
                    <rect x="1" y={tick % 2 === 0 ? 0 : 1} width="5.2" height="4" fill="#9f9fa8" />
                    {/* Ears inner pink */}
                    <rect x="1.5" y={tick % 2 === 0 ? 0 : 1} width="1" height="1" fill="#ff9ad5" />
                    <rect x="4.2" y={tick % 2 === 0 ? 0 : 1} width="1" height="1" fill="#ff9ad5" />
                    {/* Eyes */}
                    <rect x="2.2" y={tick % 2 === 0 ? 1.5 : 2.5} width="1.2" height="1.2" fill="#fbbf24" />
                    <rect x="4.2" y={tick % 2 === 0 ? 1.5 : 2.5} width="1.2" height="1.2" fill="#fbbf24" />
                    {/* Legs */}
                    {tick % 2 === 0 ? (
                      <>
                        <rect x="3" y="8.2" width="1.5" height="1.8" fill="#9f9fa8" />
                        <rect x="7" y="8" width="1.5" height="1" fill="#9f9fa8" />
                      </>
                    ) : (
                      <>
                        <rect x="3" y="8" width="1.5" height="1" fill="#9f9fa8" />
                        <rect x="7" y="8.2" width="1.5" height="1.8" fill="#9f9fa8" />
                      </>
                    )}
                    <rect x="9.5" y={tick % 2 === 0 ? 4 : 5} width="1" height="3" fill="#3a2a1d" />
                  </>
                ) : (
                  /* DEFAULT STANDING / IDLE */
                  <>
                    {/* Outline */}
                    <rect x="1" y="2" width="9" height="8" fill="#3a2a1d" />
                    <rect x="0" y="-1" width="7" height="6" fill="#3a2a1d" />
                    {/* Inner Body */}
                    <rect x="2" y="3" width="7" height="5" fill="#9f9fa8" />
                    <rect x="3" y="5" width="4" height="3" fill="#ffffff" />
                    {/* Stripes */}
                    <rect x="2" y="4" width="2" height="1" fill="#6e4f37" />
                    <rect x="6" y="3" width="2" height="1" fill="#6e4f37" />
                    <rect x="7" y="5" width="2" height="1" fill="#6e4f37" />
                    {/* Head */}
                    <rect x="1" y="0" width="5" height="4" fill="#9f9fa8" />
                    {/* Ears inner pink */}
                    <rect x="1.5" y="0" width="1" height="1" fill="#ff9ad5" />
                    <rect x="4.2" y="0" width="1" height="1" fill="#ff9ad5" />
                    {/* Eyes */}
                    {blinking ? (
                      <>
                        <rect x="2" y="2.5" width="1" height="0.5" fill="#111" />
                        <rect x="4" y="2.5" width="1" height="0.5" fill="#111" />
                      </>
                    ) : (
                      <>
                        <rect x="2" y="2" width="1" height="1" fill="#fbbf24" />
                        <rect x="4" y="2" width="1" height="1" fill="#fbbf24" />
                      </>
                    )}
                    <rect x="3" y="8" width="1.5" height="2" fill="#9f9fa8" />
                    <rect x="7" y="8" width="1.5" height="2" fill="#9f9fa8" />
                    <motion.path 
                      d="M 9 4 H 10 V 7 H 9 Z" 
                      fill="#3a2a1d"
                      animate={{ rotate: [0, -12, 12, 0], originX: 0 }}
                      transition={{ repeat: Infinity, duration: 1.4 }}
                    />
                  </>
                )}
              </svg>
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
                  aspectRatio: "204 / 251",
                }}
              >
                <SpriteAnimation frames={GAROTA_SONO} interval={260} mode="pingpong" alt="Garota dormindo na mesa" />
              </div>
            ) : (
              /* TYPING GIRL, CHAIR, AND TABLE */
              <>
                {/* Chair (Increased Size 14% x 28%) */}
                <div className="absolute left-[38%] bottom-[2px] w-[14%] h-[28%] z-5">
                  <svg viewBox="0 0 10 12" width="100%" height="100%" style={{ imageRendering: "pixelated" }}>
                    <rect x="1" y="4" width="8" height="2" fill="#8d5c3d" stroke="#1a1a27" strokeWidth="1" />
                    <rect x="2" y="6" width="1.5" height="6" fill="#8d5c3d" stroke="#1a1a27" strokeWidth="0.8" />
                    <rect x="6.5" y="6" width="1.5" height="6" fill="#8d5c3d" stroke="#1a1a27" strokeWidth="0.8" />
                  </svg>
                </div>

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
                  <motion.svg 
                    viewBox="0 0 16 20" 
                    width="100%" 
                    height="100%" 
                    style={{ imageRendering: "pixelated" }}
                    animate={isSpinning ? { rotateY: [0, 360, 720] } : {}}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    {/* Hair Back Outline */}
                    <rect x="2" y="3" width="12" height="14" fill="#2a1b12" />
                    {/* Hair Back Inner */}
                    <rect x="3" y="4" width="10" height="12" fill="#543c2c" />
                    
                    {/* Face Outline & Skin */}
                    <rect x="4" y="2" width="8" height="9" fill="#2a1b12" />
                    <rect x="5" y="3" width="6" height="7" fill="#ffe2c4" />
                    
                    {/* Bangs/Hair Front */}
                    <rect x="4" y="2" width="8" height="2" fill="#6f4e37" />
                    <rect x="3" y="4" width="2" height="5" fill="#6f4e37" />
                    <rect x="11" y="4" width="2" height="5" fill="#6f4e37" />
                    {/* Hair Highlights */}
                    <rect x="6" y="2" width="4" height="1" fill="#9d755c" />
                    
                    {/* Eyes */}
                    {blinking ? (
                      <path d="M 5 6 H 7 V 7 H 5 Z M 9 6 H 11 V 7 H 9 Z" fill="#2a1b12" />
                    ) : (
                      <>
                        <rect x="5" y="5" width="2" height="2" fill="#2a1b12" />
                        <rect x="9" y="5" width="2" height="2" fill="#2a1b12" />
                        <rect x="5" y="5" width="1" height="1" fill="#ffffff" />
                        <rect x="9" y="5" width="1" height="1" fill="#ffffff" />
                      </>
                    )}
                    
                    {/* Pink blush cheeks */}
                    <rect x="4" y="7" width="1.2" height="1" fill="#ff8ca3" />
                    <rect x="10.8" y="7" width="1.2" height="1" fill="#ff8ca3" />
                    
                    {/* Mouth */}
                    <rect x="7" y="8" width="2" height="1" fill="#2a1b12" />
                    
                    {/* Outfits selection */}
                    {outfitIndex === 0 && (
                      <>
                        {/* Purple Casual Shirt */}
                        <rect x="4" y="10" width="8" height="10" fill="#885cf6" />
                        {/* White Collar details */}
                        <rect x="6" y="10" width="4" height="1" fill="#ffffff" />
                        {/* Belt details */}
                        <rect x="4" y="15" width="8" height="1" fill="#1a1a27" />
                        <rect x="7" y="15" width="2" height="1" fill="#fbbf24" />
                      </>
                    )}
                    {outfitIndex === 1 && (
                      <>
                        {/* Pink Bunny Shirt */}
                        <rect x="4" y="10" width="8" height="10" fill="#ff7da7" />
                        <rect x="6" y="10" width="4" height="1.5" fill="#ffffff" />
                        {/* Bunny ears outlines & inner */}
                        <rect x="2" y="-1" width="4" height="4" fill="#2a1b12" />
                        <rect x="10" y="-1" width="4" height="4" fill="#2a1b12" />
                        <rect x="3" y="0" width="2" height="3" fill="#ffffff" />
                        <rect x="11" y="0" width="2" height="3" fill="#ffffff" />
                        <rect x="4" y="1" width="1" height="2" fill="#ff9ad5" />
                        <rect x="12" y="1" width="1" height="2" fill="#ff9ad5" />
                      </>
                    )}
                    {outfitIndex === 2 && (
                      <>
                        {/* Green Cyber Star Shirt */}
                        <rect x="4" y="10" width="8" height="10" fill="#39ff14" />
                        {/* Black details */}
                        <rect x="6" y="11" width="4" height="4" fill="#1a1a27" />
                        {/* Cyber glasses */}
                        <rect x="3" y="4" width="10" height="3" fill="#2a1b12" />
                        <rect x="4" y="5" width="8" height="1" fill="#00e5ff" />
                      </>
                    )}
                    
                    {/* Arms (Typing action) */}
                    {status === "idle" ? (
                      <motion.path 
                        d="M 2 11 H 4 V 13 H 2 Z M 12 11 H 14 V 13 H 12 Z" 
                        fill="#ffe2c4"
                        animate={{ y: [0, -1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
                      />
                    ) : (
                      <path d="M 3 11 H 5 V 13 H 3 Z M 11 11 H 13 V 13 H 11 Z" fill="#ffe2c4" />
                    )}
                  </motion.svg>
                </motion.div>

                {/* Desk/Table (Increased Size 30% x 32%) */}
                <div className="absolute left-[41%] bottom-[2px] w-[30%] h-[32%] z-5">
                  <svg viewBox="0 0 24 20" width="100%" height="100%" style={{ imageRendering: "pixelated" }}>
                    {/* Tabletop */}
                    <rect x="1" y="5" width="22" height="3" fill="#a06040" stroke="#1a1a27" strokeWidth="1.2" />
                    {/* Legs */}
                    <rect x="3" y="8" width="2" height="12" fill="#a06040" stroke="#1a1a27" strokeWidth="1" />
                    <rect x="19" y="8" width="2" height="12" fill="#a06040" stroke="#1a1a27" strokeWidth="1" />
                    {/* Laptop on desk */}
                    <path d="M 7 1 H 17 V 5 H 7 Z" fill="#c3b8f0" stroke="#1a1a27" strokeWidth="1" />
                    <rect x="9" y="2" width="6" height="2" fill="#eef" />
                  </svg>
                </div>
              </>
            )}

          </div>
        )}
      </div>

      {/* 3. INVISIBLE BUTTON HITBOXES */}
      
      {/* Button 1: Bed/Sleep */}
      <button 
        onClick={handleSleepToggle}
        className="absolute cursor-pointer rounded-full bg-transparent border-0 opacity-0 active:scale-95 transition-transform"
        style={{
          left: "33.16%",
          top: "71.18%",
          width: "5.08%",
          height: "6.35%",
          zIndex: 30
        }}
        title="Dormir / Wakeup"
      />

      {/* Button 2: Food bowl */}
      <button 
        onClick={handleFeed}
        className="absolute cursor-pointer rounded-full bg-transparent border-0 opacity-0 active:scale-95 transition-transform"
        style={{
          left: "43.36%",
          top: "71.18%",
          width: "5.08%",
          height: "6.35%",
          zIndex: 30
        }}
        title="Alimentar / Feed"
      />

      {/* Button 3: Clothes hanger */}
      <button 
        onClick={handleCloset}
        className="absolute cursor-pointer rounded-full bg-transparent border-0 opacity-0 active:scale-95 transition-transform"
        style={{
          left: "54.89%",
          top: "71.18%",
          width: "5.08%",
          height: "6.35%",
          zIndex: 30
        }}
        title="Closet / Change Outfit"
      />

      {/* Button 4: Outdoors/Door */}
      <button 
        onClick={handleOutdoors}
        className="absolute cursor-pointer rounded-full bg-transparent border-0 opacity-0 active:scale-95 transition-transform"
        style={{
          left: "65.96%",
          top: "71.18%",
          width: "5.08%",
          height: "6.35%",
          zIndex: 30
        }}
        title="Outdoors / Walk"
      />
    </div>
  );
}
