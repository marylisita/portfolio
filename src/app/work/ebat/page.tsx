"use client";
import { motion } from "framer-motion";
import FlipBook from "@/components/FlipBook";
import MacWindow from "@/components/MacWindow";
import ProjectShell from "@/components/ProjectShell";
import { useT } from "@/i18n/LanguageContext";

const ebatStyles = `
  .ebat-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center; }
  .ebat-social-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
  .ebat-posts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; margin-top: 56px; }
  @media (max-width: 768px) {
    .ebat-two-col, .ebat-social-grid { grid-template-columns: 1fr; }
  }
`;

export default function EbatProject() {
  const { t } = useT();
  const carousel1 = Array.from({ length: 7 }).map((_, i) => `ebat/carrossel/${i + 1}.jpg`);
  const carousel2 = Array.from({ length: 4 }).map((_, i) => `ebat/carrossel 2/${i + 1}.jpg`);
  const manual = Array.from({ length: 22 }).map((_, i) => `ebat/manual/${i + 1}.jpg`);

  const singlePosts = [
    { src: "ebat/post.jpg", file: "post_convite.jpg", rotate: -1.5 },
    { src: "ebat/artes instagram/livro.png", file: "post_livro.png", rotate: 1 },
    { src: "ebat/artes instagram/modulo1.png", file: "post_modulo01.png", rotate: -0.5 },
  ];

  return (
    <ProjectShell
      title={t("ebat_title")}
      desc={
        <>
          {t("ebat_desc")} <span className="pj-em">{t("ebat_desc_highlight")}</span> {t("ebat_desc_rest")}
        </>
      }
      meta={[
        { label: t("ebat_meta_client"), value: "EBAT" },
        { label: t("ebat_meta_role"), value: t("ebat_meta_role_val") },
        { label: t("ebat_meta_year"), value: "2026" },
      ]}
    >
      <style>{ebatStyles}</style>

      {/* Manual de Marca */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem 5rem", textAlign: "center" }}>
        <h2 className="pj-h2">{t("ebat_manual_title")}</h2>
        <p className="pj-sub" style={{ marginBottom: "2.5rem" }}>{t("ebat_manual_desc")}</p>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <FlipBook images={manual} aspectRatio="56.25%" />
        </motion.div>
      </section>

      {/* Campanha SPIW */}
      <section style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 2rem 5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 className="pj-h2">{t("ebat_spiw_title")}</h2>
          <p className="pj-sub">{t("ebat_spiw_desc")}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
          <div className="ebat-two-col">
            {["mockup outer.png", "mockup inner.png"].map((f, i) => (
              <motion.div
                key={f}
                className="pj-frame"
                initial={{ y: 46, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <img src={`/img/ebat/${f}`} alt={f} style={{ width: "100%", display: "block" }} />
              </motion.div>
            ))}
          </div>
          <div className="ebat-two-col">
            {["Outer Page.png", "Inner Page.png"].map((f, i) => (
              <motion.div
                key={f}
                className="pj-frame"
                initial={{ y: 46, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <img src={`/img/ebat/${f}`} alt={f} style={{ width: "100%", display: "block" }} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ y: 46, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            style={{ maxWidth: "900px", margin: "0 auto", width: "100%" }}
          >
            <MacWindow filename="spiw_recap.mp4">
              <video src="/img/ebat/video-ebat.mp4" controls autoPlay muted loop style={{ width: "100%", display: "block" }} />
            </MacWindow>
          </motion.div>
        </div>
      </section>

      {/* Redes Sociais — janelinhas Mac espalhadas (ideia dela) */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem 6rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 className="pj-h2">{t("ebat_social_title")}</h2>
        </div>

        <div className="ebat-social-grid">
          <motion.div
            initial={{ y: 50, opacity: 0, rotate: -3 }}
            whileInView={{ y: 0, opacity: 1, rotate: -1.5 }}
            viewport={{ once: true }}
          >
            <MacWindow filename="carrossel_bemvindes(1).jpg">
              <FlipBook images={carousel1} aspectRatio="125%" />
            </MacWindow>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0, rotate: 3 }}
            whileInView={{ y: 0, opacity: 1, rotate: 1.5 }}
            viewport={{ once: true }}
            style={{ marginTop: "48px" }}
          >
            <MacWindow filename="carrossel_modulos_final_FINAL.jpg">
              <FlipBook images={carousel2} aspectRatio="125%" />
            </MacWindow>
          </motion.div>
        </div>

        <div className="ebat-posts-grid">
          {singlePosts.map((p, index) => (
            <motion.div
              key={p.src}
              initial={{ y: 34, opacity: 0, rotate: p.rotate * 3 }}
              whileInView={{ y: 0, opacity: 1, rotate: p.rotate }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
            >
              <MacWindow filename={p.file}>
                <img src={`/img/${p.src}`} alt={p.file} style={{ width: "100%", display: "block" }} />
              </MacWindow>
            </motion.div>
          ))}
        </div>
      </section>
    </ProjectShell>
  );
}
