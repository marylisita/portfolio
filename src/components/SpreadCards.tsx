"use client";
import { motion, useScroll, useTransform } from "framer-motion";

export default function SpreadCards() {
  const { scrollY } = useScroll();

  // As soon as the page scrolls, the spread begins globally
  const leftX = useTransform(scrollY, [0, 500], [0, -360]);
  const rightX = useTransform(scrollY, [0, 500], [0, 360]);
  
  const leftRotate = useTransform(scrollY, [0, 500], [0, -6]);
  const rightRotate = useTransform(scrollY, [0, 500], [0, 6]);

  return (
    <section style={{ position: "relative", zIndex: 20, paddingTop: "2rem", paddingBottom: "8rem" }}>
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        
        <div style={{ position: "relative", width: "320px", height: "380px" }}>
          
          {/* LEFT CARD */}
          <motion.div 
            className="hero-card"
            style={{ 
              x: leftX, 
              rotate: leftRotate, 
              zIndex: 1, 
              position: "absolute", 
              inset: 0,
              boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
              opacity: 1,
              transform: "none"
            }}
          >
            <div className="hero-card__icon" style={{ backgroundColor: "#D4F0FF" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a27" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            </div>
            <h3 className="hero-card__title">UX/UI Design</h3>
            <p className="hero-card__desc">Criando interfaces digitais intuitivas que unem performance técnica e estética refinada para experiências imersivas.</p>
          </motion.div>

          {/* RIGHT CARD */}
          <motion.div 
            className="hero-card"
            style={{ 
              x: rightX, 
              rotate: rightRotate, 
              zIndex: 1, 
              position: "absolute", 
              inset: 0,
              boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
              opacity: 1,
              transform: "none"
            }}
          >
            <div className="hero-card__icon" style={{ backgroundColor: "#E6F9D2" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a27" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            </div>
            <h3 className="hero-card__title">Tecnologia Criativa</h3>
            <p className="hero-card__desc">Explorando código e arte generativa para criar soluções interativas que desafiam o design tradicional e a lógica de máquina.</p>
          </motion.div>

          {/* CENTER CARD */}
          <motion.div 
            className="hero-card"
            style={{ 
              zIndex: 3, 
              position: "absolute", 
              inset: 0,
              boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
              opacity: 1,
              transform: "none"
            }}
          >
            <div className="hero-card__icon" style={{ backgroundColor: "#FFDDEE" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a27" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </div>
            <h3 className="hero-card__title">Direção de Arte</h3>
            <p className="hero-card__desc">Desenvolvendo identidades visuais impactantes e projetos editoriais brutais com uma linguagem única e contemporânea.</p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
