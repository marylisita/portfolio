"use client";

import ProjectShell from "@/components/ProjectShell";
import {
  CaseCanvas,
  CaseCredits,
  CaseFigure,
  CaseSection,
} from "@/components/CaseStudyKit";
import { useT } from "@/i18n/LanguageContext";

const GALLERY = [
  { src: "/img/graduation/2.webp", width: 1401, height: 642 },
  { src: "/img/graduation/3.webp", width: 1600, height: 814 },
  { src: "/img/graduation/4.webp", width: 1600, height: 1142 },
  { src: "/img/graduation/5.webp", width: 1600, height: 784 },
  { src: "/img/graduation/6.webp", width: 1401, height: 901 },
  { src: "/img/graduation/7.webp", width: 1401, height: 901 },
  { src: "/img/graduation/8.webp", width: 1600, height: 1028 },
  { src: "/img/graduation/9.webp", width: 1600, height: 524 },
  { src: "/img/graduation/10.webp", width: 1600, height: 379 },
] as const;

export default function GraduationProject() {
  const { t, lang } = useT();
  const pt = lang !== "en";

  return (
    <ProjectShell
      accent="#fb4c2f"
      title={
        <>
          <strong style={{ color: "#fb4c2f", fontWeight: 700 }}>apple academy:</strong> graduation
        </>
      }
      desc={
        <>
          {t("grad_desc_1")} <span className="pj-em">{t("grad_desc_em")}</span> {t("grad_desc_2")}
        </>
      }
      role={
        pt
          ? "Design gráfico em equipe de três, do sistema visual aos desdobramentos do kit."
          : "Graphic design in a three-person team, from the visual system to the kit applications."
      }
      meta={[
        { label: t("ebat_meta_client"), value: "Apple Developer Academy" },
        { label: t("ebat_meta_role"), value: t("grad_meta_role_val") },
        { label: t("ebat_meta_year"), value: "2025" },
      ]}
    >
      <CaseCanvas variant="graduation">
        <CaseSection
          ink
          label={pt ? "01 / de onde veio" : "01 / where it came from"}
          title={pt ? "a textura veio de um postal" : "the texture came from a postcard"}
          intro={
            pt
              ? "Levei o cartão-postal como referência inicial: granulado de impressão barata, saturação alta e a onda do calçadão. A identidade usa um padrão que muda de cor conforme a peça; a repetição está no desenho, não numa marca fixa."
              : "I brought the postcard in as the starting reference: cheap-print grain, high saturation and the Copacabana promenade wave. The identity uses a pattern that changes colour with each piece; the repetition sits in the drawing, not in a fixed mark."
          }
        >
          <CaseFigure
            src="/img/graduation/animacao.webp"
            width={1000}
            height={494}
            alt={pt ? "Animação da identidade Rio de Janeiro Starter Pack" : "Rio de Janeiro Starter Pack identity animation"}
            caption={pt ? "marca em movimento" : "identity in motion"}
            index={pt ? "imagem 01" : "image 01"}
            priority
            sizes="(max-width: 1260px) 92vw, 1180px"
          />
        </CaseSection>

        <CaseSection
          label={pt ? "02 / o alfabeto" : "02 / the alphabet"}
          title={pt ? "qual Rio entra no kit" : "which Rio goes in the kit"}
          intro={
            pt
              ? "A seleção dos ícones foi uma decisão editorial. Cristo e Pão de Açúcar dão ao convidado uma entrada reconhecível. Guaravita, cadeira de plástico, biscoito Globo e joelho de padaria trazem o Rio que depende de alguém daqui apontar."
              : "Choosing the icons was an editorial decision. Christ the Redeemer and Sugarloaf give guests a recognisable way in. Guaravita, a plastic chair, Globo biscuits and the corner-bakery joelho bring in the Rio that depends on someone from here pointing it out."
          }
        >
          <div className="tc-grid tc-grid--two tc-grid--offset">
            {GALLERY.slice(0, 2).map((image, index) => (
              <CaseFigure
                key={image.src}
                {...image}
                alt={pt ? "Elementos da identidade visual de formatura" : "Graduation visual identity elements"}
                caption={index === 0 ? (pt ? "paleta & ritmo" : "palette & rhythm") : (pt ? "sistema gráfico" : "graphic system")}
                index={`${pt ? "imagem" : "image"} 0${index + 2}`}
              />
            ))}
          </div>
        </CaseSection>

        <CaseSection
          label={pt ? "03 / o checklist" : "03 / the checklist"}
          title={pt ? "instrução, não ponto turístico" : "instructions, not landmarks"}
          intro={
            pt
              ? "A equipe chegou ao checklist numa conversa. Cada item propõe uma ação: mate gelado com biscoito Globo em Ipanema, mergulho no mar antes do trabalho, pôr do sol no Arpoador. A hierarquia bilíngue põe o inglês em negrito e o português logo abaixo."
              : "The team arrived at the checklist through conversation. Each item proposes an action: iced mate with Globo biscuits on Ipanema beach, a swim before work, sunset at Arpoador. The bilingual hierarchy sets English in bold with Portuguese directly below."
          }
        >
          <div className="tc-grid tc-grid--asym">
            <CaseFigure
              {...GALLERY[2]}
              alt={pt ? "Checklist carioca da identidade de formatura" : "Carioca checklist from the graduation identity"}
              caption={pt ? "checklist carioca" : "carioca checklist"}
              index={pt ? "imagem 04" : "image 04"}
            />
            <div className="tc-grid tc-grid--stack">
              {GALLERY.slice(3, 5).map((image, index) => (
                <CaseFigure
                  key={image.src}
                  {...image}
                  alt={pt ? "Aplicação da identidade de formatura" : "Graduation identity application"}
                  caption={pt ? "desdobramento" : "application"}
                  index={`${pt ? "imagem" : "image"} 0${index + 5}`}
                />
              ))}
            </div>
          </div>
        </CaseSection>

        <CaseSection
          ink
          label={pt ? "04 / o que foi produzido" : "04 / what got made"}
          title={t("grad_gallery_title")}
          intro={
            pt
              ? "Na ecobag de linho, a impressão em uma cor reduz o sistema ao traço e ao ritmo dos ícones. Os adesivos levam o mesmo desenho para objeto pessoal — notebook, garrafa, caderno."
              : "On the linen tote, the single-colour print strips the system down to the drawing and the rhythm of the icons. The stickers carry the same drawing onto personal objects — a laptop, a bottle, a notebook."
          }
        >
          <div className="tc-grid tc-grid--two tc-grid--offset">
            {GALLERY.slice(5, 8).map((image, index) => (
              <CaseFigure
                key={image.src}
                {...image}
                alt={pt ? "Aplicações finais do Rio Starter Pack" : "Final Rio Starter Pack applications"}
                caption={pt ? "aplicação" : "application"}
                index={`${pt ? "imagem" : "image"} ${String(index + 7).padStart(2, "0")}`}
              />
            ))}
          </div>
          <div className="tc-grid tc-grid--stack" style={{ marginTop: "clamp(2rem, 5vw, 4rem)" }}>
            {GALLERY.slice(8).map((image, index) => (
              <CaseFigure
                key={image.src}
                {...image}
                alt={pt ? "Assinatura final da identidade de formatura" : "Final graduation identity signature"}
                caption={pt ? "assinatura de encerramento" : "closing signature"}
                index={`${pt ? "imagem" : "image"} ${String(index + 10).padStart(2, "0")}`}
                sizes="(max-width: 1260px) 92vw, 1180px"
              />
            ))}
          </div>
        </CaseSection>

        <CaseSection
          compact
          label={pt ? "05 / ficha" : "05 / credits"}
          title={t("grad_credits_title")}
        >
          <CaseCredits
            items={[
              {
                label: t("grad_credits_design"),
                value: "Dillon Wong · Maria Isabel Lisita · Matheus Petermann",
              },
              {
                label: t("grad_credits_comms"),
                value: "Carolina Mello · Vinicius de Moura",
              },
            ]}
          />
        </CaseSection>
      </CaseCanvas>
    </ProjectShell>
  );
}
