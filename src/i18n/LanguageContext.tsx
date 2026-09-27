"use client";
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import dictionaries, { Lang, DictKey } from "./dictionaries";

interface LanguageContextValue {
  lang: Lang;
  toggleLang: () => void;
  t: (key: DictKey) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "pt",
  toggleLang: () => {},
  t: (key) => dictionaries.pt[key],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("pt");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "en" || saved === "pt") setLang(saved);
  }, []);

  /* O <html lang> precisa acompanhar o toggle: sem isso o leitor de tela lê
     português com voz inglesa e o buscador indexa o idioma errado. O valor
     inicial vem do layout (pt-BR), então aqui só corrige a troca. */
  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "pt" ? "en" : "pt";
      localStorage.setItem("lang", next);
      return next;
    });
  }, []);

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
