"use client";
import Hero from "@/components/Hero";
import ProcessStack from "@/components/ProcessStack";
import PixelMotifs from "@/components/PixelMotifs";
import LiquidImage from "@/components/LiquidImage";
import AnimatedButton from "@/components/AnimatedButton";
import IntroShowcase from "@/components/IntroShowcase";
import GiantFooter from "@/components/GiantFooter";
import Cursor from "@/components/Cursor";
import SpreadCards from "@/components/SpreadCards";
import CapabilitiesPop from "@/components/CapabilitiesPop";
import Tamagotchi from "@/components/Tamagotchi";
import LangToggle from "@/components/LangToggle";
import { useT } from "@/i18n/LanguageContext";

export default function Home() {
  const { t } = useT();

  return (
    <>

      <nav className="nav">
        <div className="nav__inner">
          <div className="nav__logo">MARY L.</div>
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

      <main style={{ position: "relative" }}>
        <PixelMotifs />
        <Hero />
        <SpreadCards />

        <section id="work" className="work">
          <div className="work__headline wrap">
            <h2>{t("selected_work")}</h2>
          </div>
          <div className="sticky-cards">
            <div className="sticky-card">
              <div className="sticky-card__inner" style={{ backgroundColor: "#FAF5EE", border: "var(--border)" }}>
                <div>
                  <span className="sticky-card__num" style={{ color: "var(--gray-400)" }}>01</span>
                  <h3 className="sticky-card__title" style={{ color: "var(--fg)", fontFamily: "var(--font-head)" }}>Isadora Ruppert<br />Press Kit</h3>
                  <div className="sticky-card__tags" style={{ color: "var(--gray-600)" }}>
                    <span>{t("p01_tag1")}</span>
                    <span>{t("p01_tag2")}</span>
                  </div>
                  <p className="sticky-card__desc" style={{ color: "var(--gray-600)" }}>
                    {t("p01_desc")}
                  </p>
                  <AnimatedButton href="/work/isadora" variant="outline">{t("view_project")}</AnimatedButton>
                </div>
                <div style={{ padding: "40px", backgroundColor: "#D8C3A5", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--r-lg)", border: "1px solid #111" }}>
                  <div style={{ position: "relative", width: "100%", border: "1px solid #e2def2", backgroundColor: "#fff", boxShadow: "0 15px 35px rgba(0,0,0,0.12)" }}>
                    <LiquidImage src="/img/ISADORA CAPA-THUMBNAIL.webp" alt="Isadora Ruppert" fill={false} />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky-card">
              <div className="sticky-card__inner" style={{ backgroundColor: "#F5F5F5", border: "var(--border)" }}>
                <div>
                  <span className="sticky-card__num">02</span>
                  <h3 className="sticky-card__title">{t("p02_title").split("\n").map((line, i) => i === 0 ? <span key={i}>{line}<br /></span> : <span key={i}>{line}</span>)}</h3>
                  <div className="sticky-card__tags">
                    <span>{t("p02_tag1")}</span>
                    <span>{t("p02_tag2")}</span>
                  </div>
                  <p className="sticky-card__desc">
                    {t("p02_desc")}
                  </p>
                  <AnimatedButton href="/work/magazine" variant="outline">{t("view_project")}</AnimatedButton>
                </div>
                <div style={{ padding: "40px", backgroundColor: "#EAEAEA", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--r-lg)", border: "1px solid #111" }}>
                  <div style={{ position: "relative", width: "100%", border: "1px solid #e2def2", backgroundColor: "#fff", boxShadow: "0 15px 35px rgba(0,0,0,0.12)" }}>
                    <LiquidImage src="/img/helvetica/9.jpg" alt="Helvetica Project" fill={false} />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky-card">
              <div className="sticky-card__inner" style={{ backgroundColor: "#FFF0F6", border: "var(--border)", color: "var(--fg)" }}>
                <div>
                  <span className="sticky-card__num" style={{ color: "var(--gray-400)" }}>03</span>
                  <h3 className="sticky-card__title" style={{ color: "var(--fg)", fontFamily: "var(--font-head)" }}>GenLab:<br />Research Hub</h3>
                  <div className="sticky-card__tags" style={{ color: "var(--gray-600)" }}>
                    <span>{t("p03_tag1")}</span>
                    <span>{t("p03_tag2")}</span>
                  </div>
                  <p className="sticky-card__desc" style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)" }}>
                    {t("p03_desc")}
                  </p>
                  <AnimatedButton href="/work/genlab" variant="outline">{t("view_project")}</AnimatedButton>
                </div>
                <div style={{ padding: "40px", backgroundColor: "#FFDDEE", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--r-lg)", border: "1px solid #111" }}>
                  <div style={{ position: "relative", width: "100%", border: "1px solid #e2def2", backgroundColor: "#fff", boxShadow: "0 15px 35px rgba(0,0,0,0.12)" }}>
                    <LiquidImage src="/img/genlab.png" alt="GenLab Project" fill={false} />
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky-card">
              <div className="sticky-card__inner" style={{ backgroundColor: "#F0Fdf4", border: "var(--border)", color: "var(--fg)" }}>
                <div>
                  <span className="sticky-card__num" style={{ color: "var(--gray-400)" }}>04</span>
                  <h3 className="sticky-card__title" style={{ color: "var(--fg)", fontFamily: "var(--font-head)" }}>{t("p04_title").split("\n").map((line, i) => i === 0 ? <span key={i}>{line}<br /></span> : <span key={i}>{line}</span>)}</h3>
                  <div className="sticky-card__tags" style={{ color: "var(--gray-600)" }}>
                    <span>{t("p04_tag1")}</span>
                    <span>{t("p04_tag2")}</span>
                  </div>
                  <p className="sticky-card__desc" style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)" }}>
                    {t("p04_desc")}
                  </p>
                  <AnimatedButton href="/work/ebat" variant="outline">{t("view_project")}</AnimatedButton>
                </div>
                <div style={{ padding: "40px", backgroundColor: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--r-lg)", border: "1px solid #111" }}>
                  <div style={{ position: "relative", width: "100%", border: "1px solid #e2def2", backgroundColor: "#fff", boxShadow: "0 15px 35px rgba(0,0,0,0.12)" }}>
                    <LiquidImage src="/img/ebat/manual-capa.jpg" alt="EBAT — Manual de Marca" fill={false} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div id="process">
          <ProcessStack />
        </div>

        <section id="about" className="about wrap" style={{ paddingTop: "80px", paddingBottom: "40px" }}>
          <div className="about__grid" style={{ alignItems: "center" }}>

            {/* Left: Interactive Pixel Chix Device */}
            <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 0" }}>
              <Tamagotchi />
            </div>

            {/* Right: Text and Skills */}
            <div>
              <h2 className="section-title" style={{ fontFamily: "var(--font-head)", marginBottom: "1.5rem", fontSize: "3.5rem", color: "#111" }}>{t("about_title")}</h2>
              <p className="about__text" style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", lineHeight: 1.6, color: "var(--gray-600)", marginBottom: "1.5rem" }}>
                {t("about_text")}
              </p>

              {/* Credential Badges */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "2rem" }}>
                {[
                  { label: "NANO — UFRJ", sub: t("about_nano_sub"), color: "#E0F2FE" },
                  { label: "LAID — UFRJ", sub: t("about_laid_sub"), color: "#DCFCE7" },
                ].map(c => (
                  <div key={c.label} style={{ display: "flex", flexDirection: "column", gap: "2px", background: c.color, border: "1px solid #111", borderRadius: "8px", padding: "8px 14px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "1px", color: "#555" }}>{c.sub}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", fontWeight: 600, color: "#111" }}>{c.label}</span>
                  </div>
                ))}
              </div>

              {/* Tools Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {[
                  { category: t("about_cat_visual"), tools: ["Figma", "Illustrator", "Photoshop", "After Effects"] },
                  { category: t("about_cat_web"), tools: ["Next.js / React", "TypeScript", "Wordpress", "Framer"] },
                  { category: t("about_cat_creative"), tools: ["TouchDesigner", t("about_tool_gen_ai")], full: true },
                ].map(group => (
                  <div key={group.category} style={group.full ? { gridColumn: "1 / -1" } : {}}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-400)", marginBottom: "8px" }}>{group.category}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {group.tools.map(tl => (
                        <span key={tl} style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#111", background: "#fff", border: "1px solid #ddd", borderRadius: "6px", padding: "4px 10px" }}>{tl}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        <div style={{ marginTop: "-20px" }}>
          <CapabilitiesPop />
        </div>
      </main>

      <div id="contact">
        <GiantFooter />
      </div>
    </>
  );
}
