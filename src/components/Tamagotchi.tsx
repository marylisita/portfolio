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
  const [outfitIndex, setOutfitIndex] = useState(0); // 0: Casual, 1: Bunny, 2: Cyber Star
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

  // Auto-sleep if idle for 15 seconds
  useEffect(() => {
    if (status !== "sleeping" && status !== "stats" && !status.startsWith("walking")) {
      const timer = setTimeout(() => {
        setStatus("sleeping");
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const spawnParticle = (emoji: string) => {
    const id = Date.now() + Math.random();
    // Adjusted bounds to fit the smaller LCD screen
    const x = 25 + Math.random() * 65;
    const y = 30 + Math.random() * 25;
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
      spawnParticle("❤️");
      setStatus("idle");
      setCupcakeActive(false);
    }, 1800);
  };

  const handleOutdoors = () => {
    if (status.startsWith("walking") || status === "stats") return;
    setStatus("walkingOut");
    setHappiness((prev) => Math.min(100, prev + 15));

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
    setStarActive(true);
    setTimeout(() => setStarActive(false), 500);
  };

  const handleNoAction = () => {
    if (status.startsWith("walking") || status === "stats" || status === "sleeping") return;
    spawnParticle("💢");
    // Little angry wobble
    setStarActive(true);
    setTimeout(() => setStarActive(false), 300);
  };

  // Determine Chix position/animation
  const getChixAnimation = () => {
    switch (status) {
      case "sleeping":
        return { y: [0, 1.2, 0] };
      case "eating":
        return { x: [0, -20, -20, 0] };
      case "walkingOut":
        return { x: [0, 70], opacity: [1, 1, 0] };
      case "walkingIn":
        return { x: [-70, 0], opacity: [0, 1, 1] };
      case "playing":
      default:
        return starActive 
          ? { y: [0, -10, 0], rotate: [0, -10, 10, 0] } 
          : { x: [0, 10, -10, 0] };
    }
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-center select-none"
      style={{ width: "230px", height: "265px" }}
    >
      {/* 1. KEYCHAIN RING (Behind roof) */}
      <div className="absolute top-[2px] left-[103px] w-6 h-6 border-[3px] border-[#111] bg-slate-300 rounded-full z-0"></div>

      {/* 2. PIXEL CHIX HOUSE CASE SVG */}
      <svg 
        viewBox="0 0 220 255" 
        className="w-full h-full z-10"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Blue Roof Peak Skylight */}
        <polygon points="92,15 110,2 128,15" fill="#4fa8e2" stroke="#111" strokeWidth="2.5" />
        
        {/* Scalloped Shingle Roof */}
        <path d="M 0 45 L 220 45 L 210 15 L 10 15 Z" fill="#d27856" stroke="#111" strokeWidth="2.5" />
        {/* Shingle Tiles details */}
        <path d="M 25 15 v 30 M 50 15 v 30 M 75 15 v 30 M 100 15 v 30 M 125 15 v 30 M 150 15 v 30 M 175 15 v 30 M 200 15 v 30" stroke="#111" strokeWidth="1.5" opacity="0.3" />
        
        {/* Roof Border Trim */}
        <rect x="0" y="41" width="220" height="4" fill="#a05030" />

        {/* House Main Body */}
        <rect x="10" y="45" width="200" height="205" fill="#e89f80" stroke="#111" strokeWidth="3" rx="16" />
        {/* Shading/depth on right side */}
        <path d="M 194 47 A 12 12 0 0 1 207 59 L 207 235 A 12 12 0 0 1 195 247 L 195 47 Z" fill="#d48866" opacity="0.5" />

        {/* Arched Window (Top center of facade) */}
        <path d="M 92 45 A 18 18 0 0 1 128 45 Z" fill="#ffe89c" stroke="#111" strokeWidth="2.5" />
        <path d="M 110 27 v 18 M 92 40 h 36" stroke="#111" strokeWidth="1.5" opacity="0.3" />
        
        {/* Potted Palm Tree Left */}
        {/* Pot */}
        <polygon points="12,142 16,142 15,149 13,149" fill="#d6805c" stroke="#111" strokeWidth="1.5" />
        {/* Trunk */}
        <rect x="13" y="125" width="2" height="17" fill="#7d5a49" stroke="#111" strokeWidth="1" />
        {/* Leaves */}
        <path d="M 8 125 q 6 -8 12 -2 M 14 125 q -6 -8 -12 -2 M 14 120 q 0 -10 -10 -4" fill="#46a25b" stroke="#111" strokeWidth="1" />

        {/* Potted Palm Tree Right */}
        {/* Pot */}
        <polygon points="204,142 208,142 207,149 205,149" fill="#d6805c" stroke="#111" strokeWidth="1.5" />
        {/* Trunk */}
        <rect x="205" y="125" width="2" height="17" fill="#7d5a49" stroke="#111" strokeWidth="1" />
        {/* Leaves */}
        <path d="M 200 125 q 6 -8 12 -2 M 206 125 q -6 -8 -12 -2 M 206 120 q 0 -10 10 -4" fill="#46a25b" stroke="#111" strokeWidth="1" />

        {/* Accessory Connector Slot (Bottom left) */}
        <rect x="22" y="195" width="16" height="26" fill="#db68a7" stroke="#111" strokeWidth="2" rx="3" />
        <rect x="26" y="201" width="8" height="14" fill="#1a1626" rx="1" />
        <line x1="26" y1="208" x2="34" y2="208" stroke="#db68a7" strokeWidth="1.5" />

        {/* Button Bar Console Panel */}
        <rect x="48" y="184" width="150" height="40" fill="#d2805d" stroke="#111" strokeWidth="2.5" rx="6" />
        <rect x="52" y="188" width="142" height="32" fill="#bc7150" rx="4" />

        {/* Button Rings (For layout alignment with HTML overlay buttons) */}
        <circle cx="66" cy="204" r="8" fill="none" stroke="#111" strokeWidth="2" />
        <circle cx="90" cy="204" r="8" fill="none" stroke="#111" strokeWidth="2" />
        <circle cx="114" cy="204" r="8" fill="none" stroke="#111" strokeWidth="2" />
        <circle cx="138" cy="204" r="8" fill="none" stroke="#111" strokeWidth="2" />
        <circle cx="162" cy="204" r="8" fill="none" stroke="#111" strokeWidth="2" />
        <circle cx="186" cy="204" r="8" fill="none" stroke="#111" strokeWidth="2" />

        {/* Brand Logo Stamp */}
        <text x="120" y="240" textAnchor="middle" fill="#202025" fontFamily="var(--font-mono)" fontSize="7" fontWeight="900" letterSpacing="0.5">PIXEL CHIX</text>
      </svg>

      {/* 3. LCD SCREEN CONTAINER (Overlaying the screen area in SVG) */}
      <div 
        className="absolute w-[150px] h-[90px] border-[2.5px] border-[#111] rounded flex flex-col overflow-hidden text-slate-800 z-20 cursor-pointer"
        style={{
          top: "72px",
          left: "35px",
          backgroundColor: "#e4def9",
          backgroundImage: "radial-gradient(rgba(139, 147, 248, 0.16) 1.5px, transparent 1.5px)",
          backgroundSize: "6px 6px"
        }}
        onClick={handlePet}
      >
        {/* LCD Header HUD */}
        <div className="h-3 border-b border-slate-900/10 flex justify-between items-center px-1 text-[5.5px] font-bold text-slate-500/70 font-mono">
          <span>🌸 PIXEL_CHIX</span>
          <span>HUD: HOUSE</span>
          <span>🔋 99%</span>
        </div>

        {/* Screen LCD Content */}
        <div className="flex-1 flex flex-col items-center justify-end relative p-1 pb-0 overflow-hidden">
          
          {/* Floating Action Particles */}
          <AnimatePresence>
            {particles.map((p) => (
              <motion.span
                key={p.id}
                className="absolute text-xs z-30 pointer-events-none"
                initial={{ opacity: 1, scale: 0.5, x: p.x - 75, y: p.y - 40 }}
                animate={{ opacity: 0, scale: 1.4, y: p.y - 75, x: p.x - 75 + (Math.random() - 0.5) * 15 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
              >
                {p.emoji}
              </motion.span>
            ))}
          </AnimatePresence>

          {/* STATS SCREEN */}
          {status === "stats" ? (
            <div className="w-full h-full flex flex-col justify-center px-1 text-[6.5px] leading-[1.25] text-slate-700 font-mono">
              <div className="font-bold border-b border-slate-900/10 pb-0.5 mb-1 flex justify-between uppercase">
                <span>CHIX DATA</span>
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
              <div className="flex justify-between mt-0.5 pt-0.5 border-t border-slate-900/5 text-slate-500 uppercase text-[4.5px]">
                <span>TCC TERMS: ACCEPTED ✓</span>
              </div>
            </div>
          ) : (
            /* ACTIVE ROOM VIEW WITH CHIX & CATS */
            <div className="relative w-full h-full flex items-end justify-center">
              
              {/* Cupcake food element */}
              {cupcakeActive && (
                <motion.div 
                  className="absolute left-4 bottom-1 text-[10px] z-20"
                  animate={{ x: [0, 15, 20], y: [0, -6, 0], scale: [1, 1.1, 0.8], opacity: [1, 1, 0] }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                  🧁
                </motion.div>
              )}

              {/* zZZ Sleep indicator */}
              {status === "sleeping" && (
                <div className="absolute right-12 top-0 text-[7px] font-bold text-slate-500 flex flex-col items-center">
                  <motion.span
                    animate={{ y: [0, -6], x: [0, 3], opacity: [0, 1, 0], scale: [0.6, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8, delay: 0 }}
                  >z</motion.span>
                  <motion.span
                    animate={{ y: [0, -8], x: [0, -3], opacity: [0, 1, 0], scale: [0.6, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8, delay: 0.5 }}
                  >Z</motion.span>
                </div>
              )}

              {/* LCD Room floor line */}
              <div className="absolute bottom-[2px] inset-x-0 h-[1px] bg-slate-900/10"></div>

              {/* ============================================================== */}
              {/* GATINHA 1: PRETINHA MAGRINHA (Skinny black cat, left side)     */}
              {/* ============================================================== */}
              <motion.div
                className="absolute left-1.5 bottom-[2px] w-[14px] h-[16px] z-10"
                animate={
                  status === "sleeping" 
                    ? { y: [0, 0.6, 0] } 
                    : { y: [0, -0.4, 0] }
                }
                transition={{ repeat: Infinity, duration: 2.0, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 8 10" width="100%" height="100%" style={{ imageRendering: "pixelated" }}>
                  {/* Body */}
                  <rect x="2" y="3" width="4" height="4" fill="#202025" />
                  {/* Tail (Wagging) */}
                  <motion.rect 
                    x="0" y="3" width="2" height="1" 
                    fill="#202025" 
                    animate={status === "sleeping" ? {} : { rotate: [0, 15, -15, 0], originX: 1 }}
                    transition={{ repeat: Infinity, duration: 1.0 }}
                  />
                  {/* Head */}
                  <rect x="3" y="0" width="4" height="4" fill="#202025" />
                  {/* Ears */}
                  <path d="M 3 0 L 4 0 L 4 1 Z M 6 0 L 7 0 L 7 1 Z" fill="#202025" />
                  {/* Green Eyes */}
                  {status === "sleeping" ? (
                    <path d="M 4 2 H 5 V 3 H 4 Z M 6 2 H 7 V 3 H 6 Z" fill="#111" />
                  ) : (
                    <>
                      <rect x="4" y="2" width="1" height="1" fill="#4ade80" />
                      <rect x="6" y="2" width="1" height="1" fill="#4ade80" />
                    </>
                  )}
                  {/* Legs */}
                  <rect x="3" y="7" width="1" height="3" fill="#202025" />
                  <rect x="5" y="7" width="1" height="3" fill="#202025" />
                </svg>
              </motion.div>

              {/* ============================================================== */}
              {/* THE CHIX GIRL (Center character)                               */}
              {/* ============================================================== */}
              <motion.div
                className="w-[36px] h-[44px] flex items-end justify-center z-10"
                animate={getChixAnimation()}
                transition={
                  status === "sleeping"
                    ? { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
                    : status.startsWith("walking")
                    ? { duration: 1.8, ease: "easeInOut" }
                    : { repeat: Infinity, duration: 2.0, ease: "easeInOut" }
                }
                style={{
                  transformOrigin: "bottom center",
                  marginBottom: "2px"
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
                    <path d="M 5 8 H 7 V 9 H 5 Z M 9 8 H 11 V 9 H 9 Z" fill="#1a1626" />
                  ) : blinking ? (
                    <path d="M 5 8 H 7 V 9 H 5 Z M 9 8 H 11 V 9 H 9 Z" fill="#1a1626" />
                  ) : (
                    <>
                      <path d="M 5 7 H 7 V 9 H 5 Z M 9 7 H 11 V 9 H 9 Z" fill="#1a1626" />
                      <path d="M 5 7 H 6 V 8 H 5 Z M 9 7 H 10 V 8 H 9 Z" fill="#ffffff" />
                    </>
                  )}
                  
                  {/* Mouth */}
                  <path d="M 7 9 H 9 V 10 H 7 Z" fill="#1a1626" />

                  {/* OUTFITS */}
                  {outfitIndex === 0 && (
                    <path d="M 5 11 H 11 V 16 H 5 Z" fill="#ff7da7" />
                  )}
                  {outfitIndex === 1 && (
                    <>
                      <path d="M 5 11 H 11 V 16 H 5 Z" fill="#aab0f7" />
                      {/* Bunny ears */}
                      <path d="M 3 1 H 5 V 4 H 3 Z M 11 1 H 13 V 4 H 11 Z" fill="#ffffff" />
                      <path d="M 4 2 H 5 V 4 H 4 Z M 12 2 H 13 V 4 H 12 Z" fill="#ff9ad5" />
                    </>
                  )}
                  {outfitIndex === 2 && (
                    <>
                      <path d="M 5 11 H 11 V 16 H 5 Z" fill="#b6f23e" />
                      {/* Black sunglasses */}
                      <path d="M 4 7 H 12 V 8 H 4 Z" fill="#1a1626" />
                    </>
                  )}

                  {/* Neck */}
                  <path d="M 7 11 H 9 V 12 H 7 Z" fill="#ffebd2" />

                  {/* Arms */}
                  {status === "walkingIn" ? (
                    <>
                      <path d="M 3 11 H 5 V 13 H 3 Z" fill="#ffebd2" />
                      <path d="M 2 9 H 4 V 11 H 2 Z" fill="#ffebd2" />
                    </>
                  ) : (
                    <path d="M 3 11 H 5 V 14 H 3 Z M 11 11 H 13 V 14 H 11 Z" fill="#ffebd2" />
                  )}

                  {/* Legs */}
                  <path d="M 6 16 H 7 V 20 H 6 Z M 9 16 H 10 V 20 H 9 Z" fill="#ffebd2" />
                  
                  {/* Shoes */}
                  <path d="M 5 20 H 7 V 21 H 5 Z M 9 20 H 11 V 21 H 9 Z" fill="#1a1626" />
                </motion.svg>
              </motion.div>

              {/* ============================================================== */}
              {/* GATINHA 2: TIGRADA GORDINHA (Chubby grey/white/brown tabby, right side) */}
              {/* ============================================================== */}
              <motion.div
                className="absolute right-1 bottom-[2px] w-[18px] h-[16px] z-10"
                animate={
                  status === "sleeping" 
                    ? { y: [0, 0.5, 0] } 
                    : { y: [0, -0.5, 0] }
                }
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 10 9" width="100%" height="100%" style={{ imageRendering: "pixelated" }}>
                  {/* Chubby body: Grey base */}
                  <rect x="1" y="3" width="7" height="5" fill="#8f8f96" />
                  {/* White belly & chest */}
                  <rect x="2" y="5" width="4" height="3" fill="#ffffff" />
                  {/* Brown tiger stripes */}
                  <rect x="1" y="4" width="2" height="1" fill="#604835" />
                  <rect x="5" y="3" width="2" height="1" fill="#604835" />
                  <rect x="6" y="5" width="2" height="1" fill="#604835" />
                  {/* Head */}
                  <rect x="3" y="0" width="5" height="4" fill="#8f8f96" />
                  {/* Ears */}
                  <path d="M 3 0 L 4 0 L 4 1 Z M 7 0 L 8 0 L 8 1 Z" fill="#604835" />
                  {/* Eyes (Yellowish) */}
                  {status === "sleeping" ? (
                    <path d="M 4 2 H 5 V 3 H 4 Z M 6 2 H 7 V 3 H 6 Z" fill="#111" />
                  ) : (
                    <>
                      <rect x="4" y="2" width="1" height="1" fill="#fbbf24" />
                      <rect x="6" y="2" width="1" height="1" fill="#fbbf24" />
                    </>
                  )}
                  {/* Chubby Legs */}
                  <rect x="2" y="8" width="2" height="1" fill="#8f8f96" />
                  <rect x="6" y="8" width="2" height="1" fill="#8f8f96" />
                  {/* Tail (Curved and striped) */}
                  <motion.path 
                    d="M 8 4 H 9 V 7 H 8 Z" 
                    fill="#604835"
                    animate={status === "sleeping" ? {} : { rotate: [0, -10, 10, 0], originX: 0 }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                  />
                </svg>
              </motion.div>

            </div>
          )}
        </div>

        {/* Dotted lines CRT Screen Overlay */}
        <div className="absolute inset-0 pointer-events-none z-20" style={{
          background: "repeating-linear-gradient(transparent, transparent 2px, rgba(26,22,38,0.02) 2px, rgba(26,22,38,0.02) 3px)"
        }}></div>
      </div>

      {/* 4. BUTTONS HITBOXES (Overlays 6 buttons drawn in SVG, opacity: 0 but active click!) */}
      <div 
        className="absolute w-[150px] h-[32px] flex justify-between items-center z-30"
        style={{
          top: "188px",
          left: "48px"
        }}
      >
        {/* Button 1: YES/PET (teal ✓) */}
        <button 
          onClick={handlePet}
          className="w-[18px] h-[18px] rounded-full cursor-pointer bg-transparent border-0 opacity-0 active:scale-95"
          title="Fazer Carinho (Sim)"
        />

        {/* Button 2: NO (teal ✕) */}
        <button 
          onClick={handleNoAction}
          className="w-[18px] h-[18px] rounded-full cursor-pointer bg-transparent border-0 opacity-0 active:scale-95"
          title="Negar (Não)"
        />

        {/* Button 3: CLOSET */}
        <button 
          onClick={handleCloset}
          className="w-[18px] h-[18px] rounded-full cursor-pointer bg-transparent border-0 opacity-0 active:scale-95"
          title="Closet (Trocar Roupa)"
        />

        {/* Button 4: FRIDGE */}
        <button 
          onClick={handleFeed}
          className="w-[18px] h-[18px] rounded-full cursor-pointer bg-transparent border-0 opacity-0 active:scale-95"
          title="Fridge (Guloseima)"
        />

        {/* Button 5: OUTDOORS */}
        <button 
          onClick={handleOutdoors}
          className="w-[18px] h-[18px] rounded-full cursor-pointer bg-transparent border-0 opacity-0 active:scale-95"
          title="Outdoors (Passear)"
        />

        {/* Button 6: STATS */}
        <button 
          onClick={handleToggleStats}
          className="w-[18px] h-[18px] rounded-full cursor-pointer bg-transparent border-0 opacity-0 active:scale-95"
          title="Stats (Status TCC)"
        />
      </div>
    </div>
  );
}
