"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import ProjectShell from "@/components/ProjectShell";
import AsciiDivider from "@/components/AsciiDivider";
import { useT } from "@/i18n/LanguageContext";

const workshopPhotos = {
  room: {
    src: "/img/touchdesigner-workshop/documentacao/01-sala-projecao.webp",
    width: 1672,
    height: 941,
  },
  collective: {
    src: "/img/touchdesigner-workshop/documentacao/03-projecao-coletiva.webp",
    width: 1672,
    height: 941,
  },
  patch: {
    src: "/img/touchdesigner-workshop/documentacao/04-patch-participante.webp",
    width: 1672,
    height: 941,
  },
  practice: {
    src: "/img/touchdesigner-workshop/documentacao/05-pratica-touchdesigner.webp",
    width: 1672,
    height: 941,
  },
  mapping: {
    src: "/img/touchdesigner-workshop/documentacao/06-mapeamento-projecao.webp",
    width: 941,
    height: 1672,
  },
  preparation: {
    src: "/img/touchdesigner-workshop/documentacao/07-busto-preparacao.webp",
    width: 941,
    height: 1672,
  },
  projection: {
    src: "/img/touchdesigner-workshop/documentacao/08-busto-projecao.webp",
    width: 941,
    height: 1672,
  },
  final: {
    src: "/img/touchdesigner-workshop/documentacao/09-busto-final.webp",
    width: 941,
    height: 1672,
  },
} as const;

const copy = {
  pt: {
    description:
      "Uma oficina de quatro horas de introdução à programação visual e à arte generativa no TouchDesigner, planejada como pesquisa experimental do meu PIBIC e do meu TCC.",
    challenge:
      "Dá para apresentar programação criativa a quem vem do design sem pedir uma linha de código escrito — e usar a oficina como experimento da pesquisa do meu TCC?",
    outcome:
      "Sete participantes saíram da interface vazia e chegaram a protótipos próprios no fim, sem escrever código. A cadeia de áudio montada ali virou base dos testes de som e imagem do meu TCC.",
    role:
      "Oficineira e pesquisadora (PIBIC) · condução da oficina com Crisia e Plínio Hit · orientação: Prof. Clorisval Pereira.",
    meta: [
      { label: "formato", value: "oficina presencial · inscrições gratuitas" },
      { label: "duração", value: "4 horas · 13h às 17h" },
      { label: "data", value: "02 de julho de 2026" },
      { label: "local", value: "LAID · Edifício JMM · UFRJ" },
      { label: "vagas", value: "10 vagas · 17 inscrições" },
    ],
    heroKicker: "programação visual · arte generativa · vídeo mapping",
    heroA: "do node vazio",
    heroB: "ao primeiro patch",
    heroNote:
      "Introdução à programação visual e à arte generativa no TouchDesigner, planejada e conduzida como pesquisa experimental do meu PIBIC e do meu TCC na EBA/UFRJ.",
    premiseKicker: "01 / contexto",
    premiseTitle: "a oficina dentro da pesquisa",
    premise:
      "O TouchDesigner é um software de programação visual baseada em nós, usado para visuais em tempo real e performance audiovisual. Minha pesquisa de PIBIC e TCC investiga sistemas generativos para instalações interativas e performáticas, com elementos visuais manipulados em tempo real. A oficina entrou nesse percurso como pesquisa experimental, para apoiar o desenvolvimento de um projeto autoral.",
    premiseFlow: [
      { label: "pesquisa", sub: "TCC · PIBIC" },
      { label: "oficina", sub: "pesquisa experimental" },
      { label: "resultado", sub: "apoio à pesquisa" },
    ],
    goalsKicker: "02 / objetivo",
    goalsTitle: "desmistificar o código",
    goalsIntro:
      "O objetivo era planejar e realizar uma oficina que desmistificasse o uso do código. Ele valia para dois lados ao mesmo tempo.",
    goals: [
      {
        n: "01",
        title: "para a turma",
        body: "democratizar o acesso à ferramenta e aproximar estudantes da programação criativa, sem exigir código escrito",
      },
      {
        n: "02",
        title: "para a pesquisa",
        body: "usar a experiência como aprendizado para fundamentar o TCC e o PIBIC",
      },
    ],
    networkKicker: "03 / etapas",
    networkTitle: "uma conexão de cada vez",
    network:
      "Da interface e da lógica das famílias de operadores até o desenvolvimento guiado de um sistema audiorreativo e do vídeo mapping.",
    nodes: [
      { type: "TAB", title: "interface", sub: "navegação e lógica dos nós · tecla tab · famílias de operadores" },
      { type: "TOP", title: "imagem", sub: "TOPs: Noise e Circle animados" },
      { type: "CHOP", title: "som", sub: "CHOPs: o microfone controla a imagem" },
      { type: "COMP", title: "projeção", sub: "Kantan Mapper sobre o objeto" },
    ],
    networkCaption:
      "ver na projeção, refazer no próprio computador, seguir para a próxima conexão",
    methodKicker: "04 / ementa",
    methodTitle: "quatro horas, um encontro",
    method:
      "TouchDesigner para Videomapping: das 13h às 17h, no LAID, com 10 vagas e dois colegas de apoio. A abordagem foi teórico-prática — cada passo era demonstrado na projeção e repetido no computador de cada participante, até a mostra coletiva no fim.",
    methodSteps: [
      { label: "10 min", text: "00 · abertura + checklist" },
      { label: "30 min", text: "01 · sobrevivência básica" },
      { label: "40 min", text: "02 · criando a tinta (imagens 2D)" },
      { label: "15 min", text: "pausa", pause: true },
      { label: "40 min", text: "03 · áudio-reatividade" },
      { label: "50 min", text: "04 · Kantan Mapper" },
      { label: "55 min", text: "05 · mostra de resultados + encerramento" },
    ],
    processKicker: "04.1 / dentro da oficina",
    processTitle: "prática e troca",
    process:
      "Demonstração coletiva na projeção, acompanhamento próximo em cada computador e tempo para experimentar. A atividade foi registrada no LAID.",
    processCaptions: {
      room: "demonstração coletiva: a interface projetada para a sala inteira",
      patch: "experimentação visual no patch de cada participante",
      practice: "acompanhamento próximo, computador a computador",
      collective: "da tela pessoal à projeção coletiva",
    },
    resultsKicker: "05 / quem veio",
    resultsTitle: "17 inscrições para 10 vagas",
    stats: [
      { n: "17", label: "inscrições pelo formulário" },
      { n: "10", label: "vagas oferecidas" },
      { n: "07", label: "participantes efetivos + 3 tutores" },
    ],
    profileLabel: "perfil dos inscritos",
    profile:
      "Design (9), arquitetura (4) e outras áreas (4): cinema, publicidade, sistemas e matemática. Também vieram inscrições da PUC-Rio, do IFF, da Estácio e da Cruzeiro do Sul.",
    flyerAlt: "Flyer da Oficina de Video Mapping: introdução ao TouchDesigner, 02/07, 13h às 17h, Edifício JMM",
    flyerCaption: "flyer · divulgado no instagram do LED e do LAID",
    mappingKicker: "06 / vídeo mapping",
    mappingTitle: "a imagem ocupa o objeto",
    mapping:
      "No bloco do Kantan Mapper, o patch saiu da tela e foi para um objeto: a imagem foi ajustada sobre um busto, com projeção, calibragem e montagem. Os protótipos registram o busto sem e com projeção.",
    mappingQuote: "superfície. luz. imagem.",
    mappingCaptions: {
      mapping: "ajuste do mapeamento sobre a superfície",
      preparation: "o busto antes de receber luz",
      projection: "testes de escala, máscara e alinhamento",
      final: "resultado: imagem digital aderindo à forma escultórica",
    },
    learnKicker: "07 / aprendizados",
    learnTitle: "como explicar o que já parece familiar?",
    learn:
      "Para quem já usa o software, a lógica dos nós parece óbvia. Conduzir a oficina foi traduzir essa lógica para quem estava começando.",
    learnings: [
      { label: "tradução", text: "traduzir termos técnicos para iniciantes" },
      { label: "condução", text: "nervosismo na condução" },
      { label: "turma", text: "boa receptividade do grupo" },
      { label: "o que ficou", text: "rápida assimilação da lógica dos nós e protótipos autorais ao final" },
    ],
    thesisKicker: "08 / de volta à pesquisa",
    thesisTitle: "o que a oficina devolveu ao TCC",
    thesis:
      "A oficina foi pensada como pesquisa experimental, e três partes dela voltaram para o projeto autoral.",
    thesisLinks: [
      {
        type: "01",
        title: "som → imagem",
        sub: "a cadeia de áudio montada na oficina serviu de base para os testes entre som e imagem da pesquisa",
      },
      {
        type: "02",
        title: "imagem → superfície",
        sub: "o Kantan Mapper testou projeção, calibragem e montagem sobre objetos físicos",
      },
      {
        type: "03",
        title: "pessoas → sistema",
        sub: "tornar a experiência compreensível para quem não conhece a tecnologia",
      },
    ],
    teamKicker: "09 / equipe & rede",
    teamTitle: "quem fez junto",
    facilitatorsLabel: "oficineiros",
    facilitators: [
      {
        name: "Maria Isabel Lisita",
        role: "designer · artista digital · tecnologia criativa",
      },
      {
        name: "Crisia (Christiane Azevedo)",
        role: "artista multimídia · designer · fotógrafa · videomaker",
      },
      {
        name: "Plínio Hit",
        role: "artista multimídia · editor · produtor audiovisual",
      },
    ],
    adviserLabel: "orientação",
    adviser: "Prof. Clorisval Pereira · Escola de Belas Artes · UFRJ",
    presentedLabel: "apresentação",
    presented: "SIAC 2026 · Escola de Belas Artes · UFRJ",
    realizationLabel: "realização",
    realization:
      "LED — Laboratório de Experimentações em Design · LAID — Laboratório Aberto de Inovação e Design",
    supportLabel: "apoio",
    support:
      "Inova EBA · PPGDesign · Escola de Belas Artes · Universidade Federal do Rio de Janeiro",
    creditsCaption: "realização e instituições apoiadoras",
  },
  en: {
    description:
      "A four-hour introduction to visual programming and generative art in TouchDesigner, planned as experimental research for my undergraduate research grant (PIBIC) and my thesis.",
    challenge:
      "Can you introduce creative coding to design students without asking for a single line of written code — and use the workshop as an experiment for my thesis research?",
    outcome:
      "Seven participants started from an empty interface and ended with prototypes of their own, without writing code. The audio chain built there became the basis for my thesis's sound-and-image tests.",
    role:
      "Workshop lead and researcher (PIBIC) · co-led with Crisia and Plínio Hit · advised by Prof. Clorisval Pereira.",
    meta: [
      { label: "format", value: "in-person workshop · free registration" },
      { label: "duration", value: "4 hours · 1 to 5 pm" },
      { label: "date", value: "July 2, 2026" },
      { label: "venue", value: "LAID · JMM Building · UFRJ" },
      { label: "places", value: "10 places · 17 sign-ups" },
    ],
    heroKicker: "visual programming · generative art · video mapping",
    heroA: "from an empty node",
    heroB: "to a first patch",
    heroNote:
      "An introduction to visual programming and generative art in TouchDesigner, planned and run as experimental research for my undergraduate research grant and thesis at EBA/UFRJ.",
    premiseKicker: "01 / context",
    premiseTitle: "the workshop inside the research",
    premise:
      "TouchDesigner is node-based visual programming software used for real-time visuals and audiovisual performance. My undergraduate research and thesis look at generative systems for interactive and performative installations, with visual elements manipulated in real time. The workshop was part of that work as experimental research, supporting the development of a personal project.",
    premiseFlow: [
      { label: "research", sub: "thesis · PIBIC" },
      { label: "workshop", sub: "experimental research" },
      { label: "result", sub: "support for the research" },
    ],
    goalsKicker: "02 / objective",
    goalsTitle: "demystifying code",
    goalsIntro:
      "The aim was to plan and run a workshop that would demystify code. It served two sides at once.",
    goals: [
      {
        n: "01",
        title: "for the group",
        body: "open up access to the tool and bring students closer to creative coding, without requiring written code",
      },
      {
        n: "02",
        title: "for the research",
        body: "use the experience as a learning process to ground my thesis and research grant work",
      },
    ],
    networkKicker: "03 / stages",
    networkTitle: "one connection at a time",
    network:
      "From the interface and the logic of operator families to the guided build of an audio-reactive system and the video mapping.",
    nodes: [
      { type: "TAB", title: "interface", sub: "navigation and node logic · tab key · operator families" },
      { type: "TOP", title: "image", sub: "TOPs: animated Noise and Circle" },
      { type: "CHOP", title: "sound", sub: "CHOPs: the microphone drives the image" },
      { type: "COMP", title: "projection", sub: "Kantan Mapper on the object" },
    ],
    networkCaption:
      "see it on the projector, rebuild it on your own computer, move on to the next connection",
    methodKicker: "04 / program",
    methodTitle: "four hours, one session",
    method:
      "TouchDesigner for Video Mapping: 1 to 5 pm at LAID, with 10 places and two colleagues assisting. The approach mixed theory and practice — each step was demonstrated on the projector and repeated on every participant's computer, leading up to a group showcase at the end.",
    methodSteps: [
      { label: "10 min", text: "00 · welcome + checklist" },
      { label: "30 min", text: "01 · basic survival" },
      { label: "40 min", text: "02 · making the paint (2D images)" },
      { label: "15 min", text: "break", pause: true },
      { label: "40 min", text: "03 · audio reactivity" },
      { label: "50 min", text: "04 · Kantan Mapper" },
      { label: "55 min", text: "05 · results showcase + wrap-up" },
    ],
    processKicker: "04.1 / inside the workshop",
    processTitle: "practice and exchange",
    process:
      "A group demonstration on the projector, close guidance at each computer and time to experiment. The session was documented at LAID.",
    processCaptions: {
      room: "group demonstration: the interface projected for the whole room",
      patch: "visual experiments in each participant's patch",
      practice: "close guidance, one computer at a time",
      collective: "from the personal screen to the shared projection",
    },
    resultsKicker: "05 / who came",
    resultsTitle: "17 sign-ups for 10 places",
    stats: [
      { n: "17", label: "sign-ups through the form" },
      { n: "10", label: "places offered" },
      { n: "07", label: "participants who attended + 3 tutors" },
    ],
    profileLabel: "who signed up",
    profile:
      "Design (9), architecture (4) and other fields (4): film, advertising, information systems and mathematics. Sign-ups also came from PUC-Rio, IFF, Estácio and Cruzeiro do Sul.",
    flyerAlt: "Flyer for the Video Mapping Workshop: introduction to TouchDesigner, July 2, 1 to 5 pm, JMM Building",
    flyerCaption: "flyer · shared on the LED and LAID instagram accounts",
    mappingKicker: "06 / video mapping",
    mappingTitle: "the image takes over the object",
    mapping:
      "In the Kantan Mapper block, the patch left the screen and moved onto an object: the image was fitted onto a bust through projection, calibration and setup. The prototypes show the bust with and without projection.",
    mappingQuote: "surface. light. image.",
    mappingCaptions: {
      mapping: "adjusting the mapping on the surface",
      preparation: "the bust before the light",
      projection: "scale, mask and alignment tests",
      final: "result: the digital image wrapping the sculpted form",
    },
    learnKicker: "07 / what I learned",
    learnTitle: "how do you explain what already feels familiar?",
    learn:
      "For anyone who already uses the software, node logic feels obvious. Leading the workshop meant translating that logic for people who were just starting.",
    learnings: [
      { label: "jargon", text: "translating technical terms for beginners" },
      { label: "nerves", text: "nerves while leading the session" },
      { label: "the group", text: "the group was receptive" },
      { label: "what stuck", text: "the node logic sank in quickly, and there were original prototypes by the end" },
    ],
    thesisKicker: "08 / back to the research",
    thesisTitle: "what the workshop gave back to the thesis",
    thesis:
      "The workshop was designed as experimental research, and three parts of it went back into my own project.",
    thesisLinks: [
      {
        type: "01",
        title: "sound → image",
        sub: "the audio chain built in the workshop became the basis for the research's sound-and-image tests",
      },
      {
        type: "02",
        title: "image → surface",
        sub: "Kantan Mapper tested projection, calibration and setup on physical objects",
      },
      {
        type: "03",
        title: "people → system",
        sub: "making the experience understandable for people who don't know the technology",
      },
    ],
    teamKicker: "09 / team & network",
    teamTitle: "who made it with me",
    facilitatorsLabel: "workshop leads",
    facilitators: [
      {
        name: "Maria Isabel Lisita",
        role: "designer · digital artist · creative technologist",
      },
      {
        name: "Crisia (Christiane Azevedo)",
        role: "multimedia artist · designer · photographer · videomaker",
      },
      {
        name: "Plínio Hit",
        role: "multimedia artist · editor · audiovisual producer",
      },
    ],
    adviserLabel: "adviser",
    adviser: "Prof. Clorisval Pereira · School of Fine Arts · UFRJ",
    presentedLabel: "presented at",
    presented: "SIAC 2026 · School of Fine Arts · UFRJ",
    realizationLabel: "organized by",
    realization:
      "LED — Design Experimentation Lab · LAID — Open Lab for Innovation and Design",
    supportLabel: "support",
    support:
      "Inova EBA · PPGDesign · School of Fine Arts · Federal University of Rio de Janeiro",
    creditsCaption: "organizers and supporting institutions",
  },
} as const;

const styles = `
  .td {
    --td-deep: #0a0a12;
    --td-panel: #151622;
    --td-grid: rgba(141, 150, 184, .12);
    --td-ink: #f2f1dd;
    --td-cyan: #63e6ff;
    --td-pink: #ff4fd8;
    --td-violet: #735cff;
    --td-orange: #ff9d4d;
    --td-line: rgba(175, 185, 222, .3);
  }
  .td-section {
    position: relative;
    max-width: 1320px;
    margin: 0 auto;
    padding: clamp(4.5rem, 9vw, 8rem) clamp(1.25rem, 5vw, 4.5rem);
  }
  .td-dark {
    max-width: none;
    color: var(--td-ink);
    background-color: var(--td-deep);
    background-image:
      linear-gradient(var(--td-grid) 1px, transparent 1px),
      linear-gradient(90deg, var(--td-grid) 1px, transparent 1px),
      radial-gradient(60rem 45rem at var(--pj-light-pos, 72% 22%), rgba(92, 67, 217, .26), transparent 72%),
      radial-gradient(42rem 34rem at 15% 78%, rgba(255, 44, 196, .12), transparent 70%);
    background-size: 42px 42px, 42px 42px, 100% 100%, 100% 100%;
    background-attachment: local, local, fixed, fixed;
  }
  .pj-main > .td-dark::before {
    color: #080810;
    background: rgba(99, 230, 255, .92);
    border-color: rgba(99, 230, 255, .48);
  }
  .td-inner { width: min(100%, var(--project-content-max)); margin: 0 auto; }
  .td-kicker {
    margin: 0 0 .8rem;
    color: currentColor;
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-micro);
    font-weight: var(--offbit-weight);
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
    opacity: .65;
  }
  .td-h2 {
    max-width: var(--measure-section-title);
    margin: 0 0 1.4rem;
    font-family: var(--font-head);
    font-size: clamp(2.5rem, 6vw, 5.8rem);
    font-weight: 400;
    line-height: .92;
    letter-spacing: -.04em;
    text-transform: lowercase;
    text-wrap: balance;
  }
  .td-p {
    max-width: var(--measure-copy);
    margin: 0;
    font-family: var(--font-body);
    font-size: clamp(1.04rem, 1.5vw, 1.2rem);
    line-height: 1.72;
    text-wrap: pretty;
  }
  .td-poster {
    position: relative;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    box-shadow: none;
    rotate: 0deg;
  }
  .td-poster::before {
    content: "+--[ " attr(data-frame) " ]--------------------------------";
    position: absolute;
    z-index: 2;
    top: -1.35rem;
    left: 0;
    width: 100%;
    color: var(--td-cyan);
    font-family: var(--font-mono), monospace;
    font-size: var(--type-micro);
    line-height: 1;
    letter-spacing: .03em;
    white-space: nowrap;
    overflow: hidden;
    opacity: .78;
    pointer-events: none;
  }
  .td-poster::after {
    content: "+--[ eof ]------------------------------------------------";
    position: absolute;
    z-index: 2;
    bottom: -1.25rem;
    left: 0;
    width: 100%;
    color: var(--td-pink);
    font-family: var(--font-mono), monospace;
    font-size: var(--type-micro);
    line-height: 1;
    letter-spacing: .03em;
    white-space: nowrap;
    overflow: hidden;
    opacity: .58;
    pointer-events: none;
  }
  .td-poster img { display: block; width: 100%; height: auto; }
  .td-caption {
    margin: .7rem 0 0;
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-micro);
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
    opacity: .58;
  }
  .td-cover {
    display: grid;
    grid-template-columns: minmax(280px, .7fr) minmax(320px, 1fr);
    gap: clamp(2.5rem, 8vw, 8rem);
    align-items: center;
    min-height: min(980px, 94svh);
  }
  .td-cover__copy { max-width: 46rem; }
  .td-cover__signal {
    margin: 1.8rem 0;
    color: var(--td-cyan);
    font-family: var(--font-mono), monospace;
    font-size: clamp(.68rem, 1.2vw, .95rem);
    line-height: 1.35;
    white-space: pre;
    opacity: .78;
    overflow: hidden;
  }
  .td-cover__statement {
    margin: 0;
    font-family: var(--font-head);
    font-size: clamp(2.7rem, 6.2vw, 6.2rem);
    line-height: .88;
    letter-spacing: -.05em;
  }
  .td-cover__statement span { display: block; }
  .td-cover__statement em { color: var(--td-pink); font-weight: 400; }
  .td-cover__note {
    max-width: 42ch;
    margin: 1.6rem 0 0;
    font-family: var(--font-body);
    font-size: var(--type-body);
    line-height: 1.65;
    opacity: .72;
  }
  .td-premise {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(260px, .8fr);
    gap: clamp(2.5rem, 8vw, 8rem);
    align-items: end;
  }
  .td-premise__side {
    margin: 0;
    padding: 1.25rem 0 1.25rem 1.4rem;
    border-left: 2px solid var(--td-pink);
    font-family: var(--font-head);
    font-size: clamp(1.25rem, 2.4vw, 2rem);
    font-style: italic;
    line-height: 1.35;
  }
  .td-goals__head {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(2rem, 7vw, 7rem);
    align-items: end;
    margin-bottom: 3rem;
  }
  .td-goals {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: rgba(28,27,24,.2);
    border: 1px solid rgba(28,27,24,.2);
  }
  .td-goal {
    position: relative;
    min-height: 15rem;
    padding: 1.4rem;
    background:
      linear-gradient(135deg, rgba(255,255,255,.3), transparent 60%),
      var(--paper-sheet);
  }
  .td-goal__n {
    display: block;
    margin-bottom: 3rem;
    color: #7552f4;
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-micro);
    letter-spacing: var(--offbit-letter-spacing);
  }
  .td-goal__title {
    margin: 0 0 .7rem;
    font-family: var(--font-head);
    font-size: clamp(1.3rem, 2.3vw, 1.9rem);
    font-weight: 400;
  }
  .td-goal__body {
    margin: 0;
    font-family: var(--font-body);
    font-size: var(--type-body);
    line-height: 1.55;
    opacity: .72;
  }
  .td-network__head {
    display: grid;
    grid-template-columns: .85fr 1.15fr;
    gap: clamp(2rem, 7vw, 7rem);
    align-items: end;
    margin-bottom: 4rem;
  }
  .td-nodes {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: clamp(1.4rem, 3vw, 3rem);
    align-items: center;
  }
  .td-nodes::before {
    content: "";
    position: absolute;
    z-index: 0;
    left: 8%;
    right: 8%;
    top: 50%;
    height: 2px;
    background: linear-gradient(90deg, var(--td-cyan), var(--td-pink), var(--td-orange));
    box-shadow: 0 0 18px rgba(99, 230, 255, .45);
  }
  .td-node {
    position: relative;
    z-index: 1;
    min-height: 10rem;
    padding: 1.2rem;
    border: 1px solid var(--td-line);
    border-radius: .2rem;
    background:
      linear-gradient(180deg, rgba(255,255,255,.045), transparent 44%),
      var(--td-panel);
    box-shadow: 7px 8px 0 rgba(0,0,0,.26);
  }
  .td-node::before,
  .td-node::after {
    content: "";
    position: absolute;
    top: 50%;
    width: .72rem;
    height: .72rem;
    translate: 0 -50%;
    border: 2px solid var(--td-deep);
    border-radius: 50%;
    background: var(--td-cyan);
    box-shadow: 0 0 0 1px var(--td-line), 0 0 12px rgba(99, 230, 255, .7);
  }
  .td-node::before { left: -.42rem; }
  .td-node::after { right: -.42rem; background: var(--td-pink); }
  .td-node:first-child::before, .td-node:last-child::after { display: none; }
  .td-node__type {
    display: inline-block;
    margin-bottom: 1.8rem;
    padding: .25rem .42rem;
    color: var(--td-deep);
    background: var(--td-cyan);
    font-family: var(--font-mono), monospace;
    font-size: .62rem;
    letter-spacing: .12em;
  }
  .td-node:nth-child(2) .td-node__type,
  .td-node:nth-child(3) .td-node__type { background: var(--td-pink); }
  .td-node:last-child .td-node__type { background: var(--td-orange); }
  .td-node__title {
    margin: 0 0 .45rem;
    font-family: var(--font-head);
    font-size: clamp(1.2rem, 2vw, 1.65rem);
    font-weight: 400;
  }
  .td-node__sub {
    margin: 0;
    font-family: var(--font-body);
    font-size: var(--type-micro);
    line-height: 1.55;
    opacity: .65;
  }
  .td-network__caption {
    margin: 2rem 0 0;
    color: var(--td-cyan);
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-micro);
    letter-spacing: var(--offbit-letter-spacing);
    text-align: center;
    text-transform: lowercase;
  }
  .td-method {
    display: grid;
    grid-template-columns: minmax(0, .85fr) minmax(300px, 1.15fr);
    gap: clamp(2.5rem, 8vw, 8rem);
    align-items: start;
  }
  .td-method__steps { display: grid; border-top: 1px solid rgba(28,27,24,.28); }
  .td-method__step {
    display: grid;
    /* 8rem cabe "nervosismo" e "o que ficou" no itálico sem invadir o texto. */
    grid-template-columns: 8rem 1fr;
    gap: 1.2rem;
    padding: 1.35rem 0;
    border-bottom: 1px solid rgba(28,27,24,.28);
  }
  .td-method__label {
    color: #7552f4;
    font-family: var(--font-head);
    font-size: 1.35rem;
    font-style: italic;
  }
  .td-method__text {
    font-family: var(--font-body);
    font-size: var(--type-body);
    line-height: 1.6;
  }
  .td-process__head {
    display: grid;
    grid-template-columns: minmax(0, .8fr) minmax(280px, 1.2fr);
    gap: clamp(2.5rem, 8vw, 8rem);
    align-items: end;
    margin-bottom: clamp(2.5rem, 6vw, 5rem);
  }
  .td-process__grid {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: clamp(1rem, 2.5vw, 2rem);
  }
  .td-shot {
    position: relative;
    min-width: 0;
    margin: 0;
  }
  .td-shot--wide { grid-column: 1 / -1; }
  .td-shot--half { grid-column: span 6; }
  .td-shot img {
    display: block;
    width: 100%;
    height: auto;
    background: #0b0c14;
  }
  .td-shot--wide img { aspect-ratio: 16 / 9; object-fit: cover; }
  .td-shot--half img { aspect-ratio: 16 / 10; object-fit: cover; }
  .td-shot figcaption,
  .td-mapping__caption {
    margin: .72rem 0 0;
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-micro);
    line-height: 1.45;
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
    opacity: .62;
  }
  .td-shot figcaption::before,
  .td-mapping__caption::before {
    content: "+-- ";
    color: #7552f4;
  }
  .td-mapping {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(280px, .72fr);
    gap: clamp(2.5rem, 8vw, 8rem);
    align-items: center;
  }
  .td-mapping__hero {
    position: relative;
    margin: 0;
    isolation: isolate;
  }
  .td-mapping__hero::after {
    content: "";
    position: absolute;
    z-index: 1;
    inset: 0;
    background: linear-gradient(180deg, transparent 55%, rgba(10,10,18,.72));
    pointer-events: none;
  }
  .td-mapping__hero img {
    display: block;
    width: 100%;
    height: auto;
    max-height: 48rem;
    object-fit: contain;
    object-position: center;
  }
  .td-mapping__hero .td-mapping__caption {
    position: absolute;
    z-index: 2;
    right: 1rem;
    bottom: .85rem;
    left: 1rem;
    margin: 0;
    color: var(--td-ink);
    text-align: right;
  }
  .td-mapping blockquote {
    margin: 2rem 0 0;
    padding-left: 1.25rem;
    border-left: 2px solid var(--td-pink);
    font-family: var(--font-head);
    font-size: clamp(1.25rem, 2.5vw, 2rem);
    font-style: italic;
    line-height: 1.35;
  }
  .td-mapping__sequence {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(.75rem, 2vw, 1.5rem);
    width: min(100%, var(--project-content-max));
    margin: clamp(3rem, 7vw, 6rem) auto 0;
  }
  .td-mapping__sequence .td-shot img {
    aspect-ratio: 9 / 16;
    object-fit: cover;
  }
  .td-mapping__sequence .td-shot:nth-child(2) { margin-top: clamp(1.5rem, 5vw, 4.5rem); }
  .td-team__head { margin-bottom: 3rem; }
  .td-team {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(280px, .85fr);
    gap: clamp(2.5rem, 7vw, 7rem);
    align-items: start;
  }
  .td-facilitators { display: grid; border-top: 1px solid var(--td-line); }
  .td-person {
    display: grid;
    grid-template-columns: minmax(10rem, .65fr) 1fr;
    gap: 1.2rem;
    padding: 1.25rem 0;
    border-bottom: 1px solid var(--td-line);
  }
  .td-person__name {
    color: var(--td-cyan);
    font-family: var(--font-head);
    font-size: 1.35rem;
  }
  .td-person__role {
    font-family: var(--font-body);
    font-size: var(--type-body);
    line-height: 1.55;
    opacity: .72;
  }
  .td-credit {
    padding: 1.25rem 0;
    border-bottom: 1px solid var(--td-line);
  }
  .td-credit__label {
    display: block;
    margin-bottom: .55rem;
    color: var(--td-pink);
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-micro);
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
  }
  .td-credit__value {
    font-family: var(--font-body);
    font-size: var(--type-body);
    line-height: 1.62;
  }
  /* A pausa da ementa não é um bloco de conteúdo: fica mais apagada. */
  .td-method__step[data-pause="true"] { opacity: .5; }
  .td-method__step[data-pause="true"] .td-method__text { font-style: italic; }

  /* contexto: pesquisa -> oficina -> resultado, o diagrama do slide 2 */
  .td-flow {
    display: grid;
    margin: 0;
    padding: 0;
    list-style: none;
    border-left: 2px solid var(--td-pink);
  }
  .td-flow__step {
    position: relative;
    display: grid;
    gap: .2rem;
    padding: 1rem 0 1rem 1.4rem;
  }
  .td-flow__step + .td-flow__step::before {
    content: "↓";
    position: absolute;
    top: -.7rem;
    left: 1.4rem;
    color: #7552f4;
    font-family: var(--font-mono), monospace;
    font-size: .9rem;
    line-height: 1;
  }
  .td-flow__label {
    font-family: var(--font-head);
    font-size: clamp(1.4rem, 2.6vw, 2.1rem);
    font-style: italic;
    line-height: 1.1;
  }
  .td-flow__sub {
    color: #7552f4;
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-micro);
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
  }

  .td-goals--two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .td-goals--two .td-goal { min-height: 12rem; }
  .td-nodes--three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .td-nodes--three .td-node__sub { font-size: var(--type-body); opacity: .78; }

  /* resultados: números grandes e o flyer da divulgação */
  .td-results {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(260px, .7fr);
    gap: clamp(2.5rem, 7vw, 7rem);
    align-items: center;
  }
  .td-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(1rem, 3vw, 2.5rem);
    margin: 2.4rem 0 1rem;
  }
  /* dt antes de dd no código (rótulo e valor), número em cima na tela */
  .td-stat {
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-end;
    gap: .55rem;
    padding-top: 1rem;
    border-top: 1px solid var(--td-line);
  }
  .td-stat__n {
    margin: 0;
    color: var(--td-cyan);
    font-family: var(--font-head);
    font-size: clamp(3.2rem, 7vw, 5.6rem);
    line-height: .85;
    letter-spacing: -.04em;
    font-variant-numeric: tabular-nums;
  }
  .td-stat:last-child .td-stat__n { color: var(--td-pink); }
  .td-stat__label {
    font-family: var(--font-body);
    font-size: var(--type-micro);
    line-height: 1.45;
    opacity: .75;
  }
  .td-results__profile { border-bottom: 0; }
  @media (max-width: 900px) {
    .td-cover, .td-premise, .td-goals__head, .td-network__head,
    .td-method, .td-process__head, .td-mapping, .td-team, .td-results {
      grid-template-columns: 1fr;
    }
    .td-nodes--three { grid-template-columns: 1fr; }
    .td-goals { grid-template-columns: 1fr 1fr; }
    .td-nodes { grid-template-columns: 1fr 1fr; }
    .td-nodes::before { display: none; }
  }
  @media (max-width: 620px) {
    .td-section { padding: 4rem 1.25rem; }
    .td-cover { min-height: auto; }
    .td-cover__copy { order: 1; }
    .td-poster { order: 2; }
    .td-goals, .td-goals--two, .td-nodes { grid-template-columns: 1fr; }
    .td-stats { grid-template-columns: 1fr; gap: 0; }
    .td-stat { flex-direction: row-reverse; align-items: baseline; justify-content: flex-end; gap: 1rem; padding: .9rem 0; }
    .td-stat__n { font-size: 3rem; min-width: 4.5rem; }
    .td-goal { min-height: auto; }
    .td-goal__n { margin-bottom: 1.4rem; }
    .td-method__step, .td-person { grid-template-columns: 1fr; gap: .5rem; }
    .td-shot--half { grid-column: 1 / -1; }
    .td-mapping__sequence { grid-template-columns: 1fr; }
    .td-mapping__sequence .td-shot:nth-child(2) { margin-top: 0; }
    .td-node::before, .td-node::after { display: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .td-poster { rotate: 0deg; }
  }
`;

const ease = [0.16, 1, 0.3, 1] as const;

export default function TouchDesignerWorkshopProject() {
  const { lang } = useT();
  const selectedLang = lang === "en" ? "en" : "pt";
  const c = copy[selectedLang];
  const reducedMotion = useReducedMotion() ?? false;
  const reveal = (delay = 0) => ({
    initial: false,
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-70px" },
    transition: { duration: reducedMotion ? 0 : 0.8, delay, ease },
  });
  const heroReveal = (delay = 0) => ({
    initial: false,
    animate: { opacity: 1, y: 0 },
    transition: { duration: reducedMotion ? 0 : 0.8, delay, ease },
  });

  return (
    <ProjectShell
      /* o case ja abre com este mesmo arquivo */
      cover={false}
      accent="#735cff"
      title={
        <>
          {selectedLang === "pt" ? (
            <>oficina de <strong style={{ color: "#735cff", fontWeight: 700 }}>touchdesigner</strong></>
          ) : (
            <><strong style={{ color: "#735cff", fontWeight: 700 }}>touchdesigner</strong> workshop</>
          )}
        </>
      }
      desc={c.description}
      challenge={c.challenge}
      outcome={c.outcome}
      role={c.role}
      meta={c.meta.map((item) => ({ ...item }))}
    >
      <style>{styles}</style>
      <div className="td">
        <section className="td-section td-dark">
          <div className="td-cover td-inner">
            <motion.figure
              className="td-poster"
              data-frame={selectedLang === "pt" ? "output / projeção" : "output / projection"}
              {...heroReveal()}
            >
              <Image
                src="/img/touchdesigner-workshop/busto-colorido-capa.webp"
                width={941}
                height={1227}
                sizes="(max-width: 620px) 88vw, 38vw"
                alt={
                  selectedLang === "pt"
                    ? "Busto iluminado por projeções coloridas durante a oficina de TouchDesigner"
                    : "A bust lit by colorful projections during the TouchDesigner workshop"
                }
                priority
              />
            </motion.figure>
            <motion.div className="td-cover__copy" {...heroReveal(0.12)}>
              <p className="td-kicker">{c.heroKicker}</p>
              <div className="td-cover__signal" aria-hidden="true">
                {
                  "+------------+      +-------------+      +------------+\n" +
                  "|  input 01  |----->|  transform  |----->| output 01  |\n" +
                  "+------------+      +------+------+      +------------+\n" +
                  "                           |\n" +
                  "                     [ feedback loop ]"
                }
              </div>
              <p className="td-cover__statement">
                <span>{c.heroA}</span>
                <span><em>{c.heroB}</em></span>
              </p>
              <p className="td-cover__note">{c.heroNote}</p>
            </motion.div>
          </div>
        </section>

        {/* A ordem das seções segue a apresentação da SIAC 2026: contexto,
            objetivo, etapas, ementa, registros, resultados, experimento,
            aprendizados e o que voltou para o TCC. */}
        <section className="td-section">
          <motion.div className="td-premise td-inner" {...reveal()}>
            <div>
              <p className="td-kicker">{c.premiseKicker}</p>
              <h2 className="td-h2">{c.premiseTitle}</h2>
              <p className="td-p">{c.premise}</p>
            </div>
            <ol className="td-flow">
              {c.premiseFlow.map((step) => (
                <li className="td-flow__step" key={step.label}>
                  <span className="td-flow__label">{step.label}</span>
                  <span className="td-flow__sub">{step.sub}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        </section>

        <section className="td-section">
          <div className="td-inner">
            <motion.div className="td-goals__head" {...reveal()}>
              <div>
                <p className="td-kicker">{c.goalsKicker}</p>
                <h2 className="td-h2">{c.goalsTitle}</h2>
              </div>
              <p className="td-p">{c.goalsIntro}</p>
            </motion.div>
            <div className="td-goals td-goals--two">
              {c.goals.map((goal, index) => (
                <motion.article className="td-goal" key={goal.n} {...reveal(index * 0.07)}>
                  <span className="td-goal__n">{goal.n}</span>
                  <h3 className="td-goal__title">{goal.title}</h3>
                  <p className="td-goal__body">{goal.body}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="td-section td-dark">
          <div className="td-inner">
            <motion.div className="td-network__head" {...reveal()}>
              <div>
                <p className="td-kicker">{c.networkKicker}</p>
                <h2 className="td-h2">{c.networkTitle}</h2>
              </div>
              <p className="td-p">{c.network}</p>
            </motion.div>
            <div className="td-nodes">
              {c.nodes.map((node, index) => (
                <motion.article className="td-node" key={node.title} {...reveal(index * 0.1)}>
                  <span className="td-node__type">{node.type}</span>
                  <h3 className="td-node__title">{node.title}</h3>
                  <p className="td-node__sub">{node.sub}</p>
                </motion.article>
              ))}
            </div>
            <p className="td-network__caption">{c.networkCaption}</p>
          </div>
        </section>

        <section className="td-section">
          <motion.div className="td-method td-inner" {...reveal()}>
            <div>
              <p className="td-kicker">{c.methodKicker}</p>
              <h2 className="td-h2">{c.methodTitle}</h2>
              <p className="td-p">{c.method}</p>
            </div>
            <div className="td-method__steps">
              {c.methodSteps.map((step) => (
                <div
                  className="td-method__step"
                  key={step.text}
                  data-pause={"pause" in step && step.pause ? "true" : undefined}
                >
                  <span className="td-method__label">{step.label}</span>
                  <span className="td-method__text">{step.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="td-section">
          <div className="td-inner">
            <motion.div className="td-process__head" {...reveal()}>
              <div>
                <p className="td-kicker">{c.processKicker}</p>
                <h2 className="td-h2">{c.processTitle}</h2>
              </div>
              <p className="td-p">{c.process}</p>
            </motion.div>
            <div className="td-process__grid">
              <motion.figure className="td-shot td-shot--wide" {...reveal()}>
                <Image
                  src={workshopPhotos.room.src}
                  width={workshopPhotos.room.width}
                  height={workshopPhotos.room.height}
                  sizes="(max-width: 1320px) 92vw, 1180px"
                  alt={c.processCaptions.room}
                />
                <figcaption>{c.processCaptions.room}</figcaption>
              </motion.figure>
              <motion.figure className="td-shot td-shot--half" {...reveal()}>
                <Image
                  src={workshopPhotos.patch.src}
                  width={workshopPhotos.patch.width}
                  height={workshopPhotos.patch.height}
                  sizes="(max-width: 620px) 92vw, 44vw"
                  alt={c.processCaptions.patch}
                />
                <figcaption>{c.processCaptions.patch}</figcaption>
              </motion.figure>
              <motion.figure className="td-shot td-shot--half" {...reveal(0.08)}>
                <Image
                  src={workshopPhotos.practice.src}
                  width={workshopPhotos.practice.width}
                  height={workshopPhotos.practice.height}
                  sizes="(max-width: 620px) 92vw, 44vw"
                  alt={c.processCaptions.practice}
                />
                <figcaption>{c.processCaptions.practice}</figcaption>
              </motion.figure>
              <motion.figure className="td-shot td-shot--wide" {...reveal()}>
                <Image
                  src={workshopPhotos.collective.src}
                  width={workshopPhotos.collective.width}
                  height={workshopPhotos.collective.height}
                  sizes="(max-width: 1320px) 92vw, 1180px"
                  alt={c.processCaptions.collective}
                />
                <figcaption>{c.processCaptions.collective}</figcaption>
              </motion.figure>
            </div>
          </div>
        </section>

        <section className="td-section td-dark">
          <div className="td-inner td-results">
            <motion.div {...reveal()}>
              <p className="td-kicker">{c.resultsKicker}</p>
              <h2 className="td-h2">{c.resultsTitle}</h2>
              <dl className="td-stats">
                {c.stats.map((stat) => (
                  <div className="td-stat" key={stat.label}>
                    <dt className="td-stat__label">{stat.label}</dt>
                    <dd className="td-stat__n">{stat.n}</dd>
                  </div>
                ))}
              </dl>
              <div className="td-credit td-results__profile">
                <span className="td-credit__label">{c.profileLabel}</span>
                <div className="td-credit__value">{c.profile}</div>
              </div>
            </motion.div>
            <motion.figure
              className="td-poster"
              data-frame={selectedLang === "pt" ? "input / divulgação" : "input / promotion"}
              {...reveal(0.1)}
            >
              <Image
                src="/img/touchdesigner-workshop/cartaz-oficina-v2.webp"
                width={675}
                height={880}
                sizes="(max-width: 900px) 88vw, 34vw"
                alt={c.flyerAlt}
              />
              <figcaption className="td-caption">{c.flyerCaption}</figcaption>
            </motion.figure>
          </div>
        </section>

        <section className="td-section td-dark">
          <div className="td-inner">
            <div className="td-mapping">
              <motion.figure className="td-mapping__hero" {...reveal()}>
                <Image
                  src={workshopPhotos.final.src}
                  width={workshopPhotos.final.width}
                  height={workshopPhotos.final.height}
                  sizes="(max-width: 900px) 92vw, 52vw"
                  alt={c.mappingCaptions.final}
                />
                <figcaption className="td-mapping__caption">
                  {c.mappingCaptions.final}
                </figcaption>
              </motion.figure>
              <motion.div {...reveal(0.1)}>
                <p className="td-kicker">{c.mappingKicker}</p>
                <h2 className="td-h2">{c.mappingTitle}</h2>
                <p className="td-p">{c.mapping}</p>
                <blockquote>{c.mappingQuote}</blockquote>
              </motion.div>
            </div>
            <div className="td-mapping__sequence">
              <motion.figure className="td-shot" {...reveal()}>
                <Image
                  src={workshopPhotos.mapping.src}
                  width={workshopPhotos.mapping.width}
                  height={workshopPhotos.mapping.height}
                  sizes="(max-width: 620px) 92vw, 30vw"
                  alt={c.mappingCaptions.mapping}
                />
                <figcaption>{c.mappingCaptions.mapping}</figcaption>
              </motion.figure>
              <motion.figure className="td-shot" {...reveal(0.08)}>
                <Image
                  src={workshopPhotos.preparation.src}
                  width={workshopPhotos.preparation.width}
                  height={workshopPhotos.preparation.height}
                  sizes="(max-width: 620px) 92vw, 30vw"
                  alt={c.mappingCaptions.preparation}
                />
                <figcaption>{c.mappingCaptions.preparation}</figcaption>
              </motion.figure>
              <motion.figure className="td-shot" {...reveal(0.16)}>
                <Image
                  src={workshopPhotos.projection.src}
                  width={workshopPhotos.projection.width}
                  height={workshopPhotos.projection.height}
                  sizes="(max-width: 620px) 92vw, 30vw"
                  alt={c.mappingCaptions.projection}
                />
                <figcaption>{c.mappingCaptions.projection}</figcaption>
              </motion.figure>
            </div>
          </div>
        </section>

        <section className="td-section">
          <motion.div className="td-method td-inner" {...reveal()}>
            <div>
              <p className="td-kicker">{c.learnKicker}</p>
              <h2 className="td-h2">{c.learnTitle}</h2>
              <p className="td-p">{c.learn}</p>
            </div>
            <div className="td-method__steps">
              {c.learnings.map((item) => (
                <div className="td-method__step" key={item.label}>
                  <span className="td-method__label">{item.label}</span>
                  <span className="td-method__text">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="td-section td-dark">
          <div className="td-inner">
            <motion.div className="td-network__head" {...reveal()}>
              <div>
                <p className="td-kicker">{c.thesisKicker}</p>
                <h2 className="td-h2">{c.thesisTitle}</h2>
              </div>
              <p className="td-p">{c.thesis}</p>
            </motion.div>
            <div className="td-nodes td-nodes--three">
              {c.thesisLinks.map((link, index) => (
                <motion.article className="td-node" key={link.type} {...reveal(index * 0.1)}>
                  <span className="td-node__type">{link.type}</span>
                  <h3 className="td-node__title">{link.title}</h3>
                  <p className="td-node__sub">{link.sub}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="td-section td-dark">
          <div className="td-inner">
            <motion.div className="td-team__head" {...reveal()}>
              <p className="td-kicker">{c.teamKicker}</p>
              <h2 className="td-h2">{c.teamTitle}</h2>
            </motion.div>
            <AsciiDivider opacity={0.48} style={{ marginBottom: "2.5rem" }} />
            <div className="td-team">
              <motion.div {...reveal()}>
                <p className="td-kicker">{c.facilitatorsLabel}</p>
                <div className="td-facilitators">
                  {c.facilitators.map((person) => (
                    <div className="td-person" key={person.name}>
                      <span className="td-person__name">{person.name}</span>
                      <span className="td-person__role">{person.role}</span>
                    </div>
                  ))}
                </div>
                <div className="td-credit">
                  <span className="td-credit__label">{c.adviserLabel}</span>
                  <div className="td-credit__value">{c.adviser}</div>
                </div>
                <div className="td-credit">
                  <span className="td-credit__label">{c.presentedLabel}</span>
                  <div className="td-credit__value">{c.presented}</div>
                </div>
                <div className="td-credit">
                  <span className="td-credit__label">{c.realizationLabel}</span>
                  <div className="td-credit__value">{c.realization}</div>
                </div>
                <div className="td-credit">
                  <span className="td-credit__label">{c.supportLabel}</span>
                  <div className="td-credit__value">{c.support}</div>
                </div>
              </motion.div>
              <motion.figure
                className="td-poster"
                data-frame={selectedLang === "pt" ? "output / realizacao + apoio" : "output / organizers + support"}
                {...reveal(0.1)}
              >
                <Image
                  src="/img/touchdesigner-workshop/realizacao-apoio-v2.webp"
                  width={650}
                  height={872}
                  sizes="(max-width: 900px) 88vw, 38vw"
                  alt={c.creditsCaption}
                />
                <figcaption className="td-caption">{c.creditsCaption}</figcaption>
              </motion.figure>
            </div>
          </div>
        </section>
      </div>
    </ProjectShell>
  );
}
