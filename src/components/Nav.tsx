"use client";
import LangToggle from "./LangToggle";
import { useT } from "@/i18n/LanguageContext";

export default function Nav({ logoHref = "/" }: { logoHref?: string }) {
  const { t } = useT();

  return (
    <nav className="nav">
      <div className="nav__inner">
        <a href={logoHref} className="nav__logo" style={{ textDecoration: "none", color: "var(--fg)" }}>MARY L.</a>
        <ul className="nav__links">
          <li><a href="/work" className="hover-trigger">{t("nav_work")}</a></li>
          <li><a href="/experiments" className="hover-trigger">{t("nav_experiments")}</a></li>
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <LangToggle />
          <a href="#contact" className="nav__cta hover-trigger">{t("nav_cta")}</a>
        </div>
      </div>
    </nav>
  );
}
