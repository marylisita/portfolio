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

export default function GenLabProject() {
  const { t } = useT();

  return (
    <ProjectShell
      title={t("genlab_title").replace(/\n/g, " ")}
      desc={
        <>
          {t("genlab_desc")} <span className="pj-em">{t("genlab_highlight1")}</span> {t("genlab_desc2")}{" "}
          <span className="pj-em">{t("genlab_highlight2")}</span>
        </>
      }
      meta={[
        { label: t("genlab_meta_platform"), value: t("genlab_meta_platform_val") },
        { label: t("genlab_meta_services"), value: t("genlab_meta_services_val") },
        { label: t("genlab_meta_status"), value: t("genlab_meta_status_val") },
      ]}
    >
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem 5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "48px", alignItems: "center" }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="pj-h2">{t("genlab_feature_title")}</h2>
            <p style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "1.2rem" }}>
              {t("genlab_feature_p1")}
            </p>
            <p style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)", fontSize: "1.05rem", lineHeight: 1.8 }}>
              {t("genlab_feature_p2")}
            </p>
          </motion.div>

          <motion.div
            className="pj-frame"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <img src="/img/genlab.png" alt="GenLab Experimental" style={{ width: "100%", display: "block" }} />
          </motion.div>
        </div>
      </section>

      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem 6rem", textAlign: "center" }}>
        <h2 className="pj-h2" style={{ marginBottom: "2rem" }}>{t("genlab_visit")}</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <a
            className="hover-trigger"
            href="https://marylisita.github.io/genlabdesign/index.html"
            target="_blank"
            rel="noopener noreferrer"
            style={tagStyle}
          >
            [ {t("genlab_access").toLowerCase()} ↗ ]
          </a>
        </div>
      </section>
    </ProjectShell>
  );
}
