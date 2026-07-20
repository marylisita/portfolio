"use client";
import { motion } from "framer-motion";
import ProjectShell from "@/components/ProjectShell";
import { useT } from "@/i18n/LanguageContext";

const tagStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: ".78rem",
  textTransform: "lowercase",
  letterSpacing: ".08em",
  background: "var(--acid)",
  color: "#111",
  padding: ".55rem 1rem",
  textDecoration: "none",
  clipPath:
    "polygon(0 8px, 8px 8px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 8px), 0 calc(100% - 8px))",
};

const GALLERY = [1, 2, 3, 4, 5, 6, 7, 8];

const CREDITS = [
  { key: "pilotis_cred_design", names: "Vinícius de Moura · Stella Bandeira · Matheus Petermann" },
  { key: "pilotis_cred_comms", names: "Carolina Mello · Raphaela Ortega" },
  { key: "pilotis_cred_social", names: "Stella Bandeira · Matheus Petermann · Maria Isabel Lisita" },
  { key: "pilotis_cred_ux", names: "Raquel Pinheiro" },
  { key: "pilotis_cred_video", names: "Johnson Victor" },
  { key: "pilotis_cred_photo", names: "Guilherme Chartuni · Raphaela Ortega" },
] as const;

export default function PilotisProject() {
  const { t } = useT();

  return (
    <ProjectShell
      title={t("pilotis_title")}
      desc={
        <>
          {t("pilotis_desc_1")} <span className="pj-em">{t("pilotis_desc_em")}</span>
          {t("pilotis_desc_2")}
        </>
      }
      meta={[
        { label: t("ebat_meta_client"), value: "Instituto ECOA PUC-Rio" },
        { label: t("ebat_meta_role"), value: "Social Media" },
      ]}
    >
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem 4rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "44px" }}>
          {GALLERY.map((n, i) => (
            <motion.div
              key={n}
              className="pj-frame"
              initial={{ opacity: 0, y: 46, rotate: i % 3 === 1 ? -1.5 : i % 3 === 2 ? 1.5 : 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src={`/img/pilotis/${n}.jpg`} alt={`Devs no Pilotis — ${n}`} style={{ width: "100%", display: "block" }} />
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem 4rem", textAlign: "center" }}>
        <a
          className="hover-trigger"
          href="https://instituto.ecoa.puc-rio.br/devs-no-pilotis/"
          target="_blank"
          rel="noopener noreferrer"
          style={tagStyle}
        >
          [ {t("pilotis_visit")} ↗ ]
        </a>
      </section>

      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem 6rem" }}>
        <h2 className="pj-h2">{t("grad_credits_title")}</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            padding: "1.4rem 0",
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px), repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px)",
            backgroundSize: "100% 2px, 100% 2px",
            backgroundPosition: "top left, bottom left",
            backgroundRepeat: "no-repeat, no-repeat",
          }}
        >
          {CREDITS.map((c) => (
            <div key={c.key}>
              <div className="pj-meta__label">{t(c.key)}</div>
              <div className="pj-meta__value">{c.names}</div>
            </div>
          ))}
        </div>
      </section>
    </ProjectShell>
  );
}
