"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import ProjectShell from "@/components/ProjectShell";
import AsciiDivider from "@/components/AsciiDivider";
import { useT } from "@/i18n/LanguageContext";

type Photo = {
  src: string;
  width: number;
  height: number;
  altPt: string;
  altEn: string;
};

const PHOTOS = {
  magenta: {
    src: "/img/cyber-marinum/11-aquario-magenta-hero.webp",
    width: 1254,
    height: 1254,
    altPt:
      "Aquário plantado de Cyber Marinum iluminado em azul, com imagem generativa magenta e verde ao fundo",
    altEn:
      "Cyber Marinum planted aquarium lit in blue with a magenta and green generative image behind it",
  },
  internal: {
    src: "/img/cyber-marinum/10-detalhe-interno.webp",
    width: 1254,
    height: 1254,
    altPt:
      "Detalhe interno do aquário com plantas, bolhas e reflexos da imagem generativa",
    altEn:
      "Inside view of the aquarium with plants, bubbles and reflections from the generative image",
  },
  green: {
    src: "/img/cyber-marinum/09-aquario-verde-hero.webp",
    width: 1254,
    height: 1254,
    altPt:
      "Aquário plantado de Cyber Marinum iluminado em verde e azul",
    altEn:
      "Cyber Marinum planted aquarium illuminated in green and blue",
  },
  team: {
    src: "/img/cyber-marinum/05-montagem-equipe-portfolio.webp",
    width: 1448,
    height: 1086,
    altPt:
      "Equipe reunida durante a montagem do aquário na galeria",
    altEn:
      "Team gathered while installing the aquarium in the gallery",
  },
  initial: {
    src: "/img/cyber-marinum/06-instalacao-inicial-portfolio.webp",
    width: 1448,
    height: 1086,
    altPt:
      "Aquário vazio sobre o pedestal durante o início da montagem",
    altEn:
      "Empty aquarium on its pedestal during the first stage of installation",
  },
  backstage: {
    src: "/img/cyber-marinum/07-bastidores-producao-portfolio.webp",
    width: 1448,
    height: 1086,
    altPt:
      "Bastidores da produção com equipe, monitores e equipamentos na galeria",
    altEn:
      "Production backstage with the team, monitors and equipment in the gallery",
  },
  aquariumTeam: {
    src: "/img/cyber-marinum/08-equipe-aquario-portfolio.webp",
    width: 1086,
    height: 1448,
    altPt:
      "Três integrantes da equipe cuidam das plantas dentro do aquário",
    altEn:
      "Three team members tending to the plants inside the aquarium",
  },
  technology: {
    src: "/img/cyber-marinum/03-detalhe-tecnologia-portfolio.webp",
    width: 1086,
    height: 1448,
    altPt:
      "Sensores, cabos, plantas e monitor do sistema computacional vistos através do aquário",
    altEn:
      "Sensors, cables, plants and the computer system monitor seen through the aquarium",
  },
  cabinet: {
    src: "/img/cyber-marinum/02-gabinete-tecnico-portfolio.webp",
    width: 1086,
    height: 1448,
    altPt:
      "Interior do gabinete técnico com computador, cabos, iluminação e controle",
    altEn:
      "Inside the technical cabinet with computer, cables, lighting and controls",
  },
  red: {
    src: "/img/cyber-marinum/04-aquario-hero-portfolio.webp",
    width: 1450,
    height: 1085,
    altPt:
      "Vista frontal do aquário com imagem generativa vermelha e violeta",
    altEn:
      "Front view of the aquarium with a red and violet generative image",
  },
  plaque: {
    src: "/img/cyber-marinum/12-placa-exposicao.webp",
    width: 1600,
    height: 1598,
    altPt:
      "Placa da exposição com autoria, descrição, QR code, NFC e recursos de acessibilidade",
    altEn:
      "Exhibition label with credits, description, QR code, NFC and accessibility resources",
  },
} satisfies Record<string, Photo>;

const copy = {
  pt: {
    description:
      "Uma obra de arte interespécies transforma um aquário vivo em interface: sensores leem a presença do público, dados alteram imagem e luz, e o ecossistema responde.",
    challenge:
      "Uma obra que depende de organismo vivo não para quando a galeria fecha.",
    outcome:
      "Um aquário plantado que virou interface: a câmera lê a aproximação do público, o sistema traduz em luz e imagem, e as plantas seguem no ritmo delas. Obra coletiva de sete autores, pelo NANO/UFRJ.",
    role:
      "Coautoria e colaboração artística pelo NANO (EBA/UFRJ), com participação na montagem e no cuidado da instalação.",
    meta: [
      { label: "formato", value: "obra interativa · arte interespécies" },
      { label: "ano da obra", value: "2023" },
      { label: "status", value: "em exibição na Meta Gallery" },
      { label: "local", value: "Rio de Janeiro · Brasil" },
    ],
    heroKicker: "presença · dados · vida",
    heroStatementA: "um ecossistema",
    heroStatementB: "que percebe",
    heroNote:
      "A obra aproxima organismos vivos e sistemas computacionais sem esconder a tensão entre cuidado, controle e interferência humana.",
    introKicker: "01 / organismo-interface",
    introTitle: "o aquário não é uma tela",
    intro:
      "Plantas aquáticas, água, substrato, raízes e organismos mantêm seus próprios ritmos. A camada computacional não substitui esse ambiente: observa sinais, recebe a presença do público e torna essa relação visível por meio de luz e imagem.",
    introSide:
      "O que muda na imagem começa fora dela: no corpo que se aproxima e no ecossistema que continua vivo.",
    exhibitionKicker: "02 / contexto expositivo",
    exhibitionTitle: "arte digital na década dos oceanos",
    exhibitionIntro:
      "Cyber Marinum integra a I Mostra Nacional de Criptoarte — Década dos Oceanos, exposição que reúne produção brasileira em arte, ciência e tecnologia para refletir sobre coexistência e sustentabilidade. Idealizada por Byron Mendes e com curadoria de Marcio Harum, a mostra coloca interatividade, sensorialidade e emoção no centro do percurso.",
    exhibitionFacts: [
      { label: "mostra", value: "I Mostra Nacional de Criptoarte" },
      { label: "tema", value: "Década dos Oceanos · Unesco" },
      { label: "curadoria", value: "Marcio Harum" },
    ],
    interactionKicker: "03 / interação",
    interactionTitle: "a presença entra no sistema",
    interaction:
      "Uma câmera sensível ao movimento identifica a aproximação do público. Esses dados alimentam o sistema de controle e alteram, em tempo real, as cores, intensidades e formas projetadas atrás do tanque.",
    interactionSteps: [
      { n: "01", title: "presença", body: "o público se aproxima da obra" },
      { n: "02", title: "leitura", body: "sensores enviam dados ao sistema" },
      { n: "03", title: "resposta", body: "imagem e iluminação se transformam" },
    ],
    interactionCaption: "duas respostas do mesmo organismo computacional",
    makingKicker: "04 / montagem",
    makingTitle: "construir também é cuidar",
    making:
      "A instalação exigiu articular estrutura expositiva, água, plantas, iluminação, sensores, monitor e computador. A montagem aconteceu como um processo coletivo de ajuste: cada decisão técnica também afetava as condições do ambiente vivo.",
    emptyCaption: "estrutura, câmera e pedestal antes da entrada do ecossistema",
    teamCaption: "montagem coletiva e preparação das plantas",
    backstageCaption: "integração entre espaço expositivo, hardware e software",
    careCaption: "o cuidado do aquário continua depois de a obra estar ligada",
    systemKicker: "05 / sistema",
    systemTitle: "a tecnologia aparece por camadas",
    system:
      "Cabos, câmera, monitor, computador e iluminação permanecem próximos do aquário. O aparato técnico não é um efeito autônomo: ele sustenta a tradução entre presença humana e resposta visual.",
    cabinetTitle: "infraestrutura",
    cabinetBody:
      "O gabinete reúne alimentação elétrica, computador e controles que mantêm o sistema em funcionamento.",
    sensorTitle: "leitura e processamento",
    sensorBody:
      "Sensores e software recebem os dados de aproximação e modulam a imagem generativa exibida atrás da água.",
    livingKicker: "06 / imagem viva",
    livingTitle: "nenhum estado é definitivo",
    living:
      "As imagens não funcionam como cenário fixo. Elas mudam com a interação enquanto plantas, água e matéria orgânica também se transformam ao longo do tempo.",
    creditsKicker: "07 / ficha técnica",
    creditsTitle: "uma autoria distribuída",
    authorsLabel: "autoria",
    authors:
      "Artur Cabral Reis · Francisco de Paula Barretto · Jackson Cardoso Leite · Maria Luiza Fragoso · Maria Isabel Lisita de Medeiros · Milton Sogabe · Suzete Venturelli",
    supportLabel: "apoios",
    support:
      "Maria Luiza Fragoso · João Vitor Coelho (NANO LAB, UFRJ) · CNPq · Instituto de Pesquisa Anima · UnB · UFBA · UAM",
    exhibitionLabel: "em exibição",
    exhibition:
      "Meta Gallery · 1ª Mostra Nacional de Criptoarte — Década dos Oceanos · Rio de Janeiro",
    sourceLabel: "registro do NANO ↗",
    exhibitionSourceLabel: "site oficial da mostra ↗",
    plaqueCaption:
      "placa da exposição com descrição, autoria e recursos de acessibilidade",
  },
  en: {
    description:
      "An interspecies artwork turns a living aquarium into an interface: sensors read the audience's presence, data changes image and light, and the ecosystem responds.",
    challenge:
      "A work that depends on living organisms doesn't stop when the gallery closes.",
    outcome:
      "A planted aquarium turned into an interface: a camera reads the audience approaching, the system translates that into light and image, and the plants keep their own pace. A collective work by seven authors, through NANO/UFRJ.",
    role:
      "Co-authorship and artistic collaboration through NANO (EBA/UFRJ), including the installation and care of the artwork.",
    meta: [
      { label: "format", value: "interactive work · interspecies art" },
      { label: "year", value: "2023" },
      { label: "status", value: "currently on view at Meta Gallery" },
      { label: "venue", value: "Rio de Janeiro · Brazil" },
    ],
    heroKicker: "presence · data · life",
    heroStatementA: "an ecosystem",
    heroStatementB: "that senses",
    heroNote:
      "The work brings living organisms and computational systems together without hiding the tension between care, control and human interference.",
    introKicker: "01 / organism-interface",
    introTitle: "the aquarium is not a screen",
    intro:
      "Aquatic plants, water, substrate, roots and organisms maintain rhythms of their own. The computational layer does not replace that environment: it observes signals, receives the audience's presence and makes that relationship visible through light and image.",
    introSide:
      "What changes in the image begins outside it: in the approaching body and in the ecosystem that remains alive.",
    exhibitionKicker: "02 / exhibition context",
    exhibitionTitle: "digital art in the ocean decade",
    exhibitionIntro:
      "Cyber Marinum is part of the 1st National Crypto Art Exhibition — Ocean Decade, which brings Brazilian art, science and technology together to reflect on coexistence and sustainability. Conceived by Byron Mendes and curated by Marcio Harum, the exhibition places interactivity, sensoriality and emotion at the centre of its journey.",
    exhibitionFacts: [
      { label: "exhibition", value: "1st National Crypto Art Exhibition" },
      { label: "theme", value: "Ocean Decade · Unesco" },
      { label: "curator", value: "Marcio Harum" },
    ],
    interactionKicker: "03 / interaction",
    interactionTitle: "presence enters the system",
    interaction:
      "A motion-sensitive camera detects the audience approaching. This data feeds the control system and changes the colours, intensity and forms projected behind the tank in real time.",
    interactionSteps: [
      { n: "01", title: "presence", body: "the audience approaches the work" },
      { n: "02", title: "reading", body: "sensors send data to the system" },
      { n: "03", title: "response", body: "image and lighting transform" },
    ],
    interactionCaption: "two responses from the same computational organism",
    makingKicker: "04 / installation",
    makingTitle: "building is also caring",
    making:
      "The installation brought together exhibition structures, water, plants, lighting, sensors, a monitor and a computer. It was assembled through a collective process of adjustment: every technical decision also affected the conditions of the living environment.",
    emptyCaption: "structure, camera and plinth before the ecosystem moved in",
    teamCaption: "collective installation and plant preparation",
    backstageCaption: "integration between exhibition space, hardware and software",
    careCaption: "caring for the aquarium continues after the work is switched on",
    systemKicker: "05 / system",
    systemTitle: "technology appears in layers",
    system:
      "Cables, camera, monitor, computer and lighting remain close to the aquarium. The technical apparatus is not an autonomous effect: it supports the translation between human presence and visual response.",
    cabinetTitle: "infrastructure",
    cabinetBody:
      "The cabinet houses power, computer and controls that keep the system running.",
    sensorTitle: "reading and processing",
    sensorBody:
      "Sensors and software receive proximity data and modulate the generative image shown behind the water.",
    livingKicker: "06 / living image",
    livingTitle: "no state is final",
    living:
      "The images do not behave as a fixed backdrop. They change through interaction while plants, water and organic matter also transform over time.",
    creditsKicker: "07 / credits",
    creditsTitle: "distributed authorship",
    authorsLabel: "authors",
    authors:
      "Artur Cabral Reis · Francisco de Paula Barretto · Jackson Cardoso Leite · Maria Luiza Fragoso · Maria Isabel Lisita de Medeiros · Milton Sogabe · Suzete Venturelli",
    supportLabel: "support",
    support:
      "Maria Luiza Fragoso · João Vitor Coelho (NANO LAB, UFRJ) · CNPq · Anima Research Institute · UnB · UFBA · UAM",
    exhibitionLabel: "currently on view",
    exhibition:
      "Meta Gallery · 1st National Crypto Art Exhibition — Ocean Decade · Rio de Janeiro",
    sourceLabel: "NANO project record ↗",
    exhibitionSourceLabel: "official exhibition site ↗",
    plaqueCaption:
      "exhibition label with the work's description, authorship and accessibility resources",
  },
} as const;

const styles = `
  .cm {
    --cm-deep: #050915;
    --cm-ink: #ecfff8;
    --cm-cyan: #68f5db;
    --cm-blue: #365dff;
    --cm-magenta: #ff4fcb;
    --cm-green: #86ff70;
    --cm-line: rgba(196, 255, 241, .28);
  }
  .cm-section {
    position: relative;
    max-width: 1320px;
    margin: 0 auto;
    padding: clamp(4.5rem, 9vw, 8rem) clamp(1.25rem, 5vw, 4.5rem);
  }
  .cm-dark {
    max-width: none;
    color: var(--cm-ink);
    background:
      radial-gradient(62rem 50rem at var(--pj-light-pos, 72% 18%), rgba(47, 67, 222, .34), transparent 72%),
      radial-gradient(42rem 35rem at 18% 78%, rgba(255, 52, 191, .12), transparent 70%),
      var(--cm-deep);
    background-attachment: fixed;
  }
  .pj-main > .cm-dark::before {
    color: #06131a;
    background: rgba(202, 255, 241, .92);
    border-color: rgba(202, 255, 241, .42);
  }
  .cm-inner { width: min(100%, var(--project-content-max)); margin: 0 auto; }
  .cm-kicker {
    margin: 0 0 .8rem;
    font-family: var(--font-subtitle), monospace;
    font-weight: var(--offbit-weight);
    font-size: var(--type-micro);
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
    opacity: .7;
  }
  .cm-h2 {
    max-width: var(--measure-section-title);
    margin: 0 0 1.4rem;
    font-family: var(--font-head);
    font-weight: 400;
    font-size: clamp(2.5rem, 6vw, 5.8rem);
    line-height: .92;
    letter-spacing: -.04em;
    text-transform: lowercase;
    text-wrap: balance;
  }
  .cm-p {
    max-width: var(--measure-copy);
    margin: 0;
    font-family: var(--font-body);
    font-size: clamp(1.04rem, 1.5vw, 1.2rem);
    line-height: 1.72;
    text-wrap: pretty;
  }
  .cm-photo { position: relative; margin: 0; min-width: 0; }
  .cm-photo::before {
    content: "";
    position: absolute;
    z-index: 0;
    inset: 8px -8px -8px 8px;
    border: 1px dashed var(--cm-line);
    background: rgba(95, 246, 211, .05);
  }
  .cm-photo img {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
    height: auto;
    border: 1px solid rgba(202, 255, 241, .2);
    background: #060913;
  }
  .cm-caption {
    position: relative;
    z-index: 1;
    margin: .75rem 0 0;
    font-family: var(--font-subtitle), monospace;
    font-weight: var(--offbit-weight);
    font-size: var(--type-micro);
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
    opacity: .62;
  }
  .cm-cover {
    display: grid;
    grid-template-columns: minmax(300px, 1fr) minmax(280px, .72fr);
    gap: clamp(2.2rem, 7vw, 7rem);
    align-items: center;
    min-height: min(980px, 94svh);
  }
  .cm-cover__image {
    box-shadow: 18px 22px 0 rgba(55, 85, 255, .12), 0 25px 80px rgba(0,0,0,.48);
    rotate: -.6deg;
  }
  .cm-cover__statement {
    margin: 0;
    font-family: var(--font-head);
    font-size: clamp(2.6rem, 6vw, 6rem);
    line-height: .88;
    letter-spacing: -.05em;
  }
  .cm-cover__statement span { display: block; }
  .cm-cover__statement em { color: var(--cm-magenta); font-weight: 400; }
  .cm-cover__note {
    max-width: 40ch;
    margin: 1.6rem 0 0;
    font-family: var(--font-body);
    font-size: var(--type-body);
    line-height: 1.65;
    opacity: .72;
  }
  .cm-cover__signal {
    margin: 1.7rem 0;
    color: var(--cm-cyan);
    font-family: var(--font-mono), monospace;
    font-size: clamp(.65rem, 1.1vw, .95rem);
    line-height: 1.25;
    white-space: pre;
    opacity: .72;
    overflow: hidden;
  }
  .cm-intro {
    display: grid;
    grid-template-columns: minmax(0, .8fr) minmax(300px, 1.2fr);
    gap: clamp(2.5rem, 8vw, 8rem);
    align-items: center;
  }
  .cm-intro__side {
    margin: 2rem 0 0;
    padding-left: 1.3rem;
    border-left: 1px dashed rgba(28,27,24,.35);
    font-family: var(--font-head);
    font-style: italic;
    font-size: clamp(1.2rem, 2vw, 1.7rem);
    line-height: 1.35;
  }
  .cm-context {
    display: grid;
    grid-template-columns: minmax(0, 1.18fr) minmax(280px, .82fr);
    gap: clamp(2.5rem, 8vw, 8rem);
    align-items: end;
  }
  .cm-context__facts {
    display: grid;
    border-top: 1px solid var(--cm-line);
  }
  .cm-context__fact {
    display: grid;
    grid-template-columns: 6.5rem 1fr;
    gap: 1rem;
    padding: 1.15rem 0;
    border-bottom: 1px solid var(--cm-line);
  }
  .cm-context__label {
    color: var(--cm-cyan);
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-micro);
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
  }
  .cm-context__value {
    font-family: var(--font-body);
    font-size: var(--type-body);
    line-height: 1.5;
  }
  .cm-interaction__head {
    display: grid;
    grid-template-columns: .75fr 1.25fr;
    gap: clamp(2rem, 7vw, 7rem);
    align-items: end;
    margin-bottom: 3rem;
  }
  .cm-steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin-bottom: clamp(3rem, 6vw, 5rem);
    border-top: 1px solid var(--cm-line);
    border-bottom: 1px solid var(--cm-line);
  }
  .cm-step { padding: 1.4rem; border-right: 1px solid var(--cm-line); }
  .cm-step:last-child { border-right: 0; }
  .cm-step__n {
    display: block;
    margin-bottom: 1rem;
    color: var(--cm-cyan);
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-micro);
    letter-spacing: var(--offbit-letter-spacing);
  }
  .cm-step__title {
    margin: 0 0 .5rem;
    font-family: var(--font-head);
    font-size: clamp(1.25rem, 2.4vw, 1.9rem);
    font-weight: 400;
  }
  .cm-step__body {
    margin: 0;
    font-family: var(--font-body);
    font-size: var(--type-body);
    line-height: 1.55;
    opacity: .7;
  }
  .cm-states {
    position: relative;
    isolation: isolate;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    padding: clamp(.75rem, 2vw, 1.5rem) 0 2.8rem;
    overflow: hidden;
    background:
      radial-gradient(60% 75% at 24% 44%, rgba(42, 55, 176, .34), transparent 72%),
      radial-gradient(58% 72% at 76% 42%, rgba(41, 87, 213, .28), transparent 70%),
      linear-gradient(90deg, #070915 0%, #0b1028 46%, #111844 100%);
  }
  .cm-states::before {
    content: "";
    position: absolute;
    z-index: 2;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(7,9,21,.5), transparent 14% 86%, rgba(13,18,45,.42)),
      linear-gradient(180deg, rgba(7,9,21,.34), transparent 18% 72%, rgba(7,9,21,.62));
    pointer-events: none;
  }
  .cm-states .cm-photo {
    z-index: 1;
    width: 106%;
  }
  .cm-states .cm-photo:first-child { justify-self: start; }
  .cm-states .cm-photo:last-of-type {
    justify-self: end;
    margin-left: -6%;
  }
  .cm-states .cm-photo::before { display: none; }
  .cm-states .cm-photo img {
    border: 0;
    background: transparent;
    box-shadow: none;
  }
  .cm-states .cm-photo:first-child img {
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 86%, transparent 100%);
    mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 86%, transparent 100%);
  }
  .cm-states .cm-photo:last-of-type img {
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 14%, #000 92%, transparent 100%);
    mask-image: linear-gradient(90deg, transparent 0%, #000 14%, #000 92%, transparent 100%);
  }
  .cm-states__caption {
    position: absolute;
    z-index: 3;
    left: 50%;
    bottom: .55rem;
    width: min(90%, 42rem);
    margin: 0;
    translate: -50% 0;
    color: rgba(236,255,248,.58);
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-micro);
    letter-spacing: var(--offbit-letter-spacing);
    text-align: center;
    text-transform: lowercase;
  }
  .cm-making__head {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(2rem, 7vw, 7rem);
    align-items: end;
    margin-bottom: 3rem;
  }
  .cm-making__wide { margin-bottom: clamp(1.2rem, 3vw, 2.5rem); }
  .cm-making__duo {
    display: grid;
    grid-template-columns: 1.1fr .9fr;
    gap: clamp(1.2rem, 3vw, 2.5rem);
    align-items: start;
  }
  .cm-making__duo .cm-photo:nth-child(2) { margin-top: clamp(2.5rem, 8vw, 7rem); }
  .cm-system {
    display: grid;
    grid-template-columns: minmax(260px, .78fr) minmax(280px, 1fr) minmax(260px, .78fr);
    gap: clamp(1.2rem, 3vw, 2.5rem);
    align-items: center;
  }
  .cm-system__copy { padding: 1rem 0; }
  .cm-system__card {
    margin-top: 2rem;
    padding-top: 1.2rem;
    border-top: 1px dashed currentColor;
  }
  .cm-system__card h3 {
    margin: 0 0 .55rem;
    color: var(--cm-cyan);
    font-family: var(--font-head);
    font-size: 1.45rem;
    font-weight: 400;
  }
  .cm-system__card p {
    margin: 0;
    font-family: var(--font-body);
    font-size: var(--type-body);
    line-height: 1.58;
    opacity: .72;
  }
  .cm-living__copy {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(2rem, 7vw, 7rem);
    align-items: end;
    margin-bottom: 3rem;
  }
  .cm-living .cm-photo { width: min(100%, 1180px); margin: 0 auto; }
  .cm-credits__head { margin-bottom: 2.5rem; }
  .cm-credits__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(280px, .85fr);
    gap: clamp(2rem, 6vw, 6rem);
    align-items: start;
  }
  .cm-credit {
    padding: 1.2rem 0;
    border-top: 1px dashed var(--cm-line);
  }
  .cm-credit:last-child { border-bottom: 1px dashed var(--cm-line); }
  .cm-credit__label {
    display: block;
    margin-bottom: .6rem;
    color: var(--cm-cyan);
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-micro);
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
  }
  .cm-credit__value {
    font-family: var(--font-body);
    font-size: var(--type-body);
    line-height: 1.65;
  }
  .cm-source {
    display: inline-flex;
    margin-top: 1.5rem;
    color: var(--cm-ink);
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-label);
    letter-spacing: var(--offbit-letter-spacing);
    text-decoration: underline;
    text-underline-offset: .25rem;
  }
  .cm-sources { display: flex; flex-wrap: wrap; gap: .6rem 1.4rem; }
  @media (max-width: 900px) {
    .cm-cover, .cm-intro, .cm-context, .cm-interaction__head, .cm-making__head,
    .cm-living__copy, .cm-credits__grid {
      grid-template-columns: 1fr;
    }
    .cm-system { grid-template-columns: 1fr 1fr; align-items: start; }
    .cm-system__copy { grid-column: 1 / -1; }
  }
  @media (max-width: 620px) {
    .cm-section { padding: 4rem 1.25rem; }
    .cm-cover { min-height: auto; }
    .cm-cover__image { order: 2; }
    .cm-cover__copy { order: 1; }
    .cm-steps, .cm-states, .cm-making__duo, .cm-system { grid-template-columns: 1fr; }
    .cm-step { border-right: 0; border-bottom: 1px solid var(--cm-line); }
    .cm-step:last-child { border-bottom: 0; }
    .cm-states {
      gap: 0;
      padding: .5rem 0 3rem;
      background:
        radial-gradient(78% 45% at 50% 28%, rgba(42, 55, 176, .34), transparent 76%),
        radial-gradient(78% 45% at 50% 72%, rgba(41, 87, 213, .28), transparent 74%),
        linear-gradient(180deg, #070915 0%, #0b1028 50%, #111844 100%);
    }
    .cm-states .cm-photo,
    .cm-states .cm-photo:last-of-type {
      width: 100%;
      margin-left: 0;
    }
    .cm-states .cm-photo:first-child img,
    .cm-states .cm-photo:last-of-type img {
      -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 8%, #000 88%, transparent 100%);
      mask-image: linear-gradient(180deg, transparent 0%, #000 8%, #000 88%, transparent 100%);
    }
    .cm-making__duo .cm-photo:nth-child(2) { margin-top: 0; }
    .cm-system__copy { grid-column: auto; }
  }
  @media (prefers-reduced-motion: reduce) {
    .cm-cover__image { rotate: 0deg; }
  }
`;

const motionEase = [0.16, 1, 0.3, 1] as const;

function ExhibitionPhoto({
  photo,
  lang,
  caption,
  priority = false,
  sizes = "(max-width: 900px) 100vw, 50vw",
  reducedMotion,
}: {
  photo: Photo;
  lang: "pt" | "en";
  caption?: string;
  priority?: boolean;
  sizes?: string;
  reducedMotion: boolean;
}) {
  return (
    <motion.figure
      className="cm-photo"
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reducedMotion ? 0 : 0.8, ease: motionEase }}
    >
      <Image
        src={photo.src}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        alt={lang === "pt" ? photo.altPt : photo.altEn}
        priority={priority}
      />
      {caption && <figcaption className="cm-caption">{caption}</figcaption>}
    </motion.figure>
  );
}

export default function CyberMarinumProject() {
  const { lang } = useT();
  const selectedLang = lang === "en" ? "en" : "pt";
  const c = copy[selectedLang];
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <ProjectShell
      accent="#4e56ff"
      title={
        <>
          <strong style={{ color: "#4e56ff", fontWeight: 700 }}>cyber</strong>{" "}
          marinum
        </>
      }
      desc={c.description}
      challenge={c.challenge}
      outcome={c.outcome}
      role={c.role}
      meta={c.meta.map((item) => ({ ...item }))}
    >
      <style>{styles}</style>
      <div className="cm">
        <section className="cm-section cm-dark">
          <div className="cm-cover cm-inner">
            <div className="cm-cover__image">
              <ExhibitionPhoto
                photo={PHOTOS.magenta}
                lang={selectedLang}
                priority
                sizes="(max-width: 900px) 92vw, 52vw"
                reducedMotion={reducedMotion}
              />
            </div>
            <motion.div
              className="cm-cover__copy"
              initial={reducedMotion ? false : { opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reducedMotion ? 0 : 0.9, ease: motionEase }}
            >
              <p className="cm-kicker">{c.heroKicker}</p>
              <div className="cm-cover__signal" aria-hidden="true">
                {"  ·   ·  ∿∿∿  ·\n∿∿  ◌  𖦹  ◌  ∿∿\n  ·  ∿∿∿  ·   ·"}
              </div>
              <p className="cm-cover__statement">
                <span>{c.heroStatementA}</span>
                <span>
                  <em>{c.heroStatementB}</em>
                </span>
              </p>
              <p className="cm-cover__note">{c.heroNote}</p>
            </motion.div>
          </div>
        </section>

        <section className="cm-section">
          <div className="cm-intro cm-inner">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reducedMotion ? 0 : 0.8, ease: motionEase }}
            >
              <p className="cm-kicker">{c.introKicker}</p>
              <h2 className="cm-h2">{c.introTitle}</h2>
              <p className="cm-p">{c.intro}</p>
              <p className="cm-intro__side">{c.introSide}</p>
            </motion.div>
            <ExhibitionPhoto
              photo={PHOTOS.internal}
              lang={selectedLang}
              sizes="(max-width: 900px) 92vw, 55vw"
              reducedMotion={reducedMotion}
            />
          </div>
        </section>

        <section className="cm-section cm-dark">
          <motion.div
            className="cm-context cm-inner"
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: reducedMotion ? 0 : 0.85, ease: motionEase }}
          >
            <div>
              <p className="cm-kicker">{c.exhibitionKicker}</p>
              <h2 className="cm-h2">{c.exhibitionTitle}</h2>
              <p className="cm-p">{c.exhibitionIntro}</p>
            </div>
            <div className="cm-context__facts">
              {c.exhibitionFacts.map((fact) => (
                <div className="cm-context__fact" key={fact.label}>
                  <span className="cm-context__label">{fact.label}</span>
                  <span className="cm-context__value">{fact.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="cm-section cm-dark">
          <div className="cm-inner">
            <div className="cm-interaction__head">
              <div>
                <p className="cm-kicker">{c.interactionKicker}</p>
                <h2 className="cm-h2">{c.interactionTitle}</h2>
              </div>
              <p className="cm-p">{c.interaction}</p>
            </div>
            <div className="cm-steps">
              {c.interactionSteps.map((step) => (
                <div className="cm-step" key={step.n}>
                  <span className="cm-step__n">{step.n}</span>
                  <h3 className="cm-step__title">{step.title}</h3>
                  <p className="cm-step__body">{step.body}</p>
                </div>
              ))}
            </div>
            <div className="cm-states">
              <ExhibitionPhoto
                photo={PHOTOS.green}
                lang={selectedLang}
                reducedMotion={reducedMotion}
              />
              <ExhibitionPhoto
                photo={PHOTOS.magenta}
                lang={selectedLang}
                reducedMotion={reducedMotion}
              />
              <p className="cm-states__caption">{c.interactionCaption}</p>
            </div>
          </div>
        </section>

        <section className="cm-section">
          <div className="cm-inner">
            <div className="cm-making__head">
              <div>
                <p className="cm-kicker">{c.makingKicker}</p>
                <h2 className="cm-h2">{c.makingTitle}</h2>
              </div>
              <p className="cm-p">{c.making}</p>
            </div>
            <div className="cm-making__wide">
              <ExhibitionPhoto
                photo={PHOTOS.initial}
                lang={selectedLang}
                caption={c.emptyCaption}
                sizes="(max-width: 1320px) 92vw, 1180px"
                reducedMotion={reducedMotion}
              />
            </div>
            <div className="cm-making__wide">
              <ExhibitionPhoto
                photo={PHOTOS.backstage}
                lang={selectedLang}
                caption={c.backstageCaption}
                sizes="(max-width: 1320px) 92vw, 1180px"
                reducedMotion={reducedMotion}
              />
            </div>
            <div className="cm-making__duo">
              <ExhibitionPhoto
                photo={PHOTOS.team}
                lang={selectedLang}
                caption={c.teamCaption}
                reducedMotion={reducedMotion}
              />
              <ExhibitionPhoto
                photo={PHOTOS.aquariumTeam}
                lang={selectedLang}
                caption={c.careCaption}
                reducedMotion={reducedMotion}
              />
            </div>
          </div>
        </section>

        <section className="cm-section cm-dark">
          <div className="cm-system cm-inner">
            <ExhibitionPhoto
              photo={PHOTOS.technology}
              lang={selectedLang}
              reducedMotion={reducedMotion}
            />
            <div className="cm-system__copy">
              <p className="cm-kicker">{c.systemKicker}</p>
              <h2 className="cm-h2">{c.systemTitle}</h2>
              <p className="cm-p">{c.system}</p>
              <div className="cm-system__card">
                <h3>{c.sensorTitle}</h3>
                <p>{c.sensorBody}</p>
              </div>
              <div className="cm-system__card">
                <h3>{c.cabinetTitle}</h3>
                <p>{c.cabinetBody}</p>
              </div>
            </div>
            <ExhibitionPhoto
              photo={PHOTOS.cabinet}
              lang={selectedLang}
              reducedMotion={reducedMotion}
            />
          </div>
        </section>

        <section className="cm-section cm-dark cm-living">
          <div className="cm-inner">
            <div className="cm-living__copy">
              <div>
                <p className="cm-kicker">{c.livingKicker}</p>
                <h2 className="cm-h2">{c.livingTitle}</h2>
              </div>
              <p className="cm-p">{c.living}</p>
            </div>
            <ExhibitionPhoto
              photo={PHOTOS.red}
              lang={selectedLang}
              sizes="(max-width: 1320px) 92vw, 1180px"
              reducedMotion={reducedMotion}
            />
          </div>
        </section>

        <section className="cm-section cm-dark">
          <div className="cm-inner">
            <div className="cm-credits__head">
              <p className="cm-kicker">{c.creditsKicker}</p>
              <h2 className="cm-h2">{c.creditsTitle}</h2>
            </div>
            <AsciiDivider opacity={0.5} style={{ marginBottom: "2.5rem" }} />
            <div className="cm-credits__grid">
              <div>
                <div className="cm-credit">
                  <span className="cm-credit__label">{c.authorsLabel}</span>
                  <div className="cm-credit__value">{c.authors}</div>
                </div>
                <div className="cm-credit">
                  <span className="cm-credit__label">{c.supportLabel}</span>
                  <div className="cm-credit__value">{c.support}</div>
                </div>
                <div className="cm-credit">
                  <span className="cm-credit__label">{c.exhibitionLabel}</span>
                  <div className="cm-credit__value">{c.exhibition}</div>
                </div>
                <div className="cm-sources">
                  <a
                    className="cm-source hover-trigger"
                    href="https://nano.eba.ufrj.br/cyber-marinum/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {c.sourceLabel}
                  </a>
                  <a
                    className="cm-source hover-trigger"
                    href="https://www.mnca.com.br/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {c.exhibitionSourceLabel}
                  </a>
                </div>
              </div>
              <ExhibitionPhoto
                photo={PHOTOS.plaque}
                lang={selectedLang}
                caption={c.plaqueCaption}
                reducedMotion={reducedMotion}
              />
            </div>
          </div>
        </section>

      </div>
    </ProjectShell>
  );
}
