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
  { src: "/img/graduation/2.jpg", width: 1401, height: 642 },
  { src: "/img/graduation/3.jpg", width: 1600, height: 814 },
  { src: "/img/graduation/4.jpg", width: 1600, height: 1142 },
  { src: "/img/graduation/5.jpg", width: 1600, height: 784 },
  { src: "/img/graduation/6.jpg", width: 1401, height: 901 },
  { src: "/img/graduation/7.jpg", width: 1401, height: 901 },
  { src: "/img/graduation/8.jpg", width: 1600, height: 1028 },
  { src: "/img/graduation/9.jpg", width: 1600, height: 524 },
  { src: "/img/graduation/10.jpg", width: 1600, height: 379 },
] as const;

export default function GraduationProject() {
  const { t, lang } = useT();
  const pt = lang !== "en";

  return (
    <ProjectShell accent="#fb4c2f"
      title={t("grad_title")}
      desc={
        <>
          {t("grad_desc_1")} <span className="pj-em">{t("grad_desc_em")}</span> {t("grad_desc_2")}
        </>
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
          label={pt ? "01 / festa como sistema" : "01 / celebration as system"}
          title={pt ? "carioca, coletiva, em movimento" : "carioca, collective, in motion"}
          intro={
            pt
              ? "A identidade transforma a formatura em um starter pack afetivo do Rio: ondas, calor, encontro e uma paleta que se comporta como luz em movimento."
              : "The identity turns graduation into an affectionate Rio starter pack: waves, warmth, encounters and a palette that behaves like moving light."
          }
        >
          <CaseFigure
            src="/img/graduation/animacao.webp"
            width={1000}
            height={494}
            alt={pt ? "AnimaÃ§Ã£o da identidade Rio de Janeiro Starter Pack" : "Rio de Janeiro Starter Pack identity animation"}
            caption={pt ? "marca em movimento" : "identity in motion"}
            index="abertura 01"
            priority
            sizes="(max-width: 1260px) 92vw, 1180px"
          />
        </CaseSection>

        <CaseSection
          label={pt ? "02 / ingredientes" : "02 / ingredients"}
          title={pt ? "cor, onda e memÃ³ria" : "color, wave and memory"}
          intro={
            pt
              ? "Em vez de apresentar as pranchas como uma lista, elas aparecem como recortes de uma mesa de preparaÃ§Ã£o: paleta, tipografia e referÃªncias se encostam."
              : "Instead of presenting boards as a list, they appear as cutouts from a preparation table: palette, typography and references touch one another."
          }
        >
          <div className="tc-grid tc-grid--two tc-grid--offset">
            {GALLERY.slice(0, 2).map((image, index) => (
              <CaseFigure
                key={image.src}
                {...image}
                alt={pt ? "Elementos da identidade visual de formatura" : "Graduation visual identity elements"}
                caption={index === 0 ? (pt ? "paleta & ritmo" : "palette & rhythm") : (pt ? "sistema grÃ¡fico" : "graphic system")}
                index={`folha 0${index + 2}`}
                tilt={index === 0 ? -0.7 : 0.65}
              />
            ))}
          </div>
        </CaseSection>

        <CaseSection
          label={pt ? "03 / kit em circulaÃ§Ã£o" : "03 / kit in circulation"}
          title={pt ? "peÃ§as que parecem lembranÃ§as" : "pieces that feel like keepsakes"}
          intro={
            pt
              ? "Checklist, materiais impressos e objetos entram como lembranÃ§as sobrepostas. A leve inclinaÃ§Ã£o das folhas dÃ¡ corpo sem virar uma pilha caÃ³tica."
              : "Checklists, printed matter and objects become layered keepsakes. Slightly tilted sheets add body without turning into a chaotic pile."
          }
        >
          <div className="tc-grid tc-grid--asym">
            <CaseFigure
              {...GALLERY[2]}
              alt={pt ? "Checklist carioca da identidade de formatura" : "Carioca checklist from the graduation identity"}
              caption={pt ? "checklist carioca" : "carioca checklist"}
              index="folha 04"
              tilt={-0.5}
            />
            <div className="tc-grid tc-grid--stack">
              {GALLERY.slice(3, 5).map((image, index) => (
                <CaseFigure
                  key={image.src}
                  {...image}
                  alt={pt ? "AplicaÃ§Ã£o da identidade de formatura" : "Graduation identity application"}
                  caption={pt ? "desdobramento" : "application"}
                  index={`folha 0${index + 5}`}
                  tilt={index === 0 ? 0.6 : -0.35}
                />
              ))}
            </div>
          </div>
        </CaseSection>

        <CaseSection
          ink
          label={pt ? "04 / celebraÃ§Ã£o aplicada" : "04 / applied celebration"}
          title={t("grad_gallery_title")}
          intro={
            pt
              ? "As Ãºltimas peÃ§as fecham o sistema como uma faixa contÃ­nua: objetos, ambientaÃ§Ã£o e assinatura visual pertencem ao mesmo gesto."
              : "The final pieces close the system as a continuous band: objects, environment and visual signature share the same gesture."
          }
        >
          <div className="tc-grid tc-grid--two tc-grid--offset">
            {GALLERY.slice(5, 8).map((image, index) => (
              <CaseFigure
                key={image.src}
                {...image}
                alt={pt ? "AplicaÃ§Ãµes finais do Rio Starter Pack" : "Final Rio Starter Pack applications"}
                caption={pt ? "aplicaÃ§Ã£o" : "application"}
                index={`folha ${String(index + 7).padStart(2, "0")}`}
                tilt={index % 2 === 0 ? -0.45 : 0.55}
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
                index={`folha ${String(index + 10).padStart(2, "0")}`}
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
                value: "Dillon Wong Â· Maria Isabel Lisita Â· Matheus Petermann",
              },
              {
                label: t("grad_credits_comms"),
                value: "Carolina Mello Â· Vinicius de Moura",
              },
            ]}
          />
        </CaseSection>
      </CaseCanvas>
    </ProjectShell>
  );
}

