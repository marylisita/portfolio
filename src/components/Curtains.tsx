"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Curtains() {
  const [isVisible, setIsVisible] = useState(true);
  const cols = 16;
  const rows = 12;

  useEffect(() => {
    // Total transition duration (sweep ends at ~1.5s)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1800); 
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  // Generate grid cells
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ r, c });
    }
  }

  // Animation variants for individual pixel cells
  const cellVariants = {
    initial: {
      scale: 1.02, // slightly larger to prevent hairline gaps
      opacity: 1,
    },
    animate: (custom: { r: number; c: number }) => ({
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.36, 0.07, 0.19, 0.97] as const, // smooth custom ease
        delay: (custom.r + custom.c) * 0.035 + 0.45 // starts sweeping after text fades
      }
    })
  };

  return (
    <>
      {/* Centered Logo Text */}
      <div 
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100000,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <motion.div
          initial={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          animate={{ opacity: 0, filter: "blur(12px)", scale: 1.05 }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
          style={{
            color: "#ffffff",
            fontFamily: "var(--font-head)",
            fontWeight: 400,
            fontSize: "3.5rem",
            letterSpacing: "0.08em"
          }}
        >
          MARY L.
        </motion.div>
      </div>

      {/* Grid of Pixels Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          pointerEvents: "none",
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          overflow: "hidden"
        }}
      >
        {cells.map((cell, idx) => (
          <motion.div
            key={idx}
            custom={cell}
            variants={cellVariants}
            initial="initial"
            animate="animate"
            style={{
              backgroundColor: "#1a1a27", // dark Y2K charcoal base color
              border: "0.5px solid #1a1a27", // solid color borders to avoid render seams
              transformOrigin: "center center"
            }}
          />
        ))}
      </div>
    </>
  );
}
