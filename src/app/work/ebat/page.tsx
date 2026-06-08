"use client";
import GiantFooter from "@/components/GiantFooter";
import PixelMotifs from "@/components/PixelMotifs";
import TextHighlight from "@/components/TextHighlight";
import { motion } from "framer-motion";
import Link from "next/link";
import FlipBook from "@/components/FlipBook";

export default function EbatProject() {
  const spiwImages = [
    "ebat/flyer-1.png",
    "ebat/flyer-3.png"
  ];

  const instagramImages = [
    "ebat/modulo2.png",
    "ebat/livro.png",
    "ebat/modulo1.png"
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
            <Link href="/" style={{ 
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
              ← Voltar para a Home
            </Link>
            
            <h1 style={{ 
              fontFamily: "var(--font-head)", 
              fontSize: "clamp(2rem, 5vw, 4.5rem)", 
              color: "var(--fg)",
              margin: "0 0 1rem",
              lineHeight: 1.1,
              fontWeight: 600
            }}>
              EBAT - Escola de Arte e Tecnologia
            </h1>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.4rem",
              color: "var(--gray-600)",
              maxWidth: "800px",
              lineHeight: 1.6
            }}>
              No <TextHighlight variant="ios" delay={0.8}>São Paulo Innovation Week (SPIW)</TextHighlight>, a EBAT apresentou sua visão sobre a relação entre arte e tecnologia. O foco do evento foi mostrar na prática como o <TextHighlight variant="marker" color="#C7E9B0" delay={1.1}>design e o pensamento criativo</TextHighlight> se integram ao ecossistema de inovação, consolidando a escola como um espaço ativo para essas discussões na cidade.
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
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-400)", marginBottom: "8px" }}>Cliente</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", fontWeight: 500, color: "var(--fg)" }}>EBAT</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-400)", marginBottom: "8px" }}>Atuação</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", fontWeight: 500, color: "var(--fg)" }}>Design Gráfico, Social Media, Audiovisual</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-400)", marginBottom: "8px" }}>Ano</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", fontWeight: 500, color: "var(--fg)" }}>2026</div>
            </div>
          </motion.div>
        </section>

        {/* SPIW Section */}
        <section style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          padding: "0 2rem 100px",
          display: "flex",
          flexDirection: "column",
          gap: "80px"
        }}>
          
          <div style={{ textAlign: "center" }}>
             <h2 style={{ fontFamily: "var(--font-head)", fontSize: "2.5rem", margin: "0 0 1rem" }}>Campanha SPIW</h2>
             <p style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)", fontSize: "1.1rem" }}>Materiais produzidos para exibição e distribuição no evento.</p>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
            gap: "40px",
            alignItems: "center"
          }}>
            
            {/* Video Player com bordas arredondadas e sombra */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              style={{
                position: "relative",
                backgroundColor: "#000",
                borderRadius: "20px",
                overflow: "hidden",
                border: "2px solid #111",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
              }}
            >
              <video 
                src="/img/ebat/video-ebat.mp4" 
                controls
                autoPlay
                muted
                loop
                style={{ width: "100%", display: "block" }}
              />
            </motion.div>

            {/* Flyer Mockup - Cartão Flutuante em 3D */}
            <motion.div 
              initial={{ y: 50, opacity: 0, rotateY: -10 }}
              whileInView={{ y: 0, opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
              style={{
                perspective: "1000px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px"
              }}
            >
              <div style={{
                width: "80%",
                maxWidth: "350px",
                backgroundColor: "#fff",
                padding: "15px",
                borderRadius: "12px",
                boxShadow: "20px 20px 60px rgba(0,0,0,0.15), -5px -5px 20px rgba(255,255,255,0.8)",
                border: "1px solid rgba(0,0,0,0.05)"
              }}>
                <img 
                  src="/img/ebat/flyer-1.png" 
                  alt="Flyer SPIW" 
                  style={{ width: "100%", display: "block", borderRadius: "4px" }} 
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Instagram Carousel Mockup Section */}
        <section style={{ 
          maxWidth: "800px", 
          margin: "0 auto", 
          padding: "0 2rem 120px",
          display: "flex",
          flexDirection: "column",
          gap: "40px"
        }}>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: "2.5rem", margin: "0 0 1rem" }}>Redes Sociais</h2>
            <p style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)", fontSize: "1.1rem" }}>Carrossel promocional para o Módulo 2 de Computação Criativa.</p>
          </div>

          <motion.div
             initial={{ y: 50, opacity: 0 }}
             whileInView={{ y: 0, opacity: 1 }}
             viewport={{ once: true }}
             style={{
               backgroundColor: "#fff",
               border: "1px solid #dbdbdb",
               borderRadius: "8px",
               overflow: "hidden",
               boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
               maxWidth: "500px",
               margin: "0 auto"
             }}
          >
            {/* Insta Header */}
            <div style={{ display: "flex", alignItems: "center", padding: "14px", borderBottom: "1px solid #efefef" }}>
               <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", padding: "2px", marginRight: "10px" }}>
                  <div style={{ width: "100%", height: "100%", backgroundColor: "#fff", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid #fff" }}>
                     <span style={{ fontSize: "10px", fontWeight: "bold", fontFamily: "sans-serif" }}>EB</span>
                  </div>
               </div>
               <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9rem", color: "#262626" }}>ebat_escola</span>
               <span style={{ marginLeft: "auto", fontWeight: "bold", letterSpacing: "2px", color: "#262626" }}>...</span>
            </div>

            {/* Insta Content (FlipBook) */}
            <div style={{ borderBottom: "1px solid #efefef" }}>
               {/* Usamos 125% para simular a proporção 4:5 do Instagram vertical */}
               <FlipBook images={instagramImages} aspectRatio="125%" />
            </div>

            {/* Insta Footer */}
            <div style={{ padding: "14px" }}>
               <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
                  <svg aria-label="Curtir" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.287-2.043-1.59-4.345-3.797-2.5-2.39-5.15-4.275-5.15-7.177A4.99 4.99 0 0 1 7.208 3.904a4.58 4.58 0 0 1 4.792 3.197 4.58 4.58 0 0 1 4.792-3.197ZM12 21.644c-.261 0-1.464-1.077-4.004-3.51-2.903-2.775-5.996-5.045-5.996-9.012A6.99 6.99 0 0 1 9.043 2.15a6.57 6.57 0 0 1 2.957 1.455 6.57 6.57 0 0 1 2.957-1.455 6.99 6.99 0 0 1 7.043 6.962c0 3.967-3.093 6.237-5.996 9.012-2.54 2.433-3.743 3.51-4.004 3.51Z"></path></svg>
                  <svg aria-label="Comentar" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  <svg aria-label="Compartilhar" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
                  <div style={{ marginLeft: "auto" }}>
                     <svg aria-label="Salvar" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinelinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
                  </div>
               </div>
               <div style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "#262626", marginBottom: "8px" }}>
                  Curtido por <strong>estudantes.ebat</strong> e <strong>outras pessoas</strong>
               </div>
               <div style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "#262626" }}>
                  <strong>ebat_escola</strong> Módulo 2 de Computação Criativa chegando com tudo! ✨ Aprenda a integrar arte e lógica de programação. Arraste para o lado e confira mais!
               </div>
            </div>
          </motion.div>

        </section>

      </main>

      <div id="contact">
        <GiantFooter />
      </div>
    </>
  );
}
