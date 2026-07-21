"use client";
import { motion } from "framer-motion";
import ProjectShell from "@/components/ProjectShell";
import { useT } from "@/i18n/LanguageContext";

const reveal = () => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const },
});

const styles = `
  .vc-sec { max-width: 1100px; margin: 0 auto; padding: 0 2rem 5.5rem; }
  .vc-h2 {
    font-family: var(--font-head); font-weight: 400;
    font-size: clamp(1.9rem, 5vw, 3.4rem); line-height: 1.02;
    letter-spacing: -.015em; margin: 0 0 1.6rem;
  }
  .vc-p {
    font-family: var(--font-body); font-size: .96rem; line-height: 1.75;
    opacity: .82; max-width: 62ch; margin: 0 0 1.1rem;
  }
  .vc-p--forte { opacity: 1; font-weight: 500; }
  
  .vc-gallery {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    margin-top: 2rem;
  }
  
  .vc-fig {
    margin: 0;
    overflow: hidden;
    background: var(--site-tint-b);
    border: 1px solid rgba(28,27,24,.15);
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .vc-fig:hover {
    transform: scale(1.01);
  }
  .vc-img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }

  @media (max-width: 720px) {
    .vc-sec { padding: 0 1.25rem 4rem; }
  }
`;

export default function VegCozProject() {
  const { t } = useT();

  return (
    <ProjectShell
      title={t("vegcoz_title")}
      desc={
        <>
          {t("vegcoz_desc_1")}{" "}
          <span className="pj-em">{t("vegcoz_desc_em")}</span>
          {t("vegcoz_desc_2")}
        </>
      }
      meta={[
        { label: t("vegcoz_meta_ctx"), value: t("vegcoz_meta_ctx_val") },
        { label: t("vegcoz_meta_role"), value: t("vegcoz_meta_role_val") },
      ]}
    >
      <style>{styles}</style>

      {/* Intro text */}
      <section className="vc-sec">
        <motion.div {...reveal()}>
          <h2 className="vc-h2">{t("vegcoz_sub")}</h2>
          <p className="vc-p">{t("vegcoz_desc_1")}</p>
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section className="vc-sec">
        <motion.h2 {...reveal()} className="vc-h2">
          {t("vegcoz_gallery_title")}
        </motion.h2>
        <div className="vc-gallery">
          <motion.figure
            className="vc-fig"
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              className="vc-img"
              src="/img/vegcoz/1.png"
              alt="VegCoz Branding Project 1"
            />
          </motion.figure>

          <motion.figure
            className="vc-fig"
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              className="vc-img"
              src="/img/vegcoz/2.png"
              alt="VegCoz Branding Project 2"
            />
          </motion.figure>
        </div>
      </section>

      {/* Credits */}
      <section className="vc-sec" style={{ paddingBottom: "6rem" }}>
        <h2 className="pj-h2">{t("vegcoz_credits_title")}</h2>
        <div
          style={{
            padding: "1.4rem 0",
            borderTop: "1px solid rgba(28,27,24,.28)",
            borderBottom: "1px solid rgba(28,27,24,.28)",
          }}
        >
          <div className="pj-meta__value">{t("vegcoz_credits_val")}</div>
        </div>
      </section>
    </ProjectShell>
  );
}
