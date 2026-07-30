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
      "Uma oficina de quatro horas para apresentar o TouchDesigner como ambiente de programação visual e aproximar iniciantes de imagens em tempo real e vídeo mapping.",
    challenge:
      "Quatro horas é pouco para a ferramenta e muito para aula expositiva.",
    outcome:
      "Oficina introdutória de quatro horas: do node vazio ao primeiro patch rodando, com a lógica nodal apresentada na prática em vez de no slide.",
    role:
      "Oficineira · introdução ao TouchDesigner · acompanhamento prático, em colaboração com Crisia e Plínio Hit.",
    meta: [
      { label: "formato", value: "oficina presencial · inscrições gratuitas" },
      { label: "duração", value: "4 horas · 13h às 17h" },
      { label: "data", value: "02 de julho de 2026" },
      { label: "local", value: "LAID · Edifício JMM · UFRJ" },
    ],
    heroKicker: "programação visual · tempo real · projeção",
    heroA: "do node vazio",
    heroB: "ao primeiro patch",
    heroNote:
      "Uma entrada prática no TouchDesigner para quem queria entender a lógica por trás de imagens generativas, interativas e projetadas.",
    premiseKicker: "01 / ponto de partida",
    premiseTitle: "programar também pode ser conectar",
    premise:
      "Em vez de começar por sintaxe, a oficina apresentou relações. No TouchDesigner, cada operador recebe, transforma e envia dados; o raciocínio se torna visível como uma rede que pode ser observada enquanto a imagem acontece.",
    premiseSide:
      "A interface deixa de parecer um painel técnico quando cada conexão produz uma consequência perceptível.",
    goalsKicker: "02 / objetivo pedagógico",
    goalsTitle: "complexidade em camadas",
    goalsIntro:
      "O encontro foi desenhado para construir familiaridade antes de velocidade. O foco não era memorizar menus, mas reconhecer padrões e ganhar autonomia para continuar experimentando.",
    goals: [
      {
        n: "01",
        title: "orientar-se",
        body: "reconhecer interface, famílias de operadores e fluxo de dados",
      },
      {
        n: "02",
        title: "conectar",
        body: "entender entrada, transformação e saída por meio dos nodes",
      },
      {
        n: "03",
        title: "experimentar",
        body: "alterar parâmetros e observar gráficos reagindo em tempo real",
      },
      {
        n: "04",
        title: "construir",
        body: "organizar um primeiro patch funcional com intenção visual",
      },
    ],
    networkKicker: "03 / lógica nodal",
    networkTitle: "a imagem como fluxo",
    network:
      "O patch foi tratado como uma sequência legível. Uma fonte entra, parâmetros transformam sua aparência, camadas se encontram e o resultado segue para a projeção.",
    nodes: [
      { type: "IN", title: "entrada", sub: "imagem · vídeo · câmera" },
      { type: "TOP", title: "transformar", sub: "posição · escala · cor" },
      { type: "TOP", title: "compor", sub: "camadas · máscara · feedback" },
      { type: "OUT", title: "projetar", sub: "saída · superfície · espaço" },
    ],
    networkCaption:
      "uma conexão por vez: ver o efeito, entender a relação, seguir construindo",
    methodKicker: "04 / facilitação",
    methodTitle: "ver, fazer, variar",
    method:
      "Cada conceito foi aproximado da prática por um ciclo curto: demonstração, reprodução acompanhada e variação livre. Assim, o patch deixava de ser uma receita fechada e virava um sistema que podia ser desmontado, testado e reconstruído.",
    methodSteps: [
      {
        label: "ver",
        text: "uma mudança pequena e seu efeito imediato na imagem",
      },
      {
        label: "fazer",
        text: "a mesma relação reconstruída no patch de cada participante",
      },
      {
        label: "variar",
        text: "parâmetros e conexões alterados para produzir outra resposta",
      },
    ],
    processKicker: "04.1 / prática em sala",
    processTitle: "a lógica aparece enquanto é construída",
    process:
      "A oficina alternou demonstração coletiva e acompanhamento próximo. Cada tela registrava uma solução diferente para o mesmo princípio, enquanto a projeção mantinha o processo visível para toda a sala.",
    processCaptions: {
      room: "a interface projetada transforma a sala em espaço de trabalho compartilhado",
      patch: "experimentação individual: parâmetros, operadores e imagem em tempo real",
      practice: "acompanhamento dos patches e troca entre participantes",
      collective: "da tela pessoal à projeção coletiva",
    },
    mappingKicker: "05 / vídeo mapping",
    mappingTitle: "a imagem encontra o espaço",
    mapping:
      "O vídeo mapping ampliou a pergunta: não apenas o que a imagem faz, mas onde ela acontece. A saída digital passou a ser pensada em relação a formato, superfície, escala e presença física.",
    mappingQuote:
      "Quando a projeção sai da tela, composição também vira arquitetura.",
    mappingCaptions: {
      mapping: "ajuste do mapeamento sobre a superfície",
      preparation: "o busto antes de receber luz",
      projection: "testes de escala, máscara e alinhamento",
      final: "resultado: imagem digital aderindo à forma escultórica",
    },
    teamKicker: "06 / equipe & rede",
    teamTitle: "conhecimento construído em colaboração",
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
    realizationLabel: "realização",
    realization:
      "LED — Laboratório de Experimentações em Design · LAID — Laboratório Aberto de Inovação e Design",
    supportLabel: "apoio",
    support:
      "Inova EBA · PPGDesign · Escola de Belas Artes · Universidade Federal do Rio de Janeiro",
    creditsCaption: "realização e instituições apoiadoras",
    closingKicker: "07 / continuidade",
    closingTitle: "o primeiro patch não é o fim",
    closing:
      "A oficina encerrou uma introdução e abriu um campo de prática. O resultado mais importante não era uma imagem pronta, mas a confiança para abrir o software novamente, conectar outro node e descobrir o que muda.",
  },
  en: {
    description:
      "A four-hour workshop introducing TouchDesigner as a visual programming environment and bringing beginners closer to real-time images and video mapping.",
    challenge:
      "Four hours is too little for the software and too much for a lecture.",
    outcome:
      "A four-hour introductory workshop: from an empty node to a first working patch, with node logic taught by doing rather than by slide.",
    role:
      "Workshop facilitator · TouchDesigner introduction · hands-on guidance, in collaboration with Crisia and Plínio Hit.",
    meta: [
      { label: "format", value: "in-person workshop · free registration" },
      { label: "duration", value: "4 hours · 1 pm to 5 pm" },
      { label: "date", value: "July 2, 2026" },
      { label: "venue", value: "LAID · JMM Building · UFRJ" },
    ],
    heroKicker: "visual programming · real time · projection",
    heroA: "from empty node",
    heroB: "to first patch",
    heroNote:
      "A practical entry point into TouchDesigner for anyone curious about the logic behind generative, interactive and projected images.",
    premiseKicker: "01 / starting point",
    premiseTitle: "programming can also mean connecting",
    premise:
      "Instead of starting with syntax, the workshop introduced relationships. In TouchDesigner, each operator receives, transforms and sends data; reasoning becomes visible as a network that can be observed while the image happens.",
    premiseSide:
      "The interface stops looking like a technical panel when every connection produces a perceptible consequence.",
    goalsKicker: "02 / learning goal",
    goalsTitle: "complexity in layers",
    goalsIntro:
      "The session was designed to build familiarity before speed. The aim was not to memorise menus but to recognise patterns and gain autonomy for continued experimentation.",
    goals: [
      {
        n: "01",
        title: "navigate",
        body: "recognise the interface, operator families and data flow",
      },
      {
        n: "02",
        title: "connect",
        body: "understand input, transformation and output through nodes",
      },
      {
        n: "03",
        title: "experiment",
        body: "change parameters and watch graphics react in real time",
      },
      {
        n: "04",
        title: "build",
        body: "organise a first working patch with visual intent",
      },
    ],
    networkKicker: "03 / node-based logic",
    networkTitle: "the image as flow",
    network:
      "The patch was approached as a readable sequence. A source comes in, parameters transform its appearance, layers meet and the result moves towards projection.",
    nodes: [
      { type: "IN", title: "input", sub: "image · video · camera" },
      { type: "TOP", title: "transform", sub: "position · scale · colour" },
      { type: "TOP", title: "composite", sub: "layers · mask · feedback" },
      { type: "OUT", title: "project", sub: "output · surface · space" },
    ],
    networkCaption:
      "one connection at a time: see the effect, understand the relationship, keep building",
    methodKicker: "04 / facilitation",
    methodTitle: "see, make, vary",
    method:
      "Each concept moved closer to practice through a short cycle: demonstration, guided reproduction and free variation. The patch stopped being a closed recipe and became a system that could be dismantled, tested and rebuilt.",
    methodSteps: [
      {
        label: "see",
        text: "one small change and its immediate effect on the image",
      },
      {
        label: "make",
        text: "the same relationship rebuilt in each participant's patch",
      },
      {
        label: "vary",
        text: "parameters and connections changed to produce another response",
      },
    ],
    processKicker: "04.1 / studio practice",
    processTitle: "the logic appears while it is being built",
    process:
      "The workshop alternated collective demonstrations with close guidance. Each screen recorded a different solution to the same principle, while projection kept the process visible to the whole room.",
    processCaptions: {
      room: "the projected interface turns the room into a shared workspace",
      patch: "individual experimentation with parameters, operators and real-time image",
      practice: "patch guidance and exchange between participants",
      collective: "from the personal screen to collective projection",
    },
    mappingKicker: "05 / video mapping",
    mappingTitle: "the image meets space",
    mapping:
      "Video mapping expanded the question: not only what the image does, but where it happens. Digital output was considered in relation to shape, surface, scale and physical presence.",
    mappingQuote:
      "When projection leaves the screen, composition also becomes architecture.",
    mappingCaptions: {
      mapping: "mapping adjustment over the surface",
      preparation: "the bust before receiving light",
      projection: "scale, mask and alignment tests",
      final: "result: digital image adhering to sculptural form",
    },
    teamKicker: "06 / team & network",
    teamTitle: "knowledge built collaboratively",
    facilitatorsLabel: "facilitators",
    facilitators: [
      {
        name: "Maria Isabel Lisita",
        role: "designer · digital artist · creative technology",
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
    realizationLabel: "presented by",
    realization:
      "LED — Design Experimentation Laboratory · LAID — Open Laboratory for Innovation and Design",
    supportLabel: "support",
    support:
      "Inova EBA · PPGDesign · School of Fine Arts · Federal University of Rio de Janeiro",
    creditsCaption: "presented by and supporting institutions",
    closingKicker: "07 / continuity",
    closingTitle: "the first patch is not the end",
    closing:
      "The workshop completed an introduction and opened a field of practice. The most important result was not a finished image but the confidence to open the software again, connect another node and discover what changes.",
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
    grid-template-columns: 6rem 1fr;
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
  .td-closing {
    display: grid;
    grid-template-columns: minmax(0, .8fr) minmax(280px, 1.2fr);
    gap: clamp(2.5rem, 8vw, 8rem);
    align-items: end;
  }
  .td-closing .td-h2 { color: #7552f4; }
  @media (max-width: 900px) {
    .td-cover, .td-premise, .td-goals__head, .td-network__head,
    .td-method, .td-process__head, .td-mapping, .td-team, .td-closing {
      grid-template-columns: 1fr;
    }
    .td-goals { grid-template-columns: 1fr 1fr; }
    .td-nodes { grid-template-columns: 1fr 1fr; }
    .td-nodes::before { display: none; }
  }
  @media (max-width: 620px) {
    .td-section { padding: 4rem 1.25rem; }
    .td-cover { min-height: auto; }
    .td-cover__copy { order: 1; }
    .td-poster { order: 2; }
    .td-goals, .td-nodes { grid-template-columns: 1fr; }
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
      accent="#735cff"
      title={
        <>
          oficina de <strong style={{ color: "#735cff", fontWeight: 700 }}>touchdesigner</strong>
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
              data-frame="input / cartaz"
              {...heroReveal()}
            >
              <Image
                src="/img/touchdesigner-workshop/cartaz-oficina-v2.webp"
                width={675}
                height={880}
                sizes="(max-width: 620px) 88vw, 38vw"
                alt={
                  selectedLang === "pt"
                    ? "Cartaz da Oficina de Vídeo Mapping: introdução ao TouchDesigner"
                    : "Poster for the Video Mapping Workshop: introduction to TouchDesigner"
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

        <section className="td-section">
          <motion.div className="td-premise td-inner" {...reveal()}>
            <div>
              <p className="td-kicker">{c.premiseKicker}</p>
              <h2 className="td-h2">{c.premiseTitle}</h2>
              <p className="td-p">{c.premise}</p>
            </div>
            <p className="td-premise__side">{c.premiseSide}</p>
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
            <div className="td-goals">
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
                <div className="td-method__step" key={step.label}>
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
                data-frame="output / realizacao + apoio"
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

        <section className="td-section">
          <motion.div className="td-closing td-inner" {...reveal()}>
            <div>
              <p className="td-kicker">{c.closingKicker}</p>
              <h2 className="td-h2">{c.closingTitle}</h2>
            </div>
            <p className="td-p">{c.closing}</p>
          </motion.div>
        </section>
      </div>
    </ProjectShell>
  );
}
