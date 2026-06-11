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
  const [status, setStatus] = useState<"sleeping" | "idle" | "eating" | "playing" | "stats" | "walkingOut" | "walkingIn">("sleeping");
  const [particles, setParticles] = useState<Particle[]>([]);
  const [hunger, setHunger] = useState(20);
  const [happiness, setHappiness] = useState(60);
  const [outfitIndex, setOutfitIndex] = useState(0); // 0: Casual, 1: Bunny, 2: Y2K Star
  const [cupcakeActive, setCupcakeActive] = useState(false);
  const [starActive, setStarActive] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [blinking, setBlinking] = useState(false);

  // Blinking eyes simulation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, 3000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Auto-sleep if idle for 12 seconds
  useEffect(() => {
    if (status !== "sleeping" && status !== "stats" && !status.startsWith("walking")) {
      const timer = setTimeout(() => {
        setStatus("sleeping");
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const spawnParticle = (emoji: string) => {
    const id = Date.now() + Math.random();
    const x = 30 + Math.random() * 80;
    const y = 40 + Math.random() * 30;
    setParticles((prev) => [...prev, { id, x, y, emoji }]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 1000);
  };

  const handleCloset = () => {
    if (status.startsWith("walking") || status === "stats") return;
    setIsSpinning(true);
    setStatus("idle");
    spawnParticle("✨");
    
    // Cycle outfit index (0, 1, 2)
    setTimeout(() => {
      setOutfitIndex((prev) => (prev + 1) % 3);
    }, 250);

    setTimeout(() => {
      setIsSpinning(false);
      spawnParticle("👗");
    }, 500);
  };

  const handleFeed = () => {
    if (status.startsWith("walking") || status === "stats") return;
    setStatus("eating");
    setCupcakeActive(true);
    setHunger((prev) => Math.max(0, prev - 20));
    setHappiness((prev) => Math.min(100, prev + 5));
    
    setTimeout(() => {
      spawnParticle("🧁");
      spawnParticle("💖");
      setStatus("idle");
      setCupcakeActive(false);
    }, 1800);
  };

  const handleOutdoors = () => {
    if (status.startsWith("walking") || status === "stats") return;
    setStatus("walkingOut");
    setHappiness((prev) => Math.min(100, prev + 15));

    // Walk out sequence:
    // 1. Walk off-screen to the right (1.5s)
    // 2. Stay outside / play (1.2s)
    // 3. Walk back in from the left (1.5s)
    setTimeout(() => {
      setStatus("walkingIn");
      spawnParticle("🌸");
    }, 2500);

    setTimeout(() => {
      setStatus("idle");
      spawnParticle("👋");
    }, 4000);
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
    // Trigger tiny jump
    setStarActive(true);
    setTimeout(() => setStarActive(false), 500);
  };

  // Determine character position and animation based on status
  const getChixAnimation = () => {
    switch (status) {
      case "sleeping":
        return { y: [0, 1.5, 0] };
      case "eating":
        return { x: [0, -35, -35, 0] };
      case "walkingOut":
        return { x: [0, 100], opacity: [1, 1, 0] };
      case "walkingIn":
        return { x: [-100, 0], opacity: [0, 1, 1] };
      case "playing":
      default:
        return starActive 
          ? { y: [0, -12, 0], rotate: [0, -15, 15, 0] } 
          : { x: [0, 15, -15, 0] };
    }
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
      <div className="absolute top-[4px] w-8 h-8 border-4 border-[#111] bg-slate-300 rounded-full z-0"></div>
      
      {/* Chimney */}
      <div className="absolute top-[16px] right-14 w-5 h-8 bg-pink-400 border-4 border-slate-900 z-10 rounded-t-sm"></div>

      {/* PIXEL CHIX HOUSE CASE */}
      <div className="flex flex-col items-center z-20">
        
        {/* Triangular Roof */}
        <div 
          className="w-[216px] h-[64px] border-l-4 border-r-4 border-t-4 border-[#111] relative"
          style={{
            background: "linear-gradient(135deg, #ff9ad5, #aab0f7)",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            marginBottom: "-4px"
          }}
        >
          {/* Heart attic window inside the roof */}
          <div className="absolute top-[32px] left-[98px] transform -translate-x-1/2 w-[18px] h-[18px] bg-white border-2 border-[#111] rounded-full flex items-center justify-center text-[7px] text-pink-500 font-bold">
            ♥
          </div>
        </div>

        {/* House Main Body */}
        <div 
          className="w-[216px] h-[216px] border-4 border-[#111] rounded-b-[24px] shadow-[-6px_6px_0px_rgba(0,0,0,0.1)] relative flex flex-col items-center justify-between p-3 select-none"
          style={{
            background: "linear-gradient(135deg, #ffd3ec 0%, #dcd3ff 100%)",
          }}
        >
          {/* Gloss highlight overlay */}
          <div className="absolute top-2 left-8 w-[120px] h-[40px] bg-white/25 rounded-full blur-[2px] transform -rotate-12 pointer-events-none"></div>

          {/* Screen Frame */}
          <div 
            className="w-[174px] h-[116px] bg-[#111] rounded-lg p-2 flex flex-col justify-between shadow-inner mt-2 relative cursor-pointer"
            onClick={handlePet}
          >
            {/* LCD Screen Display */}
            <div 
              className="w-full h-full rounded border-2 border-[#111] flex flex-col relative overflow-hidden text-slate-800"
              style={{
                backgroundColor: "#e8def8",
                backgroundImage: "radial-gradient(rgba(139, 147, 248, 0.18) 1.5px, transparent 1.5px)",
                backgroundSize: "6px 6px"
              }}
            >
              {/* Screen Header HUD */}
              <div className="h-3 border-b border-slate-900/10 flex justify-between items-center px-1 text-[6px] font-bold text-slate-500/70">
                <span>🌸 PIXEL_CHIX</span>
                <span>SYS: IN_HOUSE</span>
                <span>🔋 99%</span>
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
                      animate={{ opacity: 0, scale: 1.5, y: p.y - 80, x: p.x - 70 + (Math.random() - 0.5) * 20 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                      {p.emoji}
                    </motion.span>
                  ))}
                </AnimatePresence>

                {/* STATS SCREEN */}
                {status === "stats" ? (
                  <div className="w-full h-full flex flex-col justify-center px-1.5 py-0.5 text-[7px] leading-[1.25] text-slate-700 font-mono">
                    <div className="font-bold border-b border-slate-900/10 pb-0.5 mb-1 flex justify-between uppercase">
                      <span>CHIX STATS</span>
                      <span className="text-pink-500">HAPPY</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FOOD VIBE:</span>
                      <span>{hunger < 40 ? "🍦 SWEET" : "FEED"}</span>
                    </div>
                    <div className="w-full bg-slate-300 h-1 rounded overflow-hidden mb-1 border border-slate-900/10">
                      <div className="bg-[#b6f23e] h-full" style={{ width: `${100 - hunger}%` }}></div>
                    </div>
                    <div className="flex justify-between">
                      <span>OUTFIT:</span>
                      <span>{outfitIndex === 0 ? "CASUAL" : outfitIndex === 1 ? "BUNNY 🐇" : "Y2K STAR ⭐"}</span>
                    </div>
                    <div className="flex justify-between mt-1 pt-1 border-t border-slate-900/5 text-slate-500 uppercase text-[5px]">
                      <span>LOC: ROOM_01</span>
                      <span>VIGIL: DISCREET</span>
                    </div>
                  </div>
                ) : (
                  /* HOUSE ROOM VIEW */
                  <div className="flex flex-col items-center justify-center relative w-full h-full">
                    
                    {/* Cupcake food animation */}
                    {cupcakeActive && (
                      <motion.div 
                        className="absolute left-6 bottom-2 text-xs z-20"
                        animate={{ x: [0, 20, 25], y: [0, -8, 0], scale: [1, 1.1, 0.8], opacity: [1, 1, 0] }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      >
                        🧁
                      </motion.div>
                    )}

                    {/* SLEEP BUBBLES */}
                    {status === "sleeping" && (
                      <div className="absolute right-6 top-1 text-[8px] font-bold text-slate-500 flex flex-col items-center">
                        <motion.span
                          animate={{ y: [0, -8], x: [0, 4], opacity: [0, 1, 0], scale: [0.6, 1.1] }}
                          transition={{ repeat: Infinity, duration: 1.8, delay: 0 }}
                        >z</motion.span>
                        <motion.span
                          animate={{ y: [0, -10], x: [0, -4], opacity: [0, 1, 0], scale: [0.6, 1.1] }}
                          transition={{ repeat: Infinity, duration: 1.8, delay: 0.5 }}
                        >Z</motion.span>
                      </div>
                    )}

                    {/* House Floor decoration */}
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-900/10"></div>

                    {/* CUTE PIXEL-ART CHIX GIRL */}
                    {status !== "walkingOut" && status !== "walkingIn" && (
                      <div className="absolute left-[3px] top-[14px] text-[7px] text-slate-500/60 uppercase">
                        {status === "sleeping" ? "💤 sleep" : "🏠 home"}
                      </div>
                    )}

                    <motion.div
                      className="w-[44px] h-[52px] flex items-center justify-center z-10"
                      animate={getChixAnimation()}
                      transition={
                        status === "sleeping"
                          ? { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
                          : status === "walkingOut" || status === "walkingIn"
                          ? { duration: 1.8, ease: "easeInOut" }
                          : { repeat: Infinity, duration: 2.0, ease: "easeInOut" }
                      }
                      style={{
                        transformOrigin: "bottom center"
                      }}
                    >
                      <motion.svg 
                        viewBox="0 0 16 24" 
                        width="100%" 
                        height="100%" 
                        style={{ imageRendering: "pixelated" }}
                        animate={isSpinning ? { rotateY: [0, 360, 720] } : {}}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        {/* Pigtails / Hair buns */}
                        <path d="M 2 5 H 4 V 7 H 2 Z M 12 5 H 14 V 7 H 12 Z" fill="#6f4e37" />
                        {/* Hair head block */}
                        <path d="M 4 4 H 12 V 9 H 4 Z" fill="#6f4e37" />
                        
                        {/* Skin block */}
                        <path d="M 5 6 H 11 V 11 H 5 Z" fill="#ffebd2" />
                        
                        {/* Cheeks */}
                        <path d="M 5 9 H 6 V 10 H 5 Z M 10 9 H 11 V 10 H 10 Z" fill="#ff9ad5" />
                        
                        {/* Eyes */}
                        {status === "sleeping" ? (
                          /* Sleeping eyes */
                          <path d="M 5 8 H 7 V 9 H 5 Z M 9 8 H 11 V 9 H 9 Z" fill="#1a1626" />
                        ) : blinking ? (
                          /* Blinking eyes */
                          <path d="M 5 8 H 7 V 9 H 5 Z M 9 8 H 11 V 9 H 9 Z" fill="#1a1626" />
                        ) : (
                          /* Open Eyes */
                          <>
                            <path d="M 5 7 H 7 V 9 H 5 Z M 9 7 H 11 V 9 H 9 Z" fill="#1a1626" />
                            <path d="M 5 7 H 6 V 8 H 5 Z M 9 7 H 10 V 8 H 9 Z" fill="#ffffff" />
                          </>
                        )}
                        
                        {/* Mouth */}
                        {status === "eating" ? (
                          <path d="M 7 9 H 9 V 10 H 7 Z" fill="#ff7da7" />
                        ) : (
                          <path d="M 7 9 H 9 V 10 H 7 Z" fill="#1a1626" />
                        )}

                        {/* OUTFITS */}
                        {outfitIndex === 0 && (
                          /* Outfit 0: Casual Pink Dress */
                          <path d="M 5 11 H 11 V 16 H 5 Z" fill="#ff7da7" />
                        )}
                        {outfitIndex === 1 && (
                          /* Outfit 1: Bunny Girl (Purple dress + ears) */
                          <>
                            <path d="M 5 11 H 11 V 16 H 5 Z" fill="#aab0f7" />
                            {/* Bunny ears */}
                            <path d="M 3 1 H 5 V 4 H 3 Z M 11 1 H 13 V 4 H 11 Z" fill="#ffffff" />
                            <path d="M 4 2 H 5 V 4 H 4 Z M 12 2 H 13 V 4 H 12 Z" fill="#ff9ad5" />
                          </>
                        )}
                        {outfitIndex === 2 && (
                          /* Outfit 2: Cyber Star (Neon green shirt + Sunglasses) */
                          <>
                            <path d="M 5 11 H 11 V 16 H 5 Z" fill="#b6f23e" />
                            {/* Black sunglasses */}
                            <path d="M 4 7 H 12 V 8 H 4 Z" fill="#1a1626" />
                          </>
                        )}

                        {/* Neck / Collar */}
                        <path d="M 7 11 H 9 V 12 H 7 Z" fill="#ffebd2" />

                        {/* Arms / Hands */}
                        {status === "walkingIn" ? (
                          /* Waving hand */
                          <>
                            <path d="M 3 11 H 5 V 13 H 3 Z" fill="#ffebd2" />
                            <path d="M 2 9 H 4 V 11 H 2 Z" fill="#ffebd2" />
                          </>
                        ) : (
                          /* Downward arms */
                          <path d="M 3 11 H 5 V 14 H 3 Z M 11 11 H 13 V 14 H 11 Z" fill="#ffebd2" />
                        )}

                        {/* Legs */}
                        <path d="M 6 16 H 7 V 20 H 6 Z M 9 16 H 10 V 20 H 9 Z" fill="#ffebd2" />
                        
                        {/* Shoes */}
                        <path d="M 5 20 H 7 V 21 H 5 Z M 9 20 H 11 V 21 H 9 Z" fill="#1a1626" />
                      </motion.svg>
                    </motion.div>
                    
                    {/* Status HUD Text */}
                    <span className="text-[6px] text-slate-500 font-bold uppercase mt-1 z-10">
                      {status === "sleeping" 
                        ? "[ SLEEPING_Zzz ]" 
                        : status === "eating" 
                        ? "[ FRIDGE_TIME ]" 
                        : status === "walkingOut" 
                        ? "[ LEAVING... ]" 
                        : status === "walkingIn" 
                        ? "[ HELLO! ]" 
                        : "[ PLAYING_Y2K ]"}
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
          <div className="w-[174px] flex justify-between items-center px-1 mb-1 relative z-20">
            
            {/* Button A: CLOSET */}
            <div className="flex flex-col items-center gap-0.5">
              <button 
                onClick={handleCloset}
                className="w-[32px] h-[32px] bg-[#ff9ad5] border-2 border-[#111] rounded-full active:translate-y-0.5 active:shadow-none shadow-[0px_2px_0px_#111] cursor-pointer flex items-center justify-center text-[10px]"
                title="Closet"
              >
                👗
              </button>
              <span className="text-[6px] font-bold text-slate-700">CLOSET</span>
            </div>

            {/* Button B: FRIDGE */}
            <div className="flex flex-col items-center gap-0.5">
              <button 
                onClick={handleFeed}
                className="w-[32px] h-[32px] bg-[#aab0f7] border-2 border-[#111] rounded-full active:translate-y-0.5 active:shadow-none shadow-[0px_2px_0px_#111] cursor-pointer flex items-center justify-center text-[10px]"
                title="Fridge"
              >
                🍦
              </button>
              <span className="text-[6px] font-bold text-slate-700">FRIDGE</span>
            </div>

            {/* Button C: OUTDOORS */}
            <div className="flex flex-col items-center gap-0.5">
              <button 
                onClick={handleOutdoors}
                className="w-[32px] h-[32px] bg-[#b6f23e] border-2 border-[#111] rounded-full active:translate-y-0.5 active:shadow-none shadow-[0px_2px_0px_#111] cursor-pointer flex items-center justify-center text-[10px]"
                title="Outdoors"
              >
                🚪
              </button>
              <span className="text-[6px] font-bold text-slate-700">OUTDOORS</span>
            </div>

            {/* Button D: STATUS */}
            <div className="flex flex-col items-center gap-0.5">
              <button 
                onClick={handleToggleStats}
                className="w-[32px] h-[32px] bg-amber-200 border-2 border-[#111] rounded-full active:translate-y-0.5 active:shadow-none shadow-[0px_2px_0px_#111] cursor-pointer flex items-center justify-center text-[10px]"
                title="Status"
              >
                📊
              </button>
              <span className="text-[6px] font-bold text-slate-700">STATS</span>
            </div>

          </div>

          {/* Speaker grids */}
          <div className="absolute bottom-1.5 flex gap-1 justify-center w-full">
            <div className="w-1 h-1 rounded-full bg-[#111]/15"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#111]/15"></div>
            <div className="w-1 h-1 rounded-full bg-[#111]/15"></div>
          </div>

        </div>
      </div>
    </div>
  );
}
