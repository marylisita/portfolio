"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import ProjectShell from "@/components/ProjectShell";
import FutureWheel from "@/components/FutureWheel";
import { CaseCanvas } from "@/components/CaseStudyKit";
import AsciiDivider from "@/components/AsciiDivider";
import { useT } from "@/i18n/LanguageContext";

/**
 * HoloGlam — design especulativo (com Maria Luiza Costa).
 *
 * ENQUADRAMENTO (escolha dela): a página apresenta o projeto como PERGUNTA, não
 * como produto. O deck original vendia a roupa como solução sustentável, mas a
 * Future Wheel das duas já registrava dependência tecnológica, elitismo,
 * privacidade e impacto dos eletrônicos — em bolinhas pequenas ao lado das boas
 * notícias. Aqui essas consequências ganham seção própria, com o mesmo peso.
 * Nada foi inventado: é leitura honesta da pesquisa que elas mesmas fizeram.
 *
 * As telas de app entram menores de propósito — grandes, puxavam a leitura para
 * "pitch de startup", que é o oposto de design especulativo.
 */

/**
 * FUNÇÃO, não constante: espalhar o MESMO objeto (e os mesmos `viewport` e
 * `transition` aninhados) em vários motion.div fazia quatro seções — inclusive
 * "o que não fecha" inteira — travarem em opacity 0 e nunca aparecerem. Cada
 * componente precisa da sua própria cópia.
 */
const reveal = () => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const },
});

const MODELS = [
  { n: 1, width: 468, height: 670 },
  { n: 2, width: 410, height: 670 },
  { n: 3, width: 484, height: 670 },
] as const;

const styles = `
  .hg-sec { max-width: var(--project-content-max); margin: 0 auto; padding: 0 var(--project-gutter) 5.5rem; position: relative; }
  .hg-kicker {
    font-family: var(--font-body); font-size: var(--type-micro);
    text-transform: uppercase; letter-spacing: .2em;
    color: var(--tc-accent); margin: 0 0 .5rem;
  }
  .hg-h2 {
    font-family: var(--font-head); font-weight: 400;
    font-size: clamp(1.9rem, 5vw, 3.4rem); line-height: 1.02;
    letter-spacing: -.015em; margin: 0 0 1.6rem;
  }
  .hg-p {
    font-family: var(--font-body); font-size: clamp(1.04rem, 1.45vw, 1.16rem); line-height: 1.7;
    opacity: .82; max-width: var(--measure-copy); margin: 0 0 1.1rem;
    text-wrap: pretty;
  }
  .hg-p--forte { opacity: 1; font-weight: 500; }

  /* a provocação: peça tipográfica, não parágrafo */
  .hg-quest {
    font-family: var(--font-head); font-weight: 400;
    font-size: clamp(1.7rem, 5.2vw, 4rem); line-height: 1.08;
    letter-spacing: -.02em; max-width: var(--measure-section-title); margin: 0;
    text-wrap: balance;
  }
  .hg-quest em { font-style: italic; color: var(--tc-accent); }
  .hg-rule { margin: 0.2rem 0 1.2rem; color: currentColor; opacity: .5; }
  .hg-opening,
  .hg-critical {
    max-width: var(--project-content-max);
    width: calc(100% - 2rem);
    margin-bottom: 5.5rem;
    padding: clamp(3rem, 7vw, 6rem) clamp(1.25rem, 4vw, 3.5rem);
    color: #f6eefc;
    border: 1px dashed rgba(198, 133, 255, .42);
    background:
      radial-gradient(
        58rem 42rem at var(--pj-light-pos, 72% 20%),
        rgba(166, 90, 232, .3) 0%,
        transparent 72%
      ),
      var(--tc-deep);
    background-attachment: fixed;
    box-shadow: 11px 12px 0 var(--tc-accent-soft);
  }
  /* método: 4 fases */
  .hg-fases { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
  .hg-fase {
    position: relative;
    padding: 1.35rem 1.2rem 1.25rem;
    border: 1px solid var(--paper-edge);
    background-color: var(--paper-sheet);
    background-image:
      repeating-linear-gradient(0deg, transparent 0 3px, rgba(28,27,24,.025) 3px 4px),
      url("/img/paper-noise.webp");
    background-size: 100% 100%, 140px 140px;
    box-shadow: 3px 4px 0 var(--paper-shadow);
    rotate: -.25deg;
  }
  .hg-fase:nth-child(even) { rotate: .35deg; }
  .hg-fase__n {
    font-family: var(--font-mono); font-size: var(--type-micro);
    letter-spacing: .16em; color: var(--tc-accent); display: block; margin-bottom: .7rem;
  }
  .hg-fase__t {
    font-family: var(--font-head); font-size: clamp(1.1rem, 2.2vw, 1.6rem);
    margin: 0 0 .6rem; line-height: 1.1;
  }
  .hg-fase__d { font-family: var(--font-body); font-size: var(--type-body); line-height: 1.62; opacity: .82; margin: 0; }

  /* STEEP: a letra é a âncora */
  .hg-steep { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1.6rem; }
  .hg-steep__l {
    font-family: var(--font-head); font-size: clamp(2.4rem, 5vw, 4.4rem);
    line-height: 1; color: var(--tc-accent); display: block; margin-bottom: .3rem;
  }
  .hg-steep__t {
    font-family: var(--font-body); font-size: var(--type-micro); font-weight: 600;
    text-transform: uppercase; letter-spacing: .14em; margin: 0 0 .7rem;
    padding-bottom: .6rem; border-bottom: 1px solid rgba(28,27,24,.25);
  }
  .hg-steep__d { font-family: var(--font-body); font-size: var(--type-body); line-height: 1.62; opacity: .82; margin: 0; }

  /* o que não fecha */
  .hg-gaps { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2.6rem 3rem; margin-bottom: 3rem; }
  .hg-gap__t {
    font-family: var(--font-head); font-size: clamp(1.2rem, 2.6vw, 1.9rem);
    margin: 0 0 .7rem; line-height: 1.12;
    padding-left: 1rem; border-left: 2px solid var(--tc-accent);
  }
  .hg-gap__d { font-family: var(--font-body); font-size: var(--type-body); line-height: 1.68; opacity: .86; margin: 0; padding-left: 1rem; }
  .hg-close {
    font-family: var(--font-head); font-style: italic;
    font-size: clamp(1.1rem, 2.4vw, 1.7rem); line-height: 1.35;
    max-width: 46ch; margin: 0; opacity: .9;
  }

  /* imagens */
  .hg-trio { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem; }
  .hg-img { width: 100%; display: block; border-radius: calc(var(--r-xl) - .45rem); }
  .hg-fig {
    overflow: hidden;
    padding: .45rem;
    border: 1px solid rgba(28,27,24,.26);
    border-radius: var(--r-xl);
    background: var(--tc-paper);
    box-shadow: 7px 8px 0 var(--tc-accent-soft);
    transition: translate var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out);
  }
  .hg-fig:hover { translate: 0 -5px; box-shadow: 11px 13px 0 var(--tc-accent-soft); }
  .hg-dupla { display: grid; grid-template-columns: 1.15fr .85fr; gap: 3rem; align-items: center; }
  /* telas de app: viraram mockups de celular em prancha 16:9 (recorte dela,
     2026-07-23) — em 190px ficavam ilegíveis, então agora é grade de 2 colunas */
  .hg-apps { display: grid; grid-template-columns: 1fr 1fr; gap: 1.6rem; }
  .hg-apps img {
    width: 100%;
    display: block;
    padding: .45rem;
    border: 1px dashed rgba(28,27,24,.28);
    border-radius: var(--r-xl);
    background: var(--tc-paper);
    box-shadow: 7px 8px 0 var(--tc-accent-soft);
  }
  .hg-cap {
    font-family: var(--font-mono); font-size: var(--type-micro);
    text-transform: uppercase; letter-spacing: .12em; opacity: .5;
    margin: .8rem 0 0;
  }

  @media (max-width: 900px) {
    .hg-fases { grid-template-columns: repeat(2, 1fr); gap: 1.8rem; }
    .hg-steep { grid-template-columns: repeat(2, 1fr); }
    .hg-gaps { grid-template-columns: 1fr; gap: 2rem; }
    .hg-dupla { grid-template-columns: 1fr; gap: 1.8rem; }
    .hg-trio { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .hg-sec { padding: 0 1.25rem 4rem; }
    .hg-fases { grid-template-columns: 1fr; }
    .hg-steep { grid-template-columns: 1fr; }
    .hg-apps { grid-template-columns: 1fr; }
  }
`;

export default function HoloGlamProject() {
  const { t, lang } = useT();
  const suf = lang === "en" ? "en" : "pt";

  const fases = [
    { n: "01", t: t("holo_m1"), d: t("holo_m1_d") },
    { n: "02", t: t("holo_m2"), d: t("holo_m2_d") },
    { n: "03", t: t("holo_m3"), d: t("holo_m3_d") },
    { n: "04", t: t("holo_m4"), d: t("holo_m4_d") },
  ];

  const steep = [
    { l: "S", t: t("holo_s1"), d: t("holo_s1_d") },
    { l: "T", t: t("holo_s2"), d: t("holo_s2_d") },
    { l: "E", t: t("holo_s3"), d: t("holo_s3_d") },
    { l: "E", t: t("holo_s4"), d: t("holo_s4_d") },
    { l: "P", t: t("holo_s5"), d: t("holo_s5_d") },
  ];

  const gaps = [
    { t: t("holo_g1_t"), d: t("holo_g1_d") },
    { t: t("holo_g2_t"), d: t("holo_g2_d") },
    { t: t("holo_g3_t"), d: t("holo_g3_d") },
    { t: t("holo_g4_t"), d: t("holo_g4_d") },
  ];

  return (
    <ProjectShell
      title={t("holo_title")}
      desc={
        <>
          {t("holo_desc_1")} <span className="pj-em">{t("holo_desc_em")}</span>
          {t("holo_desc_2")}
        </>
      }
      meta={[
        { label: t("holo_meta_ctx"), value: t("holo_meta_ctx_val") },
        { label: t("holo_meta_role"), value: t("holo_meta_role_val") },
      ]}
    >
      <CaseCanvas variant="hologlam">
      <style>{styles}</style>

      {/* a pergunta — antes de qualquer imagem */}
      <section className="hg-sec hg-opening">
        <motion.div {...reveal()}>
          <p className="hg-kicker">{t("holo_question_kicker")}</p>
          <AsciiDivider className="hg-rule" />
          <p className="hg-quest">{t("holo_question")}</p>
        </motion.div>
      </section>

      {/* os três looks */}
      <section className="hg-sec">
        <div className="hg-trio">
          {MODELS.map((model, i) => (
            <motion.figure key={model.n} className="hg-fig" style={{ margin: 0 }}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                className="hg-img"
                src={`/img/hologlam/modelo-${model.n}.webp`}
                width={model.width}
                height={model.height}
                sizes="(max-width: 900px) 100vw, 33vw"
                alt={`HoloGlam — look ${model.n}`}
              />
            </motion.figure>
          ))}
        </div>
        <p className="hg-cap">{t("holo_cred_imgs")}</p>
      </section>

      {/* método */}
      <section className="hg-sec">
        <motion.div {...reveal()}>
          <h2 className="hg-h2">{t("holo_method_title")}</h2>
          <div className="hg-fases">
            {fases.map((f) => (
              <div className="hg-fase" key={f.n}>
                <span className="hg-fase__n">{f.n}</span>
                <h3 className="hg-fase__t">{f.t}</h3>
                <p className="hg-fase__d">{f.d}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 01 entendimento */}
      <section className="hg-sec">
        <motion.div {...reveal()}>
          <p className="hg-kicker">{t("holo_ctx_kicker")}</p>
          <h2 className="hg-h2">{t("holo_ctx_title")}</h2>
          <p className="hg-p">{t("holo_ctx_1")}</p>
          <p className="hg-p hg-p--forte">{t("holo_ctx_2")}</p>
        </motion.div>
      </section>

      {/* STEEP */}
      <section className="hg-sec">
        <motion.div {...reveal()}>
          <h2 className="hg-h2">{t("holo_steep_title")}</h2>
          <p className="hg-p" style={{ marginBottom: "2.4rem" }}>{t("holo_steep_sub")}</p>
          <div className="hg-steep">
            {steep.map((s, i) => (
              <div key={i}>
                <span className="hg-steep__l">{s.l}</span>
                <p className="hg-steep__t">{s.t}</p>
                <p className="hg-steep__d">{s.d}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 02 especulação — a roda */}
      <section className="hg-sec">
        <motion.div {...reveal()}>
          <p className="hg-kicker">{t("holo_wheel_kicker")}</p>
          <h2 className="hg-h2">{t("holo_wheel_title")}</h2>
          <p className="hg-p" style={{ marginBottom: "2rem" }}>{t("holo_wheel_sub")}</p>
        </motion.div>
        <FutureWheel />
      </section>

      {/* 03 ativação — o artefato */}
      <section className="hg-sec">
        <div className="hg-dupla">
          <motion.div {...reveal()}>
            <p className="hg-kicker">{t("holo_art_kicker")}</p>
            <h2 className="hg-h2">{t("holo_art_title")}</h2>
            <p className="hg-p">{t("holo_art_1")}</p>
            <p className="hg-p">{t("holo_art_2")}</p>
            <p className="hg-p">{t("holo_art_3")}</p>
          </motion.div>
          {/* imagem com fundo transparente (recorte dela) — flutua na página */}
          <motion.figure className="hg-fig" style={{ margin: 0, background: "transparent" }}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              className="hg-img"
              src="/img/hologlam/portal.webp"
              width={1600}
              height={900}
              sizes="(max-width: 900px) 100vw, 45vw"
              alt="HoloGlam — projeção holográfica"
            />
          </motion.figure>
        </div>
      </section>

      {/* o app — pequeno de propósito */}
      <section className="hg-sec">
        <motion.div {...reveal()}>
          <h2 className="hg-h2">{t("holo_app_title")}</h2>
          <p className="hg-p">{t("holo_app_1")}</p>
          <p className="hg-p" style={{ marginBottom: "2.2rem" }}>{t("holo_app_2")}</p>
          <div className="hg-apps">
            <Image
              src={`/img/hologlam/app-${suf}.webp`}
              width={1600}
              height={900}
              sizes="(max-width: 560px) 100vw, 50vw"
              alt="HoloGlam — app"
            />
            <Image
              src={`/img/hologlam/comunidade-${suf}.webp`}
              width={1600}
              height={900}
              sizes="(max-width: 560px) 100vw, 50vw"
              alt="HoloGlam — comunidade"
            />
          </div>
        </motion.div>
      </section>

      {/* o que não fecha — o coração da página */}
      <section className="hg-sec hg-critical">
        <motion.div {...reveal()}>
          <p className="hg-kicker">{t("holo_gap_kicker")}</p>
          <h2 className="hg-h2">{t("holo_gap_title")}</h2>
          <p className="hg-p" style={{ marginBottom: "3rem" }}>{t("holo_gap_intro")}</p>
          <div className="hg-gaps">
            {gaps.map((g, i) => (
              <div key={i}>
                <h3 className="hg-gap__t">{g.t}</h3>
                <p className="hg-gap__d">{g.d}</p>
              </div>
            ))}
          </div>
          <p className="hg-close">{t("holo_gap_close")}</p>
        </motion.div>
      </section>

      {/* 04 reverberação */}
      <section className="hg-sec">
        <motion.div {...reveal()}>
          <p className="hg-kicker">{t("holo_rev_kicker")}</p>
          <h2 className="hg-h2">{t("holo_rev_title")}</h2>
          <p className="hg-p">{t("holo_rev_1")}</p>
          <p className="hg-p">{t("holo_rev_2")}</p>
        </motion.div>
      </section>

      {/* créditos */}
      <section className="hg-sec" style={{ paddingBottom: "6rem" }}>
        <h2 className="pj-h2">{t("grad_credits_title")}</h2>
        <div
          style={{
            padding: "1.4rem 0",
            borderTop: "1px solid rgba(28,27,24,.28)",
            borderBottom: "1px solid rgba(28,27,24,.28)",
          }}
        >
          <div className="pj-meta__value">Maria Isabel Lisita · Maria Luiza Costa</div>
        </div>
      </section>
      </CaseCanvas>
    </ProjectShell>
  );
}
