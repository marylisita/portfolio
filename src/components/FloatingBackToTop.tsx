"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingBackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past half of the viewport height
      if (window.scrollY > window.innerHeight / 2) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initialize state on mount
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={scrollToTop}
          className="hover-trigger"
          style={{
            position: "fixed",
            bottom: "40px",
            right: "40px",
            zIndex: 9999,
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "var(--fg, #111)",
            color: "var(--surface, #fff)",
            border: "1px solid rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "none",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          }}
          whileHover={{ scale: 1.05, y: -4, backgroundColor: "#000" }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
