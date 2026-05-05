"use client";
import GiantFooter from "@/components/GiantFooter";
import Cursor from "@/components/Cursor";
import PixelMotifs from "@/components/PixelMotifs";
import LiquidImage from "@/components/LiquidImage";
import TextHighlight from "@/components/TextHighlight";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MagazineProject() {
  const images = [
    "1.png",
    "2.png",
    "3.png",
    "4.png",
    "5.png",
    "6.png",
    "7.png",
    "8.png",
    "9.jpg",
    "10.jpg"
  ];

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

      {/* Grunge Background */}
      <main style={{ 
        minHeight: "100vh", 
        backgroundColor: "#EAEAEA",
        paddingTop: "140px" 
      }}>
        
        {/* Project Header - Grunge vs Grid */}
        <section style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          padding: "40px 2rem 100px",
          position: "relative"
        }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/work" style={{ 
              display: "inline-block", 
              marginBottom: "4rem", 
              fontFamily: "var(--font-mono)", 
              fontSize: "0.8rem", 
              color: "var(--gray-600)",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "2px",
              borderBottom: "1px solid var(--gray-400)",
              paddingBottom: "4px"
            }} className="hover-trigger">
              ← Voltar para Trabalhos
            </Link>
          </motion.div>
            
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "80px", alignItems: "start" }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <h1 style={{ 
                fontFamily: "var(--font-head)", 
                fontSize: "clamp(3.5rem, 8vw, 7rem)", 
                color: "#111",
                margin: "0",
                lineHeight: 0.9,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                textTransform: "uppercase"
              }}>
                HELVETICA
              </h1>
              <motion.div 
                initial={{ rotate: -5, scale: 0.9, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                style={{
                  display: "inline-block",
                  backgroundColor: "#FF3300", // Aggressive grunge accent
                  color: "#FFF",
                  padding: "5px 15px",
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase",
                  fontSize: "1rem",
                  fontWeight: 700,
                  transform: "rotate(-3deg) translateY(-10px)",
                  boxShadow: "4px 4px 0 #000"
                }}
              >
                A fonte da discórdia
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              style={{
                borderLeft: "4px solid #111",
                paddingLeft: "30px",
                position: "relative"
              }}
            >
              {/* Decorative overlapping text (Carson style) */}
              <div style={{
                position: "absolute",
                top: "-40px",
                right: "-20px",
                fontFamily: "var(--font-head)",
                fontSize: "8rem",
                color: "rgba(0,0,0,0.03)",
                lineHeight: 0.8,
                pointerEvents: "none",
                userSelect: "none"
              }}>
                NEUTRA.
              </div>

              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.1rem",
                color: "#333",
                lineHeight: 1.8,
                fontWeight: 500,
                marginBottom: "20px",
                position: "relative",
                zIndex: 2
              }}>
                Conhecida por sua clareza e neutralidade absoluta, a Helvetica foi <TextHighlight variant="ios" delay={0.8}>projetada para ser invisível</TextHighlight> — uma tipografia puramente funcional e desprovida de significados ocultos. Não é à toa que se tornou o padrão ouro para a publicidade global e a leitura de textos corridos.
              </p>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                color: "var(--gray-600)",
                lineHeight: 1.7,
                marginBottom: "20px",
                position: "relative",
                zIndex: 2
              }}>
                Buscando inspiração na estética pós-moderna, no movimento grunge e na genialidade subversiva de David Carson, este projeto editorial nasce como um <TextHighlight variant="marker" color="#FFD1EA" delay={1.1}>manifesto contra a previsibilidade.</TextHighlight> O estilo grunge se rebela ativamente contra a rigidez suíça: destrói terminações perfeitas, ignora pesos monótonos e ataca a suposta "falta de personalidade" da fonte mais famosa do mundo.
              </p>
              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                color: "#111",
                lineHeight: 1.6,
                padding: "20px",
                backgroundColor: "rgba(0,0,0,0.05)",
                border: "1px dashed #666",
                position: "relative",
                zIndex: 2
              }}>
                O desafio no design desta revista foi encontrar o atrito perfeito entre o caos do grunge e a precisão da Helvetica. Esse contraste conceitual traduz visualmente o embate central discutido tanto no lendário documentário da fonte quanto na entrevista desconstruída neste layout.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Magazine Spreads - Grunge / Asymmetrical Layout */}
        <section style={{ 
          maxWidth: "1400px", 
          margin: "0 auto", 
          padding: "0 2rem 120px",
          display: "flex",
          flexDirection: "column",
          gap: "120px",
          position: "relative"
        }}>
          
          {/* Cover Spread */}
          <div style={{ position: "relative" }}>
            <motion.div 
              initial={{ opacity: 0, rotate: -2, y: 40 }}
              whileInView={{ opacity: 1, rotate: 0, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, type: "spring", stiffness: 50 }}
              style={{ 
                width: "80%",
                border: "1px solid #111", 
                backgroundColor: "#fff",
                boxShadow: "30px 30px 0px rgba(0,0,0,0.1)",
                margin: "0 auto",
                display: "flex"
              }}
            >
              <LiquidImage src={`/img/helvetica/1.png`} alt="Cover Spread" fill={false} />
            </motion.div>
            
            {/* Floating typography element */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{
                position: "absolute",
                top: "20%",
                right: "5%",
                fontFamily: "var(--font-body)",
                fontSize: "4rem",
                fontWeight: 800,
                color: "transparent",
                WebkitTextStroke: "2px #111",
                transform: "rotate(90deg)",
                transformOrigin: "right bottom",
                mixBlendMode: "difference",
                pointerEvents: "none"
              }}
            >
              DAVID CARSON
            </motion.div>
          </div>

          {/* Staggered Pages 2 & 3 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", position: "relative" }}>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ 
                border: "1px solid #111", 
                backgroundColor: "#fff",
                boxShadow: "-15px 15px 0px #FF3300",
                display: "flex",
                transform: "rotate(-1deg)"
              }}
            >
              <LiquidImage src={`/img/helvetica/2.png`} alt="Spread 2" fill={false} />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ 
                border: "1px solid #111", 
                backgroundColor: "#fff",
                boxShadow: "15px 15px 0px #111",
                display: "flex",
                marginTop: "100px",
                transform: "rotate(2deg)"
              }}
            >
              <LiquidImage src={`/img/helvetica/3.png`} alt="Spread 3" fill={false} />
            </motion.div>
          </div>

          {/* Full Width Impact (4) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, filter: "grayscale(100%)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "grayscale(0%)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            style={{ 
                width: "100%", 
                border: "1px solid #111", 
                backgroundColor: "#fff",
                display: "flex"
            }}
          >
            <LiquidImage src={`/img/helvetica/4.png`} alt="Spread 4" fill={false} />
          </motion.div>

          {/* Collage Gallery (5, 6, 7) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {images.slice(4, 7).map((img, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 50, rotate: i % 2 === 0 ? -3 : 3 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                    style={{ 
                        border: "1px solid #111", 
                        backgroundColor: "#fff",
                        display: "flex",
                        boxShadow: "8px 8px 0px rgba(0,0,0,0.15)"
                    }}
                >
                    <LiquidImage src={`/img/helvetica/${img}`} alt={`Spread ${i+5}`} fill={false} />
                </motion.div>
            ))}
          </div>

          {/* Final Spreads (8, 9, 10) - Messy stack */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            marginTop: "60px",
            position: "relative"
          }}>
            {/* Removed title */}

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "100px", width: "100%" }}>
              <motion.div
                initial={{ opacity: 0, x: -100, rotate: -10 }}
                whileInView={{ opacity: 1, x: 0, rotate: -4 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                style={{
                  width: "80%",
                  maxWidth: "900px",
                  border: "1px solid #111",
                  backgroundColor: "#fff",
                  display: "flex",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                }}
              >
                <LiquidImage src={`/img/helvetica/8.png`} alt="Spread 8" fill={false} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{
                  width: "85%",
                  maxWidth: "1000px",
                  border: "1px solid #111",
                  backgroundColor: "#fff",
                  display: "flex",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                }}
              >
                <LiquidImage src={`/img/helvetica/9.jpg`} alt="Spread 9" fill={false} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 100, rotate: 10 }}
                whileInView={{ opacity: 1, x: 0, rotate: 5 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
                style={{
                  width: "75%",
                  maxWidth: "800px",
                  border: "1px solid #111",
                  backgroundColor: "#fff",
                  display: "flex",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                }}
              >
                <LiquidImage src={`/img/helvetica/10.jpg`} alt="Spread 10" fill={false} />
              </motion.div>
            </div>
          </div>

        </section>
      </main>

      <div id="contact">
        <GiantFooter />
      </div>
    </>
  );
}
