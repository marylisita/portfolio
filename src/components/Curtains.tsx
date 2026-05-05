"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Curtains() {
  const [isVisible, setIsVisible] = useState(true);

  // We unmount or hide it completely after the animation finishes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3500); 
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.8, ease: "easeInOut", delay: 1.2 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: "none",
        background: "rgba(252, 248, 255, 0.8)",
        backdropFilter: "blur(20px)", // Reduced blur slightly for performance
        WebkitBackdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
      }}
    >
      {/* Organic Smoke / Cloud Texture */}
      <motion.div
        initial={{ scale: 1, opacity: 0.2 }}
        animate={{ scale: 1.2, opacity: 0 }}
        transition={{ duration: 2, delay: 0.8, ease: "easeInOut" }}
        style={{
          position: "absolute", 
          inset: -200, 
          pointerEvents: "none",
          // Replaced SVG turbulence with a safe radial gradient to avoid GPU crashes
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(200, 200, 255, 0.2), transparent 70%)",
          backgroundSize: "cover", 
          mixBlendMode: "multiply"
        }} 
      />

      {/* Typography */}
      <motion.div
        initial={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        animate={{ opacity: 0, filter: "blur(12px)", scale: 1.05 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        style={{
          position: "relative",
          zIndex: 10000,
          color: "var(--fg)",
          fontFamily: "var(--font-head)",
          fontWeight: 400,
          fontSize: "3rem",
          letterSpacing: "-0.5px"
        }}
      >
        MARY L.
      </motion.div>
    </motion.div>
  );
}
