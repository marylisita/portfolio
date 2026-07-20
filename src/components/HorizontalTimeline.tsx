"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useT } from "@/i18n/LanguageContext";

interface Milestone {
  year: string;
  institution: string;
  titleKey: string;
  descKey: string;
  ascii: string;
}

const MILESTONES: Milestone[] = [
  {
    year: "2021",
    institution: "NANO / UFRJ",
    titleKey: "nano_title",
    descKey: "nano_desc",
    ascii: `   ._____.
  /  o o  \\
  |   -   |
  \\_  _  _/
    '---'
  [ organic ]`,
  },
  {
    year: "2022",
    institution: "LAID / UFRJ",
    titleKey: "laid_title",
    descKey: "laid_desc",
    ascii: `  +---+---+
  | x |   |
  +---+---+
  |   | x |
  +---+---+
  [ grid_id ]`,
  },
  {
    year: "2023 - 2025",
    institution: "APPLE DEVELOPER ACADEMY",
    titleKey: "academy_title",
    descKey: "academy_desc",
    ascii: `    .:'':.
   /  * *  \\
  |  (o)(o) |
   \\  __  /
    '....'
  [ ios_dev ]`,
  },
  {
    year: "2026",
    institution: "KURONAMI LAB",
    titleKey: "kuronami_title",
    descKey: "kuronami_desc",
    ascii: `  .---------.
  | [ REC ] |
  |   (o)   |
  |  =====  |
  '---------'
  [ cctv_id ]`,
  },
];

// Pixelated disintegration overlay component
function PixelOverlay({ active }: { active: boolean }) {
  const cols = 10;
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
            delay: active ? delay : delay * 0.3,
            duration: 0.2,
            ease: "easeInOut",
          }}
          style={{
            backgroundColor: "#0E0E0E", // match background
            border: "0.5px solid #0E0E0E",
            width: "100%",
            height: "100%",
          }}
        />
      ))}
    </div>
  );
}

function TimelineCard({ item, index }: { item: Milestone; index: number }) {
  const [inView, setInView] = useState(false);
  const { t } = useT();

  return (
    <motion.div
      onViewportEnter={() => setInView(true)}
      onViewportLeave={() => setInView(false)}
      viewport={{ amount: 0.35, once: false }}
      style={{
        position: "relative",
        minWidth: "280px",
        maxWidth: "340px",
        width: "100%",
        backgroundColor: "#000000",
        color: "#F2F1EC",
        border: "3px solid #F2F1EC",
        padding: "2.5rem 1.8rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem",
        height: "440px",
        boxShadow: "8px 8px 0px var(--acid, #C8F52E)",
        top: 0,
        left: 0,
        transition: "top 0.15s ease, left 0.15s ease, box-shadow 0.15s ease",
      }}
      whileHover={{
        top: 8,
        left: 8,
        boxShadow: "0px 0px 0px var(--acid, #C8F52E)",
      }}
    >
      {/* Pixel disintegration cover */}
      <PixelOverlay active={inView} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.74rem",
            color: "var(--acid, #C8F52E)",
            letterSpacing: "0.1em",
            fontWeight: 700,
          }}
        >
          {item.year}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.62rem",
            opacity: 0.7,
          }}
        >
          {item.institution}
        </span>
      </div>

      {/* Zine ASCII art in the middle */}
      <pre
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.68rem",
          lineHeight: "1.15",
          color: "#F2F1EC",
          opacity: 0.85,
          margin: "0.5rem auto",
          padding: "0.6rem",
          background: "#111111",
          border: "1px dashed rgba(242,241,236,0.3)",
          width: "100%",
          textAlign: "center",
          whiteSpace: "pre-wrap",
        }}
      >
        {item.ascii}
      </pre>

      <div style={{ marginTop: "auto" }}>
        <h4
          style={{
            fontFamily: "var(--font-head), sans-serif",
            fontSize: "1.05rem",
            fontWeight: 700,
            textTransform: "lowercase",
            letterSpacing: "-0.02em",
            marginBottom: "0.4rem",
          }}
        >
          {t(item.titleKey as any)}
        </h4>
        <p
          style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: "0.76rem",
            lineHeight: "1.5",
            opacity: 0.75,
          }}
        >
          {t(item.descKey as any)}
        </p>
      </div>
    </motion.div>
  );
}

export default function HorizontalTimeline() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { t } = useT();
  
  // Track vertical scroll for horizontal slide
  const { scrollYProgress } = useScroll({ target: targetRef });

  // Slide translation for horizontal timeline (desktop only)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]);

  return (
    <section
      ref={targetRef}
      id="trajectory"
      style={{
        position: "relative",
        zIndex: 20,
      }}
    >
      {/* DESKTOP STICKY HORIZONTAL SCROLL TIMELINE */}
      <div
        className="hidden md:block"
        style={{
          height: "220vh", // scroll track length
          position: "relative",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 4rem",
          }}
        >
          {/* Section Header */}
          <div className="rm-label" style={{ marginBottom: "4rem", width: "100%", maxWidth: "1100px", margin: "0 auto 4rem" }}>
            <span>{t("trajectory_title") || "trajetória / zine"}</span>
            <span>04 —</span>
          </div>

          {/* Slider container */}
          <div style={{ maxWidth: "1100px", width: "100%", margin: "0 auto", overflow: "visible" }}>
            <motion.div
              style={{
                display: "flex",
                gap: "2.5rem",
                x,
                width: "max-content",
              }}
            >
              {MILESTONES.map((item, idx) => (
                <TimelineCard key={idx} item={item} index={idx} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* MOBILE VERTICAL TIMELINE */}
      <div
        className="block md:hidden rm-sec"
        style={{
          paddingTop: "4rem",
          paddingBottom: "4rem",
        }}
      >
        <div className="rm-label" style={{ marginBottom: "3rem" }}>
          <span>{t("trajectory_title") || "trajetória / zine"}</span>
          <span>04 —</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3rem",
            width: "100%",
          }}
        >
          {MILESTONES.map((item, idx) => (
            <TimelineCard key={idx} item={item} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
