"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface TransitionContextProps {
  transitionTo: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextProps>({
  transitionTo: () => {},
});

export const usePageTransition = () => useContext(TransitionContext);

export default function Curtains() {
  // Keeping a default export placeholder to prevent any broken imports in other files
  return null;
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"idle" | "entrance" | "exit">("entrance");
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // When the pathname changes, start the entrance (reveal) animation
  useEffect(() => {
    setStatus("entrance");
    
    // Switch to idle after the entrance transition finishes (500ms duration + buffer)
    const timer = setTimeout(() => {
      setStatus("idle");
    }, 700);

    return () => clearTimeout(timer);
  }, [pathname]);

  const transitionTo = (href: string) => {
    if (status === "exit") return; // Prevent duplicate transition triggers
    setPendingHref(href);
    setStatus("exit");
  };

  // Intercept all internal page clicks globally
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Filter out non-routing links: external, anchors/hashes, files, new tabs
      if (
        href.startsWith("/") &&
        !href.startsWith("/#") &&
        !href.includes("#") &&
        !href.includes(".") &&
        anchor.target !== "_blank" &&
        !e.metaKey &&
        !e.ctrlKey &&
        e.button === 0
      ) {
        e.preventDefault();
        transitionTo(href);
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, [status]);

  // When the exit (pixelation/fade-out) finishes, execute the Next.js router change
  useEffect(() => {
    if (status === "exit" && pendingHref) {
      const timer = setTimeout(() => {
        router.push(pendingHref);
        setPendingHref(null);
      }, 550); // Matches the 500ms transition duration + brief buffer
      
      return () => clearTimeout(timer);
    }
  }, [status, pendingHref, router]);

  return (
    <TransitionContext.Provider value={{ transitionTo }}>
      {/* 1. SVG Filter Definition for the Pixelation Effect */}
      <svg style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none", visibility: "hidden" }}>
        <defs>
          <filter id="pixelate-filter" x="0%" y="0%" width="100%" height="100%">
            {/* Creates a 12x12 pixel grid block */}
            <feFlood x="0" y="0" height="12" width="12" result="flood" />
            <feComposite width="12" height="12" in="flood" result="composite" />
            <feTile in="composite" result="tiled" />
            <feComposite in="SourceGraphic" in2="tiled" operator="in" />
            {/* Smooths out color borders slightly to create a cohesive retro pixel block */}
            <feMorphology operator="dilate" radius="3" />
          </filter>
        </defs>
      </svg>

      {/* 2. Page Content Wrapper with independent SVG Pixelation and CSS Blur/Opacity */}
      <div 
        className={status !== "idle" ? "pixelated-filter-apply" : ""}
        style={{
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "var(--surface)",
        }}
      >
        <motion.div
          animate={
            status === "exit"
              ? { opacity: 0, filter: "blur(6px)" }
              : status === "entrance"
              ? { opacity: 1, filter: "blur(0px)" }
              : { opacity: 1, filter: "blur(0px)" }
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            width: "100%",
            minHeight: "100vh",
          }}
        >
          {children}
        </motion.div>
      </div>

      {/* 3. Central Logo Overlay during route transitions */}
      <div 
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100000,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatePresence>
          {status !== "idle" && (
            <motion.div
              initial={status === "exit" ? { opacity: 0, filter: "blur(8px)", scale: 0.95 } : { opacity: 1, filter: "blur(0px)", scale: 1 }}
              animate={status === "exit" ? { opacity: 1, filter: "blur(0px)", scale: 1 } : { opacity: 0, filter: "blur(8px)", scale: 1.05 }}
              exit={{ opacity: 0, filter: "blur(8px)", scale: 1.05 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={{
                color: "#ffffff",
                fontFamily: "var(--font-head)",
                fontWeight: 400,
                fontSize: "3.5rem",
                letterSpacing: "0.08em",
                textShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
              }}
            >
              MARY L.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CSS styling for the filter class */}
      <style jsx global>{`
        .pixelated-filter-apply {
          filter: url(#pixelate-filter);
        }
      `}</style>
    </TransitionContext.Provider>
  );
}
