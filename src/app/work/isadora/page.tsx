"use client";
import GiantFooter from "@/components/GiantFooter";
import PixelMotifs from "@/components/PixelMotifs";
import LiquidImage from "@/components/LiquidImage";
import TextHighlight from "@/components/TextHighlight";
import { motion } from "framer-motion";
import Link from "next/link";
import FlipBook from "@/components/FlipBook";
import Nav from "@/components/Nav";
import { useT } from "@/i18n/LanguageContext";

export default function IsadoraProject() {
  const { t } = useT();

  const images = [
    "ISADORA CAPA-THUMBNAIL.webp",
    "Isadora 2.webp",
    "Isadora 3.webp",
    "Isadora 4.webp",
    "Isadora 5.webp",
    "Isadora 6.webp",
    "ISADORA8.webp",
    "ISADORA 9.webp",
    "ISADORA 10.webp"
  ];

  const verticalImages = [
    "isadora_vertical/Prancheta 1.webp",
    "isadora_vertical/Prancheta 2.webp",
    "isadora_vertical/Prancheta 3.webp",
    "isadora_vertical/Prancheta 4.webp",
    "isadora_vertical/Prancheta 5.webp",
    "isadora_vertical/Prancheta 7.webp",
    "isadora_vertical/Prancheta 9.webp",
    "isadora_vertical/Prancheta 10.webp",
    "isadora_vertical/Prancheta 11.webp"
  ];

  return (
    <>
      <PixelMotifs />
      <Nav />

      <main style={{ minHeight: "100vh", backgroundColor: "var(--surface)", paddingTop: "140px" }}>

        {/* Project Header */}
        <section style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 2rem 80px",
          display: "flex",
          flexDirection: "column",
          gap: "40px"
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/work" style={{
              display: "inline-block",
              marginBottom: "2rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: "var(--gray-600)",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "1px",
              borderBottom: "1px solid var(--gray-400)",
              paddingBottom: "4px"
            }} className="hover-trigger">
              {t("isadora_back")}
            </Link>

            <h1 style={{
              fontFamily: "var(--font-head)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              color: "var(--fg)",
              margin: "0 0 1rem",
              lineHeight: 1.1,
              fontWeight: 600
            }}>
              Press Kit 2026 - Isadora Ruppert
            </h1>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.4rem",
              color: "var(--gray-600)",
              maxWidth: "700px",
              lineHeight: 1.5
            }}>
              {t("isadora_subtitle")} <TextHighlight variant="ios" delay={0.8}>{t("isadora_highlight1")}</TextHighlight> with a <TextHighlight variant="marker" color="#FFDE59" delay={1.1}>{t("isadora_highlight2")}</TextHighlight>
            </p>
          </motion.div>

          {/* Project Meta Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              borderTop: "var(--border)",
              borderBottom: "var(--border)",
              padding: "30px 0"
            }}
          >
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-400)", marginBottom: "8px" }}>{t("isadora_meta_client")}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", fontWeight: 500, color: "var(--fg)" }}>Isadora Ruppert</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-400)", marginBottom: "8px" }}>{t("isadora_meta_role")}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", fontWeight: 500, color: "var(--fg)" }}>{t("isadora_meta_role_val")}</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-400)", marginBottom: "8px" }}>{t("isadora_meta_year")}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", fontWeight: 500, color: "var(--fg)" }}>2026</div>
            </div>
          </motion.div>
        </section>

        {/* Gallery */}
        <section style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 2rem 60px",
          display: "flex",
          flexDirection: "column",
          gap: "40px"
        }}>
          <FlipBook images={images} />
        </section>

        {/* Vertical Press Kit Gallery */}
        <section style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 2rem 120px",
          display: "flex",
          flexDirection: "column",
          gap: "40px"
        }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: "2.5rem", margin: "0 0 1rem" }}>{t("isadora_vertical_title")}</h2>
            <p style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)" }}>{t("isadora_vertical_sub")}</p>
          </div>
          <FlipBook images={verticalImages} aspectRatio="141.4%" />
        </section>
      </main>

      <div id="contact">
        <GiantFooter />
      </div>
    </>
  );
}
