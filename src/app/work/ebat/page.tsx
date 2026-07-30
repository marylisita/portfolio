"use client";

import FlipBook from "@/components/FlipBook";
import ProjectShell from "@/components/ProjectShell";
import {
  CaseCanvas,
  CaseFigure,
  CasePanel,
  CaseSection,
} from "@/components/CaseStudyKit";
import { useT } from "@/i18n/LanguageContext";

const MANUAL = Array.from({ length: 22 }, (_, index) => `ebat/manual/${index + 1}.webp`);
const CAROUSEL_ONE = Array.from({ length: 7 }, (_, index) => `ebat/carrossel/${index + 1}.webp`);
const CAROUSEL_TWO = Array.from({ length: 4 }, (_, index) => `ebat/carrossel 2/${index + 1}.webp`);

const SPIW = [
  { src: "/img/ebat/mockup outer.webp", altPt: "Folder da EBAT aberto em mockup", altEn: "Open EBAT brochure mockup" },
  { src: "/img/ebat/mockup inner.webp", altPt: "Verso do folder da EBAT em mockup", altEn: "Back of the EBAT brochure mockup" },
  { src: "/img/ebat/Outer Page.webp", altPt: "Arte externa do folder da EBAT", altEn: "EBAT brochure outer artwork" },
  { src: "/img/ebat/Inner Page.webp", altPt: "Arte interna do folder da EBAT", altEn: "EBAT brochure inner artwork" },
] as const;

const POSTS = [
  {
    src: "/img/ebat/post.webp",
    captionPt: "calendário do processo seletivo",
    captionEn: "application calendar",
  },
  {
    src: "/img/ebat/artes instagram/livro.webp",
    captionPt: "conteúdo editorial",
    captionEn: "editorial content",
  },
  {
    src: "/img/ebat/artes instagram/modulo1.webp",
    captionPt: "comunicação de módulo",
    captionEn: "module communication",
  },
] as const;

export default function EbatProject() {
  const { t, lang } = useT();
  const pt = lang !== "en";

  return (
    <ProjectShell
      accent="#3158d7"
      title={
        <>
          <strong style={{ color: "#3158d7", fontWeight: 700 }}>EBAT:</strong>{" "}
          {pt ? "arte & tecnologia" : "art & technology"}
        </>
      }
      desc={
        <>
          {t("ebat_desc")} <span className="pj-em">{t("ebat_desc_highlight")}</span>{" "}
          {t("ebat_desc_rest")}
        </>
      }
      role={
        pt
          ? "Designer da escola: identidade, redes sociais, peças impressas e campanha audiovisual."
          : "School designer: identity, social media, print pieces and an audiovisual campaign."
      }
      meta={[
        { label: t("ebat_meta_client"), value: "EBAT" },
        { label: t("ebat_meta_role"), value: t("ebat_meta_role_val") },
        { label: t("ebat_meta_year"), value: "2026" },
      ]}
    >
      <CaseCanvas variant="ebat">
        <CaseSection
          ink
          label={pt ? "01 / o sistema" : "01 / the system"}
          title={pt ? "a identidade precisava ser ensinável" : "the identity had to be teachable"}
          intro={
            pt
              ? "Reuni logo, paleta, tipografia, tom de voz e aplicações em 22 páginas. O manual é operacional: registra as decisões de base para que outra pessoa da equipe consiga montar uma peça sem começar do zero."
              : "I brought the logo, palette, typography, tone of voice and applications together in 22 pages. The manual is operational: it records the base decisions so someone else on the team can build a piece without starting from scratch."
          }
        >
          <CaseFigure
            src="/img/ebat/capa-ebat.webp"
            width={1280}
            height={720}
            alt={pt ? "Assinatura visual da EBAT" : "EBAT visual signature"}
            caption={pt ? "abertura do manual" : "brand manual opening"}
            index={pt ? "imagem 01" : "image 01"}
            priority
            sizes="(max-width: 1260px) 92vw, 1180px"
          />
          <div style={{ marginTop: "clamp(2rem, 5vw, 4rem)" }}>
            <CasePanel label={pt ? "manual de marca · 22 páginas" : "brand manual · 22 pages"}>
              <FlipBook images={MANUAL} aspectRatio="56.25%" />
            </CasePanel>
          </div>
        </CaseSection>

        <CaseSection
          label={pt ? "02 / a rotina" : "02 / the routine"}
          title={pt ? "um sistema que precisa publicar toda semana" : "a system that has to publish every week"}
          intro={
            pt
              ? "Nas redes, a identidade sustenta o calendário do processo seletivo, os módulos e os encontros presenciais. Os carrosséis organizam sequência; as peças avulsas resolvem data, convocação e serviço."
              : "On social media, the identity carries the application calendar, modules and in-person meetings. Carousels organise sequence; individual posts handle dates, calls and practical information."
          }
        >
          <div className="tc-grid tc-grid--two">
            <CasePanel label={pt ? "carrossel · processo seletivo" : "carousel · applications"}>
              <FlipBook images={CAROUSEL_ONE} aspectRatio="125%" />
            </CasePanel>
            <CasePanel label={pt ? "carrossel · módulos" : "carousel · modules"}>
              <FlipBook images={CAROUSEL_TWO} aspectRatio="125%" />
            </CasePanel>
          </div>

          <div
            className="tc-grid tc-grid--three"
            style={{ marginTop: "clamp(3rem, 7vw, 6rem)" }}
          >
            {POSTS.map((post, index) => (
              <CaseFigure
                key={post.src}
                src={post.src}
                width={1080}
                height={1350}
                alt={pt ? post.captionPt : post.captionEn}
                caption={pt ? post.captionPt : post.captionEn}
                index={`${pt ? "imagem" : "image"} 0${index + 2}`}
              />
            ))}
          </div>
        </CaseSection>

        <CaseSection
          ink
          label={pt ? "03 / fora da escola" : "03 / outside the school"}
          title={pt ? "caber no SPIW sem virar startup" : "fitting into SPIW without becoming a startup"}
          intro={t("ebat_spiw_desc")}
        >
          <div className="tc-grid tc-grid--two">
            {SPIW.slice(0, 2).map((image, index) => (
              <CaseFigure
                key={image.src}
                src={image.src}
                width={2000}
                height={1414}
                alt={pt ? image.altPt : image.altEn}
                caption={pt ? "folder em contexto" : "brochure in context"}
                index={`${pt ? "imagem" : "image"} 0${index + 5}`}
              />
            ))}
          </div>

          <div
            className="tc-grid tc-grid--two"
            style={{ marginTop: "clamp(2rem, 5vw, 4rem)" }}
          >
            {SPIW.slice(2).map((image, index) => (
              <CaseFigure
                key={image.src}
                src={image.src}
                width={2000}
                height={1414}
                alt={pt ? image.altPt : image.altEn}
                caption={pt ? "arquivo para impressão" : "print-ready artwork"}
                index={`${pt ? "imagem" : "image"} 0${index + 7}`}
              />
            ))}
          </div>

          <div style={{ marginTop: "clamp(2rem, 5vw, 4rem)" }}>
            <CasePanel label={pt ? "campanha audiovisual · recap" : "audiovisual campaign · recap"}>
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
      </CaseCanvas>
    </ProjectShell>
  );
}
