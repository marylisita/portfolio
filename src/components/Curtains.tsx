"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";
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

type Status = "idle" | "entrance" | "exit";

// Tempo máximo de stagger dos blocos (s) — define quanto dura cobrir/revelar.
const MAX_DELAY = 0.4;
// Teto de blocos para não pesar em telas grandes.
const MAX_CELLS = 240;

function PixelGrid({ status }: { status: Status }) {
  const [grid, setGrid] = useState({ cols: 14, rows: 9 });
  const [covered, setCovered] = useState(false);

  // Calcula a grade com células ~quadradas, respeitando o teto de blocos.
  useEffect(() => {
    const calc = () => {
      const cell = Math.max(64, Math.min(120, window.innerWidth / 14));
      let cols = Math.ceil(window.innerWidth / cell);
      let rows = Math.ceil(window.innerHeight / cell);
      while (cols * rows > MAX_CELLS && cols > 4) {
        cols -= 1;
        rows = Math.ceil((cols * window.innerHeight) / window.innerWidth);
      }
      setGrid({ cols, rows });
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // Padrão de delays/cores, regenerado a cada fase para nunca repetir.
  const cells = useMemo(() => {
    const total = grid.cols * grid.rows;
    return Array.from({ length: total }, () => {
      const r = Math.random();
      return {
        delay: Math.random() * MAX_DELAY,
        color: r < 0.06 ? "var(--green)" : r < 0.14 ? "var(--lilac-deep)" : "var(--fg)",
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, status]);

  // O truque: ao entrar numa fase, força o estado oposto e só então (no frame
  // seguinte) aplica o alvo — assim a transição CSS realmente roda escalonada.
  useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;
    if (status === "exit") {
      setCovered(false); // começa descoberto…
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setCovered(true)); // …e cobre (escalonado)
      });
    } else if (status === "entrance") {
      setCovered(true); // começa coberto (herdado do exit)…
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setCovered(false)); // …e revela (escalonado)
      });
    }
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [status]);

  if (status === "idle") return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        pointerEvents: "none",
        display: "grid",
        gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
        gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
      }}
    >
      {cells.map((c, i) => (
        <div
          key={i}
          style={{
            background: c.color,
            opacity: covered ? 1 : 0,
            // 1ms = sem fade; só o delay escalona a aparição → feel de pixel.
            transition: `opacity 1ms linear ${c.delay}s`,
            willChange: "opacity",
          }}
        />
      ))}
    </div>
  );
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>("idle");
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const isFirstLoad = useRef(true);

  // Ao trocar de rota, roda a entrada (revelar) — exceto no primeiro carregamento.
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    setStatus("entrance");
    const timer = setTimeout(() => setStatus("idle"), MAX_DELAY * 1000 + 250);
    return () => clearTimeout(timer);
  }, [pathname]);

  const transitionTo = (href: string) => {
    if (status === "exit") return; // evita disparos duplicados
    setPendingHref(href);
    setStatus("exit");
  };

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
  }, [status]);

  // Quando a cobertura termina, troca a rota (tela já está coberta).
  useEffect(() => {
    if (status === "exit" && pendingHref) {
      const timer = setTimeout(() => {
        router.push(pendingHref);
        setPendingHref(null);
      }, MAX_DELAY * 1000 + 120);
      return () => clearTimeout(timer);
    }
  }, [status, pendingHref, router]);

  return (
    <TransitionContext.Provider value={{ transitionTo }}>
      <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "var(--surface)" }}>
        {children}
      </div>

      {/* Grade de pixels (transição em blocos, estilo Bodak) */}
      <PixelGrid status={status} />

      {/* Logo central durante a transição */}
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
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: status === "exit" ? 1 : 0, scale: status === "exit" ? 1 : 1.04 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: status === "exit" ? 0.2 : 0 }}
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
    </TransitionContext.Provider>
  );
}
