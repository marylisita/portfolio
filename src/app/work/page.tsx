"use client";
import PixelScrollImage from "@/components/PixelScrollImage";
import { useT } from "@/i18n/LanguageContext";
import { useProjects } from "@/components/useProjects";
import EditorialFooter from "@/components/EditorialFooter";
import LangToggle from "@/components/LangToggle";

interface ProjectCardProps {
  num: string;
  title: string;
  tags: string;
  href: string;
  img: string;
  desc: string;
  ratio: number;
}

function ProjectCard({ num, title, tags, href, img, desc, ratio }: ProjectCardProps) {
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

      {/* capa: mesma revelação em pixels da landing, sem borda */}
      <div style={{ width: "100%", overflow: "hidden", backgroundColor: "var(--site-tint-b)" }}>
        <PixelScrollImage src={img} alt={title} ratio={ratio} style={{ width: "100%" }} />
      </div>

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
            background: "var(--ink)",
            color: "var(--paper)",
            padding: "0.5rem 1rem",
            textDecoration: "none",
            cursor: "pointer",
            transition: "background 0.25s ease, color 0.25s ease, border-color 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--acid)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--ink)";
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
      background: var(--ink);
      color: var(--paper);
      padding: 0.35rem 0.7rem;
      text-decoration: none;
      transition: background 0.25s ease, color 0.25s ease;
    }
    .wk-back-btn:hover {
      background: var(--acid, #E4462A);
      color: var(--paper);
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
              ratio={proj.ratio}
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
