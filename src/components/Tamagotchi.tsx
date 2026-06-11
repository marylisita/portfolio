"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
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

  const spawnParticle = (emoji: string) => {
    const id = Date.now() + Math.random();
    // Bounds restricted to fits the LCD overlay screen
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
      return;
    }
    if (status.startsWith("walking") || status === "stats") return;
    
    spawnParticle("❤️");
    setHappiness((prev) => Math.min(100, prev + 10));
    setStarActive(true);
    setTimeout(() => setStarActive(false), 500);
  };

  // Determine Chix movement animations
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
        maxWidth: "420px",
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
          backgroundColor: "#8be4eb", // soft retro LCD cyan/blue
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
              className="absolute text-xs z-30 pointer-events-none"
              initial={{ opacity: 1, scale: 0.5, x: p.x, y: p.y }}
              animate={{ opacity: 0, scale: 1.4, y: p.y - 30, x: p.x + (Math.random() - 0.5) * 10 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              {p.emoji}
            </motion.span>
          ))}
        </AnimatePresence>

        {/* LCD Header HUD */}
        <div className="absolute top-0 inset-x-0 h-3 border-b border-slate-900/10 flex justify-between items-center px-1 text-[5px] font-bold text-slate-600/80 font-mono z-20">
          <span>🌸 PIXEL_CHIX</span>
          <span>HUD: HOUSE</span>
          <span>🔋 99%</span>
        </div>

        {/* room graphics */}
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
            
            {/* Room Background SVG (exact copy of mockup background) */}
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
                className="absolute left-[54%] bottom-[12%] text-[10px] z-20"
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
            {/* GATINHA 1: PRETINHA MAGRINHA (Left side)                       */}
            {/* ============================================================== */}
            <div className="absolute left-[18%] bottom-[2px] w-[12%] h-[20%] z-10">
              <svg viewBox="0 0 10 10" width="100%" height="100%" style={{ imageRendering: "pixelated" }}>
                {/* Body */}
                <rect x="2" y="4" width="5" height="5" fill="#202025" />
                {/* Head */}
                <rect x="4" y="1" width="4" height="4" fill="#202025" />
                {/* Ears */}
                <rect x="4" y="0" width="1" height="1" fill="#202025" />
                <rect x="7" y="0" width="1" height="1" fill="#202025" />
                {/* Green Eyes */}
                {status === "sleeping" ? (
                  <path d="M 5 2 H 6 V 3 H 5 Z M 7 2 H 8 V 3 H 7 Z" fill="#111" />
                ) : (
                  <>
                    <rect x="5" y="2" width="1" height="1" fill="#4ade80" />
                    <rect x="7" y="2" width="1" height="1" fill="#4ade80" />
                  </>
                )}
                {/* Tail */}
                <motion.rect 
                  x="0" y="4" width="2" height="1" 
                  fill="#202025" 
                  animate={status === "sleeping" ? {} : { rotate: [0, 15, -15, 0], originY: 0.5 }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
                {/* Feet */}
                <rect x="3" y="9" width="1" height="1" fill="#202025" />
                <rect x="6" y="9" width="1" height="1" fill="#202025" />
              </svg>
            </div>

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
              className="absolute left-[64%] bottom-[30%] w-[10%] h-[15%] z-15"
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
            {/* GATINHA 2: TIGRADA GORDINHA (Right side)                       */}
            {/* ============================================================== */}
            <div className="absolute left-[76%] bottom-[2px] w-[14%] h-[22%] z-10">
              <svg viewBox="0 0 12 10" width="100%" height="100%" style={{ imageRendering: "pixelated" }}>
                {/* Chubby body: Grey base */}
                <rect x="2" y="3" width="7" height="5" fill="#8f8f96" />
                {/* White belly & chest */}
                <rect x="3" y="5" width="4" height="3" fill="#ffffff" />
                {/* Stripes */}
                <rect x="2" y="4" width="2" height="1" fill="#604835" />
                <rect x="6" y="3" width="2" height="1" fill="#604835" />
                <rect x="7" y="5" width="2" height="1" fill="#604835" />
                {/* Head */}
                <rect x="1" y="0" width="5" height="4" fill="#8f8f96" />
                {/* Ears */}
                <rect x="1" y="0" width="1" height="1" fill="#604835" />
                <rect x="4" y="0" width="1" height="1" fill="#604835" />
                {/* Eyes (Yellow) */}
                {status === "sleeping" ? (
                  <path d="M 2 2 H 3 V 3 H 2 Z M 4 2 H 5 V 3 H 4 Z" fill="#111" />
                ) : (
                  <>
                    <rect x="2" y="2" width="1" height="1" fill="#fbbf24" />
                    <rect x="4" y="2" width="1" height="1" fill="#fbbf24" />
                  </>
                )}
                {/* Legs */}
                <rect x="3" y="8" width="1.5" height="2" fill="#8f8f96" />
                <rect x="7" y="8" width="1.5" height="2" fill="#8f8f96" />
                {/* Tail */}
                <motion.path 
                  d="M 9 4 H 10 V 7 H 9 Z" 
                  fill="#604835"
                  animate={status === "sleeping" ? {} : { rotate: [0, -12, 12, 0], originX: 0 }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                />
              </svg>
            </div>

            {/* ============================================================== */}
            {/* CORE INTERACTION VIEW: SLEEPING VS TYPING                      */}
            {/* ============================================================== */}
            {status === "sleeping" ? (
              /* BED AND SLEEPING GIRL */
              <div className="absolute left-[36%] bottom-[2px] w-[28%] h-[24%] z-15">
                <svg viewBox="0 0 28 20" width="100%" height="100%" style={{ imageRendering: "pixelated" }}>
                  {/* Bed Base */}
                  <rect x="1" y="6" width="26" height="14" fill="#aab0f7" stroke="#1a1a27" strokeWidth="1" />
                  {/* Bed Posts */}
                  <rect x="0" y="2" width="2" height="18" fill="#a06040" stroke="#1a1a27" strokeWidth="0.8" />
                  <rect x="26" y="2" width="2" height="18" fill="#a06040" stroke="#1a1a27" strokeWidth="0.8" />
                  {/* Pillow */}
                  <rect x="3" y="8" width="6" height="4" fill="#fff" stroke="#1a1a27" strokeWidth="0.8" />
                  {/* Sleeping Girl Head */}
                  <rect x="4" y="10" width="4" height="4" fill="#ffebd2" />
                  <rect x="3" y="9" width="5" height="2" fill="#6f4e37" />
                  {/* Eyes closed */}
                  <rect x="5" y="11" width="2" height="1" fill="#1a1a27" />
                  {/* Blanket */}
                  <rect x="8" y="8" width="18" height="12" fill="#ff9ad5" stroke="#1a1a27" strokeWidth="0.8" />
                </svg>
              </div>
            ) : (
              /* TYPING GIRL, CHAIR, AND TABLE */
              <>
                {/* Chair */}
                <div className="absolute left-[40%] bottom-[2px] w-[10%] h-[20%] z-5">
                  <svg viewBox="0 0 10 12" width="100%" height="100%" style={{ imageRendering: "pixelated" }}>
                    <rect x="1" y="4" width="8" height="2" fill="#8d5c3d" stroke="#1a1a27" strokeWidth="1" />
                    <rect x="2" y="6" width="1.5" height="6" fill="#8d5c3d" stroke="#1a1a27" strokeWidth="0.8" />
                    <rect x="6.5" y="6" width="1.5" height="6" fill="#8d5c3d" stroke="#1a1a27" strokeWidth="0.8" />
                  </svg>
                </div>

                {/* The Chix Girl */}
                <motion.div
                  className="absolute left-[38%] bottom-[6%] w-[18%] h-[42%] z-10"
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
                    {/* Hair Back */}
                    <rect x="3" y="4" width="10" height="12" fill="#543c2c" />
                    {/* Face */}
                    <rect x="4" y="3" width="8" height="7" fill="#ffe2c4" />
                    {/* Hair Front/Bangs */}
                    <rect x="3" y="2" width="10" height="3" fill="#6f4e37" />
                    <rect x="3" y="5" width="2" height="4" fill="#6f4e37" />
                    <rect x="11" y="5" width="2" height="4" fill="#6f4e37" />
                    {/* Eyes */}
                    {blinking ? (
                      <path d="M 5 7 H 7 V 8 H 5 Z M 9 7 H 11 V 8 H 9 Z" fill="#1a1a27" />
                    ) : (
                      <>
                        <rect x="5" y="6" width="2" height="2" fill="#1a1a27" />
                        <rect x="9" y="6" width="2" height="2" fill="#1a1a27" />
                        <rect x="5" y="6" width="1" height="1" fill="#ffffff" />
                        <rect x="9" y="6" width="1" height="1" fill="#ffffff" />
                      </>
                    )}
                    {/* Mouth */}
                    <rect x="7" y="8" width="2" height="1" fill="#1a1a27" />
                    
                    {/* Outfits selection */}
                    {outfitIndex === 0 && <rect x="4" y="10" width="8" height="10" fill="#885cf6" />} {/* Purple Casual */}
                    {outfitIndex === 1 && (
                      <>
                        <rect x="4" y="10" width="8" height="10" fill="#ff7da7" /> {/* Pink Bunny */}
                        {/* Bunny ears */}
                        <rect x="3" y="0" width="2" height="3" fill="#ffffff" />
                        <rect x="11" y="0" width="2" height="3" fill="#ffffff" />
                        <rect x="4" y="1" width="1" height="2" fill="#ff9ad5" />
                        <rect x="12" y="1" width="1" height="2" fill="#ff9ad5" />
                      </>
                    )}
                    {outfitIndex === 2 && (
                      <>
                        <rect x="4" y="10" width="8" height="10" fill="#39ff14" /> {/* Green Cyber Star */}
                        {/* Glasses */}
                        <rect x="4" y="5" width="8" height="2" fill="#1a1a27" />
                        <rect x="5" y="6" width="6" height="1" fill="#00e5ff" />
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

                {/* Desk/Table */}
                <div className="absolute left-[44%] bottom-[2px] w-[22%] h-[24%] z-15">
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

      {/* 3. INVISIBLE BUTTON HITBOXES (Placed exactly over the 4 physical buttons in the mockup image) */}
      
      {/* Button 1: Bed/Sleep (teal circular base, Leftmost) */}
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

      {/* Button 2: Food bowl (teal circular base, Center-left) */}
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

      {/* Button 3: Clothes hanger (teal circular base, Center-right) */}
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

      {/* Button 4: Outdoors/Door (red circular base, Rightmost) */}
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
