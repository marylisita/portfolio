"use client";
import GiantFooter from "@/components/GiantFooter";
import PixelMotifs from "@/components/PixelMotifs";
import TextHighlight from "@/components/TextHighlight";
import { motion } from "framer-motion";
import Link from "next/link";
import FlipBook from "@/components/FlipBook";

export default function EbatProject() {
  const carousel1 = Array.from({ length: 7 }).map((_, i) => `ebat/carrossel/${i + 1}.jpg`);
  const carousel2 = Array.from({ length: 4 }).map((_, i) => `ebat/carrossel 2/${i + 1}.jpg`);

  const singlePosts = [
    "ebat/post.jpg",
    "ebat/artes instagram/livro.png",
    "ebat/artes instagram/modulo1.png"
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

      <main style={{ minHeight: "100vh", paddingTop: "140px", position: "relative" }}>
        
        {/* Project Header */}
        <section style={{ 
          maxWidth: "1000px", 
          margin: "0 auto", 
          padding: "40px 2rem 80px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          position: "relative",
          zIndex: 10
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
              A EBAT (Escola Brasileira de Arte e Tecnologia) é uma escola laboratório 100% gratuita de arte, inovação e tecnologia voltada para quem deseja se posicionar na nova economia criativa. Atuei diretamente como designer da escola, ajudando a traduzir o <TextHighlight variant="marker" color="#C7E9B0" delay={0.8}>pensamento criativo</TextHighlight> para a identidade visual de campanhas, módulos de ensino e redes sociais.
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

        {/* SPIW Section - Mockups */}
        <section style={{ 
          maxWidth: "1400px", 
          margin: "0 auto", 
          padding: "0 2rem 100px",
          display: "flex",
          flexDirection: "column",
          gap: "60px",
          position: "relative",
          zIndex: 10
        }}>
          
          <div style={{ textAlign: "center" }}>
             <h2 style={{ fontFamily: "var(--font-head)", fontSize: "2.5rem", margin: "0 0 1rem" }}>Campanha SPIW</h2>
             <p style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)", fontSize: "1.1rem", maxWidth: "800px", margin: "0 auto" }}>No São Paulo Innovation Week (SPIW), a EBAT apresentou sua visão sobre a relação entre arte e tecnologia. O foco do evento foi mostrar na prática como o design e o pensamento criativo se integram ao ecossistema de inovação, consolidando a escola como um espaço ativo para essas discussões na cidade.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {/* Mockups Side by Side */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr", 
              gap: "20px",
              alignItems: "center"
            }}>
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", backgroundColor: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)" }}
              >
                 <img src="/img/ebat/mockup outer.png" alt="Flyer Outer Mockup" style={{ width: "100%", display: "block" }} />
              </motion.div>
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", backgroundColor: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)" }}
              >
                 <img src="/img/ebat/mockup inner.png" alt="Flyer Inner Mockup" style={{ width: "100%", display: "block" }} />
              </motion.div>
            </div>

            {/* Original Arts Side by Side */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr", 
              gap: "20px",
              alignItems: "center"
            }}>
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", backgroundColor: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)" }}
              >
                 <img src="/img/ebat/Outer Page.png" alt="Outer Page" style={{ width: "100%", display: "block" }} />
              </motion.div>
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", backgroundColor: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)" }}
              >
                 <img src="/img/ebat/Inner Page.png" alt="Inner Page" style={{ width: "100%", display: "block" }} />
              </motion.div>
            </div>

            {/* Video Grande */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              style={{ width: "100%", backgroundColor: "#000", borderRadius: "16px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", border: "2px solid #111" }}
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
          </div>
        </section>

        {/* Social Media Section */}
        <section style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          padding: "0 2rem 120px",
          display: "flex",
          flexDirection: "column",
          gap: "80px"
        }}>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: "2.5rem", margin: "0 0 2rem" }}>Redes Sociais</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", width: "100%" }}>
            
            {/* Carousel 1 */}
            <motion.div
               initial={{ y: 50, opacity: 0 }}
               whileInView={{ y: 0, opacity: 1 }}
               viewport={{ once: true }}
               style={{
                 backgroundColor: "#fff",
                 border: "1px solid #dbdbdb",
                 borderRadius: "8px",
                 overflow: "hidden",
                 boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
               }}
            >
              <div style={{ display: "flex", alignItems: "center", padding: "14px", borderBottom: "1px solid #efefef" }}>
                 <img src="/img/ebat/logo.png" alt="EBAT Logo" style={{ width: "32px", height: "32px", borderRadius: "50%", marginRight: "10px", border: "1px solid #efefef", objectFit: "cover" }} />
                 <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9rem", color: "#262626" }}>ebat.escola</span>
                 <span style={{ marginLeft: "auto", fontWeight: "bold", letterSpacing: "2px", color: "#262626" }}>...</span>
              </div>
              <div style={{ borderBottom: "1px solid #efefef" }}>
                 <FlipBook images={carousel1} aspectRatio="125%" />
              </div>
              <div style={{ padding: "14px" }}>
                 <div style={{ display: "flex", gap: "16px" }}>
                    <svg aria-label="Curtir" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.287-2.043-1.59-4.345-3.797-2.5-2.39-5.15-4.275-5.15-7.177A4.99 4.99 0 0 1 7.208 3.904a4.58 4.58 0 0 1 4.792 3.197 4.58 4.58 0 0 1 4.792-3.197ZM12 21.644c-.261 0-1.464-1.077-4.004-3.51-2.903-2.775-5.996-5.045-5.996-9.012A6.99 6.99 0 0 1 9.043 2.15a6.57 6.57 0 0 1 2.957 1.455 6.57 6.57 0 0 1 2.957-1.455 6.99 6.99 0 0 1 7.043 6.962c0 3.967-3.093 6.237-5.996 9.012-2.54 2.433-3.743 3.51-4.004 3.51Z"></path></svg>
                    <svg aria-label="Comentar" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    <div style={{ marginLeft: "auto" }}>
                       <svg aria-label="Salvar" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
                    </div>
                 </div>
              </div>
            </motion.div>

            {/* Carousel 2 */}
            <motion.div
               initial={{ y: 50, opacity: 0 }}
               whileInView={{ y: 0, opacity: 1 }}
               viewport={{ once: true }}
               style={{
                 backgroundColor: "#fff",
                 border: "1px solid #dbdbdb",
                 borderRadius: "8px",
                 overflow: "hidden",
                 boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
               }}
            >
              <div style={{ display: "flex", alignItems: "center", padding: "14px", borderBottom: "1px solid #efefef" }}>
                 <img src="/img/ebat/logo.png" alt="EBAT Logo" style={{ width: "32px", height: "32px", borderRadius: "50%", marginRight: "10px", border: "1px solid #efefef", objectFit: "cover" }} />
                 <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9rem", color: "#262626" }}>ebat.escola</span>
                 <span style={{ marginLeft: "auto", fontWeight: "bold", letterSpacing: "2px", color: "#262626" }}>...</span>
              </div>
              <div style={{ borderBottom: "1px solid #efefef" }}>
                 <FlipBook images={carousel2} aspectRatio="125%" />
              </div>
              <div style={{ padding: "14px" }}>
                 <div style={{ display: "flex", gap: "16px" }}>
                    <svg aria-label="Curtir" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.287-2.043-1.59-4.345-3.797-2.5-2.39-5.15-4.275-5.15-7.177A4.99 4.99 0 0 1 7.208 3.904a4.58 4.58 0 0 1 4.792 3.197 4.58 4.58 0 0 1 4.792-3.197ZM12 21.644c-.261 0-1.464-1.077-4.004-3.51-2.903-2.775-5.996-5.045-5.996-9.012A6.99 6.99 0 0 1 9.043 2.15a6.57 6.57 0 0 1 2.957 1.455 6.57 6.57 0 0 1 2.957-1.455 6.99 6.99 0 0 1 7.043 6.962c0 3.967-3.093 6.237-5.996 9.012-2.54 2.433-3.743 3.51-4.004 3.51Z"></path></svg>
                    <svg aria-label="Comentar" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    <div style={{ marginLeft: "auto" }}>
                       <svg aria-label="Salvar" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
                    </div>
                 </div>
              </div>
            </motion.div>

          </div>

          {/* Grid of Single Posts */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "20px", 
            marginTop: "60px" 
          }}>
            {singlePosts.map((imgSrc, index) => (
               <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #dbdbdb",
                    borderRadius: "8px",
                    overflow: "hidden"
                  }}
               >
                 <img src={`/img/${imgSrc}`} alt="Post" style={{ width: "100%", display: "block" }} />
               </motion.div>
            ))}
          </div>

        </section>

      </main>

      <div id="contact">
        <GiantFooter />
      </div>
    </>
  );
}
