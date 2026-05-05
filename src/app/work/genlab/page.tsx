"use client";
import PixelMotifs from "@/components/PixelMotifs";
import LiquidImage from "@/components/LiquidImage";
import TextHighlight from "@/components/TextHighlight";
import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedButton from "@/components/AnimatedButton";

export default function GenLabProject() {
  return (
    <>
      <nav className="nav">
        <div className="nav__inner">
          <a href="/" className="nav__logo" style={{ textDecoration: "none", color: "inherit" }}>MARY L.</a>
          <ul className="nav__links">
            <li><a href="/work" className="hover-trigger">Trabalhos</a></li>
            <li><a href="/experiments" className="hover-trigger">Experimentos</a></li>
          </ul>
          <a href="/#contact" className="nav__cta hover-trigger">Fale Comigo</a>
        </div>
      </nav>

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
              Projeto 03 — Laboratório de Pesquisa
            </div>
            <h1 style={{ 
              fontFamily: "var(--font-head)", 
              fontSize: "clamp(2.5rem, 6vw, 5rem)", 
              color: "var(--fg)",
              margin: "0 0 1.5rem",
              lineHeight: 1,
              fontWeight: 600
            }}>
              GenLab: Ideias que moldam<br /> o mundo digital.
            </h1>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.4rem",
              color: "var(--gray-600)",
              maxWidth: "800px",
              lineHeight: 1.5
            }}>
              Laboratório experimental focado em código, <TextHighlight variant="ios" delay={0.8}>arte generativa</TextHighlight> e UI/UX imersiva. Explorando a interseção entre filosofia humana e <TextHighlight variant="marker" color="rgba(255, 77, 148, 0.2)" delay={1.1}>lógica de máquina.</TextHighlight>
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
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-400)", marginBottom: "8px" }}>Plataforma</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", fontWeight: 500, color: "var(--fg)" }}>Editorial & Laboratório</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-400)", marginBottom: "8px" }}>Serviços</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", fontWeight: 500, color: "var(--fg)" }}>Tecnologia Criativa, Pesquisa</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-400)", marginBottom: "8px" }}>Status</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", fontWeight: 500, color: "var(--fg)" }}>Pesquisa Ativa</div>
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
              <h2 style={{ fontFamily: "var(--font-head)", fontSize: "2.5rem", marginBottom: "2rem" }}>Um Laboratório de Pesquisa para Tecnologia Criativa</h2>
              <p style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)", fontSize: "1.1rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                O GenLab é um laboratório digital independente e uma plataforma editorial dedicada à análise crítica de algoritmos generativos, programação criativa e estética digital moderna.
              </p>
              <p style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)", fontSize: "1.1rem", lineHeight: 1.8 }}>
                Eu crio uma ponte entre conceitos abstratos de ciência da computação e o design centrado no humano, oferecendo análises profundas de como a lógica da máquina molda nossos ambientes físicos e online.
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
          <h2 style={{ fontFamily: "var(--font-head)", fontSize: "3rem", marginBottom: "2rem" }}>Visite o GenLab</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <AnimatedButton href="https://marylisita.github.io/genlabdesign/index.html" variant="primary">
              Acessar Site
            </AnimatedButton>
            <AnimatedButton href="/work" variant="outline">
              Voltar para Trabalhos
            </AnimatedButton>
          </div>
        </section>
      </main>
    </>
  );
}
