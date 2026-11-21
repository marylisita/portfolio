"use client";

import ProjectShell from "@/components/ProjectShell";
import {
  CaseCanvas,
  CaseCarousel,
  CaseCredits,
  CaseFigure,
  CaseNotes,
  CaseSection,
  CaseStats,
} from "@/components/CaseStudyKit";
import { getSocialCase, type SocialSection } from "@/content/socialMediaCases";
import { useT } from "@/i18n/LanguageContext";

/**
 * Página dos cases de social media. Os três usam a mesma casca e o mesmo kit
 * dos outros cases (ProjectShell + CaseStudyKit); só os dados mudam, em
 * `src/content/socialMediaCases.ts`.
 */
export default function SocialMediaCaseStudy({ slug }: { slug: string }) {
  const { t, lang } = useT();
  const pt = lang !== "en";
  const l = pt ? "pt" : "en";
  const item = getSocialCase(slug);
  if (!item) return null;

  const [first, ...rest] = item.sections;
  const next = item.sections.length + 1;
  const pad = (n: number) => String(n).padStart(2, "0");

  const renderImages = (section: SocialSection, sectionIndex: number) => {
    const images = section.images.map((image) => ({
      src: image.src,
      width: image.width,
      height: image.height,
      alt: image.alt[l],
      caption: image.caption[l],
    }));
    if (section.layout === "carousel") {
      return (
        <CaseCarousel
          label={`${pt ? "Carrossel" : "Carousel"}: ${section.title[l]}`}
          items={images}
          wide={images.length <= 3}
        />
      );
    }
    return (
      <div className={`tc-grid ${section.layout === "grid-three" ? "tc-grid--three" : "tc-grid--two"}`}>
        {images.map((image, i) => (
          <CaseFigure
            key={image.src}
            {...image}
            index={`${pt ? "imagem" : "image"} ${pad(i + 1)}`}
            priority={sectionIndex === 0 && i === 0}
          />
        ))}
      </div>
    );
  };

  const section = (s: SocialSection, i: number) => (
    <CaseSection key={s.label.pt} label={s.label[l]} title={s.title[l]} intro={s.intro[l]}>
      {renderImages(s, i)}
    </CaseSection>
  );

  return (
    <ProjectShell
      accent={item.accent}
      cover={false}
      title={
        <>
          <strong style={{ color: item.accent, fontWeight: 700 }}>{item.titleStrong}</strong>{" "}
          {item.titleRest[l]}
        </>
      }
      desc={item.desc[l]}
      meta={[
        { label: t("ebat_meta_client"), value: item.client },
        { label: t("ebat_meta_role"), value: item.role[l] },
        { label: pt ? "formato" : "format", value: item.formats[l] },
        { label: pt ? "ano" : "year", value: "2026" },
      ]}
    >
      <CaseCanvas variant={item.variant}>
        {section(first, 0)}

        {rest.map((s, i) => section(s, i + 1))}

        {/* A pergunta e o resultado já abrem a página (ProjectShell lê
            projectStories). A faixa escura fica com as métricas: é o
            conteúdo que só estes cases têm. */}
        <CaseSection
          ink
          label={pt ? `${pad(next)} / números do perfil` : `${pad(next)} / profile numbers`}
          title={pt ? "alcance & presença" : "reach & presence"}
          intro={
            pt
              ? "O que o painel profissional do perfil mostrava em novembro de 2026, numa janela de 30 dias. São números do perfil inteiro, não de uma peça isolada."
              : "What the profile's professional dashboard showed in November 2026, over a 30-day window. These are numbers for the whole profile, not for a single post."
          }
        >
          <CaseStats
            period={pt ? "perfil, últimos 30 dias, captura de novembro de 2026" : "profile, last 30 days, captured november 2026"}
            items={item.stats.map((stat) => ({
              value: stat.value[l],
              label: stat.label[l],
              detail: stat.detail[l],
            }))}
            highlight={item.highlight[l]}
            note={
              pt
                ? "Fonte: painel profissional e capturas das publicações enviadas pela cliente. A variação compara com o período anterior do próprio painel e não demonstra que as peças, sozinhas, causaram a mudança. Resultados de posts valem para a data da captura."
                : "Source: the professional dashboard and post screenshots provided by the client. Changes compare against the dashboard's own previous period and do not show that these posts alone caused them. Post results reflect the date of capture."
            }
          />
        </CaseSection>

        <CaseSection
          compact
          label={pt ? `${pad(next + 1)} / decisões` : `${pad(next + 1)} / decisions`}
          title={pt ? "linguagem visual" : "visual language"}
        >
          <CaseNotes items={item.notes.map((note) => note[l])} />
          {item.credits.length ? (
            <CaseCredits
              items={item.credits.map((credit) => ({ label: credit.label[l], value: credit.value[l] }))}
            />
          ) : null}
        </CaseSection>
      </CaseCanvas>
    </ProjectShell>
  );
}
