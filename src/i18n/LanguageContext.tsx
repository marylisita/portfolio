"use client";
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import dictionaries, { Lang, DictKey } from "./dictionaries";

interface LanguageContextValue {
  lang: Lang;
  toggleLang: () => void;
  t: (key: DictKey) => string;
}

/** Rotas em /en/... são a versão em inglês indexável pelo Google. */
export function isEnPath(pathname: string | null) {
  return !!pathname && (pathname === "/en" || pathname.startsWith("/en/"));
}

/** Tira o prefixo /en: "/en/work/juizo" → "/work/juizo", "/en" → "/". */
export function stripLocale(pathname: string | null) {
  if (!pathname) return "/";
  if (!isEnPath(pathname)) return pathname;
  return pathname.slice(3) || "/";
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "pt",
  toggleLang: () => {},
  t: (key) => dictionaries.pt[key],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  /* Em /en/... o idioma vem da URL, já no HTML do servidor: é isso que deixa
     o Google ler o site em inglês. Fora delas, vale a escolha do toggle. */
  const forcedEn = isEnPath(pathname);
  const [chosen, setChosen] = useState<Lang>("pt");
  const lang: Lang = forcedEn ? "en" : chosen;

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "en" || saved === "pt") setChosen(saved);
  }, []);

  /* Quem chega por uma página /en continua em inglês ao clicar nos links
     internos (que apontam para as rotas sem prefixo). Ajuste de estado
     durante o render, não em efeito: assim não há um quadro em português. */
  if (forcedEn && chosen !== "en") setChosen("en");
  useEffect(() => {
    if (!forcedEn) return;
    try { localStorage.setItem("lang", "en"); } catch {}
  }, [forcedEn]);

  /* O <html lang> precisa acompanhar o toggle: sem isso o leitor de tela lê
     português com voz inglesa e o buscador indexa o idioma errado. O valor
     inicial vem do layout (pt-BR), então aqui só corrige a troca. */
  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
  }, [lang]);

  const toggleLang = useCallback(() => {
    if (forcedEn) {
      /* Numa rota /en, trocar para português é ir para a mesma página sem o
         prefixo; ficar na URL /en mostrando português confundiria o Google. */
      try { localStorage.setItem("lang", "pt"); } catch {}
      setChosen("pt");
      router.push(stripLocale(pathname));
      return;
    }
    setChosen((prev) => {
      const next = prev === "pt" ? "en" : "pt";
      try { localStorage.setItem("lang", next); } catch {}
      return next;
    });
  }, [forcedEn, pathname, router]);

  const t = useCallback(
    (key: DictKey) => dictionaries[lang][key],
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  return useContext(LanguageContext);
}
