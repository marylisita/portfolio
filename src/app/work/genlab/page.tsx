"use client";
import PixelMotifs from "@/components/PixelMotifs";
import LiquidImage from "@/components/LiquidImage";
import TextHighlight from "@/components/TextHighlight";
import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedButton from "@/components/AnimatedButton";
import Nav from "@/components/Nav";
import { useT } from "@/i18n/LanguageContext";

export default function GenLabProject() {
  const { t } = useT();

  return (
    <>
      <Nav />

      <main style={{ backgroundColor: "#FFF0F6", color: "var(--fg)", minHeight: "100vh" }}>
        <PixelMotifs />

        {/* Project Hero */}
        <section className="wrap" style={{ paddingTop: "160px", paddingBottom: "100px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.9rem", color: "#FF4D94", marginBottom: "1rem" }}>
              {t("genlab_subtitle")}
            </div>
            <h1 style={{
              fontFamily: "var(--font-head)",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              color: "var(--fg)",
              margin: "0 0 1.5rem",
              lineHeight: 1,
              fontWeight: 600
            }}>
              {t("genlab_title").split("\n").map((line, i) => i === 0 ? <span key={i}>{line}<br /></span> : <span key={i}>{line}</span>)}
            </h1>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.4rem",
              color: "var(--gray-600)",
              maxWidth: "800px",
              lineHeight: 1.5
            }}>
              {t("genlab_desc")} <TextHighlight variant="ios" delay={0.8}>{t("genlab_highlight1")}</TextHighlight> {t("genlab_desc2")} <TextHighlight variant="marker" color="rgba(255, 77, 148, 0.2)" delay={1.1}>{t("genlab_highlight2")}</TextHighlight>
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
              borderTop: "1px solid rgba(26,26,39,0.1)",
              borderBottom: "1px solid rgba(26,26,39,0.1)",
              padding: "40px 0",
              marginTop: "80px"
            }}
          >
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-400)", marginBottom: "8px" }}>{t("genlab_meta_platform")}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", fontWeight: 500, color: "var(--fg)" }}>{t("genlab_meta_platform_val")}</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-400)", marginBottom: "8px" }}>{t("genlab_meta_services")}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", fontWeight: 500, color: "var(--fg)" }}>{t("genlab_meta_services_val")}</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-400)", marginBottom: "8px" }}>{t("genlab_meta_status")}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", fontWeight: 500, color: "var(--fg)" }}>{t("genlab_meta_status_val")}</div>
            </div>
          </motion.div>
        </section>

        {/* Feature Section */}
        <section className="wrap" style={{ paddingBottom: "120px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "60px", alignItems: "center" }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 style={{ fontFamily: "var(--font-head)", fontSize: "2.5rem", marginBottom: "2rem" }}>{t("genlab_feature_title")}</h2>
              <p style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)", fontSize: "1.1rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                {t("genlab_feature_p1")}
              </p>
              <p style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)", fontSize: "1.1rem", lineHeight: 1.8 }}>
                {t("genlab_feature_p2")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              style={{ border: "1px solid rgba(26,26,39,0.1)", background: "#fff", overflow: "hidden", borderRadius: "12px" }}
            >
              <LiquidImage src="/img/genlab.png" alt="GenLab Experimental" />
            </motion.div>
          </div>
        </section>

        <section className="wrap" style={{ padding: "120px 0", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-head)", fontSize: "3rem", marginBottom: "2rem" }}>{t("genlab_visit")}</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <AnimatedButton href="https://marylisita.github.io/genlabdesign/index.html" variant="primary">
              {t("genlab_access")}
            </AnimatedButton>
            <AnimatedButton href="/work" variant="outline">
              {t("genlab_back")}
            </AnimatedButton>
          </div>
        </section>
      </main>
    </>
  );
}
