"use client";
import { useEffect, useState } from "react";

export default function CapabilitiesPop() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

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

  const tagsData = [
    { 
      text: "Design Gráfico", 
      color: "#FF2A85", 
      hoverBg: "#ffd3e8",
      icon: (
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
          <rect x="7" y="1" width="2" height="2" />
          <rect x="7" y="3" width="2" height="2" />
          <rect x="5" y="5" width="6" height="2" />
          <rect x="1" y="7" width="14" height="2" />
          <rect x="5" y="9" width="6" height="2" />
          <rect x="7" y="11" width="2" height="2" />
          <rect x="7" y="13" width="2" height="2" />
        </svg>
      )
    },
    { 
      text: "Web & UI Design", 
      color: "#3A86FF", 
      hoverBg: "#d0e0fc",
      icon: (
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
          <rect x="0" y="0" width="16" height="2" />
          <rect x="0" y="2" width="2" height="10" />
          <rect x="14" y="2" width="2" height="10" />
          <rect x="3" y="3" width="2" height="2" />
          <rect x="6" y="3" width="2" height="2" />
          <rect x="3" y="7" width="10" height="2" />
          <rect x="3" y="10" width="6" height="2" />
          <rect x="0" y="12" width="16" height="2" />
          <rect x="6" y="14" width="4" height="2" />
        </svg>
      )
    },
    { 
      text: "Direção de Arte", 
      color: "#FFAA00", 
      hoverBg: "#ffe5a3",
      icon: (
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="2" width="12" height="2" />
          <rect x="1" y="4" width="14" height="8" />
          <rect x="3" y="6" width="3" height="3" fill="#FF2A85" />
          <rect x="10" y="6" width="3" height="3" fill="#00E5FF" />
          <rect x="2" y="12" width="12" height="2" />
        </svg>
      )
    },
    { 
      text: "Identidade Visual", 
      color: "#8B5CF6", 
      hoverBg: "#e8d8fc",
      icon: (
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
          <rect x="7" y="0" width="2" height="2" />
          <rect x="5" y="2" width="6" height="2" />
          <rect x="3" y="4" width="10" height="2" />
          <rect x="1" y="6" width="14" height="2" />
          <rect x="3" y="8" width="10" height="2" />
          <rect x="5" y="10" width="6" height="2" />
          <rect x="7" y="12" width="2" height="2" />
          <rect x="7" y="14" width="2" height="2" />
        </svg>
      )
    },
    { 
      text: "Tecnologia Criativa", 
      color: "#10B981", 
      hoverBg: "#d4ffc8",
      icon: (
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
          <rect x="8" y="0" width="4" height="2" />
          <rect x="7" y="2" width="4" height="2" />
          <rect x="6" y="4" width="4" height="2" />
          <rect x="4" y="6" width="8" height="2" />
          <rect x="5" y="8" width="5" height="2" />
          <rect x="4" y="10" width="5" height="2" />
          <rect x="3" y="12" width="5" height="2" />
          <rect x="2" y="14" width="4" height="2" />
        </svg>
      )
    },
    { 
      text: "IA Generativa", 
      color: "#EC4899", 
      hoverBg: "#ffd3f5",
      icon: (
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
          <rect x="12" y="1" width="2" height="2" />
          <rect x="11" y="3" width="2" height="2" />
          <rect x="9" y="5" width="2" height="2" />
          <rect x="7" y="7" width="2" height="2" />
          <rect x="5" y="9" width="2" height="2" />
          <rect x="3" y="11" width="2" height="2" />
          <rect x="1" y="13" width="2" height="2" />
          <rect x="14" y="5" width="1" height="1" />
          <rect x="9" y="0" width="1" height="2" />
          <rect x="8" y="1" width="3" height="1" />
        </svg>
      )
    },
    { 
      text: "Prototipagem", 
      color: "#14B8A6", 
      hoverBg: "#cbfaf4",
      icon: (
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="1" width="14" height="14" />
          <rect x="3" y="3" width="10" height="2" fill="#fff" />
          <rect x="3" y="6" width="4" height="4" fill="#a0a0a0" />
          <rect x="9" y="6" width="4" height="4" fill="#a0a0a0" />
          <rect x="5" y="12" width="6" height="2" fill="#fff" />
        </svg>
      )
    }
  ];

  return (
    <section className="capabilities" style={{ border: "none" }}>
      <div className="wrap">
        <h2 className="capabilities__title" style={{ fontFamily: "var(--font-head)", textAlign: "center" }}>Minhas Capacidades</h2>
        <p className="capabilities__sub" style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", textAlign: "center", margin: "0 auto", maxWidth: "600px" }}>
          Equilibrando estética experimental e usabilidade refinada para criar marcas e experiências digitais memoráveis.
        </p>

        <div className="capabilities__tags" style={{ padding: "40px 0 40px", maxWidth: "720px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "18px" }}>
          {tagsData.map((tag, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div 
                key={idx} 
                className="cap-tag" 
                data-delay={idx}
                style={{ 
                  backgroundColor: isHovered ? tag.hoverBg : "#fff",
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <span className="cap-tag-icon" style={{ color: tag.color }}>{tag.icon}</span>
                <span>{tag.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
