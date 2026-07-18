"use client";
import { useT } from "@/i18n/LanguageContext";

export default function LangToggle() {
  const { lang, toggleLang } = useT();

  return (
    <button
      onClick={toggleLang}
      aria-label={lang === "pt" ? "Switch to English" : "Mudar para Português"}
      className="lang-toggle hover-trigger"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.7rem",
        letterSpacing: "1px",
        textTransform: "uppercase",
        padding: "5px 10px",
        border: "1px solid currentColor",
        borderRadius: "var(--r-pill, 99px)",
        background: "transparent",
        color: "inherit",
        cursor: "pointer",
        transition: "opacity 0.2s",
      }}
    >
      {lang === "pt" ? "EN" : "PT"}
    </button>
  );
}
