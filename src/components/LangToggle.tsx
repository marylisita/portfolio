"use client";
import { useT } from "@/i18n/LanguageContext";

/* O botao era o unico controle do header sem foco proprio: caia no
   "outline: auto" do navegador, que o Chrome pinta com o azul do sistema --
   destoando de todo o resto, que usa 2px solidos na tinta. Estilo inline nao
   expressa :focus-visible, entao a regra vive aqui. */
const styles = `
  .lang-toggle:focus-visible {
    outline: 2px solid var(--ink, #1C1B18);
    outline-offset: 3px;
  }
`;

export default function LangToggle() {
  const { lang, toggleLang } = useT();

  return (
    <>
    <style>{styles}</style>
    <button
      onClick={toggleLang}
      aria-label={lang === "pt" ? "Switch to English" : "Mudar para Português"}
      className="lang-toggle hover-trigger"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--type-micro)",
        letterSpacing: "1px",
        textTransform: "uppercase",
        minWidth: "var(--tap-min)",
        minHeight: "var(--tap-min)",
        display: "inline-grid",
        placeItems: "center",
        padding: ".55rem .75rem",
        border: "1px solid currentColor",
        borderRadius: "99px",
        background: "color-mix(in srgb, var(--paper) 90%, transparent)",
        boxShadow: "2px 2px 0 color-mix(in srgb, currentColor 14%, transparent)",
        color: "inherit",
        cursor: "pointer",
        transition: "opacity 0.2s, transform 0.2s, box-shadow 0.2s",
      }}
    >
      {lang === "pt" ? "EN" : "PT"}
    </button>
    </>
  );
}
