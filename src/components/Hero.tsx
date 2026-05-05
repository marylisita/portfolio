"use client";
import PixelHero from "./PixelHero";
import TextHighlight from "./TextHighlight";

export default function Hero() {
  return (
    <section className="hero">
      <PixelHero
        pixelSize={32}
        baseBlue="#96a5fa"
        lilac="#be96ff"
        bgBase="#FCF8FF"
        bgGlow="#C8B0FF"
        hoverRadius={160}
      />
      <div className="hero__content">
        <div className="hero__pills">
          <div className="pill"><span className="dot dot--green"></span> Disponível para collabs/trabalhos</div>
          <div className="pill" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            RIO DE JANEIRO, RJ, BRASIL
          </div>
        </div>
        <h1 className="hero__title" style={{ fontFamily: "var(--font-head)", maxWidth: "800px", margin: "0 auto 1.8rem" }}>
          Identidades visuais marcantes & <br/> <span style={{ display: "inline-block", whiteSpace: "nowrap" }}><TextHighlight variant="ios" delay={2.5}>experiências imersivas.</TextHighlight></span>
        </h1>
        <p className="hero__sub" style={{ fontFamily: "var(--font-body)", fontSize: "1.2rem", maxWidth: "600px" }}>
          Sou uma designer multidisciplinar que une sistemas visuais e estética experimental para construir marcas e sites que <TextHighlight variant="marker" color="#D4FFC8" delay={2.8}>se destacam.</TextHighlight>
        </p>
      </div>
    </section>
  );
}
