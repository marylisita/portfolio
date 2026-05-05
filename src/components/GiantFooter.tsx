"use client";
import { motion } from "framer-motion";
import AnimatedButton from "./AnimatedButton";

function SpinningBadge() {
  const text = "LET'S WORK TOGETHER • SAY HELLO • ";
  const radius = 60;
  
  return (
    <motion.div 
      className="circle-badge"
      style={{ position: "relative", width: "160px", height: "160px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
      animate={{ rotate: 360 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      whileHover={{ scale: 1.1 }}
    >
      {/* Center Icon/Dot */}
      <div style={{ width: "20px", height: "20px", background: "var(--fg)", borderRadius: "50%", position: "absolute" }} />
      
      {/* Circular Text */}
      <svg viewBox="0 0 160 160" width="160" height="160" style={{ position: "absolute", inset: 0 }}>
        <path id="circlePath" d="M 80, 80 m -60, 0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0" fill="transparent" />
        <text style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", fill: "var(--fg)" }}>
          <textPath href="#circlePath" startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>
    </motion.div>
  );
}

export default function GiantFooter() {
  return (
    <footer style={{ padding: "140px 2rem 40px", background: "#1A1A1A", borderTop: "none", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
        
        {/* Main Center Content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "2rem", marginBottom: "80px" }}>
          
          {/* Custom Chat Bubble */}
          <div style={{ display: "inline-block" }}>
            <svg width="60" height="48" viewBox="0 0 60 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="56" height="34" rx="14" fill="white" />
              <path d="M 18 35 L 12 46 L 24 35 Z" fill="white" />
              <circle cx="20" cy="19" r="3.5" fill="#FFEAA7" stroke="#1A1A1A" strokeWidth="1.5" />
              <circle cx="30" cy="19" r="3.5" fill="#FFEAA7" stroke="#1A1A1A" strokeWidth="1.5" />
              <circle cx="40" cy="19" r="3.5" fill="#FFEAA7" stroke="#1A1A1A" strokeWidth="1.5" />
            </svg>
          </div>

          <h2 style={{ 
            fontFamily: "var(--font-head)", 
            fontSize: "clamp(3rem, 6vw, 5rem)", 
            lineHeight: 1.1, 
            fontWeight: 400,
            maxWidth: "800px",
            color: "#fff",
            margin: 0
          }}>
            Vamos conversar sobre<br/>o seu projeto.
          </h2>
          
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1.2rem", color: "#A0A0A0", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
            Tem um projeto em mente? Podemos transformar essa ideia em um produto real.
          </p>

          <div style={{ position: "relative", marginTop: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
            <AnimatedButton href="mailto:lisita.medeiros@gmail.com" variant="light">
              Fale Comigo
            </AnimatedButton>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#A0A0A0", letterSpacing: "1px" }}>
              lisita.medeiros@gmail.com
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "40px 0" }} />

        {/* Bottom Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem", color: "#A0A0A0", fontSize: "0.9rem" }}>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <a href="https://www.linkedin.com/in/maria-lisita/" target="_blank" rel="noopener noreferrer" className="hover-trigger" style={{ textDecoration: "none", color: "inherit" }}>LinkedIn</a>
            <a href="https://www.behance.net/marylisita" target="_blank" rel="noopener noreferrer" className="hover-trigger" style={{ textDecoration: "none", color: "inherit" }}>Behance</a>
            <a href="/Curriculo_Maria_Isabel_Lisita.pdf" target="_blank" rel="noopener noreferrer" className="hover-trigger" style={{ textDecoration: "none", color: "inherit" }}>Currículo</a>
            <a href="https://wa.me/5521936180477" target="_blank" rel="noopener noreferrer" className="hover-trigger" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              WhatsApp
            </a>
          </div>
          
          <div>
            MARY © {new Date().getFullYear()} — Designed & Built with Next.js
          </div>
        </div>

      </div>

      <style jsx>{`
        .footer-badge-desktop { display: block; }
        @media (max-width: 768px) {
          .footer-badge-desktop { display: none; }
          .footer-badge-wrapper { display: block !important; margin-bottom: 2rem; }
        }
      `}</style>
    </footer>
  );
}
