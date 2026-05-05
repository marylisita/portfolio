"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FlipBook({ 
  images, 
  aspectRatio = "56.25%" 
}: { 
  images: string[],
  aspectRatio?: string
}) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextButtonClick = () => {
    if (page < images.length - 1) {
      setDirection(1);
      setPage(page + 1);
    }
  };

  const prevButtonClick = () => {
    if (page > 0) {
      setDirection(-1);
      setPage(page - 1);
    }
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* Aspect Ratio Container */}
      <div style={{ 
        position: "relative", 
        width: "100%", 
        paddingTop: aspectRatio,
        backgroundColor: "#2A181C",
        border: "var(--border)",
        overflow: "hidden"
      }}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={`/img/${images[page]}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              backgroundColor: "#2A181C"
            }}
            alt={`Slide ${page + 1}`}
          />
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "40px" }}>
        <button 
          onClick={prevButtonClick}
          disabled={page === 0}
          className="hover-trigger"
          style={{
            padding: "12px 24px",
            background: "transparent",
            color: page === 0 ? "var(--gray-400)" : "var(--fg)",
            border: `1px solid ${page === 0 ? "var(--gray-400)" : "var(--fg)"}`,
            borderRadius: "100px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            textTransform: "uppercase",
            cursor: page === 0 ? "not-allowed" : "none",
            opacity: page === 0 ? 0.5 : 1
          }}
        >
          ← Anterior
        </button>
        <div style={{ display: "flex", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "var(--gray-600)" }}>
          {page + 1} / {images.length}
        </div>
        <button 
          onClick={nextButtonClick}
          disabled={page === images.length - 1}
          className="hover-trigger"
          style={{
            padding: "12px 24px",
            background: page === images.length - 1 ? "var(--gray-400)" : "var(--fg)",
            color: "#fff",
            border: "1px solid var(--fg)",
            borderRadius: "100px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            textTransform: "uppercase",
            cursor: page === images.length - 1 ? "not-allowed" : "none",
            opacity: page === images.length - 1 ? 0.5 : 1
          }}
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}
