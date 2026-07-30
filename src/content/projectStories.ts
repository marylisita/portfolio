export type ProjectStory = {
  impact: string;
  shortImpact: string;
  challenge: string;
};

type LocalizedStory = Record<"pt" | "en", ProjectStory>;

const stories: Record<string, LocalizedStory> = {
  isadora: {
    pt: {
      impact: "Um press kit editorial que se lê numa passada de scroll: capa, sequência e ritmo, do jeito que diretor de casting realmente lê.",
      shortImpact: "press kit que se lê numa passada",
      challenge: "Ela tinha foto boa e nenhum material que as organizasse.",
    },
    en: {
      impact: "An editorial press kit you can read in one scroll: cover, sequence and pacing, the way casting directors actually read.",
      shortImpact: "a press kit read in one scroll",
      challenge: "She had good photographs and nothing that organised them.",
    },
  },
  magazine: {
    pt: {
      impact: "Uma revista em que a diagramação faz o argumento: a Helvetica aparece rasgada e fora de eixo, e continua legível.",
      shortImpact: "layout que carrega o argumento",
      challenge: "Se der só ruído, ninguém lê. Se der só grid, não sobra tese.",
    },
    en: {
      impact: "A magazine where the layout makes the case: Helvetica shows up torn and off-axis, and stays readable.",
      shortImpact: "layout that carries the argument",
      challenge: "All noise and nobody reads it. All grid and there's no argument left.",
    },
  },
  genlab: {
    pt: {
      impact: "Um laboratório aberto no navegador, onde a análise de algoritmo vem com o olho de quem desenha.",
      shortImpact: "algoritmo com olho de designer",
      challenge: "Todo texto sobre algoritmo vira tutorial ou vira manifesto. Queria um terceiro caminho.",
    },
    en: {
      impact: "An open browser-based lab where algorithm analysis comes with a designer's eye.",
      shortImpact: "algorithms with a designer's eye",
      challenge: "Every piece about algorithms becomes a tutorial or a manifesto. I wanted a third option.",
    },
  },
  ebat: {
    pt: {
      impact: "Um manual de 22 páginas transformou logo, paleta, tipografia e tom de voz em ferramenta de trabalho. O sistema acompanhou um ciclo de cerca de 190 inscrições e 100 aprovados.",
      shortImpact: "manual de 22 páginas, 190 inscrições",
      challenge: "A EBAT é gratuita e presencial. A identidade precisava mostrar o nível do programa e continuar simples de aplicar na rotina.",
    },
    en: {
      impact: "A 22-page manual turned the logo, palette, typography and tone of voice into a working tool. The system accompanied a cycle of around 190 applications and 100 accepted students.",
      shortImpact: "22-page manual, 190 applications",
      challenge: "EBAT is free and in person. The identity had to show the programme's level and remain simple to apply in daily work.",
    },
  },
  graduation: {
    pt: {
      impact: "Um kit bilíngue em que ícones, checklist e objetos impressos apresentam o Rio por hábitos de praia, comida de balcão e objetos de todo dia.",
      shortImpact: "o Rio por hábito e objeto",
      challenge: "O que um convidado de fora reconhece no Rio — e o que só alguém daqui poderia incluir?",
    },
    en: {
      impact: "A bilingual kit where icons, a checklist and printed objects introduce Rio through beach habits, counter food and everyday objects.",
      shortImpact: "Rio through habits and objects",
      challenge: "What does a guest from abroad recognise as Rio — and what could only someone from here include?",
    },
  },
  pilotis: {
    pt: {
      impact: "Uma comunicação que puxou referência de placa de rua em vez de dashboard, e cobriu gente em vez de tela.",
      shortImpact: "placa de rua, não dashboard",
      challenge: "Evento de tecnologia costuma ser azul, escuro e cheio de linha de circuito.",
    },
    en: {
      impact: "Communication that took its cues from street signage instead of dashboards, and covered people instead of screens.",
      shortImpact: "street signs, not dashboards",
      challenge: "Tech events tend to be dark, blue and full of circuit lines.",
    },
  },
  chinario: {
    pt: {
      impact: "Um sistema modular que aguentou o programa mudar até a semana do evento, em impresso, sinalização e social.",
      shortImpact: "sistema que aguentou remanejo",
      challenge: "Dragão, bandeira e verde-amarelo estavam fora. Sobrava o quê?",
    },
    en: {
      impact: "A modular system that survived a programme still changing the week of the event, across print, signage and social.",
      shortImpact: "a system that survived the reshuffle",
      challenge: "Dragons, flags and green-and-yellow were out. So what was left?",
    },
  },
  hologlam: {
    pt: {
      impact: "Um artefato especulativo que fica mais interessante nas objeções do que nas promessas — e o case dá o mesmo peso às duas.",
      shortImpact: "as objeções com o mesmo peso",
      challenge: "Falar de excesso e descarte sem que a crítica virasse estética bonita.",
    },
    en: {
      impact: "A speculative artefact that gets more interesting in its objections than in its promises — and the case gives both the same weight.",
      shortImpact: "objections given equal weight",
      challenge: "Talking about excess and disposal without the critique turning into a pretty aesthetic.",
    },
  },
  vegcoz: {
    pt: {
      impact: "Um app que fecha a volta que ninguém fecha: receita, ingrediente, lista, preço e despensa no mesmo fluxo.",
      shortImpact: "a volta que ninguém fecha",
      challenge: "Cada concorrente é bom em um pedaço do problema e ignora o resto.",
    },
    en: {
      impact: "An app that closes the loop nobody closes: recipe, ingredient, list, price and pantry in one flow.",
      shortImpact: "the loop nobody closes",
      challenge: "Every competitor is good at one piece of the problem and ignores the rest.",
    },
  },
  ondularis: {
    pt: {
      impact: "Uma instalação em que escultura, resíduo industrial e projeção negociam entre si e com quem atravessa a sala.",
      shortImpact: "um oceano inventado",
      challenge: "Como fazer pesquisa densa virar coisa que o corpo entende antes da cabeça?",
    },
    en: {
      impact: "An installation where sculpture, industrial waste and projection negotiate with each other and with whoever crosses the room.",
      shortImpact: "an invented ocean",
      challenge: "How do you make dense research into something the body understands before the head does?",
    },
  },
  "cyber-marinum": {
    pt: {
      impact:
        "Um aquário plantado que virou interface: a câmera lê a aproximação do público, o sistema traduz em luz e imagem, e as plantas seguem no ritmo delas. Obra coletiva de sete autores, pelo NANO/UFRJ.",
      shortImpact: "aquário vivo como interface",
      challenge:
        "Uma obra que depende de organismo vivo não para quando a galeria fecha.",
    },
    en: {
      impact:
        "A planted aquarium turned into an interface: a camera reads the audience approaching, the system translates that into light and image, and the plants keep their own pace. A collective work by seven authors, through NANO/UFRJ.",
      shortImpact: "a living aquarium as interface",
      challenge:
        "A work that depends on living organisms doesn't stop when the gallery closes.",
    },
  },
  "touchdesigner-workshop": {
    pt: {
      impact:
        "Oficina introdutória de quatro horas: do node vazio ao primeiro patch rodando, com a lógica nodal apresentada na prática em vez de no slide.",
      shortImpact: "do node vazio ao primeiro patch",
      challenge:
        "Quatro horas é pouco para a ferramenta e muito para aula expositiva.",
    },
    en: {
      impact:
        "A four-hour introductory workshop: from an empty node to a first working patch, with node logic taught by doing rather than by slide.",
      shortImpact: "from empty node to first patch",
      challenge:
        "Four hours is too little for the software and too much for a lecture.",
    },
  },
};

export function getProjectStory(pathname: string, lang: string): ProjectStory | undefined {
  const slug = pathname.split("/").filter(Boolean).at(-1);
  if (!slug) return undefined;
  return stories[slug]?.[lang === "en" ? "en" : "pt"];
}
