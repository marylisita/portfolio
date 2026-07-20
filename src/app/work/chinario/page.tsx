"use client";
import { motion } from "framer-motion";
import ProjectShell from "@/components/ProjectShell";
import { useT } from "@/i18n/LanguageContext";

const GALLERY = [1, 2, 3, 4, 5, 6];

export default function ChinaRioProject() {
  const { t } = useT();

  return (
    <ProjectShell
      title={t("chinario_title")}
      desc={
        <>
          {t("chinario_desc_1")} <span className="pj-em">{t("chinario_desc_em")}</span>
          {t("chinario_desc_2")}
        </>
      }
      meta={[
        { label: t("ebat_meta_client"), value: "PUC-Rio" },
        { label: t("ebat_meta_role"), value: "Design Gráfico" },
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
              <img src={`/img/chinario/${n}.jpg`} alt={`China–Rio — ${n}`} style={{ width: "100%", display: "block" }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* tagline */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem 4rem", textAlign: "center" }}>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "var(--font-head)",
            fontStyle: "italic",
            fontSize: "clamp(1.3rem, 3vw, 2.2rem)",
            color: "var(--acid)",
            margin: 0,
          }}
        >
          {t("chinario_tagline")}
        </motion.p>
      </section>

      {/* créditos */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem 6rem" }}>
        <h2 className="pj-h2">{t("grad_credits_title")}</h2>
        <div
          style={{
            padding: "1.4rem 0",
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px), repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px)",
            backgroundSize: "100% 2px, 100% 2px",
            backgroundPosition: "top left, bottom left",
            backgroundRepeat: "no-repeat, no-repeat",
          }}
        >
          <div className="pj-meta__value">Dillon Wong · Maria I. Lisita · Vinícius de Moura</div>
        </div>
      </section>
    </ProjectShell>
  );
}
