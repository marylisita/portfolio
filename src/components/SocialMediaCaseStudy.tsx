"use client";

import ProjectShell from "@/components/ProjectShell";
import {
  CaseCanvas,
  CaseCarousel,
  CaseCredits,
  CaseFigure,
  CaseSection,
  CaseStats,
} from "@/components/CaseStudyKit";
import { SOCIAL_CLIENTS, type SocialSection } from "@/content/socialMediaCases";
import { useT } from "@/i18n/LanguageContext";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * /work/social-media: um projeto, três clientes. Cada cliente é um capítulo
 * com a própria cor (wrapper `.tc--<cliente>` sobre o canvas roxo comum).
 * As métricas dos três perfis ficam juntas numa única faixa escura, com
 * período e fonte; os créditos fecham a página. Conteúdo em
 * `src/content/socialMediaCases.ts`.
 */
export default function SocialMediaCaseStudy() {
  const { t, lang } = useT();
  const pt = lang !== "en";
  const l = pt ? "pt" : "en";

  /* Numeração contínua dos capítulos, na ordem em que aparecem. */
  const chapters = SOCIAL_CLIENTS.flatMap((client) =>
    client.sections.map((section) => ({ client, section })),
  );
  const numbersAt = chapters.length + 1;

  const images = (section: SocialSection, first: boolean) => {
    const items = section.images.map((image) => ({
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
          items={items}
          wide={items.length <= 3}
        />
      );
    }
    return (
      <div className={`tc-grid ${section.layout === "grid-three" ? "tc-grid--three" : "tc-grid--two"}`}>
        {items.map((image, i) => (
          <CaseFigure
            key={image.src}
            {...image}
            index={`${pt ? "imagem" : "image"} ${pad(i + 1)}`}
            priority={first && i === 0}
          />
        ))}
      </div>
    );
  };

  const credits = SOCIAL_CLIENTS.flatMap((client) =>
    client.credits.map((credit) => ({ label: credit.label[l], value: credit.value[l] })),
  );

  return (
    <ProjectShell
      accent="#7446e0"
      cover={false}
      title={
        <>
          <strong style={{ color: "#7446e0", fontWeight: 700 }}>social media:</strong>{" "}
          {pt ? "metagallery, metaverse agency e byron mendes" : "metagallery, metaverse agency and byron mendes"}
        </>
      }
      desc={
        pt
          ? "Posts e carrosséis para três perfis em 2026: a inauguração da nova sede da MetaGallery, galeria de arte e tecnologia; o robô Tobias na Rio Innovation Week, para a Metaverse Agency; e uma série editorial para o perfil profissional de Byron Mendes."
          : "Posts and carousels for three profiles in 2026: the opening of MetaGallery's new space, an art and technology gallery; the robot Tobias at Rio Innovation Week, for Metaverse Agency; and an editorial series for Byron Mendes's professional profile."
      }
      meta={[
        { label: pt ? "clientes" : "clients", value: SOCIAL_CLIENTS.map((c) => c.client).join(", ") },
        { label: t("ebat_meta_role"), value: pt ? "Social media e direção de arte" : "Social media & art direction" },
        { label: pt ? "formato" : "format", value: pt ? "Posts e carrosséis (4:5)" : "Posts and carousels (4:5)" },
        { label: pt ? "ano" : "year", value: "2026" },
      ]}
    >
      <CaseCanvas variant="social-media">
        {chapters.map(({ client, section }, i) => (
          <div className={`tc--${client.variant}`} key={section.images[0].src}>
            <CaseSection
              label={`${pad(i + 1)} / ${client.client.toLowerCase()}, ${section.label[l].replace(/^\d+\s*\/\s*/, "")}`}
              title={section.title[l]}
              intro={section.intro[l]}
            >
              {images(section, i === 0)}
            </CaseSection>
          </div>
        ))}

        <CaseSection
          ink
          label={pt ? `${pad(numbersAt)} / números dos perfis` : `${pad(numbersAt)} / profile numbers`}
          title={pt ? "alcance & presença" : "reach & presence"}
          intro={
            pt
              ? "O que o painel profissional de cada perfil mostrava em novembro de 2026, numa janela de 30 dias. São números do perfil inteiro, não de uma peça isolada, e os três perfis têm tamanhos muito diferentes."
              : "What each profile's professional dashboard showed in November 2026, over a 30-day window. These are numbers for the whole profile, not for a single post, and the three profiles differ a lot in size."
          }
        >
          {SOCIAL_CLIENTS.map((client, ci) => (
            <div className={`tc--${client.variant} tc-stats-block`} key={client.id}>
              <CaseStats
                period={
                  pt
                    ? `${client.client.toLowerCase()}, últimos 30 dias`
                    : `${client.client.toLowerCase()}, last 30 days`
                }
                items={client.stats.map((stat) => ({
                  value: stat.value[l],
                  label: stat.label[l],
                  detail: stat.detail[l],
                }))}
                highlight={client.highlight[l]}
                note={
                  ci === SOCIAL_CLIENTS.length - 1
                    ? pt
                      ? "Fonte: painéis profissionais e capturas das publicações enviadas pelos clientes em novembro de 2026. A variação compara com o período anterior do próprio painel e não demonstra que as peças, sozinhas, causaram a mudança. Resultados de posts valem para a data da captura."
                      : "Source: professional dashboards and post screenshots provided by the clients in November 2026. Changes compare against each dashboard's own previous period and do not show that these posts alone caused them. Post results reflect the date of capture."
                    : undefined
                }
              />
            </div>
          ))}
        </CaseSection>

        <CaseSection
          compact
          label={pt ? `${pad(numbersAt + 1)} / créditos` : `${pad(numbersAt + 1)} / credits`}
          title={pt ? "obra, evento e fotografia" : "artwork, event and photography"}
        >
          <CaseCredits items={credits} />
        </CaseSection>
      </CaseCanvas>
    </ProjectShell>
  );
}
