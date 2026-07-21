"use client";
import { motion } from "framer-motion";
import { useT } from "@/i18n/LanguageContext";

/**
 * Future Wheel do HoloGlam redesenhada em SVG, na paleta do site.
 *
 * No deck original isso era um print de ferramenta de mapa mental (fundo azul
 * marinho, bolha ciano) que não conversava com nada. Aqui é vetor: escala sem
 * borrar, muda de idioma junto com o site e usa tinta/bege/tomate.
 *
 * Geometria: centro + 6 nós de 1ª ordem num anel + 18 de 2ª ordem no anel de
 * fora, três para cada nó de 1ª ordem. O ângulo de cada filho é o do pai ±20°,
 * então a ordem do anel externo é a mesma do diagrama original.
 *
 * Rótulos vêm quebrados em linhas à mão (array): SVG não tem quebra automática,
 * e medir texto no cliente causaria salto de layout.
 */

/**
 * Geometria conferida na conta, não no olho:
 * 18 nós de 2ª ordem a cada 20° num raio R_EXTERNO têm corda
 * 2*R_EXTERNO*sen(10°) entre vizinhos. Ela precisa ser MAIOR que 2*R_NO_2,
 * senão eles se encavalam — foi o que aconteceu com 408/80 (corda 142, diâmetro
 * 160). Com 440/72: corda 152.8 contra diâmetro 144, folga de 9px.
 * E R_EXTERNO + R_NO_2 (512) tem que caber em VB/2 (560).
 */
const VB = 1120;
const CX = VB / 2;
const CY = VB / 2;
const R_CENTRO = 100;
const R_INTERNO = 262;   // distância do centro aos nós de 1ª ordem
const R_NO_1 = 70;
const R_EXTERNO = 440;   // distância do centro aos nós de 2ª ordem
const R_NO_2 = 72;
const FONTE_1 = 15;
const LINHA_1 = 17;
const FONTE_2 = 13.5;
const LINHA_2 = 16;

type Linhas = string[];

/** 6 nós de 1ª ordem, sentido horário a partir do topo */
const PRIMEIROS: { pt: Linhas; en: Linhas }[] = [
  { pt: ["Expansão da", "Economia", "Circular"], en: ["Expansion of the", "Circular", "Economy"] },
  { pt: ["Para todos", "os públicos"], en: ["For all", "audiences"] },
  { pt: ["Materiais", "Inteligentes"], en: ["Smart", "Materials"] },
  { pt: ["Objeto", "Smart"], en: ["Smart", "Object"] },
  { pt: ["Versatilidade"], en: ["Versatility"] },
  { pt: ["Preço"], en: ["Price"] },
];

/** 18 nós de 2ª ordem, em grupos de 3 na ordem dos pais acima */
const SEGUNDOS: { pt: Linhas; en: Linhas }[] = [
  // Economia Circular
  { pt: ["Prolongamento", "da vida útil", "de roupas"], en: ["Prolonging", "Clothing", "Lifespan"] },
  { pt: ["Sustentável"], en: ["Sustainable"] },
  { pt: ["Consciente"], en: ["Conscious"] },
  // Para todos os públicos
  { pt: ["Igualdade", "e Inclusão"], en: ["Equality and", "Inclusion"] },
  { pt: ["Discreta"], en: ["Understated", "clothing"] },
  { pt: ["Estímulo à", "inovação e avanço", "tecnológico"], en: ["Innovation and", "technological", "advancement"] },
  // Materiais Inteligentes
  { pt: ["Privacidade", "e segurança"], en: ["Privacy and", "security"] },
  { pt: ["Personalização", "da aparência", "da roupa"], en: ["Customization", "of clothing", "appearance"] },
  { pt: ["Adaptação e", "transformação", "da roupa"], en: ["Adaptation and", "transformation", "of clothing"] },
  // Objeto Smart
  { pt: ["Desafios de", "Infraestrutura", "e Integração"], en: ["Infrastructure", "and Integration", "Challenges"] },
  { pt: ["Dependência", "Tecnológica"], en: ["Technological", "Dependency"] },
  { pt: ["Sem mais", "limitações (de", "tempo ou estilo)"], en: ["Without further", "limitations (of", "time or style)"] },
  // Versatilidade
  { pt: ["Inúmeras", "Possibilidades", "de vestuário"], en: ["Countless", "Clothing", "Possibilities"] },
  { pt: ["Conforto"], en: ["Comfy"] },
  { pt: ["Fim das fast", "fashions"], en: ["End of Fast", "Fashion"] },
  // Preço
  { pt: ["Talvez", "elitista"], en: ["Perhaps", "Elitist"] },
  { pt: ["Inibidor"], en: ["Inhibitor"] },
  { pt: ["Menos lixo"], en: ["Less Waste"] },
];

/** os quatro nós que a página discute em "o que não fecha" — destacados */
const CRITICOS = new Set([6, 9, 10, 15]);

const rad = (g: number) => ((g - 90) * Math.PI) / 180;
const pos = (grausSemOffset: number, raio: number) => ({
  x: CX + raio * Math.cos(rad(grausSemOffset)),
  y: CY + raio * Math.sin(rad(grausSemOffset)),
});

const styles = `
  .fw__wrap { overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch; }
  /* a familia vem daqui, mas NUNCA o fill: regra CSS vence atributo de
     apresentacao, entao um fill aqui apagaria o texto branco dos nos escuros. */
  .fw__svg { display: block; width: 100%; min-width: 680px; height: auto; font-family: var(--font-body); }
  .fw__legend {
    display: flex; gap: 1.6rem; flex-wrap: wrap;
    font-family: var(--font-body); font-size: .7rem;
    text-transform: uppercase; letter-spacing: .14em;
    opacity: .6; margin-top: 1.2rem;
  }
  .fw__key { display: inline-flex; align-items: center; gap: .5rem; }
  .fw__dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
`;

export default function FutureWheel() {
  const { t, lang } = useT();
  const L = (n: { pt: Linhas; en: Linhas }) => (lang === "en" ? n.en : n.pt);

  return (
    <div>
      <style>{styles}</style>
      <div className="fw__wrap">
        <svg className="fw__svg" viewBox={`0 0 ${VB} ${VB}`} role="img" aria-label={t("holo_wheel_title")}>
          {/* anel pontilhado que costura os nós de 2ª ordem */}
          <circle cx={CX} cy={CY} r={R_EXTERNO} fill="none" stroke="var(--ink)" strokeOpacity=".18"
            strokeDasharray="2 7" strokeWidth="1" />

          {/* ligações */}
          {PRIMEIROS.map((_, i) => {
            const ang = i * 60;
            const p = pos(ang, R_INTERNO);
            return (
              <g key={`lig-${i}`}>
                <line x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="var(--ink)" strokeOpacity=".4" strokeWidth="1.6" />
                {[-20, 0, 20].map((d) => {
                  const f = pos(ang + d, R_EXTERNO);
                  return <line key={d} x1={p.x} y1={p.y} x2={f.x} y2={f.y}
                    stroke="var(--ink)" strokeOpacity=".22" strokeWidth="1.1" />;
                })}
              </g>
            );
          })}

          {/* 2ª ordem */}
          {SEGUNDOS.map((n, j) => {
            const ang = Math.floor(j / 3) * 60 + ((j % 3) - 1) * 20;
            const p = pos(ang, R_EXTERNO);
            const linhas = L(n);
            const critico = CRITICOS.has(j);
            return (
              <motion.g key={`s-${j}`}
                initial={{ opacity: 0, scale: 0.82 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: 0.35 + j * 0.025, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              >
                <circle cx={p.x} cy={p.y} r={R_NO_2}
                  fill={critico ? "var(--acid)" : "var(--site-tint-b)"}
                  fillOpacity={critico ? 0.16 : 1}
                  stroke={critico ? "var(--acid)" : "var(--ink)"}
                  strokeOpacity={critico ? 0.9 : 0.25}
                  strokeWidth={critico ? 1.6 : 1} />
                <text x={p.x} y={p.y - ((linhas.length - 1) * LINHA_2) / 2} textAnchor="middle"
                  fontSize={FONTE_2} fill={critico ? "var(--acid)" : "var(--ink)"}>
                  {linhas.map((l, k) => (
                    <tspan key={k} x={p.x} dy={k === 0 ? FONTE_2 * 0.35 : LINHA_2}>{l}</tspan>
                  ))}
                </text>
              </motion.g>
            );
          })}

          {/* 1ª ordem */}
          {PRIMEIROS.map((n, i) => {
            const p = pos(i * 60, R_INTERNO);
            const linhas = L(n);
            return (
              <motion.g key={`p-${i}`}
                initial={{ opacity: 0, scale: 0.82 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: 0.15 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              >
                <circle cx={p.x} cy={p.y} r={R_NO_1} fill="var(--ink)" />
                <text x={p.x} y={p.y - ((linhas.length - 1) * LINHA_1) / 2} textAnchor="middle"
                  fontSize={FONTE_1} fill="var(--paper)">
                  {linhas.map((l, k) => (
                    <tspan key={k} x={p.x} dy={k === 0 ? FONTE_1 * 0.35 : LINHA_1}>{l}</tspan>
                  ))}
                </text>
              </motion.g>
            );
          })}

          {/* centro */}
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
          >
            <circle cx={CX} cy={CY} r={R_CENTRO} fill="var(--acid)" />
            <text x={CX} y={CY + 10} textAnchor="middle" fill="var(--paper)"
              style={{ fontFamily: "var(--font-head)", fontSize: 32 }}>
              HoloGlam
            </text>
          </motion.g>
        </svg>
      </div>

      <div className="fw__legend">
        <span className="fw__key">
          <span className="fw__dot" style={{ background: "var(--ink)" }} /> {t("holo_wheel_legend_1")}
        </span>
        <span className="fw__key">
          <span className="fw__dot" style={{ background: "var(--site-tint-b)", border: "1px solid rgba(28,27,24,.35)" }} /> {t("holo_wheel_legend_2")}
        </span>
        <span className="fw__key">
          <span className="fw__dot" style={{ background: "rgba(228,70,42,.2)", border: "1.5px solid var(--acid)" }} /> {t("holo_gap_title")}
        </span>
      </div>
    </div>
  );
}
