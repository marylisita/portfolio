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

const GALLERY = [
  { src: "/img/pilotis/1.jpg", width: 1600, height: 511 },
  { src: "/img/pilotis/2.jpg", width: 1600, height: 2573 },
  { src: "/img/pilotis/3.jpg", width: 1600, height: 949 },
  { src: "/img/pilotis/4.jpg", width: 1600, height: 566 },
  { src: "/img/pilotis/5.jpg", width: 1600, height: 1190 },
  { src: "/img/pilotis/6.jpg", width: 1600, height: 900 },
  { src: "/img/pilotis/7.jpg", width: 1600, height: 1118 },
  { src: "/img/pilotis/8.jpg", width: 1600, height: 136 },
] as const;

const CREDIT_NAMES = [
  { key: "pilotis_cred_design", names: "Vinícius de Moura · Stella Bandeira · Matheus Petermann" },
  { key: "pilotis_cred_comms", names: "Carolina Mello · Raphaela Ortega" },
  { key: "pilotis_cred_social", names: "Stella Bandeira · Matheus Petermann · Maria Isabel Lisita" },
  { key: "pilotis_cred_ux", names: "Raquel Pinheiro" },
  { key: "pilotis_cred_video", names: "Johnson Victor" },
  { key: "pilotis_cred_photo", names: "Guilherme Chartuni · Raphaela Ortega" },
] as const;

export default function PilotisProject() {
  const { t, lang } = useT();
  const pt = lang !== "en";

  return (
    <ProjectShell accent="#00a8ad"
      title={
        <>
          <strong style={{ color: "#00a8ad", fontWeight: 700 }}>devs no pilotis</strong>
        </>
      }
      desc={
        <>
          {t("pilotis_desc_1")} <span className="pj-em">{t("pilotis_desc_em")}</span>
          {t("pilotis_desc_2")}
        </>
      }
      meta={[
        { label: t("ebat_meta_client"), value: "Instituto ECOA PUC-Rio" },
        { label: t("ebat_meta_role"), value: "Social Media" },
      ]}
    >
      <CaseCanvas variant="pilotis">
        <CaseSection
          label={pt ? "01 / identidade em campo" : "01 / identity in the field"}
          title={pt ? "tecnologia ocupando o pilotis" : "technology taking over the pilotis"}
          intro={
            pt
              ? "A cobertura visual aproxima programação, realidade virtual e encontro presencial. O sistema gráfico funciona como sinalização: rápido, legível e reconhecível em movimento."
              : "The visual coverage connects programming, virtual reality and in-person encounters. The graphic system works like signage: fast, legible and recognizable in motion."
          }
        >
          <CaseFigure
            {...GALLERY[0]}
            alt={pt ? "Identidade do evento Devs no Pilotis" : "Devs no Pilotis event identity"}
            caption={pt ? "assinatura do evento" : "event signature"}
            index="placa 01"
            priority
            sizes="(max-width: 1260px) 92vw, 1180px"
          />
        </CaseSection>

        <CaseImpact
          challengeLabel={t("pilotis_chal_kicker")}
          challengeTitle={t("pilotis_chal_title")}
          challengeDesc={t("pilotis_chal_desc")}
          impactLabel={t("pilotis_imp_kicker")}
          impactTitle={t("pilotis_imp_title")}
          impactDesc={t("pilotis_imp_desc")}
        />

        <CaseSection
          label={pt ? "02 / cobertura" : "02 / coverage"}
          title={pt ? "um feed com ritmo de evento" : "a feed with event rhythm"}
          intro={
            pt
              ? "A sequência vertical é tratada como uma faixa de cobertura presa à página. Ao lado, a síntese horizontal mostra como a identidade atravessa formatos."
              : "The vertical sequence becomes a coverage strip pinned to the page. Beside it, the horizontal summary shows how the identity moves across formats."
          }
        >
          <div className="tc-grid tc-grid--asym-reverse">
            <CaseFigure
              {...GALLERY[1]}
              alt={pt ? "Sequência de publicações do evento Devs no Pilotis" : "Devs no Pilotis social post sequence"}
              caption={pt ? "cobertura contínua" : "continuous coverage"}
              index="faixa 02"
              tilt={-0.45}
            />
            <CaseFigure
              {...GALLERY[2]}
              alt={pt ? "Peças digitais do evento Devs no Pilotis" : "Devs no Pilotis digital pieces"}
              caption={pt ? "sistema nas redes" : "social system"}
              index="folha 03"
              tilt={0.6}
            />
          </div>
        </CaseSection>

        <CaseSection
          label={pt ? "03 / sinais do encontro" : "03 / signals of the encounter"}
          title={pt ? "pessoas primeiro, código depois" : "people first, code second"}
          intro={
            pt
              ? "As imagens do evento mantêm o público no centro. Os sinais gráficos organizam a leitura sem cobrir a experiência registrada."
              : "Event imagery keeps people at the center. Graphic signals organize the reading without covering the documented experience."
          }
        >
          <div className="tc-grid tc-grid--stack">
            <CaseFigure
              {...GALLERY[3]}
              alt={pt ? "Faixa gráfica do evento Devs no Pilotis" : "Devs no Pilotis graphic strip"}
              caption={pt ? "faixa de chamada" : "announcement strip"}
              index="faixa 04"
              tilt={-0.25}
              sizes="(max-width: 1260px) 92vw, 1180px"
            />
            <div className="tc-grid tc-grid--two tc-grid--offset">
              {GALLERY.slice(4, 6).map((image, index) => (
                <CaseFigure
                  key={image.src}
                  {...image}
                  alt={pt ? "Registros e aplicações do Devs no Pilotis" : "Devs no Pilotis records and applications"}
                  caption={pt ? "registro aplicado" : "applied record"}
                  index={`folha 0${index + 5}`}
                  tilt={index === 0 ? -0.65 : 0.65}
                />
              ))}
            </div>
          </div>
        </CaseSection>

        <CaseSection compact>
          <CaseFigure
            {...GALLERY[6]}
            alt={pt ? "Mosaico final do evento Devs no Pilotis" : "Final Devs no Pilotis event mosaic"}
            caption={pt ? "arquivo do encontro" : "encounter archive"}
            index="folha 07"
            tilt={0.35}
            sizes="(max-width: 1050px) 92vw, 980px"
          />
          <div style={{ marginTop: "clamp(1.4rem, 4vw, 3rem)" }}>
            <CaseFigure
              {...GALLERY[7]}
              alt={pt ? "Assinatura gráfica de encerramento" : "Closing graphic signature"}
              caption={pt ? "encerramento" : "closing"}
              index="faixa 08"
              sizes="(max-width: 1050px) 92vw, 980px"
            />
          </div>
        </CaseSection>

        <CaseSection compact>
          <a
            className="tc-action hover-trigger"
            href="https://instituto.ecoa.puc-rio.br/devs-no-pilotis/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("pilotis_visit")} ↗
          </a>
        </CaseSection>

        <CaseSection
          label={pt ? "04 / ficha" : "04 / credits"}
          title={t("grad_credits_title")}
        >
          <CaseCredits
            items={CREDIT_NAMES.map((credit) => ({
              label: t(credit.key),
              value: credit.names,
            }))}
          />
        </CaseSection>
      </CaseCanvas>
    </ProjectShell>
  );
}
