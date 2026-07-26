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

const MANUAL = Array.from({ length: 22 }, (_, index) => `ebat/manual/${index + 1}.jpg`);
const CAROUSEL_ONE = Array.from({ length: 7 }, (_, index) => `ebat/carrossel/${index + 1}.jpg`);
const CAROUSEL_TWO = Array.from({ length: 4 }, (_, index) => `ebat/carrossel 2/${index + 1}.jpg`);

const SPIW = [
  { src: "/img/ebat/mockup outer.webp", alt: "SPIW outer page mockup" },
  { src: "/img/ebat/mockup inner.webp", alt: "SPIW inner page mockup" },
  { src: "/img/ebat/Outer Page.png", alt: "SPIW outer page" },
  { src: "/img/ebat/Inner Page.png", alt: "SPIW inner page" },
] as const;

const POSTS = [
  { src: "/img/ebat/post.jpg", label: "post_convite.jpg" },
  { src: "/img/ebat/artes instagram/livro.png", label: "post_livro.png" },
  { src: "/img/ebat/artes instagram/modulo1.png", label: "post_modulo01.png" },
] as const;

export default function EbatProject() {
  const { t, lang } = useT();
  const pt = lang !== "en";

  return (
    <ProjectShell accent="#3158d7"
      title={
        <>
          <strong style={{ color: "#3158d7", fontWeight: 700 }}>EBAT</strong> - Escola de Arte e Tecnologia
        </>
      }
      desc={
        <>
          {t("ebat_desc")} <span className="pj-em">{t("ebat_desc_highlight")}</span> {t("ebat_desc_rest")}
        </>
      }
      meta={[
        { label: t("ebat_meta_client"), value: "EBAT" },
        { label: t("ebat_meta_role"), value: t("ebat_meta_role_val") },
        { label: t("ebat_meta_year"), value: "2026" },
      ]}
    >
      <CaseCanvas variant="ebat">
        <CaseSection
          label={pt ? "01 / identidade como caderno" : "01 / identity as a workbook"}
          title={t("ebat_manual_title")}
          intro={t("ebat_manual_desc")}
        >
          <CaseFigure
            src="/img/ebat/capa-ebat.png"
            width={1280}
            height={720}
            alt={pt ? "Capa do sistema visual da EBAT" : "EBAT visual system cover"}
            caption={pt ? "abertura do manual" : "brand manual opening"}
            index="caderno 01"
            priority
            tilt={-0.4}
            sizes="(max-width: 1260px) 92vw, 1180px"
          />
          <div style={{ marginTop: "clamp(2rem, 5vw, 4rem)" }}>
            <CasePanel label={pt ? "manual de marca · folheável" : "brand manual · browsable"}>
              <FlipBook images={MANUAL} aspectRatio="56.25%" />
            </CasePanel>
          </div>
        </CaseSection>

        <CaseImpact
          challengeLabel={t("ebat_chal_kicker")}
          challengeTitle={t("ebat_chal_title")}
          challengeDesc={t("ebat_chal_desc")}
          impactLabel={t("ebat_imp_kicker")}
          impactTitle={t("ebat_imp_title")}
          impactDesc={t("ebat_imp_desc")}
        />

        <CaseSection
          label={pt ? "02 / campanha editorial" : "02 / editorial campaign"}
          title={t("ebat_spiw_title")}
          intro={t("ebat_spiw_desc")}
        >
          <div className="tc-grid tc-grid--two tc-grid--offset">
            {SPIW.slice(0, 2).map((image, index) => (
              <CaseFigure
                key={image.src}
                src={image.src}
                width={2000}
                height={1414}
                alt={image.alt}
                caption={pt ? "mockup impresso" : "printed mockup"}
                index={`lâmina 0${index + 2}`}
                tilt={index === 0 ? -0.65 : 0.65}
              />
            ))}
          </div>
          <div className="tc-grid tc-grid--two" style={{ marginTop: "clamp(2rem, 5vw, 4rem)" }}>
            {SPIW.slice(2).map((image, index) => (
              <CaseFigure
                key={image.src}
                src={image.src}
                width={2000}
                height={1414}
                alt={image.alt}
                caption={pt ? "arquivo aberto" : "flat artwork"}
                index={`lâmina 0${index + 4}`}
                tilt={index === 0 ? 0.35 : -0.35}
              />
            ))}
          </div>
          <div style={{ marginTop: "clamp(2rem, 5vw, 4rem)" }}>
            <CasePanel label="spiw_recap.mp4">
              <video
                src="/img/ebat/video-ebat.mp4"
                controls
                muted
                loop
                playsInline
                preload="metadata"
                style={{ width: "100%", display: "block" }}
              />
            </CasePanel>
          </div>
        </CaseSection>

        <CaseSection
          label={pt ? "03 / comunicação em circulação" : "03 / communication in circulation"}
          title={t("ebat_social_title")}
          intro={
            pt
              ? "Os carrosséis são tratados como pequenos cadernos editoriais. As peças avulsas aparecem abaixo como impressos presos à mesma mesa."
              : "Carousels are treated as small editorial booklets. Individual posts sit below like prints pinned to the same table."
          }
        >
          <div className="tc-grid tc-grid--two tc-grid--offset">
            <CasePanel label={pt ? "carrossel · boas-vindas" : "carousel · welcome"}>
              <FlipBook images={CAROUSEL_ONE} aspectRatio="125%" />
            </CasePanel>
            <CasePanel label={pt ? "carrossel · módulos" : "carousel · modules"}>
              <FlipBook images={CAROUSEL_TWO} aspectRatio="125%" />
            </CasePanel>
          </div>

          <div className="tc-grid tc-grid--three tc-grid--offset" style={{ marginTop: "clamp(3rem, 7vw, 6rem)" }}>
            {POSTS.map((post, index) => (
              <CaseFigure
                key={post.src}
                src={post.src}
                width={1080}
                height={1350}
                alt={post.label}
                caption={post.label}
                index={`post 0${index + 1}`}
                tilt={[-0.8, 0.65, -0.35][index]}
              />
            ))}
          </div>
        </CaseSection>
      </CaseCanvas>
    </ProjectShell>
  );
}
