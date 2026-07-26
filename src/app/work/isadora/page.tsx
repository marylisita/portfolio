"use client";

import FlipBook from "@/components/FlipBook";
import ProjectShell from "@/components/ProjectShell";
import {
  CaseCanvas,
  CaseFigure,
  CasePanel,
  CaseSection,
  CaseImpact,
} from "@/components/CaseStudyKit";
import { useT } from "@/i18n/LanguageContext";

const LANDSCAPE = [
  "ISADORA CAPA-THUMBNAIL.webp",
  "Isadora 2.webp",
  "Isadora 3.webp",
  "Isadora 4.webp",
  "Isadora 5.webp",
  "Isadora 6.webp",
  "ISADORA8.webp",
  "ISADORA 9.webp",
  "ISADORA 10.webp",
];

const VERTICAL = [
  "isadora_vertical/Prancheta 1.webp",
  "isadora_vertical/Prancheta 2.webp",
  "isadora_vertical/Prancheta 3.webp",
  "isadora_vertical/Prancheta 4.webp",
  "isadora_vertical/Prancheta 5.webp",
  "isadora_vertical/Prancheta 7.webp",
  "isadora_vertical/Prancheta 9.webp",
  "isadora_vertical/Prancheta 10.webp",
  "isadora_vertical/Prancheta 11.webp",
];

export default function IsadoraProject() {
  const { t, lang } = useT();
  const pt = lang !== "en";

  return (
    <ProjectShell accent="#E32026"
      title={
        <>
          <strong style={{ color: "#E32026", fontWeight: 700 }}>press kit</strong> â€” isadora ruppert
        </>
      }
      desc={
        <>
          {t("isadora_subtitle")} <span className="pj-em">{t("isadora_highlight1")}</span>{" "}
          <span className="pj-em">{t("isadora_highlight2")}</span>
        </>
      }
      meta={[
        { label: t("isadora_meta_client"), value: "Isadora Ruppert" },
        { label: t("isadora_meta_role"), value: t("isadora_meta_role_val") },
        { label: t("isadora_meta_year"), value: "2026" },
      ]}
    >
      <CaseCanvas variant="isadora">
        <CaseSection
          label={pt ? "01 / presenÃ§a editorial" : "01 / editorial presence"}
          title={pt ? "um retrato que se desdobra" : "a portrait that unfolds"}
          intro={
            pt
              ? "O press kit Ã© apresentado como um objeto editorial, nÃ£o como um carrossel de telas. Preto, branco e respiro preservam a presenÃ§a da artista."
              : "The press kit is presented as an editorial object rather than a screen carousel. Black, white and generous space preserve the artistâ€™s presence."
          }
        >
          <CaseFigure
            src="/img/ISADORA CAPA-THUMBNAIL.webp"
            width={1920}
            height={1080}
            alt={pt ? "Capa do press kit de Isadora Ruppert" : "Isadora Ruppert press kit cover"}
            caption={pt ? "capa do dossiÃª" : "press dossier cover"}
            index="caderno 01"
            priority
            tilt={-0.45}
            sizes="(max-width: 1260px) 92vw, 1180px"
          />
        </CaseSection>

        <CaseImpact
          challengeLabel={t("isadora_chal_kicker")}
          challengeTitle={t("isadora_chal_title")}
          challengeDesc={t("isadora_chal_desc")}
          impactLabel={t("isadora_imp_kicker")}
          impactTitle={t("isadora_imp_title")}
          impactDesc={t("isadora_imp_desc")}
        />

        <CaseSection
          label={pt ? "02 / caderno horizontal" : "02 / landscape folio"}
          title={pt ? "folhear para conhecer" : "browse to discover"}
          intro={
            pt
              ? "As pÃ¡ginas vivem dentro de uma pasta escura, como material enviado para imprensa, curadoria e produÃ§Ã£o."
              : "The pages live inside a dark folder, like material sent to press, curators and production teams."
          }
        >
          <CasePanel label={pt ? "arraste ou use as setas" : "drag or use the arrows"}>
            <FlipBook images={LANDSCAPE} />
          </CasePanel>
        </CaseSection>

        <CaseSection
          compact
          label={pt ? "03 / formato vertical" : "03 / portrait format"}
          title={t("isadora_vertical_title")}
          intro={t("isadora_vertical_sub")}
        >
          <CasePanel label={pt ? "versÃ£o para leitura vertical" : "portrait reading version"}>
            <FlipBook images={VERTICAL} aspectRatio="141.4%" />
          </CasePanel>
        </CaseSection>

        <CaseSection compact>
          <p className="tc-manifest">
            {pt ? "imagem, trajetÃ³ria & " : "image, trajectory & "}
            <em>{pt ? "presenÃ§a." : "presence."}</em>
          </p>
        </CaseSection>
      </CaseCanvas>
    </ProjectShell>
  );
}

