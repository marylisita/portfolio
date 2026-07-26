"use client";

import ProjectShell from "@/components/ProjectShell";
import {
  CaseCanvas,
  CaseFigure,
  CasePanel,
  CaseSection,
} from "@/components/CaseStudyKit";
import { useT } from "@/i18n/LanguageContext";

export default function GenLabProject() {
  const { t, lang } = useT();
  const pt = lang !== "en";

  return (
    <ProjectShell
      title={
        <>
          <strong style={{ color: "#B482F6", fontWeight: 700 }}>GenLab:</strong> {pt ? "Ideias que moldam o mundo digital." : "Ideas that shape the digital world."}
        </>
      }
      desc={
        <>
          {t("genlab_desc")} <span className="pj-em">{t("genlab_highlight1")}</span> {t("genlab_desc2")}{" "}
          <span className="pj-em">{t("genlab_highlight2")}</span>
        </>
      }
      meta={[
        { label: t("genlab_meta_platform"), value: t("genlab_meta_platform_val") },
        { label: t("genlab_meta_services"), value: t("genlab_meta_services_val") },
        { label: t("genlab_meta_status"), value: t("genlab_meta_status_val") },
      ]}
    >
      <CaseCanvas variant="genlab">
        <CaseSection
          ink
          label={pt ? "01 / laboratório aberto" : "01 / open laboratory"}
          title={pt ? "a ferramenta também é experimento" : "the tool is also an experiment"}
          intro={
            pt
              ? "O GenLab não aparece como uma tela de produto isolada. Ele ocupa uma mesa escura de ensaio, e a luz acompanha o visitante como se estivesse examinando uma amostra."
              : "GenLab is not presented as an isolated product screen. It occupies a dark workbench, while light follows the visitor as if inspecting a sample."
          }
        >
          <CaseFigure
            src="/img/genlab.png"
            width={1743}
            height={868}
            alt="GenLab Experimental"
            caption={pt ? "interface generativa em execução" : "generative interface in motion"}
            index="ensaio 01"
            priority
            sizes="(max-width: 1260px) 92vw, 1180px"
          />
        </CaseSection>

        <CaseSection
          label={pt ? "02 / princípio" : "02 / principle"}
          title={t("genlab_feature_title")}
          intro={
            <>
              <p style={{ margin: "0 0 1rem" }}>{t("genlab_feature_p1")}</p>
              <p style={{ margin: 0 }}>{t("genlab_feature_p2")}</p>
            </>
          }
        >
          <p className="tc-manifest">
            {pt ? "gerar, observar, " : "generate, observe, "}
            <em>{pt ? "interferir." : "interfere."}</em>
          </p>
        </CaseSection>

        <CaseSection compact>
          <CasePanel label={pt ? "experimento disponível" : "experiment available"}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              <p className="tc-copy" style={{ margin: 0 }}>
                {pt
                  ? "A experiência continua fora do portfólio: o laboratório pode ser aberto e testado diretamente no navegador."
                  : "The experience continues beyond the portfolio: the laboratory can be opened and tested directly in the browser."}
              </p>
              <a
                className="tc-action hover-trigger"
                href="https://marylisita.github.io/genlabdesign/index.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("genlab_access").toLowerCase()} ↗
              </a>
            </div>
          </CasePanel>
        </CaseSection>
      </CaseCanvas>
    </ProjectShell>
  );
}
