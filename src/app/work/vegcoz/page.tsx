"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import ProjectShell from "@/components/ProjectShell";
import { CaseCanvas } from "@/components/CaseStudyKit";
import AsciiDivider from "@/components/AsciiDivider";
import { useT } from "@/i18n/LanguageContext";

/**
 * VegCoz — case de UX.
 *
 * ANTES: a página servia /img/vegcoz/1.png E /img/vegcoz/2.png, que são a MESMA
 * prancha do Behance em resoluções diferentes (1400x21705 e 1920x29767). Ou
 * seja: 6,4 MB, a mesma coisa duas vezes, sem texto, sem estrutura, sem
 * responsividade — e as nove etapas do processo invisíveis dentro do PNG.
 *
 * AGORA: a prancha foi fatiada nas nove etapas (1,1 MB no total, −82%) e cada
 * uma ganhou título e texto próprios. O projeto é um processo de UX completo,
 * não "branding": pesquisa com 45 pessoas, benchmarking de três concorrentes,
 * card sorting, jornada, arquitetura, três personas, wireframes e telas finais.
 *
 * Os títulos originais da prancha ficaram DE FORA de cada fatia de propósito
 * (o corte começa abaixo deles) — quem titula agora é a tipografia do site.
 *
 * Layout: `span` alterna largura e lado a cada etapa. Nove blocos iguais viravam
 * uma lista; alternando, vira composição.
 */

const reveal = (d = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.75, delay: d, ease: [0.16, 1, 0.3, 1] as const },
});

const ETAPAS = [
  { id: "questionario", n: "01", t: "vz_s1", d: "vz_s1_d", span: "side", width: 1920, height: 4420 },
  { id: "benchmarking", n: "02", t: "vz_s2", d: "vz_s2_d", span: "side", width: 1920, height: 3521 },
  { id: "cardsorting", n: "03", t: "vz_s3", d: "vz_s3_d", span: "wide", width: 1742, height: 854 },
  { id: "jornada", n: "04", t: "vz_s4", d: "vz_s4_d", span: "full", width: 1920, height: 1380 },
  { id: "arquitetura", n: "05", t: "vz_s5", d: "vz_s5_d", span: "wide", width: 1740, height: 1075 },
  { id: "personas", n: "06", t: "vz_s6", d: "vz_s6_d", span: "side", width: 1920, height: 2945 },
  { id: "wireframes", n: "07", t: "vz_s7", d: "vz_s7_d", span: "full", width: 1920, height: 2181 },
  { id: "identidade", n: "08", t: "vz_s8", d: "vz_s8_d", span: "wide", width: 1885, height: 854 },
  { id: "telas", n: "09", t: "vz_s9", d: "vz_s9_d", span: "side", width: 1889, height: 4851 },
] as const;

const styles = `
  .vz { --gut: var(--project-gutter); }
  .vz-sec { max-width: var(--project-content-max); margin: 0 auto; padding: 0 var(--gut) 5rem; }
  .vz-opening {
    max-width: var(--project-content-max);
    width: calc(100% - 2rem);
    margin-bottom: 5rem;
    padding: clamp(3rem, 7vw, 6rem) clamp(1.25rem, 4vw, 3.5rem);
    color: #f3f6e8;
    border: 1px dashed rgba(146, 188, 111, .48);
    background:
      radial-gradient(
        56rem 40rem at var(--pj-light-pos, 72% 18%),
        rgba(112, 158, 82, .32) 0%,
        transparent 72%
      ),
      var(--tc-deep);
    background-attachment: fixed;
    box-shadow: 11px 12px 0 var(--tc-accent-soft);
  }

  .vz-lead {
    font-family: var(--font-head); font-weight: 400;
    font-size: clamp(1.4rem, 3.4vw, 2.5rem); line-height: 1.25;
    /* Este é um texto de contexto, não um título: a medida curta de heading
       deixava a abertura fragmentada e criava um vazio desproporcional. */
    max-width: min(100%, 31ch); margin: 0;
    text-wrap: pretty;
  }
  .vz-kicker {
    font-family: var(--font-subtitle, var(--font-mono)); font-size: var(--type-micro);
    text-transform: uppercase; letter-spacing: .2em; opacity: .55;
    margin: 0 0 .9rem;
  }
  .vz-rule { margin: 0 0 2.2rem; color: currentColor; opacity: .5; }

  /* as tres fases */
  .vz-fases { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.2rem; }
  .vz-fase {
    position: relative;
    padding: 1.35rem 1.2rem 1.3rem;
    border: 1px solid var(--paper-edge);
    background-color: var(--paper-sheet);
    background-image:
      repeating-linear-gradient(0deg, transparent 0 3px, rgba(28,27,24,.025) 3px 4px),
      url("/img/paper-noise.webp");
    background-size: 100% 100%, 140px 140px;
    box-shadow: 3px 4px 0 var(--paper-shadow);
    rotate: -.25deg;
  }
  .vz-fase:nth-child(even) { rotate: .35deg; }
  .vz-fase__n {
    font-family: var(--font-subtitle, var(--font-mono));
    font-size: var(--type-micro); letter-spacing: .14em; opacity: .62; display: block; margin-bottom: .5rem;
  }
  .vz-fase__t { font-family: var(--font-head); font-size: clamp(1.2rem, 2.4vw, 1.7rem); margin: 0 0 .4rem; line-height: 1.1; }
  .vz-fase__d { font-family: var(--font-body); font-size: var(--type-body); line-height: 1.62; opacity: .82; margin: 0; }

  /* etapa */
  .vz-etapa { margin-bottom: 5.5rem; }
  .vz-etapa__cab { display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1rem; }
  .vz-etapa__n {
    font-family: var(--font-subtitle, var(--font-mono));
    font-size: clamp(1.6rem, 4vw, 2.8rem); line-height: 1;
    color: var(--tc-accent); opacity: .72; letter-spacing: -.02em;
  }
  .vz-etapa__t {
    font-family: var(--font-head); font-weight: 400;
    font-size: clamp(1.7rem, 4.4vw, 3rem); line-height: 1.02;
    letter-spacing: -.015em; margin: 0;
  }
  .vz-etapa__d {
    font-family: var(--font-body); font-size: clamp(1.04rem, 1.4vw, 1.15rem); line-height: 1.7;
    opacity: .8; max-width: var(--measure-copy); margin: 0 0 1.8rem;
    text-wrap: pretty;
  }
  .vz-fig {
    margin: 0;
    overflow: hidden;
    padding: clamp(.35rem, .8vw, .55rem);
    border: 1px solid rgba(28,27,24,.26);
    background: var(--tc-paper);
    box-shadow: 8px 9px 0 var(--tc-accent-soft);
    transition: translate var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out);
  }
  .vz-fig:hover { translate: 0 -5px; box-shadow: 12px 14px 0 var(--tc-accent-soft); }
  .vz-fig img { width: 100%; display: block; }

  /* lado a lado: o texto gruda no topo enquanto a imagem alta rola */
  .vz-etapa--side .vz-etapa__corpo {
    display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 5fr);
    gap: clamp(1.5rem, 4vw, 3.5rem); align-items: start;
  }
  .vz-etapa--side .vz-etapa__txt { position: sticky; top: 6rem; }
  .vz-etapa--wide .vz-etapa__corpo { max-width: 900px; }
  .vz-etapa--full .vz-fig { margin-inline: calc(var(--gut) * -1); }

  /* alterna o lado da imagem nas etapas "side" */
  .vz-etapa--side:nth-of-type(even) .vz-etapa__corpo { direction: rtl; }
  .vz-etapa--side:nth-of-type(even) .vz-etapa__corpo > * { direction: ltr; }

  /* blocos de sintese intercalados entre as etapas */
  .vz-bloco {
    margin: -2.5rem 0 5.5rem;
    padding: 2.2rem;
    border: 1px solid var(--paper-edge);
    background-color: var(--paper-sheet);
    background-image:
      repeating-linear-gradient(0deg, transparent 0 3px, rgba(28,27,24,.025) 3px 4px),
      url("/img/paper-noise.webp");
    background-size: 100% 100%, 140px 140px;
    box-shadow: 4px 5px 0 var(--paper-shadow);
    rotate: -.2deg;
  }
  .vz-bloco--forte { border-top-width: 2px; border-top-color: var(--ink); }
  .vz-bloco__t {
    font-family: var(--font-head); font-weight: 400;
    font-size: clamp(1.4rem, 3.2vw, 2.2rem); line-height: 1.08;
    margin: 0 0 1.2rem;
  }
  .vz-ciclo {
    font-family: var(--font-subtitle, var(--font-mono));
    font-size: clamp(.78rem, 1.7vw, 1.05rem);
    letter-spacing: .06em; margin: 0 0 1.2rem;
  }
  .vz-tres { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.2rem; }

  .vz-retro { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.4rem; margin-bottom: 2.6rem; }
  .vz-r__t {
    font-family: var(--font-head); font-size: clamp(1.15rem, 2.4vw, 1.6rem);
    font-weight: 700; color: var(--tc-accent);
    margin: 0 0 .6rem; line-height: 1.15;
    padding-left: .9rem; border-left: 2px solid var(--tc-accent);
  }
  .vz-r__d { font-family: var(--font-body); font-size: var(--type-body); line-height: 1.68; opacity: .86; margin: 0; padding-left: .9rem; }
  .vz-close {
    font-family: var(--font-head); font-style: italic;
    font-size: clamp(1.05rem, 2.2vw, 1.6rem); line-height: 1.35;
    max-width: 46ch; margin: 0; opacity: .9;
  }

  @media (max-width: 900px) {
    .vz-fases { grid-template-columns: 1fr; gap: 1.6rem; }
    .vz-retro, .vz-tres { grid-template-columns: 1fr; gap: 1.8rem; }
    .vz-etapa--side .vz-etapa__corpo { grid-template-columns: 1fr; }
    .vz-etapa--side .vz-etapa__txt { position: static; }
    .vz-etapa--side:nth-of-type(even) .vz-etapa__corpo { direction: ltr; }
  }
`;

export default function VegCozProject() {
  const { t } = useT();

  const fases = [
    { n: "01", tt: t("vz_f1"), d: t("vz_f1_d") },
    { n: "02", tt: t("vz_f2"), d: t("vz_f2_d") },
    { n: "03", tt: t("vz_f3"), d: t("vz_f3_d") },
  ];

  const insights = [
    { tt: t("vz_i1_t"), d: t("vz_i1_d") },
    { tt: t("vz_i2_t"), d: t("vz_i2_d") },
    { tt: t("vz_i3_t"), d: t("vz_i3_d") },
  ];

  const decisoes = [
    { tt: t("vz_d1_t"), d: t("vz_d1_d") },
    { tt: t("vz_d2_t"), d: t("vz_d2_d") },
    { tt: t("vz_d3_t"), d: t("vz_d3_d") },
  ];

  return (
    <ProjectShell
      title={
        <>
          <strong style={{ color: "#4f7f3a", fontWeight: 700 }}>vegcoz:</strong> culinária consciente
        </>
      }
      desc={
        <>
          {t("vegcoz_desc_1")} <span className="pj-em">{t("vegcoz_desc_em")}</span>
          {t("vegcoz_desc_2")}
        </>
      }
      meta={[
        { label: t("vegcoz_meta_ctx"), value: t("vegcoz_meta_ctx_val") },
        { label: t("vegcoz_meta_role"), value: t("vegcoz_meta_role_val") },
      ]}
    >
      <CaseCanvas variant="vegcoz">
      <div className="vz">
        <style>{styles}</style>

        {/* abertura */}
        <section className="vz-sec vz-opening">
          <motion.div {...reveal()}>
            <AsciiDivider className="vz-rule" />
            <p className="vz-lead">{t("vz_lead")}</p>
          </motion.div>
        </section>

        {/* capa */}
        <section className="vz-sec">
          <motion.figure className="vz-fig" {...reveal()}>
            <Image
              src="/img/vegcoz/capa.png"
              width={1400}
              height={991}
              sizes="(max-width: 1180px) 92vw, 1120px"
              alt="VegCoz"
              priority
            />
          </motion.figure>
        </section>

        {/* as tres fases */}
        <section className="vz-sec">
          <motion.div {...reveal()}>
            <p className="vz-kicker">{t("vz_fases_title")}</p>
            <div className="vz-fases">
              {fases.map((f) => (
                <div className="vz-fase" key={f.n}>
                  <span className="vz-fase__n">{f.n}</span>
                  <h3 className="vz-fase__t">{f.tt}</h3>
                  <p className="vz-fase__d">{f.d}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* as nove etapas, com as sinteses intercaladas onde elas nascem:
            a leitura da pesquisa vem logo depois do questionario, a conclusao do
            benchmarking logo depois dele, e as decisoes antes das telas finais. */}
        <section className="vz-sec">
          {ETAPAS.map((e) => (
            <div key={e.id}>
              <motion.article className={`vz-etapa vz-etapa--${e.span}`} {...reveal()}>
                <div className="vz-etapa__cab">
                  <span className="vz-etapa__n">{e.n}</span>
                  <h2 className="vz-etapa__t">{t(e.t)}</h2>
                </div>
                <div className="vz-etapa__corpo">
                  <div className="vz-etapa__txt">
                    <p className="vz-etapa__d">{t(e.d)}</p>
                  </div>
                  <figure className="vz-fig">
                    <Image
                      src={`/img/vegcoz/${e.id}.webp`}
                      width={e.width}
                      height={e.height}
                      sizes="(max-width: 900px) 92vw, 62vw"
                      alt={t(e.t)}
                    />
                  </figure>
                </div>
              </motion.article>

              {/* leitura das 4 perguntas */}
              {e.id === "questionario" && (
                <motion.div className="vz-bloco" {...reveal()}>
                  <p className="vz-kicker">{t("vz_ins_kicker")}</p>
                  <h3 className="vz-bloco__t">{t("vz_ins_title")}</h3>
                  <div className="vz-tres">
                    {insights.map((it, i) => (
                      <div key={i}>
                        <h4 className="vz-r__t">{it.tt}</h4>
                        <p className="vz-r__d">{it.d}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* a lacuna que o benchmarking revela */}
              {e.id === "benchmarking" && (
                <motion.div className="vz-bloco vz-bloco--forte" {...reveal()}>
                  <h3 className="vz-bloco__t">{t("vz_gap_title")}</h3>
                  <p className="vz-ciclo">{t("vz_gap_ciclo")}</p>
                  <p className="vz-etapa__d" style={{ marginBottom: 0 }}>{t("vz_gap_d")}</p>
                </motion.div>
              )}

              {/* achado -> escolha de produto */}
              {e.id === "identidade" && (
                <motion.div className="vz-bloco" {...reveal()}>
                  <p className="vz-kicker">{t("vz_dec_kicker")}</p>
                  <h3 className="vz-bloco__t">{t("vz_dec_title")}</h3>
                  <p className="vz-etapa__d">{t("vz_dec_intro")}</p>
                  <div className="vz-tres">
                    {decisoes.map((it, i) => (
                      <div key={i}>
                        <h4 className="vz-r__t">{it.tt}</h4>
                        <p className="vz-r__d">{it.d}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </section>

        {/* creditos */}
        <section className="vz-sec" style={{ paddingBottom: "6rem" }}>
          <h2 className="pj-h2">{t("vegcoz_credits_title")}</h2>
          <div style={{ padding: "1.3rem 0", borderTop: "1px solid rgba(28,27,24,.28)", borderBottom: "1px solid rgba(28,27,24,.28)" }}>
            <div className="pj-meta__value">{t("vegcoz_credits_val")}</div>
          </div>
        </section>
      </div>
      </CaseCanvas>
    </ProjectShell>
  );
}
