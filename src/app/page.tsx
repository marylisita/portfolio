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
                    <span>Art Direction</span>
                    <span>Editorial</span>
                  </div>
                  <p className="sticky-card__desc" style={{ color: "var(--gray-600)" }}>
                    A high-end, brutalist digital press kit for actress Isadora Ruppert. Featuring torn paper aesthetics and vintage Hollywood colors.
                  </p>
                  <AnimatedButton href="/work/isadora" variant="outline">Ver Projeto</AnimatedButton>
                </div>
                <div style={{ padding: "40px", backgroundColor: "#D8C3A5", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--r-lg)", border: "1px solid #111" }}>
                  <div style={{ position: "relative", width: "100%", border: "1px solid #111", backgroundColor: "#fff", boxShadow: "0 15px 35px rgba(0,0,0,0.15)" }}>
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
                  <div style={{ position: "relative", width: "100%", border: "1px solid #111", backgroundColor: "#fff", boxShadow: "0 15px 35px rgba(0,0,0,0.15)" }}>
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
                    <span>Creative Tech</span>
                    <span>Generative Art</span>
                  </div>
                  <p className="sticky-card__desc" style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)" }}>
                    Um laboratório experimental focado em código e arte generativa, explorando a intersecção entre a filosofia humana e a lógica de máquina.
                  </p>
                  <AnimatedButton href="/work/genlab" variant="outline">Ver Projeto</AnimatedButton>
                </div>
                <div style={{ padding: "40px", backgroundColor: "#FFDDEE", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--r-lg)", border: "1px solid #111" }}>
                  <div style={{ position: "relative", width: "100%", border: "1px solid #111", backgroundColor: "#fff", boxShadow: "0 15px 35px rgba(0,0,0,0.15)" }}>
                    <LiquidImage src="/img/genlab.png" alt="GenLab Project" fill={false} />
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
            
            {/* Left: Organic Portrait Container */}
            <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ 
                width: "90%", 
                height: "90%", 
                backgroundColor: "#F4D77A", 
                borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%", /* Organic blob shape */
                overflow: "hidden",
                border: "2px solid #111",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "-10px 10px 0px rgba(0,0,0,0.05)"
              }}>
                <img src="/profile.jpeg" alt="Maria Lisita" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              
              {/* Tape Graphic */}
              <div style={{ position: "absolute", top: "2%", left: "50%", transform: "translateX(-50%) rotate(-3deg)", width: "140px", height: "30px", backgroundColor: "#E5F0F9", border: "1px solid #111", zIndex: 10, backgroundImage: "radial-gradient(#111 2px, transparent 2px)", backgroundSize: "15px 15px", boxShadow: "2px 2px 0px rgba(0,0,0,0.1)" }}></div>
              
              {/* Sticker */}
              <div style={{ position: "absolute", bottom: "5%", left: "5%", width: "110px", height: "110px", backgroundColor: "#fff", borderRadius: "50%", border: "1px solid #111", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, boxShadow: "4px 4px 0px rgba(0,0,0,0.1)" }}>
                <div style={{ width: "100px", height: "100px", position: "relative", animation: "spin 12s linear infinite" }}>
                   <svg viewBox="0 0 100 100" width="100" height="100">
                     <path id="circlePath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="none" />
                     <text style={{ fontSize: "8px", fontFamily: "var(--font-mono)", fill: "#111", letterSpacing: "1.2px", textTransform: "uppercase" }}>
                       <textPath href="#circlePath">
                         • Disponível para Freelance • Disponível para Freelance •
                       </textPath>
                     </text>
                   </svg>
                </div>
                <a href="mailto:lisita.medeiros@gmail.com" className="hover-trigger" style={{ position: "absolute", fontSize: "1.8rem", textDecoration: "none", zIndex: 11 }}>✉️</a>
              </div>
            </div>

            {/* Right: Text and Progress Bars */}
            <div>
              <h2 className="section-title" style={{ fontFamily: "var(--font-head)", marginBottom: "1.5rem", fontSize: "3.5rem", color: "#111" }}>Minibio</h2>
              <p className="about__text" style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", lineHeight: 1.6, color: "var(--gray-600)" }}>
                Minha trajetória no design é guiada pela pesquisa e pela experimentação tecnológica. Fui pesquisadora no NANO (Núcleo de Arte e Novos Organismos) e atualmente integro o LAID (Laboratório Aberto de Inovação e Design) da UFRJ.
              </p>
              <p className="about__text" style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", lineHeight: 1.6, color: "var(--gray-600)", marginTop: "1rem", marginBottom: "2rem" }}>
                Utilizo essa base acadêmica e artística para estruturar projetos de Design Gráfico, Web Design e Programação Criativa. No meu trabalho diário, construo interfaces e identidades visuais onde o rigor técnico se encontra com estéticas contemporâneas.
              </p>

              {/* Progress Bars */}
              <div className="skills__grid">
                {[
                  { name: "UX/UI Design", p: 95, color: "#E0F2FE" },
                  { name: "Web Design", p: 97, color: "#DCFCE7" },
                  { name: "Figma", p: 85, color: "#FCE7F3" },
                  { name: "Wordpress", p: 80, color: "#E0E7FF" },
                  { name: "Creative Cloud", p: 90, color: "#ECFCCB" }
                ].map(skill => (
                  <div key={skill.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#111", marginBottom: "8px", fontWeight: 500 }}>
                      <span>{skill.name}</span>
                      <span>{skill.p}%</span>
                    </div>
                    <div style={{ height: "6px", width: "100%", background: "#fff", borderRadius: "10px", border: "1px solid #111", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${skill.p}%`, background: skill.color, borderRight: "1px solid #111" }} />
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
