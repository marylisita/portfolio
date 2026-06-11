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
  const [status, setStatus] = useState<"sleeping" | "idle" | "eating" | "playing" | "stats">("sleeping");
  const [particles, setParticles] = useState<Particle[]>([]);
  const [hunger, setHunger] = useState(30);
  const [happiness, setHappiness] = useState(50);
  const [toyActive, setToyActive] = useState(false);
  const [fishActive, setFishActive] = useState(false);

  // Auto-sleep if mouse leaves for too long
  useEffect(() => {
    if (status !== "sleeping" && status !== "stats") {
      const timer = setTimeout(() => {
        setStatus("sleeping");
      }, 10000); // 10 seconds of inactivity puts it back to sleep
      return () => clearTimeout(timer);
    }
  }, [status]);

  const spawnParticle = (emoji: string) => {
    const id = Date.now() + Math.random();
    // Random position within the LCD screen bounds
    const x = 30 + Math.random() * 80;
    const y = 40 + Math.random() * 30;
    setParticles((prev) => [...prev, { id, x, y, emoji }]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 1000);
  };

  const handleFeed = () => {
    if (status === "stats") return;
    setStatus("eating");
    setFishActive(true);
    setHunger((prev) => Math.max(0, prev - 15));
    setHappiness((prev) => Math.min(100, prev + 5));
    
    // Animate fish eating
    setTimeout(() => {
      spawnParticle("🐟");
      spawnParticle("✨");
      setStatus("idle");
      setFishActive(false);
    }, 1500);
  };

  const handlePlay = () => {
    if (status === "stats") return;
    setStatus("playing");
    setToyActive(true);
    setHappiness((prev) => Math.min(100, prev + 20));
    setHunger((prev) => Math.min(100, prev + 10));

    setTimeout(() => {
      spawnParticle("⭐️");
      spawnParticle("💖");
      setStatus("idle");
      setToyActive(false);
    }, 2000);
  };

  const handleToggleStats = () => {
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
    if (status === "stats") return;
    spawnParticle("❤️");
    setHappiness((prev) => Math.min(100, prev + 10));
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-center"
      style={{ width: "260px", height: "320px", fontFamily: "var(--font-mono)" }}
      onMouseEnter={() => {
        if (status === "sleeping") setStatus("idle");
      }}
    >
      {/* Top Chain links (Keychain effect) */}
      <div className="absolute -top-3 w-8 h-8 border-4 border-[#111] bg-slate-300 rounded-full z-0"></div>
      
      {/* Device Body Shell */}
      <div 
        className="w-[230px] h-[290px] border-4 border-[#111] rounded-[50%_50%_43%_43%/48%_48%_52%_52%] shadow-[-6px_6px_0px_rgba(0,0,0,0.1)] relative flex flex-col items-center justify-between p-4 select-none z-10"
        style={{
          background: "linear-gradient(135deg, #ffd3ec 0%, #dcd3ff 50%, #ffd3ec 100%)",
        }}
      >
        {/* Gloss highlight overlay */}
        <div className="absolute top-2 left-8 w-[130px] h-[45px] bg-white/25 rounded-full blur-[2px] transform -rotate-12 pointer-events-none"></div>

        {/* Screen Frame */}
        <div 
          className="w-[180px] h-[136px] bg-[#111] rounded-xl p-2.5 flex flex-col justify-between shadow-inner mt-4 relative cursor-pointer"
          onClick={handlePet}
        >
          {/* LCD Screen Display */}
          <div 
            className="w-full h-full rounded border-2 border-[#111] flex flex-col relative overflow-hidden text-slate-800"
            style={{
              backgroundColor: "#ece8fc",
              backgroundImage: "radial-gradient(rgba(139, 147, 248, 0.15) 1.5px, transparent 1.5px)",
              backgroundSize: "6px 6px"
            }}
          >
            {/* Screen Header HUD */}
            <div className="h-4 border-b border-slate-900/10 flex justify-between items-center px-1 text-[7px] font-bold text-slate-500">
              <div className="flex items-center gap-0.5">
                <span>🔋 99%</span>
              </div>
              <span className="tracking-wide">VIRTUAL_MARY.EXE</span>
              <span>❤️</span>
            </div>

            {/* Inner LCD State Content */}
            <div className="flex-1 flex flex-col items-center justify-center relative p-1">
              
              {/* Floating interactive particles */}
              <AnimatePresence>
                {particles.map((p) => (
                  <motion.span
                    key={p.id}
                    className="absolute text-sm z-30 pointer-events-none"
                    initial={{ opacity: 1, scale: 0.5, x: p.x - 70, y: p.y - 40 }}
                    animate={{ opacity: 0, scale: 1.5, y: p.y - 90, x: p.x - 70 + (Math.random() - 0.5) * 30 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    {p.emoji}
                  </motion.span>
                ))}
              </AnimatePresence>

              {/* STATS SCREEN */}
              {status === "stats" ? (
                <div className="w-full h-full flex flex-col justify-center px-2 py-1 text-[8px] leading-[1.3] text-slate-700">
                  <div className="font-bold border-b border-slate-900/10 pb-0.5 mb-1 flex justify-between">
                    <span>STATUS REPORT</span>
                    <span className="text-pink-500">ONLINE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FOME:</span>
                    <span>{hunger}% {hunger > 60 ? "🍗!" : "OK"}</span>
                  </div>
                  <div className="w-full bg-slate-300 h-1 rounded overflow-hidden mb-1 border border-slate-900/20">
                    <div className="bg-[#b6f23e] h-full" style={{ width: `${100 - hunger}%` }}></div>
                  </div>
                  <div className="flex justify-between">
                    <span>AFETO:</span>
                    <span>{happiness}% {happiness > 75 ? "🥰" : "MIMAR"}</span>
                  </div>
                  <div className="w-full bg-slate-300 h-1 rounded overflow-hidden border border-slate-900/20">
                    <div className="bg-[#ff9ad5] h-full" style={{ width: `${happiness}%` }}></div>
                  </div>
                  <div className="mt-1.5 text-[7px] text-slate-500 text-center uppercase tracking-wider">
                    Termos de fofura aceitos ✓
                  </div>
                </div>
              ) : (
                /* PET VIEW */
                <div className="flex flex-col items-center justify-center relative w-full h-full">
                  
                  {/* Fish toy animation */}
                  {fishActive && (
                    <motion.div 
                      className="absolute left-2 text-xs z-20"
                      animate={{ x: [0, 45, 60], y: [0, -10, 10], opacity: [1, 1, 0] }}
                      transition={{ duration: 1.4, ease: "easeInOut" }}
                    >
                      🐟
                    </motion.div>
                  )}

                  {/* Toy star animation */}
                  {toyActive && (
                    <motion.div 
                      className="absolute text-xs z-20"
                      animate={{ 
                        x: [60, -20, 40, -40, 0], 
                        y: [-20, 20, -10, 15, 0],
                        rotate: 360,
                        scale: [1, 1.2, 0.8, 1.1, 0]
                      }}
                      transition={{ duration: 1.8, ease: "easeInOut" }}
                    >
                      ⭐️
                    </motion.div>
                  )}

                  {/* SLEEP BUBBLES */}
                  {status === "sleeping" && (
                    <div className="absolute right-6 top-2 text-[9px] font-bold text-slate-500 flex flex-col items-center">
                      <motion.span
                        animate={{ y: [0, -10], x: [0, 5], opacity: [0, 1, 0], scale: [0.6, 1.2] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0 }}
                      >z</motion.span>
                      <motion.span
                        animate={{ y: [0, -12], x: [0, -5], opacity: [0, 1, 0], scale: [0.6, 1.2] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
                      >Z</motion.span>
                      <motion.span
                        animate={{ y: [0, -15], x: [0, 3], opacity: [0, 1, 0], scale: [0.6, 1.2] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 1.2 }}
                      >Z</motion.span>
                    </div>
                  )}

                  {/* CUTE PIXEL-ART CAT SVG */}
                  <motion.div
                    className="w-[52px] h-[52px] flex items-center justify-center z-10"
                    animate={
                      status === "sleeping" 
                        ? { y: [0, 2, 0] } 
                        : status === "playing" 
                        ? { y: [0, -15, 0], rotate: [0, -10, 10, 0] }
                        : { y: [0, -1, 0] }
                    }
                    transition={
                      status === "sleeping"
                        ? { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
                        : status === "playing"
                        ? { repeat: 2, duration: 0.6, ease: "easeInOut" }
                        : { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                    }
                  >
                    <svg viewBox="0 0 16 16" width="100%" height="100%" style={{ imageRendering: "pixelated" }}>
                      {/* Body */}
                      <path d="M4 6h8v7H4V6z" fill="#8b93f8" />
                      <path d="M5 7h6v5H5V7z" fill="#aab0f7" />
                      
                      {/* Ears */}
                      <path d="M3 3h2v3H3V3z M11 3h2v3h-2V3z" fill="#8b93f8" />
                      <path d="M4 4h1v2H4V4z M11 4h1v2h-1V4z" fill="#ff9ad5" />
                      
                      {/* Paws */}
                      <path d="M4 13h2v1H4v-1z M10 13h2v1h-2v-1z" fill="#1a1626" />
                      
                      {/* Tail */}
                      {status === "sleeping" ? (
                        <path d="M12 10h2v2h-2v-2z" fill="#8b93f8" />
                      ) : (
                        <motion.path 
                          d="M12 9h2v2h-2V9z" 
                          fill="#8b93f8"
                          animate={{ rotate: [0, 15, -15, 0], originX: 0.75, originY: 0.6 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                        />
                      )}
                      
                      {/* Face / Eyes */}
                      {status === "sleeping" ? (
                        <>
                          {/* Sleeping eyes */}
                          <path d="M5 8h2v1H5V8z M9 8h2v1H9V8z" fill="#1a1626" />
                          {/* Cheeks */}
                          <path d="M4 9h1v1H4V9z M11 9h1v1h-1V9z" fill="#ff9ad5" opacity="0.6" />
                        </>
                      ) : status === "eating" ? (
                        <>
                          {/* Happy blinking eyes */}
                          <path d="M5 8l1-1l1 1 M9 8l1-1l1 1" stroke="#1a1626" strokeWidth="1" fill="none" />
                          {/* Mouth open */}
                          <path d="M7 9h2v1H7V9z" fill="#ff9ad5" />
                          <path d="M4 9h1v1H4V9z M11 9h1v1h-1V9z" fill="#ff9ad5" />
                        </>
                      ) : (
                        <>
                          {/* Open Eyes */}
                          <path d="M5 7h1v2H5V7z M10 7h1v2h-1V7z" fill="#1a1626" />
                          <path d="M5 7h1v1H5V7z M10 7h1v1h-1V7z" fill="#fff" />
                          {/* Mouth */}
                          <path d="M7 9h2v1H7V9z" fill="#1a1626" />
                          {/* Cheeks */}
                          <path d="M4 9h1v1H4V9z M11 9h1v1h-1V9z" fill="#ff9ad5" />
                        </>
                      )}
                    </svg>
                  </motion.div>
                  
                  {/* Status subtitle */}
                  <span className="text-[7px] text-slate-500 font-bold uppercase mt-1">
                    {status === "sleeping" ? "[ DORMIR_Zzz ]" : status === "eating" ? "[ COMENDO... ]" : status === "playing" ? "[ BRINCANDO! ]" : "[ ONLINE_FUTE ]"}
                  </span>
                </div>
              )}
            </div>

            {/* Dotted lines CRT Screen Overlay */}
            <div className="absolute inset-0 pointer-events-none z-20" style={{
              background: "repeating-linear-gradient(transparent, transparent 2px, rgba(26,22,38,0.02) 2px, rgba(26,22,38,0.02) 3px)"
            }}></div>
          </div>
        </div>

        {/* Physical Buttons Controls Area */}
        <div className="w-[180px] flex justify-between items-center px-2 mb-2 relative z-20">
          
          {/* Button A: FEED */}
          <div className="flex flex-col items-center gap-1">
            <button 
              onClick={handleFeed}
              className="w-9 h-9 bg-[#ff9ad5] border-2 border-[#111] rounded-full active:translate-y-0.5 active:shadow-none shadow-[0px_2px_0px_#111] cursor-pointer"
              title="Alimentar"
            ></button>
            <span className="text-[7px] font-bold text-slate-700">FEED</span>
          </div>

          {/* Button B: PLAY */}
          <div className="flex flex-col items-center gap-1">
            <button 
              onClick={handlePlay}
              className="w-9 h-9 bg-[#aab0f7] border-2 border-[#111] rounded-full active:translate-y-0.5 active:shadow-none shadow-[0px_2px_0px_#111] cursor-pointer"
              title="Brincar"
            ></button>
            <span className="text-[7px] font-bold text-slate-700">PLAY</span>
          </div>

          {/* Button C: STATS */}
          <div className="flex flex-col items-center gap-1">
            <button 
              onClick={handleToggleStats}
              className="w-9 h-9 bg-[#b6f23e] border-2 border-[#111] rounded-full active:translate-y-0.5 active:shadow-none shadow-[0px_2px_0px_#111] cursor-pointer"
              title="Status"
            ></button>
            <span className="text-[7px] font-bold text-slate-700">STATUS</span>
          </div>

        </div>

        {/* Small Y2K Speaker grids */}
        <div className="absolute bottom-2 flex gap-1 justify-center w-full">
          <div className="w-1.5 h-1.5 rounded-full bg-[#111]/15"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#111]/15"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#111]/15"></div>
        </div>

      </div>
    </div>
  );
}
