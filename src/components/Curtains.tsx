"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
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

// Duração do fade do desfoque (s), cada sentido.
const FADE = 0.55;

function BlurVeil({ status }: { status: Status }) {
  const [covered, setCovered] = useState(false);

  // Força o estado oposto na montagem e só no frame seguinte aplica o alvo,
  // para a transição CSS rodar de fato (cobre no exit, revela na entrada).
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
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        backgroundColor: "rgba(252, 248, 255, 0.06)",
        opacity: covered ? 1 : 0,
        transition: `opacity ${FADE}s cubic-bezier(0.4, 0, 0.2, 1)`,
        willChange: "opacity",
      }}
    />
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
    const timer = setTimeout(() => setStatus("idle"), FADE * 1000 + 200);
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

  // Quando o desfoque cobre, troca a rota.
  useEffect(() => {
    if (status === "exit" && pendingHref) {
      const timer = setTimeout(() => {
        router.push(pendingHref);
        setPendingHref(null);
      }, FADE * 1000);
      return () => clearTimeout(timer);
    }
  }, [status, pendingHref, router]);

  return (
    <TransitionContext.Provider value={{ transitionTo }}>
      <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "var(--surface)" }}>
        {children}
      </div>

      {/* Transição: desfoque suave de tela cheia */}
      <BlurVeil status={status} />
    </TransitionContext.Provider>
  );
}
