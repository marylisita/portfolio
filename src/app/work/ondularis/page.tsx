"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import ProjectShell from "@/components/ProjectShell";
import AsciiDivider from "@/components/AsciiDivider";
import { useT } from "@/i18n/LanguageContext";

type PhotoData = {
  src: string;
  width: number;
  height: number;
  altPt: string;
  altEn: string;
};

const PHOTOS = {
  territory: {
    src: "/img/ondularis/img-0090.webp",
    width: 2000,
    height: 1333,
    altPt: "Vista ampla da instalação Ondularis, com esculturas suspensas e projeções azuis",
    altEn: "Wide view of the Ondularis installation with suspended sculptures and blue projections",
  },
  floating: {
    src: "/img/ondularis/img-0156.webp",
    width: 2000,
    height: 1222,
    altPt: "Projeção azul flutuando entre esculturas orgânicas suspensas",
    altEn: "Blue projection floating among suspended organic sculptures",
  },
  shadow: {
    src: "/img/ondularis/img-0014.webp",
    width: 2000,
    height: 1455,
    altPt: "Silhueta de uma pessoa atravessada por projeções azuis",
    altEn: "Silhouette of a person crossed by blue projections",
  },
  panorama: {
    src: "/img/ondularis/img-0182.webp",
    width: 2000,
    height: 1333,
    altPt: "Panorama da galeria com visitante, esculturas e luz violeta",
    altEn: "Gallery panorama with a visitor, sculptures and violet light",
  },
  visitor: {
    src: "/img/ondularis/img-0033.webp",
    width: 2000,
    height: 1128,
    altPt: "Visitante observa uma escultura diante de uma projeção ondulante",
    altEn: "Visitor observing a sculpture in front of an undulating projection",
  },
  gesture: {
    src: "/img/ondularis/img-0070.webp",
    width: 2000,
    height: 1333,
    altPt: "Pessoa ergue os braços diante de uma projeção azul reativa",
    altEn: "Person raising their arms in front of a reactive blue projection",
  },
  portrait: {
    src: "/img/ondularis/img-0051.webp",
    width: 2000,
    height: 1333,
    altPt: "Retrato de visitante entre uma escultura escura e luz azul",
    altEn: "Portrait of a visitor between a dark sculpture and blue light",
  },
  membrane: {
    src: "/img/ondularis/img-0045.webp",
    width: 2000,
    height: 1333,
    altPt: "Membrana escultórica translúcida iluminada por projeções azuis e violetas",
    altEn: "Translucent sculptural membrane lit by blue and violet projections",
  },
  residue: {
    src: "/img/ondularis/img-0023.webp",
    width: 2000,
    height: 1333,
    altPt: "Detalhe de escultura feita com resíduos e texturas orgânicas",
    altEn: "Detail of a sculpture made with residues and organic textures",
  },
  hand: {
    src: "/img/ondularis/img-0066.webp",
    width: 2000,
    height: 1333,
    altPt: "Mão em silhueta toca visualmente uma projeção de padrões marinhos",
    altEn: "Silhouetted hand visually touching a projection of marine patterns",
  },
  atmosphere: {
    src: "/img/ondularis/img-0118.webp",
    width: 2000,
    height: 1333,
    altPt: "Reflexos iridescentes e luz azul criam uma atmosfera submersa",
    altEn: "Iridescent reflections and blue light create a submerged atmosphere",
  },
  projection: {
    src: "/img/ondularis/img-0131.webp",
    width: 2000,
    height: 1333,
    altPt: "Silhueta diante de uma projeção rosa e azul semelhante a um organismo",
    altEn: "Silhouette in front of a pink and blue organism-like projection",
  },
  organism: {
    src: "/img/ondularis/img-0173.webp",
    width: 2000,
    height: 1333,
    altPt: "Escultura escura suspensa diante de uma malha luminosa",
    altEn: "Dark suspended sculpture in front of a luminous mesh",
  },
  gallery: {
    src: "/img/ondularis/img-0128.webp",
    width: 2000,
    height: 1333,
    altPt: "Parede da Meta Gallery ocupada por esculturas suspensas",
    altEn: "Meta Gallery wall occupied by suspended sculptures",
  },
  installation: {
    src: "/img/ondularis/img-0124.webp",
    width: 2000,
    height: 1333,
    altPt: "Pessoa atravessa a instalação entre esculturas, projeções e luz violeta",
    altEn: "Person crossing the installation among sculptures, projections and violet light",
  },
  ending: {
    src: "/img/ondularis/img-9970.webp",
    width: 2000,
    height: 1333,
    altPt: "Conjunto de esculturas e projeção em azul, rosa e violeta",
    altEn: "Group of sculptures and projection in blue, pink and violet",
  },
} satisfies Record<string, PhotoData>;

const copy = {
  pt: {
    description:
      "Um oceano inventado, composto de esculturas tentaculares, resíduos industriais, atmosfera imersiva e projeções que reagem ao som.",
    meta: [
      { label: "formato", value: "exposição coletiva · instalação imersiva" },
      { label: "participação", value: "artista · coletivo Endosymbiosis" },
      { label: "período", value: "14–31 de julho de 2026" },
      { label: "local", value: "Meta Gallery · Rio de Janeiro" },
    ],
    coverNote: "primeira exposição do coletivo Endosymbiosis",
    coverPrefix: "um oceano",
    coverEmphasis: "inventado",
    open: "visitação aberta · 14.07—31.07",
    sectionSound: "som · corpo · imagem",
    sectionMatter: "matéria",
    sectionAtmosphere: "atmosfera",
    sectionArchive: "arquivo",
    introTitle: "um território entre técnica e delírio",
    intro:
      "Criado a partir da residência de artistas-pesquisadores do NANO (EBA/UFRJ) na Meta Gallery, o coletivo Endosymbiosis trabalha na intersecção entre arte, ciência e tecnologia. A simpoiese — fazer-com — orienta tanto o processo de criação quanto o modo de relação do grupo.",
    introSide:
      "Esculturas tentaculares, resíduos industriais e imagens responsivas não ilustram um ecossistema conhecido. Elas negociam entre si e com quem atravessa o espaço.",
    quoteA: "Ondularis não simula o mar.",
    quoteB: "Cria um outro: artificial, instável, fabulado.",
    interactionTitle: "um ambiente que escuta",
    interaction:
      "As projeções reagem ao som e se espalham sobre corpos, paredes e matérias suspensas. O público deixa de observar uma paisagem à distância e passa a interferir em suas marés.",
    materialTitle: "vestígio e invenção",
    material:
      "O oceano aparece como hipótese material: restos industriais assumem anatomias ambíguas, membranas recebem luz e volumes escuros oscilam entre organismo, ruína e máquina.",
    atmosphereTitle: "abaixo da superfície",
    atmosphere:
      "Luz, reflexo e sombra dissolvem os limites da galeria. A instalação não reconstrói um ambiente natural; produz condições para que outro ambiente possa emergir.",
    contextCaption: "Meta Gallery · Rio de Janeiro · julho de 2026",
    galleryCaption: "registros da exposição e de suas relações com o público",
    creditsTitle: "ficha técnica",
    partnersLabel: "realização & apoio",
    partnersAlt:
      "Créditos institucionais de Ondularis: Meta Gallery, MetaverseAgency, NANO, Reviver Cultural e Escola de Belas Artes",
    credits: [
      { label: "curadoria", value: "Fabiane M. Borges" },
      {
        label: "coletivo Endosymbiosis",
        value: "Crisia · Maria Isabel · Giovanna Medeiros · Léo Cauper · Soso Reis",
      },
      { label: "orientação", value: "Malu Fragoso · Guto Nóbrega" },
      { label: "co-orientação", value: "Cila Mac Dowell · Paula Scamparini" },
      { label: "residência artística · orientação", value: "Byron Mendes" },
      {
        label: "participação especial",
        value: "Bruna Pellegrino · Giulia Moraes · Pathenopy Bertoli",
      },
      {
        label: "colaboração",
        value: "Andréa Renck · Ricardo Nogueira · Taki Runa · João Vitor · Stefany Fernandes",
      },
      { label: "realização", value: "Meta Gallery · MetaverseAgency" },
      {
        label: "apoio",
        value:
          "Núcleo de Artes e Novos Organismos (NANO) · Reviver Cultural · Escola de Belas Artes (EBA/UFRJ)",
      },
    ],
  },
  en: {
    description:
      "An invented ocean made of tentacular sculptures, industrial residues, an immersive atmosphere and projections that react to sound.",
    meta: [
      { label: "format", value: "group exhibition · immersive installation" },
      { label: "participation", value: "artist · Endosymbiosis collective" },
      { label: "dates", value: "July 14–31, 2026" },
      { label: "venue", value: "Meta Gallery · Rio de Janeiro" },
    ],
    coverNote: "the first exhibition by the Endosymbiosis collective",
    coverPrefix: "an",
    coverEmphasis: "invented ocean",
    open: "open to visitors · 14.07—31.07",
    sectionSound: "sound · body · image",
    sectionMatter: "matter",
    sectionAtmosphere: "atmosphere",
    sectionArchive: "archive",
    introTitle: "a territory between technique and delirium",
    intro:
      "Born from an artist-researcher residency by NANO (EBA/UFRJ) at Meta Gallery, the Endosymbiosis collective works at the intersection of art, science and technology. Sympoiesis — making-with — guides both the creative process and the group’s way of relating.",
    introSide:
      "Tentacular sculptures, industrial residues and responsive images do not illustrate a known ecosystem. They negotiate with one another and with those who move through the space.",
    quoteA: "Ondularis does not simulate the sea.",
    quoteB: "It creates another: artificial, unstable, fabulated.",
    interactionTitle: "an environment that listens",
    interaction:
      "The projections react to sound and spread across bodies, walls and suspended materials. Visitors stop observing a landscape from a distance and begin to interfere with its tides.",
    materialTitle: "trace and invention",
    material:
      "The ocean emerges as a material hypothesis: industrial remnants acquire ambiguous anatomies, membranes receive light, and dark volumes oscillate between organism, ruin and machine.",
    atmosphereTitle: "below the surface",
    atmosphere:
      "Light, reflection and shadow dissolve the gallery’s boundaries. The installation does not reconstruct a natural environment; it produces the conditions for another environment to emerge.",
    contextCaption: "Meta Gallery · Rio de Janeiro · July 2026",
    galleryCaption: "exhibition views and encounters with its visitors",
    creditsTitle: "credits",
    partnersLabel: "presented by & support",
    partnersAlt:
      "Ondularis institutional credits: Meta Gallery, MetaverseAgency, NANO, Reviver Cultural and the School of Fine Arts",
    credits: [
      { label: "curation", value: "Fabiane M. Borges" },
      {
        label: "Endosymbiosis collective",
        value: "Crisia · Maria Isabel · Giovanna Medeiros · Léo Cauper · Soso Reis",
      },
      { label: "advisors", value: "Malu Fragoso · Guto Nóbrega" },
      { label: "co-advisors", value: "Cila Mac Dowell · Paula Scamparini" },
      { label: "artistic residency · advisor", value: "Byron Mendes" },
      {
        label: "special participation",
        value: "Bruna Pellegrino · Giulia Moraes · Pathenopy Bertoli",
      },
      {
        label: "collaboration",
        value: "Andréa Renck · Ricardo Nogueira · Taki Runa · João Vitor · Stefany Fernandes",
      },
      { label: "presented by", value: "Meta Gallery · MetaverseAgency" },
      {
        label: "support",
        value:
          "Núcleo de Artes e Novos Organismos (NANO) · Reviver Cultural · Escola de Belas Artes (EBA/UFRJ)",
      },
    ],
  },
} as const;

const styles = `
  .on {
    --on-deep: #020d15;
    --on-ink: #d9fff2;
    --on-cyan: #64f6d0;
    --on-blue: #38b9ff;
    --on-violet: #7d52d8;
    --on-line: rgba(190, 255, 237, .3);
  }
  .pj:has(.on) .pj-corner {
    padding: .3rem .5rem;
    color: #1c1b18;
    background: rgba(237, 231, 218, .86);
    box-shadow: 3px 3px 0 rgba(100, 246, 208, .18);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }
  .on-section {
    position: relative;
    max-width: 1320px;
    margin: 0 auto;
    padding: clamp(4.5rem, 9vw, 8rem) clamp(1.25rem, 5vw, 4.5rem);
  }
  .on-dark {
    max-width: none;
    color: var(--on-ink);
    background:
      radial-gradient(
        72rem 54rem at var(--pj-light-pos, 70% 24%),
        rgba(58, 171, 194, .3) 0%,
        rgba(62, 91, 167, .16) 38%,
        transparent 72%
      ),
      var(--on-deep);
    background-attachment: fixed;
  }
  .pj-main > .on-dark::before {
    color: #03141b;
    background: rgba(190, 255, 237, .9);
    border-color: rgba(190, 255, 237, .45);
  }
  .on-inner { width: min(100%, var(--project-content-max)); margin: 0 auto; }
  .on-kicker {
    margin: 0 0 .85rem;
    font-family: var(--font-subtitle), monospace;
    font-weight: var(--offbit-weight);
    font-size: var(--type-micro);
    line-height: 1.4;
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
    opacity: .72;
  }
  .on-h2 {
    max-width: var(--measure-section-title);
    margin: 0 0 1.5rem;
    font-family: var(--font-head);
    font-weight: 400;
    font-size: clamp(2.5rem, 6vw, 5.8rem);
    line-height: .92;
    letter-spacing: -.035em;
    text-transform: lowercase;
    text-wrap: balance;
  }
  .on-p {
    max-width: var(--measure-copy);
    margin: 0;
    font-family: var(--font-body);
    font-size: clamp(1.05rem, 1.55vw, 1.22rem);
    line-height: 1.7;
    text-wrap: pretty;
  }
  .on-rule {
    width: 100%;
    margin: 2rem 0;
    border: 0;
    border-top: 1px dashed currentColor;
    opacity: .28;
  }
  .on-caption {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin: .7rem 0 0;
    font-family: var(--font-subtitle), monospace;
    font-weight: var(--offbit-weight);
    font-size: var(--type-micro);
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
    opacity: .64;
  }
  .on-photo {
    position: relative;
    margin: 0;
    min-width: 0;
  }
  .on-photo::before {
    content: "";
    position: absolute;
    z-index: 0;
    inset: 7px -7px -7px 7px;
    border: 1px dashed var(--on-line);
    background: rgba(71, 224, 207, .06);
  }
  .on-photo img {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
    height: auto;
    border: 1px solid rgba(190, 255, 237, .22);
    background: #04121b;
  }

  .on-cover {
    display: grid;
    grid-template-columns: minmax(280px, .8fr) minmax(300px, 1fr);
    gap: clamp(2rem, 7vw, 7rem);
    align-items: center;
    min-height: min(920px, 92svh);
  }
  .on-cover__poster {
    position: relative;
    margin: 0;
    box-shadow:
      18px 22px 0 rgba(92, 246, 209, .08),
      0 28px 80px rgba(0, 0, 0, .48);
    rotate: -1deg;
  }
  .on-cover__poster::before {
    content: "╳  ⠂⠄⠂  ╳";
    position: absolute;
    z-index: 2;
    top: .55rem;
    left: 50%;
    translate: -50% 0;
    color: #bfffe8;
    font-family: var(--font-mono), monospace;
    font-size: .55rem;
    letter-spacing: .35em;
    opacity: .58;
  }
  .on-cover__poster img { display: block; width: 100%; height: auto; }
  .on-cover__copy { max-width: 42rem; }
  .on-cover__ascii {
    margin: 1.8rem 0;
    color: var(--on-cyan);
    font-family: var(--font-mono), monospace;
    font-size: clamp(.7rem, 1.25vw, 1rem);
    line-height: 1.2;
    white-space: pre;
    opacity: .72;
    overflow: hidden;
  }
  .on-cover__statement {
    margin: 0;
    font-family: var(--font-head);
    font-size: clamp(2.2rem, 5.5vw, 5.4rem);
    line-height: .9;
    letter-spacing: -.04em;
  }
  .on-cover__statement em { color: var(--on-cyan); font-weight: 400; }
  .on-cover__note {
    max-width: 42ch;
    margin: 1.5rem 0 0;
    font-family: var(--font-body);
    font-size: var(--type-body);
    line-height: 1.62;
    opacity: .7;
  }

  .on-territory .on-photo { width: min(100%, 1180px); margin: 0 auto; }
  .on-story {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(220px, .65fr);
    gap: clamp(2.5rem, 8vw, 8rem);
    align-items: end;
  }
  .on-story__aside {
    padding: 1.2rem 0 1.2rem 1.4rem;
    border-left: 1px dashed rgba(28, 27, 24, .36);
    font-family: var(--font-head);
    font-style: italic;
    font-size: clamp(1.2rem, 2.2vw, 1.8rem);
    line-height: 1.35;
  }
  .on-duo {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(230px, .65fr);
    gap: clamp(1.5rem, 5vw, 5rem);
    align-items: start;
  }
  .on-duo .on-photo:nth-child(2) { margin-top: clamp(3rem, 10vw, 9rem); }
  .on-gesture {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(1rem, 3vw, 2.5rem);
  }
  .on-gesture .on-photo:nth-child(2) { margin-top: clamp(3rem, 8vw, 7rem); }

  .on-quote {
    padding-top: clamp(5rem, 12vw, 11rem);
    padding-bottom: clamp(5rem, 12vw, 11rem);
  }
  .on-quote blockquote {
    max-width: 18ch;
    margin: 0;
    font-family: var(--font-head);
    font-size: clamp(3rem, 8.5vw, 8rem);
    line-height: .86;
    letter-spacing: -.05em;
  }
  .on-quote blockquote span { display: block; }
  .on-quote blockquote span:last-child {
    margin-top: .22em;
    padding-left: clamp(1rem, 9vw, 8rem);
    font-style: italic;
    color: #164b53;
  }

  .on-copy-grid {
    display: grid;
    grid-template-columns: minmax(0, .8fr) minmax(300px, 1.2fr);
    gap: clamp(2rem, 7vw, 7rem);
    align-items: center;
  }
  .on-copy-grid--reverse { grid-template-columns: minmax(300px, 1.2fr) minmax(0, .8fr); }
  .on-details {
    display: grid;
    grid-template-columns: 1.25fr .75fr;
    gap: clamp(1rem, 3vw, 2.5rem);
  }
  .on-details__small {
    display: grid;
    gap: clamp(1rem, 3vw, 2.5rem);
  }
  .on-atmosphere .on-photo { width: min(100%, 1100px); margin: 3rem auto 0; }
  .on-people {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(.8rem, 2vw, 1.6rem);
  }
  .on-people .on-photo:nth-child(2) { margin-top: clamp(2rem, 7vw, 6rem); }
  .on-people .on-photo:nth-child(3) { margin-top: clamp(1rem, 3.5vw, 3rem); }
  .on-context {
    display: grid;
    grid-template-columns: .82fr 1.18fr;
    gap: clamp(1rem, 4vw, 3.5rem);
    align-items: end;
  }
  .on-ending .on-photo { width: min(100%, 1180px); margin: 0 auto; }

  .on-credits {
    padding-top: clamp(5rem, 10vw, 9rem);
    padding-bottom: clamp(6rem, 12vw, 11rem);
  }
  .on-credits__head {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    align-items: end;
    margin-bottom: 2.5rem;
  }
  .on-credits__mark {
    color: var(--on-cyan);
    font-family: var(--font-mono), monospace;
    font-size: clamp(1.2rem, 3vw, 2.5rem);
    white-space: nowrap;
  }
  .on-credits__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 3rem;
  }
  .on-credit {
    position: relative;
    display: grid;
    grid-template-columns: minmax(8rem, .42fr) 1fr;
    gap: 1rem;
    padding: 1.1rem 0;
  }
  .on-credit::after {
    content: "------------------------------------------------------------";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -.15rem;
    overflow: hidden;
    color: currentColor;
    font-family: var(--font-mono), monospace;
    font-size: var(--type-ascii-rule);
    line-height: 1;
    letter-spacing: .02em;
    white-space: nowrap;
    opacity: .32;
  }
  .on-credit__label {
    font-family: var(--font-subtitle), monospace;
    font-weight: var(--offbit-weight);
    font-size: var(--type-micro);
    line-height: 1.5;
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
    opacity: .58;
  }
  .on-credit__value {
    font-family: var(--font-body);
    font-size: var(--type-body);
    line-height: 1.55;
  }
  .on-partners {
    position: relative;
    width: min(100%, 31rem);
    margin: clamp(3.5rem, 8vw, 6.5rem) auto 0;
    padding: clamp(.55rem, 1.4vw, .85rem);
    border: 1px dashed var(--on-line);
    background: rgba(5, 21, 33, .72);
    box-shadow:
      .75rem .75rem 0 rgba(56, 185, 255, .07),
      1.3rem 1.3rem 0 rgba(125, 82, 216, .045);
  }
  .on-partners::before {
    content: "";
    position: absolute;
    inset: .4rem;
    z-index: 1;
    border: 1px solid rgba(190, 255, 237, .12);
    pointer-events: none;
  }
  .on-partners__label {
    display: block;
    margin: 0 0 .7rem;
    color: var(--on-cyan);
    font-family: var(--font-subtitle), monospace;
    font-weight: var(--offbit-weight);
    font-size: var(--type-micro);
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
    opacity: .72;
  }
  .on-partners img {
    display: block;
    width: 100%;
    height: auto;
  }
  .on-credits__end {
    margin: 3rem 0 0;
    color: var(--on-cyan);
    font-family: var(--font-mono), monospace;
    font-size: var(--type-micro);
    letter-spacing: .22em;
    text-align: center;
    opacity: .72;
  }

  @media (max-width: 820px) {
    .on-cover,
    .on-story,
    .on-duo,
    .on-copy-grid,
    .on-copy-grid--reverse {
      grid-template-columns: 1fr;
    }
    .on-cover { min-height: 0; }
    .on-cover__poster { width: min(100%, 31rem); margin: 0 auto; }
    .on-story__aside { max-width: 30rem; }
    .on-duo .on-photo:nth-child(2),
    .on-gesture .on-photo:nth-child(2),
    .on-people .on-photo:nth-child(2),
    .on-people .on-photo:nth-child(3) { margin-top: 0; }
    .on-details { grid-template-columns: 1fr; }
    .on-details__small { grid-template-columns: 1fr 1fr; }
    .on-credits__grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .on-section { padding-left: 1.25rem; padding-right: 1.25rem; }
    .on-cover__statement { font-size: clamp(2.35rem, 13vw, 4rem); }
    .on-cover__ascii { font-size: .54rem; }
    .on-gesture,
    .on-details__small,
    .on-people,
    .on-context { grid-template-columns: 1fr; }
    .on-caption { flex-direction: column; gap: .2rem; }
    .on-credit { grid-template-columns: 1fr; gap: .35rem; }
    .on-credits__head { align-items: start; flex-direction: column; }
  }
`;

const motionEase = [0.16, 1, 0.3, 1] as const;

function ExhibitionPhoto({
  photo,
  lang,
  caption,
  className = "",
  sizes = "(max-width: 820px) 100vw, 50vw",
  priority = false,
  reducedMotion,
}: {
  photo: PhotoData;
  lang: "pt" | "en";
  caption?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  reducedMotion: boolean;
}) {
  return (
    <motion.figure
      className={`on-photo ${className}`}
      initial={reducedMotion ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reducedMotion ? 0 : .8, ease: motionEase }}
    >
      <Image
        src={photo.src}
        alt={lang === "pt" ? photo.altPt : photo.altEn}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        priority={priority}
      />
      {caption ? <figcaption className="on-caption">{caption}</figcaption> : null}
    </motion.figure>
  );
}

export default function OndularisProject() {
  const { lang } = useT();
  const reducedMotion = Boolean(useReducedMotion());
  const selectedLang = lang === "en" ? "en" : "pt";
  const c = copy[selectedLang];

  return (
    <ProjectShell
      title={
        <>
          <strong style={{ color: "#64f6d0", fontWeight: 700 }}>ondularis</strong>
        </>
      }
      desc={c.description}
      meta={c.meta.map((item) => ({ ...item }))}
    >
      <style>{styles}</style>
      <div className="on">
        <section className="on-section on-dark">
          <div className="on-cover on-inner">
            <motion.figure
              className="on-cover__poster"
              initial={reducedMotion ? false : { opacity: 0, rotate: -3, y: 24 }}
              whileInView={{ opacity: 1, rotate: -1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reducedMotion ? 0 : 1, ease: motionEase }}
            >
              <Image
                src="/img/ondularis/capa.webp"
                alt={
                  selectedLang === "pt"
                    ? "Cartaz oficial de Ondularis, com o título da exposição, curadoria, coletivo e datas"
                    : "Official Ondularis poster with the exhibition title, curation, collective and dates"
                }
                width={1080}
                height={1350}
                sizes="(max-width: 820px) 90vw, 38vw"
                priority
              />
            </motion.figure>

            <motion.div
              className="on-cover__copy"
              initial={reducedMotion ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reducedMotion ? 0 : .9, delay: .12, ease: motionEase }}
            >
              <p className="on-kicker">{c.open} · Meta Gallery</p>
              <div className="on-cover__ascii" aria-hidden="true">
                {"      ≈≈≈      ∿∿∿\n  ∿∿      ◌       ≈≈\n      〰  𖦹  〰\n ≈≈      ∿∿      ≈≈"}
              </div>
              <p className="on-cover__statement">
                {c.coverPrefix} <em>{c.coverEmphasis}</em>
              </p>
              <p className="on-cover__note">{c.coverNote}</p>
            </motion.div>
          </div>
        </section>

        <section className="on-section on-dark on-territory">
          <div className="on-inner">
            <ExhibitionPhoto
              photo={PHOTOS.territory}
              lang={selectedLang}
              caption={c.contextCaption}
              sizes="(max-width: 1320px) 92vw, 1180px"
              priority
              reducedMotion={reducedMotion}
            />
          </div>
        </section>

        <section className="on-section">
          <motion.div
            className="on-story on-inner"
            initial={reducedMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: reducedMotion ? 0 : .8, ease: motionEase }}
          >
            <div>
              <p className="on-kicker">01 / endosymbiosis</p>
              <h2 className="on-h2">{c.introTitle}</h2>
              <p className="on-p">{c.intro}</p>
            </div>
            <p className="on-story__aside">{c.introSide}</p>
          </motion.div>
        </section>

        <section className="on-section on-dark">
          <div className="on-duo on-inner">
            <ExhibitionPhoto
              photo={PHOTOS.floating}
              lang={selectedLang}
              sizes="(max-width: 820px) 100vw, 62vw"
              reducedMotion={reducedMotion}
            />
            <ExhibitionPhoto
              photo={PHOTOS.shadow}
              lang={selectedLang}
              sizes="(max-width: 820px) 100vw, 30vw"
              reducedMotion={reducedMotion}
            />
          </div>
        </section>

        <section className="on-section on-dark">
          <div className="on-gesture on-inner">
            <ExhibitionPhoto
              photo={PHOTOS.visitor}
              lang={selectedLang}
              reducedMotion={reducedMotion}
            />
            <ExhibitionPhoto
              photo={PHOTOS.gesture}
              lang={selectedLang}
              caption={c.galleryCaption}
              reducedMotion={reducedMotion}
            />
          </div>
        </section>

        <section className="on-section on-quote">
          <motion.blockquote
            initial={reducedMotion ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: reducedMotion ? 0 : .9, ease: motionEase }}
          >
            <span>{c.quoteA}</span>
            <span>{c.quoteB}</span>
          </motion.blockquote>
        </section>

        <section className="on-section on-dark">
          <div className="on-copy-grid on-inner">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reducedMotion ? 0 : .8, ease: motionEase }}
            >
              <p className="on-kicker">02 / {c.sectionSound}</p>
              <h2 className="on-h2">{c.interactionTitle}</h2>
              <p className="on-p">{c.interaction}</p>
            </motion.div>
            <ExhibitionPhoto
              photo={PHOTOS.panorama}
              lang={selectedLang}
              sizes="(max-width: 820px) 100vw, 58vw"
              reducedMotion={reducedMotion}
            />
          </div>
        </section>

        <section className="on-section on-dark">
          <div className="on-copy-grid on-copy-grid--reverse on-inner">
            <div className="on-details">
              <ExhibitionPhoto
                photo={PHOTOS.membrane}
                lang={selectedLang}
                reducedMotion={reducedMotion}
              />
              <div className="on-details__small">
                <ExhibitionPhoto
                  photo={PHOTOS.residue}
                  lang={selectedLang}
                  reducedMotion={reducedMotion}
                />
                <ExhibitionPhoto
                  photo={PHOTOS.organism}
                  lang={selectedLang}
                  reducedMotion={reducedMotion}
                />
              </div>
            </div>
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reducedMotion ? 0 : .8, ease: motionEase }}
            >
              <p className="on-kicker">03 / {c.sectionMatter}</p>
              <h2 className="on-h2">{c.materialTitle}</h2>
              <p className="on-p">{c.material}</p>
            </motion.div>
          </div>
        </section>

        <section className="on-section on-dark on-atmosphere">
          <div className="on-inner">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reducedMotion ? 0 : .8, ease: motionEase }}
            >
              <p className="on-kicker">04 / {c.sectionAtmosphere}</p>
              <h2 className="on-h2">{c.atmosphereTitle}</h2>
              <p className="on-p">{c.atmosphere}</p>
            </motion.div>
            <ExhibitionPhoto
              photo={PHOTOS.atmosphere}
              lang={selectedLang}
              sizes="(max-width: 1180px) 92vw, 1100px"
              reducedMotion={reducedMotion}
            />
          </div>
        </section>

        <section className="on-section on-dark">
          <div className="on-people on-inner">
            <ExhibitionPhoto
              photo={PHOTOS.portrait}
              lang={selectedLang}
              reducedMotion={reducedMotion}
            />
            <ExhibitionPhoto
              photo={PHOTOS.hand}
              lang={selectedLang}
              reducedMotion={reducedMotion}
            />
            <ExhibitionPhoto
              photo={PHOTOS.projection}
              lang={selectedLang}
              reducedMotion={reducedMotion}
            />
          </div>
        </section>

        <section className="on-section on-dark">
          <div className="on-context on-inner">
            <ExhibitionPhoto
              photo={PHOTOS.gallery}
              lang={selectedLang}
              reducedMotion={reducedMotion}
            />
            <ExhibitionPhoto
              photo={PHOTOS.installation}
              lang={selectedLang}
              caption={c.contextCaption}
              reducedMotion={reducedMotion}
            />
          </div>
        </section>

        <section className="on-section on-dark on-ending">
          <div className="on-inner">
            <ExhibitionPhoto
              photo={PHOTOS.ending}
              lang={selectedLang}
              sizes="(max-width: 1320px) 92vw, 1180px"
              reducedMotion={reducedMotion}
            />
          </div>
        </section>

        <section className="on-section on-dark on-credits">
          <div className="on-inner">
            <div className="on-credits__head">
              <div>
                <p className="on-kicker">05 / {c.sectionArchive}</p>
                <h2 className="on-h2">{c.creditsTitle}</h2>
              </div>
              <span className="on-credits__mark" aria-hidden="true">≈ 𖦹 ≈</span>
            </div>
            <AsciiDivider opacity={0.52} style={{ marginBottom: "1rem" }} />
            <div className="on-credits__grid">
              {c.credits.map((credit) => (
                <div className="on-credit" key={credit.label}>
                  <span className="on-credit__label">{credit.label}</span>
                  <span className="on-credit__value">{credit.value}</span>
                </div>
              ))}
            </div>
            <AsciiDivider opacity={0.52} style={{ marginTop: "1rem" }} />
            <motion.figure
              className="on-partners"
              initial={reducedMotion ? false : { opacity: 0, y: 24, rotate: -0.8 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.8, ease: motionEase }}
            >
              <figcaption className="on-partners__label">{c.partnersLabel}</figcaption>
              <Image
                src="/img/ondularis/creditos-institucionais.webp"
                width={1080}
                height={1350}
                sizes="(max-width: 560px) calc(100vw - 3.6rem), 31rem"
                alt={c.partnersAlt}
              />
            </motion.figure>
            <p className="on-credits__end" aria-hidden="true">
              ⠂⠄⠄⠂  ≈  ⠂⠄⠄⠂  𖦹  ⠂⠄⠄⠂  ≈  ⠂⠄⠄⠂
            </p>
          </div>
        </section>
      </div>
    </ProjectShell>
  );
}
