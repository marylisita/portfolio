"use client";
import AnimatedButton from "@/components/AnimatedButton";
import LiquidImage from "@/components/LiquidImage";
import GiantFooter from "@/components/GiantFooter";
import PixelMotifs from "@/components/PixelMotifs";

export default function Work() {
  return (
    <>
      <PixelMotifs />
      
      {/* Shared Nav */}
      <nav className="nav">
        <div className="nav__inner">
          <a href="/" className="nav__logo" style={{ textDecoration: "none", color: "var(--fg)" }}>MARY L.</a>
          <ul className="nav__links">
            <li><a href="/work" className="hover-trigger">Trabalhos</a></li>
            <li><a href="/experiments" className="hover-trigger">Experimentos</a></li>
          </ul>
          <a href="#contact" className="nav__cta hover-trigger">Fale Comigo</a>
        </div>
      </nav>

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
            Trabalhos Selecionados
          </h1>
          <p style={{ 
            fontFamily: "var(--font-body)", 
            fontSize: "1.2rem", 
            color: "var(--gray-600)", 
            maxWidth: "600px", 
            margin: "0 auto",
            lineHeight: 1.6
          }}>
            Explore alguns dos meus projetos recentes, onde uno design sistemático, direção de arte e estética experimental para criar narrativas digitais únicas.
          </p>
        </section>

        {/* Projects List - Overlapping the blue header */}
        <section style={{ 
          padding: "0 2rem", 
          maxWidth: "1200px", 
          margin: "0 auto",
          marginTop: "-80px", // Pull up over the blue background
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          paddingBottom: "120px",
          position: "relative",
          zIndex: 10
        }}>
          
          {/* Project Card: Isadora Ruppert (Brutalist Theme) */}
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
                Direção de Arte, Design Editorial
              </div>
              <p style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)", lineHeight: 1.6, marginBottom: "2rem" }}>
                Um press kit digital com estética brutalista de alto padrão para a atriz Isadora Ruppert. Apresenta visuais de papel rasgado, cores vintage de Hollywood e colagens editoriais marcantes.
              </p>
              <AnimatedButton href="/work/isadora" variant="outline">Ver Projeto</AnimatedButton>
            </div>
            <div style={{ padding: "40px", backgroundColor: "#D8C3A5", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--r-lg)", border: "1px solid #111" }}>
              <div style={{ position: "relative", width: "100%", border: "1px solid #111", backgroundColor: "#fff", boxShadow: "0 15px 35px rgba(0,0,0,0.15)" }}>
                <LiquidImage src="/img/ISADORA CAPA-THUMBNAIL.webp" alt="Isadora Ruppert" fill={false} />
              </div>
            </div>
          </div>

          {/* Project Card: Magazine Layout */}
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
                HELVETICA:<br/>A Fonte da Discórdia
              </h2>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-600)", marginBottom: "2rem" }}>
                Editorial, Grunge, Tipografia
              </div>
              <p style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)", lineHeight: 1.6, marginBottom: "2rem" }}>
                Um projeto editorial que opõe a neutralidade da Helvetica ao caos do estilo grunge (David Carson), quebrando as regras de grid.
              </p>
              <AnimatedButton href="/work/magazine" variant="outline">Ver Projeto</AnimatedButton>
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
                Tecnologia Criativa, Pesquisa, IA
              </div>
              <p style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)", lineHeight: 1.6, marginBottom: "2rem" }}>
                Um laboratório de pesquisa focado na intersecção entre arte generativa e tecnologia. Análises críticas de algoritmos e estética digital.
              </p>
              <AnimatedButton href="/work/genlab" variant="outline">Ver Projeto</AnimatedButton>
            </div>
            <div style={{ padding: "40px", backgroundColor: "#FFDDEE", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--r-lg)", border: "1px solid #111" }}>
              <div style={{ position: "relative", width: "100%", border: "1px solid #111", backgroundColor: "#fff", boxShadow: "0 15px 35px rgba(0,0,0,0.15)" }}>
                <LiquidImage src="/img/genlab.png" alt="GenLab Project" fill={false} />
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
