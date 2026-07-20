"use client";
import { motion } from "framer-motion";
import ProjectShell from "@/components/ProjectShell";
import { useT } from "@/i18n/LanguageContext";

const GALLERY = [
  { src: "/img/graduation/2.jpg", rotate: 0 },     // paleta de cores
  { src: "/img/graduation/3.jpg", rotate: -1 },
  { src: "/img/graduation/4.jpg", rotate: 1 },     // checklist carioca
  { src: "/img/graduation/5.jpg", rotate: 0 },
  { src: "/img/graduation/6.jpg", rotate: -1 },
  { src: "/img/graduation/7.jpg", rotate: 1.5 },   // ecobags
  { src: "/img/graduation/8.jpg", rotate: 0 },
  { src: "/img/graduation/9.jpg", rotate: -1 },
  { src: "/img/graduation/10.jpg", rotate: 0 },
];

export default function GraduationProject() {
  const { t } = useT();

  return (
    <ProjectShell
      title={t("grad_title")}
      desc={
        <>
          {t("grad_desc_1")} <span className="pj-em">{t("grad_desc_em")}</span> {t("grad_desc_2")}
        </>
      }
      meta={[
        { label: t("ebat_meta_client"), value: "Apple Developer Academy" },
        { label: t("ebat_meta_role"), value: t("grad_meta_role_val") },
        { label: t("ebat_meta_year"), value: "2025" },
      ]}
    >
      {/* animação da marca */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem 4rem" }}>
        <motion.div
          className="pj-frame"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src="/img/graduation/animacao.webp"
            alt="Animação da identidade Rio de Janeiro Starter Pack"
            style={{ width: "100%", display: "block" }}
          />
        </motion.div>
      </section>

      {/* galeria */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem 5rem" }}>
        <h2 className="pj-h2" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          {t("grad_gallery_title")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "44px" }}>
          {GALLERY.map((g, i) => (
            <motion.div
              key={g.src}
              className="pj-frame"
              initial={{ opacity: 0, y: 46, rotate: g.rotate * 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: g.rotate }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src={g.src} alt={`Rio Starter Pack — ${i + 2}`} style={{ width: "100%", display: "block" }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* créditos */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem 6rem" }}>
        <h2 className="pj-h2">{t("grad_credits_title")}</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            padding: "1.4rem 0",
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px), repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px)",
            backgroundSize: "100% 2px, 100% 2px",
            backgroundPosition: "top left, bottom left",
            backgroundRepeat: "no-repeat, no-repeat",
          }}
        >
          <div>
            <div className="pj-meta__label">{t("grad_credits_design")}</div>
            <div className="pj-meta__value">Dillon Wong · Maria Isabel Lisita · Matheus Petermann</div>
          </div>
          <div>
            <div className="pj-meta__label">{t("grad_credits_comms")}</div>
            <div className="pj-meta__value">Carolina Mello · Vinicius de Moura</div>
          </div>
        </div>
      </section>
    </ProjectShell>
  );
}
