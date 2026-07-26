"use client";

import ProjectShell from "@/components/ProjectShell";
import {
  CaseCanvas,
  CaseCredits,
  CaseFigure,
  CaseSection,
  CaseImpact,
} from "@/components/CaseStudyKit";
import { useT } from "@/i18n/LanguageContext";

const IMAGES = [
  { n: "01", src: "/img/chinario/1.jpg", width: 1600, height: 1068 },
  { n: "02", src: "/img/chinario/2.jpg", width: 1600, height: 1236 },
  { n: "03", src: "/img/chinario/3.jpg", width: 1600, height: 1651 },
  { n: "04", src: "/img/chinario/4.jpg", width: 1600, height: 1848 },
  { n: "05", src: "/img/chinario/5.jpg", width: 1600, height: 2689 },
  { n: "06", src: "/img/chinario/6.jpg", width: 1600, height: 2857 },
] as const;

export default function ChinaRioProject() {
  const { t, lang } = useT();
  const pt = lang !== "en";

  return (
    <ProjectShell accent="#c90035"
      title={
        <>
          <strong style={{ color: "#c90035", fontWeight: 700 }}>china-rio:</strong> pontes para inovaÃ§Ã£o
        </>
      }
      desc={
        <>
          {t("chinario_desc_1")} <span className="pj-em">{t("chinario_desc_em")}</span>
          {t("chinario_desc_2")}
        </>
      }
      meta={[
        { label: t("ebat_meta_client"), value: "PUC-Rio" },
        { label: t("ebat_meta_role"), value: pt ? "Design grÃ¡fico" : "Graphic design" },
      ]}
    >
      <CaseCanvas variant="chinario">
        <CaseSection
          label={pt ? "01 / sistema de pontes" : "01 / system of bridges"}
          title={pt ? "duas cidades, uma linguagem" : "two cities, one language"}
          intro={
            pt
              ? "A identidade organiza encontro, diplomacia e inovaÃ§Ã£o sem recorrer a uma estÃ©tica institucional fria. Formas modulares constroem uma ponte visual entre Rio e China."
              : "The identity brings together encounter, diplomacy and innovation without relying on a cold institutional aesthetic. Modular forms build a visual bridge between Rio and China."
          }
        >
          <CaseFigure
            {...IMAGES[0]}
            alt={pt ? "Identidade visual Chinaâ€“Rio" : "Chinaâ€“Rio visual identity"}
            caption={pt ? "abertura do sistema visual" : "visual system opening"}
            index="espÃ©cime 01"
            priority
            sizes="(max-width: 1260px) 92vw, 1180px"
          />
        </CaseSection>

        <CaseImpact
          challengeLabel={t("chinario_chal_kicker")}
          challengeTitle={t("chinario_chal_title")}
          challengeDesc={t("chinario_chal_desc")}
          impactLabel={t("chinario_imp_kicker")}
          impactTitle={t("chinario_imp_title")}
          impactDesc={t("chinario_imp_desc")}
        />

        <CaseSection
          label={pt ? "02 / traduÃ§Ã£o visual" : "02 / visual translation"}
          title={pt ? "sÃ­mbolos que se encontram" : "symbols meeting"}
          intro={
            pt
              ? "As peÃ§as alternam escala, ritmo e densidade como cartazes retirados de um mesmo arquivo. O vermelho vira matÃ©ria de impressÃ£o, nÃ£o apenas cor de marca."
              : "The pieces alternate scale, rhythm and density like posters pulled from the same archive. Red becomes a printing material, not merely a brand color."
          }
        >
          <div className="tc-grid tc-grid--asym tc-grid--offset">
            <CaseFigure
              {...IMAGES[1]}
              alt={pt ? "AplicaÃ§Ã£o grÃ¡fica Chinaâ€“Rio" : "Chinaâ€“Rio graphic application"}
              caption={pt ? "mÃ³dulos & tipografia" : "modules & typography"}
              index="folha 02"
              tilt={-0.7}
            />
            <CaseFigure
              {...IMAGES[2]}
              alt={pt ? "Desdobramento da identidade Chinaâ€“Rio" : "Chinaâ€“Rio identity development"}
              caption={pt ? "ritmo editorial" : "editorial rhythm"}
              index="folha 03"
              tilt={0.8}
            />
          </div>
        </CaseSection>

        <CaseSection compact>
          <CaseFigure
            {...IMAGES[3]}
            alt={pt ? "ComposiÃ§Ã£o visual do projeto Chinaâ€“Rio" : "Chinaâ€“Rio project visual composition"}
            caption={pt ? "a ponte como estrutura" : "the bridge as structure"}
            index="folha 04"
            tilt={-0.35}
            sizes="(max-width: 1050px) 92vw, 980px"
          />
        </CaseSection>

        <CaseSection
          label={pt ? "03 / arquivo aplicado" : "03 / applied archive"}
          title={pt ? "um sistema que se estende" : "a system that extends"}
          intro={
            pt
              ? "Nos materiais longos, a identidade mantÃ©m coerÃªncia sem perder variaÃ§Ã£o. As duas folhas sÃ£o apresentadas como documentos paralelos, quase um dÃ­ptico."
              : "Across longer materials, the identity remains coherent without losing variation. The two sheets appear as parallel documents, almost a diptych."
          }
        >
          <div className="tc-grid tc-grid--two tc-grid--offset">
            <CaseFigure
              {...IMAGES[4]}
              alt={pt ? "AplicaÃ§Ãµes extensas da identidade Chinaâ€“Rio" : "Extended Chinaâ€“Rio identity applications"}
              caption={pt ? "documento a" : "document a"}
              index="folha 05"
              tilt={-0.55}
            />
            <CaseFigure
              {...IMAGES[5]}
              alt={pt ? "Sistema visual completo Chinaâ€“Rio" : "Complete Chinaâ€“Rio visual system"}
              caption={pt ? "documento b" : "document b"}
              index="folha 06"
              tilt={0.55}
            />
          </div>
        </CaseSection>

        <CaseSection compact>
          <p className="tc-tape">{t("chinario_tagline")}</p>
        </CaseSection>

        <CaseSection
          compact
          label={pt ? "04 / ficha" : "04 / credits"}
          title={t("grad_credits_title")}
        >
          <CaseCredits
            items={[
              {
                label: pt ? "design" : "design",
                value: "Dillon Wong Â· Maria I. Lisita Â· VinÃ­cius de Moura",
              },
            ]}
          />
        </CaseSection>
      </CaseCanvas>
    </ProjectShell>
  );
}

