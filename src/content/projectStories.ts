export type ProjectStory = {
  impact: string;
  shortImpact: string;
  challenge: string;
};

type LocalizedStory = Record<"pt" | "en", ProjectStory>;

const stories: Record<string, LocalizedStory> = {
  isadora: {
    pt: {
      impact: "Um press kit que transforma o universo da artista em uma presença editorial coesa, feita para circular entre curadoria, imprensa e parcerias.",
      shortImpact: "presença editorial para circular",
      challenge: "Como apresentar uma prática artística múltipla sem a reduzir a uma estética única?",
    },
    en: {
      impact: "A press kit that turns the artist's universe into a cohesive editorial presence, made to travel across curators, press and partnerships.",
      shortImpact: "an editorial presence that travels",
      challenge: "How might a multifaceted artistic practice be introduced without reducing it to a single aesthetic?",
    },
  },
  magazine: {
    pt: {
      impact: "Uma revista-objeto que tira a Helvetica da neutralidade e a transforma em matéria, gesto e leitura espacial.",
      shortImpact: "tipo como matéria e espaço",
      challenge: "Como contar a história de uma fonte tão conhecida sem repetir a sua versão mais previsível?",
    },
    en: {
      impact: "A magazine-object that takes Helvetica out of neutrality and turns it into material, gesture and spatial reading.",
      shortImpact: "type as material and space",
      challenge: "How might the story of such a familiar typeface be told without repeating its most predictable version?",
    },
  },
  genlab: {
    pt: {
      impact: "Um laboratório aberto no navegador que torna a experimentação com IA generativa mais direta, visual e compartilhável.",
      shortImpact: "IA generativa para experimentar",
      challenge: "Como fazer da IA uma ferramenta de investigação, e não uma caixa-preta que apenas entrega imagens?",
    },
    en: {
      impact: "An open browser-based lab that makes experimenting with generative AI more direct, visual and shareable.",
      shortImpact: "generative AI to explore",
      challenge: "How might AI become a tool for inquiry rather than a black box that simply delivers images?",
    },
  },
  ebat: {
    pt: {
      impact: "Uma identidade-sistema que aproxima pesquisa, repertório e comunicação da escola por meio da linguagem de um caderno em uso.",
      shortImpact: "pesquisa em linguagem de caderno",
      challenge: "Como dar unidade a uma instituição em movimento sem apagar a diversidade das suas disciplinas?",
    },
    en: {
      impact: "A system identity that brings the school's research, repertoire and communication closer through the language of a working notebook.",
      shortImpact: "research in a notebook language",
      challenge: "How might an evolving institution gain coherence without flattening the diversity of its disciplines?",
    },
  },
  graduation: {
    pt: {
      impact: "A formatura vira um sistema de celebração: objetos, sinalização e memória compartilham o mesmo gesto visual.",
      shortImpact: "uma celebração que vira sistema",
      challenge: "Como desenhar uma festa coletiva que ainda deixasse espaço para o afeto e as memórias individuais?",
    },
    en: {
      impact: "Graduation becomes a celebration system: objects, signage and memory share the same visual gesture.",
      shortImpact: "a celebration turned system",
      challenge: "How might a collective celebration still leave space for affection and individual memory?",
    },
  },
  pilotis: {
    pt: {
      impact: "Uma comunicação digital que prolonga a energia do encontro físico e torna a iniciativa reconhecível antes, durante e depois do evento.",
      shortImpact: "o encontro continua nas redes",
      challenge: "Como traduzir a presença espontânea de um espaço de encontro para uma linguagem social contínua?",
    },
    en: {
      impact: "A digital communication system that extends the energy of a physical gathering and makes the initiative recognisable before, during and after the event.",
      shortImpact: "the gathering continues online",
      challenge: "How might the spontaneous presence of a gathering space translate into an ongoing social language?",
    },
  },
  chinario: {
    pt: {
      impact: "Uma identidade que constrói pontes visuais entre Brasil e China para tornar a colaboração acadêmica mais próxima e legível.",
      shortImpact: "uma ponte visual entre culturas",
      challenge: "Como representar o encontro entre duas culturas sem recorrer a símbolos prontos ou simplificações?",
    },
    en: {
      impact: "An identity that builds visual bridges between Brazil and China, making academic collaboration feel closer and easier to read.",
      shortImpact: "a visual bridge between cultures",
      challenge: "How might two cultures meet visually without relying on ready-made symbols or simplifications?",
    },
  },
  hologlam: {
    pt: {
      impact: "Uma experiência editorial que torna visíveis as contradições da moda rápida e convida o público a olhar o consumo de outro jeito.",
      shortImpact: "moda rápida em outra perspectiva",
      challenge: "Como falar de excesso e descarte sem transformar uma crítica à moda em uma estética vazia?",
    },
    en: {
      impact: "An editorial experience that makes fast-fashion contradictions visible and invites the audience to look at consumption differently.",
      shortImpact: "fast fashion, reframed",
      challenge: "How might excess and disposal be addressed without turning a critique of fashion into an empty aesthetic?",
    },
  },
  vegcoz: {
    pt: {
      impact: "Uma proposta de experiência que torna escolhas de alimentação vegetal mais claras, desejáveis e acionáveis no cotidiano.",
      shortImpact: "escolhas vegetais mais acionáveis",
      challenge: "Como tornar a alimentação vegetal uma possibilidade concreta, sem simplificar escolhas pessoais e de contexto?",
    },
    en: {
      impact: "An experience proposal that makes plant-based choices clearer, more desirable and more actionable in everyday life.",
      shortImpact: "plant-based choices made actionable",
      challenge: "How might plant-based eating become a concrete option without oversimplifying personal and contextual choices?",
    },
  },
  ondularis: {
    pt: {
      impact: "Uma experiência expositiva que aproxima arte, ciência e tecnologia por meio de um percurso espacial, sensorial e coletivo.",
      shortImpact: "arte, ciência e tecnologia em percurso",
      challenge: "Como transformar pesquisa complexa em uma experiência que o corpo também pudesse compreender?",
    },
    en: {
      impact: "An exhibition experience that brings art, science and technology together through a spatial, sensory and collective journey.",
      shortImpact: "art, science and technology in motion",
      challenge: "How might complex research become an experience the body can understand too?",
    },
  },
};

export function getProjectStory(pathname: string, lang: string): ProjectStory | undefined {
  const slug = pathname.split("/").filter(Boolean).at(-1);
  if (!slug) return undefined;
  return stories[slug]?.[lang === "en" ? "en" : "pt"];
}
