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

// Durações (ms). Saída um pouco mais curta que a entrada para um fluxo contínuo.
const EXIT = 420;
const ENTER = 560;

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>("idle");
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const isFirstLoad = useRef(true);

  // Ao trocar de rota, roda a entrada (revela o conteúdo novo) — exceto no 1º load.
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    setStatus("entrance");
    const timer = setTimeout(() => setStatus("idle"), ENTER);
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

  // Quando a saída termina, troca a rota (o conteúdo já está invisível).
  useEffect(() => {
    if (status === "exit" && pendingHref) {
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
        router.push(pendingHref);
        setPendingHref(null);
      }, EXIT);
      return () => clearTimeout(timer);
    }
  }, [status, pendingHref, router]);

  // O wrapper persiste entre navegações, então o cross-dissolve é contínuo:
  // idle (1,1) → exit (0, 0.985) → [troca de rota] → entrance volta a (1,1).
  const isExit = status === "exit";
  const wrapperStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "var(--surface)",
    opacity: isExit ? 0 : 1,
    // IMPORTANTE: fora da transição o transform precisa ser "none" (e não "scale(1)").
    // Qualquer transform != none — e também will-change: transform — faz este wrapper
    // virar o containing block dos descendentes position:fixed, quebrando a nav,
    // o cursor de estrelinhas e o botão de voltar ao topo ao rolar a página.
    transform: isExit ? "scale(0.985)" : "none",
    transition: isExit
      ? `opacity ${EXIT}ms cubic-bezier(0.4, 0, 1, 1), transform ${EXIT}ms cubic-bezier(0.4, 0, 1, 1)`
      : `opacity ${ENTER}ms cubic-bezier(0, 0, 0.2, 1), transform ${ENTER}ms cubic-bezier(0, 0, 0.2, 1)`,
    willChange: isExit ? "opacity, transform" : "auto",
    transformOrigin: "center top",
  };

  return (
    <TransitionContext.Provider value={{ transitionTo }}>
      <div style={wrapperStyle}>{children}</div>
    </TransitionContext.Provider>
  );
}
