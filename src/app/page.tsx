import Hero from "@/components/Hero";
import ProcessStack from "@/components/ProcessStack";
import PixelMotifs from "@/components/PixelMotifs";
import LiquidImage from "@/components/LiquidImage";
import AnimatedButton from "@/components/AnimatedButton";
import IntroShowcase from "@/components/IntroShowcase";
import GiantFooter from "@/components/GiantFooter";
import Cursor from "@/components/Cursor";
import SpreadCards from "@/components/SpreadCards";
import CapabilitiesPop from "@/components/CapabilitiesPop";
import Curtains from "@/components/Curtains";
import Tamagotchi from "@/components/Tamagotchi";

export default function Home() {
  return (
    <>
      <Curtains />
      
      <nav className="nav">
        <div className="nav__inner">
          <div className="nav__logo">MARY L.</div>
          <ul className="nav__links">
            <li><a href="/work" className="hover-trigger">Trabalhos</a></li>
            <li><a href="/experiments" className="hover-trigger">Experimentos</a></li>
          </ul>
          <a href="#contact" className="nav__cta hover-trigger">Fale Comigo</a>
        </div>
      </nav>

      <main style={{ position: "relative" }}>
        <PixelMotifs />
        <Hero />
        <SpreadCards />
        
        <section id="work" className="work">
          <div className="work__headline wrap">
            <h2>Trabalhos Selecionados</h2>
          </div>
          <div className="sticky-cards">
            <div className="sticky-card">
              <div className="sticky-card__inner" style={{ backgroundColor: "#FAF5EE", border: "var(--border)" }}>
                <div>
                  <span className="sticky-card__num" style={{ color: "var(--gray-400)" }}>01</span>
                  <h3 className="sticky-card__title" style={{ color: "var(--fg)", fontFamily: "var(--font-head)" }}>Isadora Ruppert<br />Press Kit</h3>
                  <div className="sticky-card__tags" style={{ color: "var(--gray-600)" }}>
                    <span>Direção de Arte</span>
                    <span>Editorial</span>
                  </div>
                  <p className="sticky-card__desc" style={{ color: "var(--gray-600)" }}>
                    Um press kit digital brutalista e sofisticado para a atriz Isadora Ruppert, com estética de papel rasgado e cores do Hollywood vintage.
                  </p>
                  <AnimatedButton href="/work/isadora" variant="outline">Ver Projeto</AnimatedButton>
                </div>
                <div style={{ padding: "40px", backgroundColor: "#D8C3A5", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--r-lg)", border: "1px solid #111" }}>
                  <div style={{ position: "relative", width: "100%", border: "1px solid #e2def2", backgroundColor: "#fff", boxShadow: "0 15px 35px rgba(0,0,0,0.12)" }}>
                    <LiquidImage src="/img/ISADORA CAPA-THUMBNAIL.webp" alt="Isadora Ruppert" fill={false} />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky-card">
              <div className="sticky-card__inner" style={{ backgroundColor: "#F5F5F5", border: "var(--border)" }}>
                <div>
                  <span className="sticky-card__num">02</span>
                  <h3 className="sticky-card__title">Helvetica:<br />Discórdia</h3>
                  <div className="sticky-card__tags">
                    <span>Grunge</span>
                    <span>Editorial</span>
                  </div>
                  <p className="sticky-card__desc">
                    Um projeto editorial que opõe a neutralidade da Helvetica ao caos do estilo grunge, inspirado por David Carson.
                  </p>
                  <AnimatedButton href="/work/magazine" variant="outline">Ver Projeto</AnimatedButton>
                </div>
                <div style={{ padding: "40px", backgroundColor: "#EAEAEA", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--r-lg)", border: "1px solid #111" }}>
                  <div style={{ position: "relative", width: "100%", border: "1px solid #e2def2", backgroundColor: "#fff", boxShadow: "0 15px 35px rgba(0,0,0,0.12)" }}>
                    <LiquidImage src="/img/helvetica/9.jpg" alt="Helvetica Project" fill={false} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="sticky-card">
              <div className="sticky-card__inner" style={{ backgroundColor: "#FFF0F6", border: "var(--border)", color: "var(--fg)" }}>
                <div>
                  <span className="sticky-card__num" style={{ color: "var(--gray-400)" }}>03</span>
                  <h3 className="sticky-card__title" style={{ color: "var(--fg)", fontFamily: "var(--font-head)" }}>GenLab:<br />Research Hub</h3>
                  <div className="sticky-card__tags" style={{ color: "var(--gray-600)" }}>
                    <span>Tecnologia Criativa</span>
                    <span>Arte Generativa</span>
                  </div>
                  <p className="sticky-card__desc" style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)" }}>
                    Um laboratório experimental focado em código e arte generativa, explorando a intersecção entre a filosofia humana e a lógica de máquina.
                  </p>
                  <AnimatedButton href="/work/genlab" variant="outline">Ver Projeto</AnimatedButton>
                </div>
                <div style={{ padding: "40px", backgroundColor: "#FFDDEE", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--r-lg)", border: "1px solid #111" }}>
                  <div style={{ position: "relative", width: "100%", border: "1px solid #e2def2", backgroundColor: "#fff", boxShadow: "0 15px 35px rgba(0,0,0,0.12)" }}>
                    <LiquidImage src="/img/genlab.png" alt="GenLab Project" fill={false} />
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky-card">
              <div className="sticky-card__inner" style={{ backgroundColor: "#F0Fdf4", border: "var(--border)", color: "var(--fg)" }}>
                <div>
                  <span className="sticky-card__num" style={{ color: "var(--gray-400)" }}>04</span>
                  <h3 className="sticky-card__title" style={{ color: "var(--fg)", fontFamily: "var(--font-head)" }}>EBAT:<br />Arte & Tecnologia</h3>
                  <div className="sticky-card__tags" style={{ color: "var(--gray-600)" }}>
                    <span>Design Gráfico</span>
                    <span>Social Media</span>
                  </div>
                  <p className="sticky-card__desc" style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)" }}>
                    Campanha audiovisual para o São Paulo Innovation Week (SPIW) e identidade visual para redes sociais.
                  </p>
                  <AnimatedButton href="/work/ebat" variant="outline">Ver Projeto</AnimatedButton>
                </div>
                <div style={{ padding: "40px", backgroundColor: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--r-lg)", border: "1px solid #111" }}>
                  <div style={{ position: "relative", width: "100%", border: "1px solid #e2def2", backgroundColor: "#fff", boxShadow: "0 15px 35px rgba(0,0,0,0.12)" }}>
                    <LiquidImage src="/img/ebat/flyer-1.png" alt="EBAT Project" fill={false} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div id="process">
          <ProcessStack />
        </div>

        <section id="about" className="about wrap" style={{ paddingTop: "80px", paddingBottom: "40px" }}>
          <div className="about__grid" style={{ alignItems: "center" }}>
            
            {/* Left: Interactive Pixel Chix Device */}
            <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 0" }}>
              <Tamagotchi />
            </div>

            {/* Right: Text and Skills */}
            <div>
              <h2 className="section-title" style={{ fontFamily: "var(--font-head)", marginBottom: "1.5rem", fontSize: "3.5rem", color: "#111" }}>Minibio</h2>
              <p className="about__text" style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", lineHeight: 1.6, color: "var(--gray-600)", marginBottom: "1.5rem" }}>
                Designer multidisciplinar com base em pesquisa acadêmica. Construo interfaces e identidades visuais onde rigor técnico encontra estética contemporânea — do conceito ao código.
              </p>

              {/* Credential Badges */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "2rem" }}>
                {[
                  { label: "NANO — UFRJ", sub: "Pesquisadora", color: "#E0F2FE" },
                  { label: "LAID — UFRJ", sub: "Integrante", color: "#DCFCE7" },
                ].map(c => (
                  <div key={c.label} style={{ display: "flex", flexDirection: "column", gap: "2px", background: c.color, border: "1px solid #111", borderRadius: "8px", padding: "8px 14px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "1px", color: "#555" }}>{c.sub}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", fontWeight: 600, color: "#111" }}>{c.label}</span>
                  </div>
                ))}
              </div>

              {/* Tools Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {[
                  { category: "Design Visual", tools: ["Figma", "Illustrator", "Photoshop", "After Effects"] },
                  { category: "Web & Código", tools: ["Next.js / React", "TypeScript", "Wordpress", "Framer"] },
                  { category: "Tecnologia Criativa", tools: ["TouchDesigner", "IA Generativa"], full: true },
                ].map(group => (
                  <div key={group.category} style={group.full ? { gridColumn: "1 / -1" } : {}}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-400)", marginBottom: "8px" }}>{group.category}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {group.tools.map(t => (
                        <span key={t} style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#111", background: "#fff", border: "1px solid #ddd", borderRadius: "6px", padding: "4px 10px" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </section>
        
        <div style={{ marginTop: "-20px" }}>
          <CapabilitiesPop />
        </div>
      </main>

      <div id="contact">
        <GiantFooter />
      </div>
    </>
  );
}
