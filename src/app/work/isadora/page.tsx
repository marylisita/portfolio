"use client";
import { motion } from "framer-motion";
import FlipBook from "@/components/FlipBook";
import ProjectShell from "@/components/ProjectShell";
import { useT } from "@/i18n/LanguageContext";

export default function IsadoraProject() {
  const { t } = useT();

  const images = [
    "ISADORA CAPA-THUMBNAIL.webp",
    "Isadora 2.webp",
    "Isadora 3.webp",
    "Isadora 4.webp",
    "Isadora 5.webp",
    "Isadora 6.webp",
    "ISADORA8.webp",
    "ISADORA 9.webp",
    "ISADORA 10.webp",
  ];

  const verticalImages = [
    "isadora_vertical/Prancheta 1.webp",
    "isadora_vertical/Prancheta 2.webp",
    "isadora_vertical/Prancheta 3.webp",
    "isadora_vertical/Prancheta 4.webp",
    "isadora_vertical/Prancheta 5.webp",
    "isadora_vertical/Prancheta 7.webp",
    "isadora_vertical/Prancheta 9.webp",
    "isadora_vertical/Prancheta 10.webp",
    "isadora_vertical/Prancheta 11.webp",
  ];

  return (
    <ProjectShell
      title="press kit — isadora ruppert"
      desc={
        <>
          {t("isadora_subtitle")} <span className="pj-em">{t("isadora_highlight1")}</span>{" "}
          <span className="pj-em">{t("isadora_highlight2")}</span>
        </>
      }
      meta={[
        { label: t("isadora_meta_client"), value: "Isadora Ruppert" },
        { label: t("isadora_meta_role"), value: t("isadora_meta_role_val") },
        { label: t("isadora_meta_year"), value: "2026" },
      ]}
    >
      <section style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 2rem 5rem" }}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <FlipBook images={images} />
        </motion.div>
      </section>

      <section style={{ maxWidth: "950px", margin: "0 auto", padding: "0 2rem 6rem", textAlign: "center" }}>
        <h2 className="pj-h2">{t("isadora_vertical_title")}</h2>
        <p className="pj-sub" style={{ marginBottom: "2.5rem" }}>{t("isadora_vertical_sub")}</p>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <FlipBook images={verticalImages} aspectRatio="141.4%" />
        </motion.div>
      </section>
    </ProjectShell>
  );
}
