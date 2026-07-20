"use client";
import { motion } from "framer-motion";
import LiquidImage from "@/components/LiquidImage";
import ProjectShell from "@/components/ProjectShell";
import { useT } from "@/i18n/LanguageContext";

export default function MagazineProject() {
  const { t } = useT();

  const collage = ["5.png", "6.png", "7.png"];

  return (
    <ProjectShell
      title={t("work_helvetica_title").replace(/\n/g, " ")}
      desc={
        <>
          {t("magazine_p1")} <span className="pj-em">{t("magazine_p1_highlight")}</span> {t("magazine_p1_rest")}{" "}
          {t("magazine_p2")} <span className="pj-em">{t("magazine_p2_highlight")}</span> {t("magazine_p2_rest")}
        </>
      }
      meta={[
        { label: t("ebat_meta_role"), value: t("work_helvetica_tags") },
        { label: t("ebat_meta_year"), value: "2025" },
      ]}
    >
      {/* nota de processo */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem 4rem" }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: ".85rem",
            color: "var(--ink)",
            lineHeight: 1.7,
            padding: "20px",
            border: "1px dashed rgba(242,241,236,.4)",
            maxWidth: "760px",
          }}
        >
          {t("magazine_p3")}
        </motion.p>
      </section>

      {/* spreads da revista — as folhas brancas saltam no fundo escuro */}
      <section
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "0 2rem 6rem",
          display: "flex",
          flexDirection: "column",
          gap: "100px",
          position: "relative",
        }}
      >
        <div style={{ position: "relative" }}>
          <motion.div
            initial={{ opacity: 0, rotate: -2, y: 40 }}
            whileInView={{ opacity: 1, rotate: 0, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, type: "spring", stiffness: 50 }}
            style={{ width: "84%", margin: "0 auto", border: "1px solid rgba(242,241,236,.3)", backgroundColor: "#fff", display: "flex", boxShadow: "26px 26px 0 rgba(200,245,46,.12)" }}
          >
            <LiquidImage src="/img/helvetica/1.png" alt="Cover Spread" fill={false} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{
              position: "absolute",
              top: "20%",
              right: "2%",
              fontFamily: "var(--font-grotesk)",
              fontSize: "3.4rem",
              fontWeight: 800,
              color: "transparent",
              WebkitTextStroke: "2px var(--acid)",
              transform: "rotate(90deg)",
              transformOrigin: "right bottom",
              pointerEvents: "none",
            }}
          >
            DAVID CARSON
          </motion.div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "60px" }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ border: "1px solid rgba(242,241,236,.3)", backgroundColor: "#fff", boxShadow: "-15px 15px 0 #FF3300", display: "flex", transform: "rotate(-1deg)" }}
          >
            <LiquidImage src="/img/helvetica/2.png" alt="Spread 2" fill={false} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ border: "1px solid rgba(242,241,236,.3)", backgroundColor: "#fff", boxShadow: "15px 15px 0 var(--acid)", display: "flex", marginTop: "80px", transform: "rotate(2deg)" }}
          >
            <LiquidImage src="/img/helvetica/3.png" alt="Spread 3" fill={false} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "grayscale(100%)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "grayscale(0%)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          style={{ width: "100%", border: "1px solid rgba(242,241,236,.3)", backgroundColor: "#fff", display: "flex" }}
        >
          <LiquidImage src="/img/helvetica/4.png" alt="Spread 4" fill={false} />
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
          {collage.map((img, i) => (
            <motion.div
              key={img}
              initial={{ opacity: 0, y: 50, rotate: i % 2 === 0 ? -3 : 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              style={{ border: "1px solid rgba(242,241,236,.3)", backgroundColor: "#fff", display: "flex", boxShadow: "8px 8px 0 rgba(200,245,46,.18)" }}
            >
              <LiquidImage src={`/img/helvetica/${img}`} alt={`Spread ${i + 5}`} fill={false} />
            </motion.div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "90px", width: "100%" }}>
          <motion.div
            initial={{ opacity: 0, x: -100, rotate: -10 }}
            whileInView={{ opacity: 1, x: 0, rotate: -4 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={{ width: "82%", maxWidth: "900px", border: "1px solid rgba(242,241,236,.3)", backgroundColor: "#fff", display: "flex", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}
          >
            <LiquidImage src="/img/helvetica/8.png" alt="Spread 8" fill={false} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ width: "88%", maxWidth: "1000px", border: "1px solid rgba(242,241,236,.3)", backgroundColor: "#fff", display: "flex", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}
          >
            <LiquidImage src="/img/helvetica/9.jpg" alt="Spread 9" fill={false} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 100, rotate: 10 }}
            whileInView={{ opacity: 1, x: 0, rotate: 5 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{ width: "78%", maxWidth: "800px", border: "1px solid rgba(242,241,236,.3)", backgroundColor: "#fff", display: "flex", boxShadow: "0 20px 40px rgba(0,0,0,.6)" }}
          >
            <LiquidImage src="/img/helvetica/10.jpg" alt="Spread 10" fill={false} />
          </motion.div>
        </div>
      </section>
    </ProjectShell>
  );
}
