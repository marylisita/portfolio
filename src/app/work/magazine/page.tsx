"use client";

import ProjectShell from "@/components/ProjectShell";
import {
  CaseCanvas,
  CaseFigure,
  CasePanel,
  CaseSection,
  CaseImpact,
} from "@/components/CaseStudyKit";
import { useT } from "@/i18n/LanguageContext";

const SPREADS = [
  { src: "/img/helvetica/1.png", width: 1124, height: 632 },
  { src: "/img/helvetica/2.png", width: 1124, height: 632 },
  { src: "/img/helvetica/3.png", width: 1124, height: 632 },
  { src: "/img/helvetica/4.png", width: 1124, height: 632 },
  { src: "/img/helvetica/5.png", width: 1124, height: 632 },
  { src: "/img/helvetica/6.png", width: 1124, height: 632 },
  { src: "/img/helvetica/7.png", width: 893, height: 632 },
  { src: "/img/helvetica/8.png", width: 893, height: 632 },
  { src: "/img/helvetica/9.jpg", width: 948, height: 632 },
  { src: "/img/helvetica/10.jpg", width: 948, height: 632 },
] as const;

export default function MagazineProject() {
  const { t, lang } = useT();
  const pt = lang !== "en";

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
      <CaseCanvas variant="magazine">
        <CaseSection
          label={pt ? "01 / revista como objeto" : "01 / magazine as object"}
          title={pt ? "tipografia que ocupa espaço" : "typography taking up space"}
          intro={
            pt
              ? "As páginas deixam de ser imagens alinhadas e passam a se comportar como provas de impressão sobre uma mesa: giradas, sobrepostas e com marcas de manuseio."
              : "Pages stop behaving like aligned images and become print proofs on a table: rotated, layered and marked by handling."
          }
        >
          <CaseFigure
            {...SPREADS[0]}
            alt={pt ? "Capa da revista experimental de tipografia" : "Cover of the experimental typography magazine"}
            caption={pt ? "abertura · david carson" : "opening · david carson"}
            index="prova 01"
            priority
            tilt={-0.5}
            sizes="(max-width: 1260px) 92vw, 1180px"
          />
          <div style={{ marginTop: "clamp(2rem, 5vw, 4rem)" }}>
            <CasePanel label={pt ? "nota de processo" : "process note"}>
              <p className="tc-copy" style={{ margin: 0 }}>{t("magazine_p3")}</p>
            </CasePanel>
          </div>
        </CaseSection>

        <CaseImpact
          challengeLabel={t("magazine_chal_kicker")}
          challengeTitle={t("magazine_chal_title")}
          challengeDesc={t("magazine_chal_desc")}
          impactLabel={t("magazine_imp_kicker")}
          impactTitle={t("magazine_imp_title")}
          impactDesc={t("magazine_imp_desc")}
        />

        <CaseSection
          ink
          label={pt ? "02 / tensão editorial" : "02 / editorial tension"}
          title={pt ? "ordem suficiente para sustentar o ruído" : "enough order to hold the noise"}
          intro={
            pt
              ? "A composição alterna respiro e colisão. O contraste não vem de um efeito digital genérico, mas do modo como as folhas se aproximam e se afastam."
              : "The composition alternates breathing room and collision. Contrast comes not from a generic digital effect, but from the way sheets move closer and farther apart."
          }
        >
          <div className="tc-grid tc-grid--two tc-grid--offset">
            {SPREADS.slice(1, 3).map((spread, index) => (
              <CaseFigure
                key={spread.src}
                {...spread}
                alt={pt ? "Diagramação experimental da revista" : "Experimental magazine layout"}
                caption={pt ? "abertura tipográfica" : "typographic spread"}
                index={`prova 0${index + 2}`}
                tilt={index === 0 ? -1 : 1}
              />
            ))}
          </div>
        </CaseSection>

        <CaseSection compact>
          <CaseFigure
            {...SPREADS[3]}
            alt={pt ? "Página dupla da revista experimental" : "Experimental magazine double-page spread"}
            caption={pt ? "página dupla" : "double-page spread"}
            index="prova 04"
            tilt={0.35}
            sizes="(max-width: 1050px) 92vw, 980px"
          />
        </CaseSection>

        <CaseSection
          label={pt ? "03 / recortes" : "03 / fragments"}
          title={pt ? "três vozes na mesma bancada" : "three voices on one workbench"}
          intro={
            pt
              ? "Os recortes menores formam uma grade irregular, como referências separadas durante o processo de edição."
              : "Smaller fragments form an irregular grid, like references separated during the editing process."
          }
        >
          <div className="tc-grid tc-grid--three tc-grid--offset">
            {SPREADS.slice(4, 7).map((spread, index) => (
              <CaseFigure
                key={spread.src}
                {...spread}
                alt={pt ? "Recorte editorial da revista" : "Editorial magazine fragment"}
                caption={pt ? "recorte editorial" : "editorial fragment"}
                index={`prova 0${index + 5}`}
                tilt={[-1, 0.7, -0.4][index]}
              />
            ))}
          </div>
        </CaseSection>

        <CaseSection
          ink
          label={pt ? "04 / sequência final" : "04 / final sequence"}
          title={pt ? "o ritmo fecha sem se acalmar" : "the rhythm closes without calming down"}
          intro={
            pt
              ? "As últimas provas preservam a instabilidade da publicação, mas ganham uma hierarquia clara de leitura."
              : "The final proofs preserve the publication’s instability while gaining a clear reading hierarchy."
          }
        >
          <div className="tc-grid tc-grid--asym">
            <CaseFigure
              {...SPREADS[7]}
              alt={pt ? "Prova editorial oito" : "Editorial proof eight"}
              caption={pt ? "prova de impressão" : "print proof"}
              index="prova 08"
              tilt={-0.75}
            />
            <div className="tc-grid tc-grid--stack">
              {SPREADS.slice(8).map((spread, index) => (
                <CaseFigure
                  key={spread.src}
                  {...spread}
                  alt={pt ? "Prova editorial final" : "Final editorial proof"}
                  caption={pt ? "encerramento" : "closing"}
                  index={`prova ${String(index + 9).padStart(2, "0")}`}
                  tilt={index === 0 ? 0.65 : -0.35}
                />
              ))}
            </div>
          </div>
        </CaseSection>
      </CaseCanvas>
    </ProjectShell>
  );
}
