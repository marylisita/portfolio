"use client";
import GiantFooter from "@/components/GiantFooter";
import PixelMotifs from "@/components/PixelMotifs";
import TextHighlight from "@/components/TextHighlight";
import { motion } from "framer-motion";
import Link from "next/link";
import FlipBook from "@/components/FlipBook";
import Nav from "@/components/Nav";
import { useT } from "@/i18n/LanguageContext";

const ebatStyles = `
  .ebat-main { padding-top: 140px; }
  .ebat-header { padding: 40px 2rem 80px; }
  .ebat-spiw { padding: 0 2rem 100px; gap: 60px; }
  .ebat-social { padding: 0 2rem 120px; gap: 80px; }
  .ebat-two-col { grid-template-columns: 1fr 1fr; }
  .ebat-social-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
  .ebat-posts-grid { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
  .ebat-desc { font-size: clamp(1.1rem, 2.2vw, 1.4rem); }
  .ebat-h2 { font-size: clamp(1.8rem, 4vw, 2.5rem); letter-spacing: -0.5px; }
  .ebat-meta-value { font-size: clamp(1rem, 1.5vw, 1.1rem); }

  @media (max-width: 768px) {
    .ebat-main { padding-top: 90px; }
    .ebat-header { padding: 24px 1.25rem 48px; gap: 28px; }
    .ebat-spiw { padding: 0 1.25rem 60px; gap: 36px; }
    .ebat-social { padding: 0 1.25rem 80px; gap: 48px; }
    .ebat-two-col { grid-template-columns: 1fr !important; }
    .ebat-social-grid { grid-template-columns: 1fr !important; gap: 24px; }
    .ebat-posts-grid { grid-template-columns: 1fr; }
  }
`;

export default function EbatProject() {
  const { t } = useT();
  const carousel1 = Array.from({ length: 7 }).map((_, i) => `ebat/carrossel/${i + 1}.jpg`);
  const carousel2 = Array.from({ length: 4 }).map((_, i) => `ebat/carrossel 2/${i + 1}.jpg`);
  const manual = Array.from({ length: 22 }).map((_, i) => `ebat/manual/${i + 1}.jpg`);

  const singlePosts = [
    "ebat/post.jpg",
    "ebat/artes instagram/livro.png",
    "ebat/artes instagram/modulo1.png"
  ];

  return (
    <>
      <style>{ebatStyles}</style>
      <PixelMotifs />
      <Nav />

      <main className="ebat-main" style={{ minHeight: "100vh", position: "relative" }}>

        {/* Project Header */}
        <section className="ebat-header" style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          position: "relative",
          zIndex: 10
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/" style={{
              display: "inline-block",
              marginBottom: "2rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: "var(--gray-600)",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "1px",
              borderBottom: "1px solid var(--gray-400)",
              paddingBottom: "4px"
            }} className="hover-trigger">
              {t("ebat_back")}
            </Link>

            <h1 style={{
              fontFamily: "var(--font-head)",
              fontSize: "clamp(2rem, 5vw, 4.5rem)",
              color: "var(--fg)",
              margin: "0 0 1rem",
              lineHeight: 1.1,
              fontWeight: 600
            }}>
              {t("ebat_title")}
            </h1>
            <p className="ebat-desc" style={{
              fontFamily: "var(--font-body)",
              color: "var(--gray-600)",
              maxWidth: "800px",
              lineHeight: 1.6
            }}>
              {t("ebat_desc")} <TextHighlight variant="marker" color="#C7E9B0" delay={0.8}>{t("ebat_desc_highlight")}</TextHighlight> {t("ebat_desc_rest")}
            </p>
          </motion.div>

          {/* Project Meta Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              borderTop: "var(--border)",
              borderBottom: "var(--border)",
              padding: "30px 0"
            }}
          >
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-400)", marginBottom: "8px" }}>{t("ebat_meta_client")}</div>
              <div className="ebat-meta-value" style={{ fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--fg)" }}>EBAT</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-400)", marginBottom: "8px" }}>{t("ebat_meta_role")}</div>
              <div className="ebat-meta-value" style={{ fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--fg)" }}>{t("ebat_meta_role_val")}</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--gray-400)", marginBottom: "8px" }}>{t("ebat_meta_year")}</div>
              <div className="ebat-meta-value" style={{ fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--fg)" }}>2026</div>
            </div>
          </motion.div>
        </section>

        {/* Brand Manual Section */}
        <section className="ebat-spiw" style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 10
        }}>
          <div style={{ textAlign: "center" }}>
            <h2 className="ebat-h2" style={{ fontFamily: "var(--font-head)", margin: "0 0 1rem" }}>{t("ebat_manual_title")}</h2>
            <p style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)", fontSize: "1.1rem", maxWidth: "800px", margin: "0 auto" }}>{t("ebat_manual_desc")}</p>
          </div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <FlipBook images={manual} aspectRatio="56.25%" />
          </motion.div>
        </section>

        {/* SPIW Section */}
        <section className="ebat-spiw" style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 10
        }}>

          <div style={{ textAlign: "center" }}>
            <h2 className="ebat-h2" style={{ fontFamily: "var(--font-head)", margin: "0 0 1rem" }}>{t("ebat_spiw_title")}</h2>
            <p style={{ color: "var(--gray-600)", fontFamily: "var(--font-body)", fontSize: "1.1rem", maxWidth: "800px", margin: "0 auto" }}>{t("ebat_spiw_desc")}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            <div className="ebat-two-col" style={{ display: "grid", gap: "20px", alignItems: "center" }}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", backgroundColor: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)" }}
              >
                <img src="/img/ebat/mockup outer.png" alt="Flyer Outer Mockup" style={{ width: "100%", display: "block" }} />
              </motion.div>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", backgroundColor: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)" }}
              >
                <img src="/img/ebat/mockup inner.png" alt="Flyer Inner Mockup" style={{ width: "100%", display: "block" }} />
              </motion.div>
            </div>

            <div className="ebat-two-col" style={{ display: "grid", gap: "20px", alignItems: "center" }}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", backgroundColor: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)" }}
              >
                <img src="/img/ebat/Outer Page.png" alt="Outer Page" style={{ width: "100%", display: "block" }} />
              </motion.div>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", backgroundColor: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)" }}
              >
                <img src="/img/ebat/Inner Page.png" alt="Inner Page" style={{ width: "100%", display: "block" }} />
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              style={{ width: "100%", backgroundColor: "#000", borderRadius: "16px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", border: "2px solid #111" }}
            >
              <video
                src="/img/ebat/video-ebat.mp4"
                controls
                autoPlay
                muted
                loop
                style={{ width: "100%", display: "block" }}
              />
            </motion.div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="ebat-social" style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ textAlign: "center" }}>
            <h2 className="ebat-h2" style={{ fontFamily: "var(--font-head)", margin: "0 0 2rem" }}>{t("ebat_social_title")}</h2>
          </div>

          <div className="ebat-social-grid" style={{ display: "grid", width: "100%" }}>

            {/* Carousel 1 */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #dbdbdb",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", padding: "14px", borderBottom: "1px solid #efefef" }}>
                <img src="/img/ebat/logo.png" alt="EBAT Logo" style={{ width: "32px", height: "32px", borderRadius: "50%", marginRight: "10px", border: "1px solid #efefef", objectFit: "cover" }} />
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9rem", color: "#262626" }}>ebat.escola</span>
                <span style={{ marginLeft: "auto", fontWeight: "bold", letterSpacing: "2px", color: "#262626" }}>...</span>
              </div>
              <div style={{ borderBottom: "1px solid #efefef" }}>
                <FlipBook images={carousel1} aspectRatio="125%" />
              </div>
              <div style={{ padding: "14px" }}>
                <div style={{ display: "flex", gap: "16px" }}>
                  <svg aria-label="Like" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.287-2.043-1.59-4.345-3.797-2.5-2.39-5.15-4.275-5.15-7.177A4.99 4.99 0 0 1 7.208 3.904a4.58 4.58 0 0 1 4.792 3.197 4.58 4.58 0 0 1 4.792-3.197ZM12 21.644c-.261 0-1.464-1.077-4.004-3.51-2.903-2.775-5.996-5.045-5.996-9.012A6.99 6.99 0 0 1 9.043 2.15a6.57 6.57 0 0 1 2.957 1.455 6.57 6.57 0 0 1 2.957-1.455 6.99 6.99 0 0 1 7.043 6.962c0 3.967-3.093 6.237-5.996 9.012-2.54 2.433-3.743 3.51-4.004 3.51Z"></path></svg>
                  <svg aria-label="Comment" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  <div style={{ marginLeft: "auto" }}>
                    <svg aria-label="Save" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Carousel 2 */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #dbdbdb",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", padding: "14px", borderBottom: "1px solid #efefef" }}>
                <img src="/img/ebat/logo.png" alt="EBAT Logo" style={{ width: "32px", height: "32px", borderRadius: "50%", marginRight: "10px", border: "1px solid #efefef", objectFit: "cover" }} />
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9rem", color: "#262626" }}>ebat.escola</span>
                <span style={{ marginLeft: "auto", fontWeight: "bold", letterSpacing: "2px", color: "#262626" }}>...</span>
              </div>
              <div style={{ borderBottom: "1px solid #efefef" }}>
                <FlipBook images={carousel2} aspectRatio="125%" />
              </div>
              <div style={{ padding: "14px" }}>
                <div style={{ display: "flex", gap: "16px" }}>
                  <svg aria-label="Like" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.287-2.043-1.59-4.345-3.797-2.5-2.39-5.15-4.275-5.15-7.177A4.99 4.99 0 0 1 7.208 3.904a4.58 4.58 0 0 1 4.792 3.197 4.58 4.58 0 0 1 4.792-3.197ZM12 21.644c-.261 0-1.464-1.077-4.004-3.51-2.903-2.775-5.996-5.045-5.996-9.012A6.99 6.99 0 0 1 9.043 2.15a6.57 6.57 0 0 1 2.957 1.455 6.57 6.57 0 0 1 2.957-1.455 6.99 6.99 0 0 1 7.043 6.962c0 3.967-3.093 6.237-5.996 9.012-2.54 2.433-3.743 3.51-4.004 3.51Z"></path></svg>
                  <svg aria-label="Comment" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  <div style={{ marginLeft: "auto" }}>
                    <svg aria-label="Save" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Grid of Single Posts */}
          <div className="ebat-posts-grid" style={{
            display: "grid",
            gap: "20px",
            marginTop: "60px"
          }}>
            {singlePosts.map((imgSrc, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #dbdbdb",
                  borderRadius: "8px",
                  overflow: "hidden"
                }}
              >
                <img src={`/img/${imgSrc}`} alt="Post" style={{ width: "100%", display: "block" }} />
              </motion.div>
            ))}
          </div>

        </section>

      </main>

      <div id="contact">
        <GiantFooter />
      </div>
    </>
  );
}
