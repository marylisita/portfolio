"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/i18n/LanguageContext";
import { useProjects } from "@/components/useProjects";
import EditorialFooter from "@/components/EditorialFooter";
import LangToggle from "@/components/LangToggle";

// Pixelated disintegration overlay component
function PixelOverlay({ active }: { active: boolean }) {
  const cols = 12;
  const rows = 8;
  const total = cols * rows;
  const [delays] = useState(() =>
    Array.from({ length: total }, () => Math.random() * 0.45)
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 5,
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        pointerEvents: "none",
      }}
    >
      {delays.map((delay, idx) => (
        <motion.div
          key={idx}
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            scale: active ? 0 : 1,
            opacity: active ? 0 : 1,
          }}
          transition={{
            delay: active ? delay : delay * 0.25,
            duration: 0.18,
            ease: "easeInOut",
          }}
          style={{
            backgroundColor: "var(--site-paper)", // acompanha o fundo da pagina
            border: "0.5px solid var(--site-paper)",
            width: "100%",
            height: "100%",
          }}
        />
      ))}
    </div>
  );
}

interface ProjectCardProps {
  num: string;
  title: string;
  tags: string;
  href: string;
  img: string;
  desc: string;
}

function ProjectCard({ num, title, tags, href, img, desc }: ProjectCardProps) {
  const [inView, setInView] = useState(false);
  const { t } = useT();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        width: "100%",
        marginBottom: "6rem",
      }}
    >
      {/* Card Header (horizontal info line) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3rem 1fr auto",
          alignItems: "baseline",
          gap: "1rem",
          paddingBottom: "0.8rem",
          backgroundImage: "repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px)",
          backgroundSize: "100% 2px",
          backgroundPosition: "bottom left",
          backgroundRepeat: "no-repeat",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.8rem",
            color: "var(--acid, #E4462A)",
            fontWeight: 700,
          }}
        >
          {num}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-grotesk), sans-serif",
            fontSize: "clamp(1.4rem, 4vw, 2.5rem)",
            fontWeight: 700,
            textTransform: "lowercase",
            letterSpacing: "-0.03em",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {title}
        </h2>
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.68rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            textAlign: "right",
          }}
        >
          {tags}
        </span>
      </div>

      {/* Project Description */}
      <p
        style={{
          fontFamily: "var(--font-body), sans-serif",
          fontSize: "0.92rem",
          lineHeight: "1.7",
          opacity: 0.8,
          maxWidth: "750px",
          margin: 0,
        }}
      >
        {desc}
      </p>

      {/* Giant Cover Image with Pixelated Disintegration */}
      <motion.div
        onViewportEnter={() => setInView(true)}
        onViewportLeave={() => setInView(false)}
        viewport={{ amount: 0.25, once: false }}
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(240px, 45vh, 480px)",
          overflow: "hidden",
          border: "3px solid var(--ink, #1C1B18)",
          backgroundColor: "var(--site-tint-b)",
        }}
      >
        {/* Pixel Disintegration Cover */}
        <PixelOverlay active={inView} />

        <img
          src={img}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </motion.div>

      {/* Brutalist Button link to project */}
      <div>
        <a
          href={href}
          className="hover-trigger"
          style={{
            display: "inline-block",
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.74rem",
            letterSpacing: "0.08em",
            background: "#000000",
            color: "#ffffff",
            border: "1.5px solid var(--acid, #E4462A)",
            padding: "0.5rem 1rem",
            textDecoration: "none",
            cursor: "pointer",
            transition: "background 0.25s ease, color 0.25s ease, border-color 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--acid, #E4462A)";
            e.currentTarget.style.color = "#000000";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#000000";
            e.currentTarget.style.color = "#ffffff";
          }}
        >
          [ {t("view_project").toLowerCase()} ]
        </a>
      </div>
    </div>
  );
}

export default function Work() {
  const { t } = useT();
  const projects = useProjects();

  const getDesc = (href: string) => {
    if (href.endsWith("isadora")) return t("work_isadora_desc");
    if (href.endsWith("magazine")) return t("work_helvetica_desc");
    if (href.endsWith("genlab")) return t("work_genlab_desc");
    if (href.endsWith("ebat")) return t("work_ebat_desc");
    if (href.endsWith("graduation")) return t("grad_desc_2");
    if (href.endsWith("pilotis")) return t("pilotis_desc_2");
    if (href.endsWith("chinario")) return t("chinario_desc_1");
    return "";
  };

  const localStyles = `
    .wk-page {
      --ink: var(--site-ink);
      --paper: var(--site-paper);
      --acid: var(--site-accent);
      --font-grotesk: Arial, "Helvetica Neue", Helvetica, sans-serif;
      background:
        radial-gradient(1100px 700px at 18% -5%, var(--site-tint-a) 0%, transparent 60%),
      radial-gradient(900px 600px at 100% 30%, var(--site-tint-b) 0%, transparent 55%),
      radial-gradient(1000px 800px at 50% 105%, var(--site-tint-c) 0%, transparent 55%),
        var(--paper);
      color: var(--ink);
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
    }
    .wk-page::after {
      content: "";
      position: fixed;
      inset: 0;
      z-index: 5;
      pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      opacity: .07;
      mix-blend-mode: multiply;
    }
    .wk-corner {
      position: fixed; top: 1rem; z-index: 1000;
      font-family: var(--font-mono);
      font-size: .7rem; text-transform: lowercase; letter-spacing: .14em;
      color: var(--ink);
    }
    .wk-corner--l { left: 1.4rem; }
    .wk-corner--r { right: 1.4rem; display: flex; align-items: center; gap: .8rem; }
    .wk-back-btn {
      font-family: var(--font-mono);
      font-size: .68rem;
      text-transform: lowercase;
      letter-spacing: .08em;
      background: #000000;
      color: #ffffff;
      border: 1.5px solid var(--acid, #E4462A);
      padding: 0.35rem 0.7rem;
      text-decoration: none;
      transition: background 0.25s ease, color 0.25s ease;
    }
    .wk-back-btn:hover {
      background: var(--acid, #E4462A);
      color: #000000;
    }
  `;

  return (
    <div className="wk-page">
      <style>{localStyles}</style>

      {/* Navigation corners */}
      <span className="wk-corner wk-corner--l">
        mary l. ✳
      </span>
      <span className="wk-corner wk-corner--r">
        <a href="/" className="wk-back-btn hover-trigger">
          [ {t("pj_home").toLowerCase()} ]
        </a>
        <LangToggle />
      </span>

      <main style={{ padding: "8rem 2rem 4rem", maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 10 }}>
        {/* Title row */}
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: "0.9rem",
            marginBottom: "4rem",
            backgroundImage: "repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px)",
            backgroundSize: "100% 2px",
            backgroundPosition: "bottom left",
            backgroundRepeat: "no-repeat",
          }}
        >
          <span>{t("work_page_title")}</span>
          <span>{projects.length.toString().padStart(2, "0")} —</span>
        </div>

        {/* Vertical list of projects with full image pixel disintegration */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {projects.map((proj) => (
            <ProjectCard
              key={proj.href}
              num={proj.num}
              title={proj.title}
              tags={proj.tags}
              href={proj.href}
              img={proj.img}
              desc={getDesc(proj.href)}
            />
          ))}
        </div>
      </main>

      <div id="contact">
        <EditorialFooter />
      </div>
    </div>
  );
}
