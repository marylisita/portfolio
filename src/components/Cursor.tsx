"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function Cursor() {
  const [hovered, setHovered] = useState(false);
  
  // Use framer-motion values for instant tracking
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // No offset, matches exactly the CSS cursor hotspot (0, 0)
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("hover-trigger")
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        x: cursorX,
        y: cursorY,
        pointerEvents: "none",
        zIndex: 10000,
      }}
    >
      <motion.div
        style={{ width: "32px", height: "32px", position: "relative" }}
      >
        {/* Claws Overlay (appear on hover) */}
        {/* Placed around the top left to match the pixel-art toes */}
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}>
          <motion.path d="M 6 10 L 2 4 L 8 6" fill="#1A1A27" 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.5, x: hovered ? -2 : 0, y: hovered ? -2 : 0 }} />
            
          <motion.path d="M 14 6 L 12 0 L 17 4" fill="#1A1A27" 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.5, y: hovered ? -3 : 0 }} />
            
          <motion.path d="M 22 8 L 24 1 L 26 7" fill="#1A1A27" 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.5, x: hovered ? 2 : 0, y: hovered ? -2 : 0 }} />
        </svg>
      </motion.div>
    </motion.div>
  );
}
