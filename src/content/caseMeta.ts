import type { Metadata } from "next";

/**
 * Metadados sociais e de busca dos cases, em português e inglês.
 *
 * Existe porque cada página de case é `"use client"` e não pode exportar
 * `metadata`: quem exporta é um `layout.tsx` (PT, em /work/<slug>) ou o
 * `page.tsx` server da versão em inglês (em /en/work/<slug>). Centralizar
 * aqui mantém título, descrição, capa e hreflang sincronizados.
 *
 * As descrições saem da mesma voz dos cases (`projectStories.impact`), sem
 * alegar resultado que não foi medido.
 *
 * Imagem de compartilhamento: todos os cases usam um JPEG 1200×630 em
 * /img/og/<slug>.jpg, gerado a partir da capa do case (cover quando a
 * proporção já é de cartão; contain sobre o papel do site quando é cartaz ou
 * faixa). JPEG porque o LinkedIn e o WhatsApp nem sempre mostram webp, e
 * porque cada arquivo fica bem abaixo dos ~300 kB que o WhatsApp aceita.
 */
type Lang = "pt" | "en";
type Copy = { title: string; description: string; alt: string };
type CaseMeta = Record<Lang, Copy>;

const CASES: Record<string, CaseMeta> = {
  graduation: {
    pt: {
      title: "Apple Academy: Graduation",
      description:
        "Um kit bilíngue em que ícones, checklist e objetos impressos apresentam o Rio por hábitos de praia, comida de balcão e objetos de todo dia. Design gráfico em equipe de três.",
      alt: "Peças impressas do kit de graduação da Apple Developer Academy",
    },
    en: {
      title: "Apple Academy: Graduation",
      description:
        "A bilingual kit where icons, a checklist and printed objects introduce Rio through beach habits, counter food and everyday objects. Graphic design in a team of three.",
      alt: "Printed pieces from the Apple Developer Academy graduation kit",
    },
  },
  ebat: {
    pt: {
      title: "EBAT — identidade e rotina editorial",
      description:
        "Um manual de 22 páginas transformou logo, paleta, tipografia e tom de voz em ferramenta de trabalho, com rotina de redes, folder e peças de estande.",
      alt: "Peças da identidade visual da EBAT",
    },
    en: {
      title: "EBAT — identity and editorial routine",
      description:
        "A 22-page manual turned the logo, palette, typography and tone of voice into a working tool, with a social media routine, folder and booth pieces.",
      alt: "Visual identity pieces for EBAT",
    },
  },
  "cyber-marinum": {
    pt: {
      title: "Cyber Marinum — arte interespécies",
      description:
        "Instalação interativa em que um aquário vivo, sensores e imagens generativas respondem à presença do público. Em exibição na Meta Gallery, Rio de Janeiro.",
      alt: "Cyber Marinum: aquário plantado diante de uma imagem generativa magenta e verde",
    },
    en: {
      title: "Cyber Marinum — interspecies art",
      description:
        "An interactive installation where a living aquarium, sensors and generative imagery respond to the audience. On view at Meta Gallery, Rio de Janeiro.",
      alt: "Cyber Marinum: a planted aquarium in front of a magenta and green generative image",
    },
  },
  isadora: {
    pt: {
      title: "Isadora Ruppert — press kit",
      description:
        "Um press kit editorial que se lê numa passada de scroll: capa, sequência e ritmo, do jeito que diretor de casting realmente lê.",
      alt: "Páginas do press kit editorial da atriz Isadora Ruppert",
    },
    en: {
      title: "Isadora Ruppert — press kit",
      description:
        "An editorial press kit you can read in one scroll: cover, sequence and pacing, the way casting directors actually read.",
      alt: "Pages from actress Isadora Ruppert's editorial press kit",
    },
  },
  magazine: {
    pt: {
      title: "Helvetica: Discórdia — revista",
      description:
        "Uma revista em que a diagramação faz o argumento: a Helvetica aparece rasgada e fora de eixo, e continua legível.",
      alt: "Páginas abertas da revista Helvetica: Discórdia",
    },
    en: {
      title: "Helvetica: Discord — magazine",
      description:
        "A magazine where the layout makes the case: Helvetica shows up torn and off-axis, and stays readable.",
      alt: "Open spread of the Helvetica: Discord magazine",
    },
  },
  vegcoz: {
    pt: {
      title: "VegCoz — culinária consciente",
      description:
        "Projeto de UX/UI completo: pesquisa, benchmarking, personas, card sorting, wireframes e telas para um app de culinária vegetariana.",
      alt: "Telas e artefatos de pesquisa do aplicativo VegCoz",
    },
    en: {
      title: "VegCoz — mindful cooking app",
      description:
        "A full UX/UI project: research, benchmarking, personas, card sorting, wireframes and screens for a vegetarian cooking app.",
      alt: "Screens and research artifacts from the VegCoz app",
    },
  },
  pilotis: {
    pt: {
      title: "Devs no Pilotis",
      description:
        "Identidade e peças para o encontro de desenvolvedores no pilotis: sinalização que funciona como placa de rua, não como dashboard.",
      alt: "Peças gráficas do evento Devs no Pilotis",
    },
    en: {
      title: "Devs no Pilotis",
      description:
        "Identity and pieces for a developer meetup: communication that took its cues from street signage instead of dashboards.",
      alt: "Graphic pieces for the Devs no Pilotis event",
    },
  },
  chinario: {
    pt: {
      title: "China–Rio: pontes para inovação",
      description:
        "Sistema visual e peças para o programa de intercâmbio de inovação entre China e Rio de Janeiro.",
      alt: "Peças do programa China–Rio: pontes para inovação",
    },
    en: {
      title: "China–Rio: bridges for innovation",
      description:
        "A modular visual system for an innovation exchange program between China and Rio de Janeiro, across print, signage and social media.",
      alt: "Pieces from the China–Rio innovation program",
    },
  },
  genlab: {
    pt: {
      title: "GenLab",
      description:
        "Um laboratório aberto no navegador, onde a análise de algoritmo vem com o olho de quem desenha.",
      alt: "Interface do GenLab rodando no navegador",
    },
    en: {
      title: "GenLab",
      description:
        "An open browser-based lab where algorithm analysis comes with a designer's eye.",
      alt: "The GenLab interface running in the browser",
    },
  },
  juizo: {
    pt: {
      title: "Juízo: dinheiro sem sermão",
      description:
        "App autoral de finanças pessoais: produto, UX/UI e interface que trata as objeções de quem não quer ser sermonado sobre gasto.",
      alt: "Telas do aplicativo de finanças Juízo",
    },
    en: {
      title: "Juízo: money without the lecture",
      description:
        "A personal finance app that runs entirely on the device, tested against 285 real statement entries and designed for people whose income changes every month.",
      alt: "Screens from the Juízo finance app",
    },
  },
  ondularis: {
    pt: {
      title: "Ondularis — Coletivo Endosymbiosis",
      description:
        "Exposição coletiva na intersecção entre arte, ciência e tecnologia. Um oceano artificial, instável e fabulado na Meta Gallery, Rio de Janeiro.",
      alt: "Cartaz da exposição Ondularis, do coletivo Endosymbiosis",
    },
    en: {
      title: "Ondularis — Endosymbiosis Collective",
      description:
        "A group exhibition at the intersection of art, science and technology: an artificial, unstable, fabulated ocean at Meta Gallery, Rio de Janeiro.",
      alt: "Poster for the Ondularis exhibition by the Endosymbiosis collective",
    },
  },
  "touchdesigner-workshop": {
    pt: {
      title: "Oficina de TouchDesigner — vídeo mapping",
      description:
        "Oficina de quatro horas de introdução à programação visual e à arte generativa no TouchDesigner, realizada no LAID/UFRJ como pesquisa experimental de PIBIC e TCC.",
      alt: "Cartaz da Oficina de Vídeo Mapping: introdução ao TouchDesigner",
    },
    en: {
      title: "TouchDesigner workshop — video mapping",
      description:
        "A four-hour introduction to visual programming and generative art in TouchDesigner, run at LAID/UFRJ as experimental research for my undergraduate thesis.",
      alt: "Poster for the Video Mapping Workshop: an introduction to TouchDesigner",
    },
  },
  metagallery: {
    pt: {
      title: "MetaGallery — social media",
      description:
        "Social media e direção de arte para a inauguração da nova sede da MetaGallery na Praça XV: convite, cobertura, imprensa e carrossel editorial, com números do perfil em 30 dias.",
      alt: "Arte de inauguração da MetaGallery com escultura dourada: Uma nova casa para a arte",
    },
    en: {
      title: "MetaGallery — social media",
      description:
        "Social media and art direction for the opening of MetaGallery's new space at Praça XV: invitation, coverage, press and an editorial carousel, with 30-day profile numbers.",
      alt: "MetaGallery opening artwork with a golden sculpture: A new home for art",
    },
  },
  "metaverse-agency": {
    pt: {
      title: "Metaverse Agency — Tobias na Rio Innovation Week",
      description:
        "Carrossel de cinco telas sobre o robô social Tobias na Rio Innovation Week 2026, com números do perfil em 30 dias.",
      alt: "Capa do carrossel com o robô Tobias na Rio Innovation Week",
    },
    en: {
      title: "Metaverse Agency — Tobias at Rio Innovation Week",
      description:
        "A five-slide carousel about the social robot Tobias at Rio Innovation Week 2026, with 30-day profile numbers.",
      alt: "Carousel cover featuring the robot Tobias at Rio Innovation Week",
    },
  },
  "byron-mendes": {
    pt: {
      title: "Byron Mendes — social media",
      description:
        "Série editorial para o perfil de Byron Mendes: bastidores de exposição, encontros com o público e projetos do arquivo, com números do perfil em 30 dias.",
      alt: "Post Antes de abrir as portas, com Byron Mendes diante de uma instalação visual",
    },
    en: {
      title: "Byron Mendes — social media",
      description:
        "An editorial series for Byron Mendes's profile: exhibition setup, encounters with visitors and archive projects, with 30-day profile numbers.",
      alt: "Post Before the doors open, with Byron Mendes in front of a visual installation",
    },
  },
};

/** Caminho da mesma página nos dois idiomas, para hreflang e canonical. */
export function languageAlternates(ptPath: string, lang: Lang) {
  const enPath = ptPath === "/" ? "/en" : `/en${ptPath}`;
  return {
    canonical: lang === "en" ? enPath : ptPath,
    languages: { "pt-BR": ptPath, en: enPath, "x-default": ptPath },
  };
}

/** Monta o `metadata` de um case a partir do slug da rota. */
export function caseMetadata(slug: string, lang: Lang = "pt"): Metadata {
  const entry = CASES[slug]?.[lang];
  if (!entry) return {};
  const ptPath = `/work/${slug}`;
  const alternates = languageAlternates(ptPath, lang);
  const image = { url: `/img/og/${slug}.jpg`, width: 1200, height: 630, alt: entry.alt };

  return {
    /* Sem sufixo: o `title.template` do layout raiz acrescenta o nome. */
    title: entry.title,
    description: entry.description,
    alternates,
    openGraph: {
      type: "article",
      title: entry.title,
      description: entry.description,
      url: alternates.canonical,
      locale: lang === "en" ? "en_US" : "pt_BR",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.description,
      images: [image.url],
    },
  };
}

export const CASE_SLUGS = Object.keys(CASES);
