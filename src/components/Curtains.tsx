"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";
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

// Suavidade: cada bloco faz fade lento (FADE), escalonado num intervalo (STAGGER).
const FADE = 0.5; // duração do fade de cada bloco (s)
const STAGGER = 0.4; // espalhamento aleatório do início de cada bloco (s)
const TOTAL = FADE + STAGGER; // tempo até cobrir/revelar por completo (s)
const MAX_CELLS = 130; // teto de blocos (blur por célula é custoso — mantém leve)

// Grão sutil (noise) via SVG, sem cor — só textura.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function PixelGrid({ status }: { status: Status }) {
  const [grid, setGrid] = useState({ cols: 12, rows: 8 });
  const [covered, setCovered] = useState(false);

  // Grade com células ~quadradas, respeitando o teto de blocos.
  useEffect(() => {
    const calc = () => {
      const cell = Math.max(90, Math.min(150, window.innerWidth / 11));
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

  // Delays aleatórios, regenerados a cada fase para nunca repetir o padrão.
  const cells = useMemo(() => {
    const total = grid.cols * grid.rows;
    return Array.from({ length: total }, () => Math.random() * STAGGER);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, status]);

  // Força o estado oposto na montagem e só no frame seguinte aplica o alvo,
  // garantindo que a transição CSS realmente rode escalonada.
  useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;
    if (status === "exit") {
      setCovered(false);
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setCovered(true));
      });
    } else if (status === "entrance") {
      setCovered(true);
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setCovered(false));
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
      {cells.map((delay, i) => (
        <div
          key={i}
          style={{
            // Bloco transparente que apenas desfoca o conteúdo atrás (sem cor).
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            // Véu quase imperceptível só para dar corpo ao desfoque.
            backgroundColor: "rgba(252, 248, 255, 0.04)",
            // Grão sutil por cima do desfoque.
            backgroundImage: GRAIN,
            backgroundSize: "150px 150px",
            opacity: covered ? 1 : 0,
            transition: `opacity ${FADE}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
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

  // Ao trocar de rota, roda a entrada (revelar) — exceto no primeiro load.
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    setStatus("entrance");
    const timer = setTimeout(() => setStatus("idle"), TOTAL * 1000 + 200);
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
      }, TOTAL * 1000);
      return () => clearTimeout(timer);
    }
  }, [status, pendingHref, router]);

  return (
    <TransitionContext.Provider value={{ transitionTo }}>
      <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "var(--surface)" }}>
        {children}
      </div>

      {/* Transição: blocos de desfoque + grão, transparentes, sem cor */}
      <PixelGrid status={status} />
    </TransitionContext.Provider>
  );
}
