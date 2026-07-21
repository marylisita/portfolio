"use client";

import React, { createContext, useCallback, useContext, useState, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

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

type Status = "idle" | "entrance" | "exit";

// Fade curta, como a troca rápida entre duas páginas de uma revista.
// Mirrors --duration-slow: swap routes only after the paper covers the page.
const EXIT = 500;
const ENTER = 500;

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const isFirstLoad = useRef(true);
  const exitDuration = reduceMotion ? 0 : EXIT;
  const enterDuration = reduceMotion ? 0 : ENTER;

  // Ao trocar de rota, roda a entrada (revela o conteúdo novo) — exceto no 1º load.
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    setStatus("entrance");
    const timer = setTimeout(() => setStatus("idle"), enterDuration);
    return () => clearTimeout(timer);
  }, [pathname, enterDuration]);

  const transitionTo = useCallback((href: string) => {
    if (status === "exit" || href === pathname) return;
    setPendingHref(href);
    setStatus("exit");
  }, [pathname, status]);

  // Intercepta cliques internos globalmente.
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignora links não-roteáveis: externos, âncoras, arquivos, nova aba.
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
  }, [transitionTo]);

  // Quando a saída termina, troca a rota (o conteúdo já está invisível).
  useEffect(() => {
    if (status === "exit" && pendingHref) {
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
        router.push(pendingHref);
        setPendingHref(null);
      }, exitDuration);
      return () => clearTimeout(timer);
    }
  }, [status, pendingHref, router, exitDuration]);

  // O wrapper persiste entre navegações, então o cross-dissolve é contínuo.
  const isExit = status === "exit";
  const isMoving = status !== "idle";
  const wrapperStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "var(--surface)",
  };

  const sheetStyle: React.CSSProperties = {
    position: "fixed",
    inset: "-8vh 0",
    zIndex: 980,
    pointerEvents: "none",
    backgroundColor: "var(--site-paper)",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='sheet'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.78' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23sheet)' opacity='.13'/%3E%3C/svg%3E\"), repeating-linear-gradient(0deg, transparent 0 17px, rgba(28,27,24,.025) 17px 18px), radial-gradient(circle at 18% 12%, rgba(255,255,255,.42), transparent 48%)",
    backgroundSize: "180px 180px, 100% 18px, 100% 100%",
    backgroundBlendMode: "multiply, multiply, normal",
    clipPath: "polygon(0 2%, 3% 1.2%, 7% 2.5%, 12% 1%, 18% 2.2%, 24% 1.1%, 31% 2.4%, 39% 1.3%, 47% 2.3%, 55% 1%, 63% 2.5%, 72% 1.2%, 81% 2.2%, 90% 1%, 96% 2.4%, 100% 1.4%, 100% 98%, 96% 99.1%, 91% 97.7%, 84% 99%, 77% 97.8%, 69% 99.2%, 61% 97.6%, 53% 99%, 44% 97.7%, 36% 99.1%, 28% 97.8%, 20% 99.2%, 13% 97.7%, 6% 99%, 0 98%)",
    opacity: reduceMotion || !isMoving ? 0 : 0.99,
    transform: status === "exit"
      ? "translate3d(0, 0, 0)"
      : status === "entrance"
        ? "translate3d(0, 115%, 0)"
        : "translate3d(0, -115%, 0)",
    filter: "drop-shadow(0 14px 16px rgba(28,27,24,.16))",
    transition: reduceMotion || status === "idle"
      ? "none"
      : `transform var(--duration-slow) ${isExit ? "var(--ease-out)" : "var(--ease-default)"}, opacity var(--duration-fast) var(--ease-default)`,
    willChange: isMoving ? "transform" : "auto",
  };

  return (
    <TransitionContext.Provider value={{ transitionTo }}>
      <div aria-hidden="true" data-page-transition-sheet style={sheetStyle} />
      <div style={wrapperStyle}>{children}</div>
    </TransitionContext.Provider>
  );
}
