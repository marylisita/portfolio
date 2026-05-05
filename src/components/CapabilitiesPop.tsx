"use client";
import { useEffect, useRef } from "react";

export default function CapabilitiesPop() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const tags = document.querySelectorAll(".cap-tag");
    tags.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="capabilities" style={{ border: "none" }}>
      <div className="wrap">
        <h2 className="capabilities__title" style={{ fontFamily: "var(--font-head)", textAlign: "center" }}>Minhas Capacidades</h2>
        <p className="capabilities__sub" style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", textAlign: "center", margin: "0 auto", maxWidth: "600px" }}>
          Equilibrando estética experimental e usabilidade refinada para criar marcas e experiências digitais memoráveis.
        </p>

        <div className="capabilities__tags" ref={sectionRef} style={{ padding: "30px 0 40px", maxWidth: "650px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
          {[
            { text: "Design Gráfico", color: "#FF5E5E", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10Z"/></svg> },
            { text: "Web & UI Design", color: "#3B82F6", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15 9l7-1-4 6 2 7-6-4-6 4 2-7-4-6 7 1z"/></svg> },
            { text: "Direção de Arte", color: "#F5A623", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l9 16H3L12 3z"/><path d="M7 12h10"/></svg> },
            { text: "Identidade Visual", color: "#8B5CF6", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15 9 22 9 17 14 18 21 12 17 6 21 7 14 2 9 9 9" /></svg> },
            { text: "Tecnologia Criativa", color: "#10B981", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.8 4.6a5.5 5.5 0 00-7.7 0l-1.1 1-1.1-1a5.5 5.5 0 00-7.8 7.8l1 1 7.9 7.9 7.9-7.9 1-1a5.5 5.5 0 000-7.8z" /></svg> },
            { text: "IA Generativa", color: "#EC4899", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" transform="rotate(45 12 12)"/></svg> },
            { text: "Prototipagem", color: "#14B8A6", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> }
          ].map((tag, idx) => {
            return (
              <div 
                key={idx} 
                className="cap-tag" 
                data-delay={idx}
                style={{ 
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  margin: "0",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  padding: "10px 24px",
                  background: "#fff",
                  color: "#111",
                  border: "1px solid #111",
                  borderRadius: "100px",
                  boxShadow: "none"
                }}
              >
                <span style={{ display: "flex", color: tag.color }}>{tag.icon}</span> <span>{tag.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
