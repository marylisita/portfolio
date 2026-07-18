"use client";
import AnimatedButton from "@/components/AnimatedButton";
import LiquidImage from "@/components/LiquidImage";
import GiantFooter from "@/components/GiantFooter";
import PixelMotifs from "@/components/PixelMotifs";
import Nav from "@/components/Nav";
import { useT } from "@/i18n/LanguageContext";

export default function Work() {
  const { t } = useT();

  return (
    <>
      <PixelMotifs />
      <Nav />

      <main style={{ minHeight: "100vh", backgroundColor: "var(--surface)" }}>

        {/* Top Header - Light Blue */}
        <section style={{
          backgroundColor: "#e6f0ff",
          padding: "180px 2rem 140px",
          textAlign: "center",
          borderBottom: "var(--border)"
        }}>
          <h1 style={{
            fontFamily: "var(--font-head)",
            fontSize: "clamp(3rem, 6vw, 5rem)",
            color: "var(--fg)",
            margin: "0 0 1rem"
          }}>
            {t("work_page_title")}
          </h1>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.2rem",
            color: "var(--gray-600)",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.6
          }}>
            {t("work_page_sub")}
          </p>
        </section>

        {/* Projects List */}
        <section style={{
          padding: "0 2rem",
          maxWidth: "1200px",
          margin: "0 auto",
          marginTop: "-80px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          paddingBottom: "120px",
          position: "relative",
          zIndex: 10
        }}>

          {/* Project Card: Isadora Ruppert */}
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "var(--r-xl)",
            border: "var(--border)",
            padding: "40px",
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: "60px",
            alignItems: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.02)"
          }}>
            <div>
              <h2 style={{
                fontFamily: "var(--font-head)",
                fontSize: "3rem",
                color: "#4A0E17",
                margin: "0 0 0.5rem",
                lineHeight: 1.1
              }}>
                Isadora Ruppert Press Kit
              </h2>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#C29F55",
                marginBottom: "2rem"
              }}>
                {t("work_isadora_tags")}
              </div>
              <p style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)", lineHeight: 1.6, marginBottom: "2rem" }}>
                {t("work_isadora_desc")}
              </p>
              <AnimatedButton href="/work/isadora" variant="outline">{t("view_project")}</AnimatedButton>
            </div>
            <div style={{ padding: "40px", backgroundColor: "#D8C3A5", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--r-lg)", border: "1px solid #111" }}>
              <div style={{ position: "relative", width: "100%", border: "1px solid #111", backgroundColor: "#fff", boxShadow: "0 15px 35px rgba(0,0,0,0.15)" }}>
                <LiquidImage src="/img/ISADORA CAPA-THUMBNAIL.webp" alt="Isadora Ruppert" fill={false} />
              </div>
            </div>
          </div>

          {/* Project Card: Magazine */}
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "var(--r-xl)",
            border: "var(--border)",
            padding: "40px",
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: "60px",
            alignItems: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.02)"
          }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-head)", fontSize: "3rem", color: "var(--fg)", margin: "0 0 0.5rem", lineHeight: 1.1 }}>
                {t("work_helvetica_title").split("\n").map((line, i) => i === 0 ? <span key={i}>{line}<br/></span> : <span key={i}>{line}</span>)}
              </h2>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-600)", marginBottom: "2rem" }}>
                {t("work_helvetica_tags")}
              </div>
              <p style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)", lineHeight: 1.6, marginBottom: "2rem" }}>
                {t("work_helvetica_desc")}
              </p>
              <AnimatedButton href="/work/magazine" variant="outline">{t("view_project")}</AnimatedButton>
            </div>
            <div style={{ padding: "40px", backgroundColor: "#EAEAEA", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--r-lg)", border: "1px solid #111" }}>
              <div style={{ position: "relative", width: "100%", border: "1px solid #111", backgroundColor: "#fff", boxShadow: "0 15px 35px rgba(0,0,0,0.15)" }}>
                <LiquidImage src="/img/helvetica/9.jpg" alt="Helvetica Project" fill={false} />
              </div>
            </div>
          </div>

          {/* Project Card: GenLab */}
          <div style={{
            backgroundColor: "#FFF0F6",
            borderRadius: "var(--r-xl)",
            border: "var(--border)",
            padding: "40px",
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: "60px",
            alignItems: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.02)",
            color: "var(--fg)"
          }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-head)", fontSize: "3rem", color: "var(--fg)", margin: "0 0 0.5rem", lineHeight: 1.1 }}>
                GenLab:<br/>Experimental Lab
              </h2>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-600)", marginBottom: "2rem" }}>
                {t("work_genlab_tags")}
              </div>
              <p style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)", lineHeight: 1.6, marginBottom: "2rem" }}>
                {t("work_genlab_desc")}
              </p>
              <AnimatedButton href="/work/genlab" variant="outline">{t("view_project")}</AnimatedButton>
            </div>
            <div style={{ padding: "40px", backgroundColor: "#FFDDEE", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--r-lg)", border: "1px solid #111" }}>
              <div style={{ position: "relative", width: "100%", border: "1px solid #111", backgroundColor: "#fff", boxShadow: "0 15px 35px rgba(0,0,0,0.15)" }}>
                <LiquidImage src="/img/genlab.png" alt="GenLab Project" fill={false} />
              </div>
            </div>
          </div>

          {/* Project Card: EBAT */}
          <div style={{
            backgroundColor: "#F0Fdf4",
            borderRadius: "var(--r-xl)",
            border: "var(--border)",
            padding: "40px",
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: "60px",
            alignItems: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.02)",
            color: "var(--fg)"
          }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-head)", fontSize: "3rem", color: "var(--fg)", margin: "0 0 0.5rem", lineHeight: 1.1 }}>
                {t("work_ebat_title").split("\n").map((line, i) => i === 0 ? <span key={i}>{line}<br/></span> : <span key={i}>{line}</span>)}
              </h2>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-600)", marginBottom: "2rem" }}>
                {t("work_ebat_tags")}
              </div>
              <p style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)", lineHeight: 1.6, marginBottom: "2rem" }}>
                {t("work_ebat_desc")}
              </p>
              <AnimatedButton href="/work/ebat" variant="outline">{t("view_project")}</AnimatedButton>
            </div>
            <div style={{ padding: "40px", backgroundColor: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--r-lg)", border: "1px solid #111" }}>
              <div style={{ position: "relative", width: "100%", border: "1px solid #111", backgroundColor: "#fff", boxShadow: "0 15px 35px rgba(0,0,0,0.15)" }}>
                <LiquidImage src="/img/ebat/manual-capa.jpg" alt="EBAT — Manual de Marca" fill={false} />
              </div>
            </div>
          </div>

        </section>
      </main>

      <div id="contact">
        <GiantFooter />
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          section > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
