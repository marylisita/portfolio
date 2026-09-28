import type { Metadata } from "next";

/**
 * Metadados sociais dos cases.
 *
 * Existe porque cada página de case é `"use client"` e não pode exportar
 * `metadata`: quem exporta é um `layout.tsx` server component ao lado dela.
 * Centralizar aqui evita dez blocos duplicados e mantém título, descrição e
 * capa sincronizados com a lista de projetos.
 *
 * A descrição sai da mesma voz dos cases (`projectStories.impact`), sem
 * alegar resultado que não foi medido.
 *
 * `image` é relativo de propósito: o `metadataBase` do layout raiz resolve
 * para URL absoluta. Largura e altura são as reais do arquivo — passar número
 * errado faz o Slack e o WhatsApp recortarem torto.
 */
type CaseMeta = {
  title: string;
  description: string;
  image: string;
  width: number;
  height: number;
  alt: string;
};

const CASES: Record<string, CaseMeta> = {
  graduation: {
    title: "Apple Academy: Graduation",
    description:
      "Um kit bilíngue em que ícones, checklist e objetos impressos apresentam o Rio por hábitos de praia, comida de balcão e objetos de todo dia. Design gráfico em equipe de três.",
    image: "/img/graduation/animacao-poster.webp",
    width: 1000,
    height: 494,
    alt: "Peças impressas do kit de graduação da Apple Developer Academy",
  },
  ebat: {
    title: "EBAT — identidade e rotina editorial",
    description:
      "Um manual de 22 páginas transformou logo, paleta, tipografia e tom de voz em ferramenta de trabalho, com rotina de redes, folder e peças de estande.",
    image: "/img/previews/ebat.webp",
    width: 1200,
    height: 675,
    alt: "Peças da identidade visual da EBAT",
  },
  isadora: {
    title: "Isadora Ruppert — press kit",
    description:
      "Um press kit editorial que se lê numa passada de scroll: capa, sequência e ritmo, do jeito que diretor de casting realmente lê.",
    image: "/img/previews/isadora.webp",
    width: 1200,
    height: 675,
    alt: "Páginas do press kit editorial da atriz Isadora Ruppert",
  },
  magazine: {
    title: "Helvetica: Discórdia — revista",
    description:
      "Uma revista em que a diagramação faz o argumento: a Helvetica aparece rasgada e fora de eixo, e continua legível.",
    image: "/img/previews/magazine.webp",
    width: 948,
    height: 632,
    alt: "Páginas abertas da revista Helvetica: Discórdia",
  },
  hologlam: {
    title: "HoloGlam: Fashion Reloaded",
    description:
      "Projeto de moda e imagem digital: identidade, peças e sistema visual para uma proposta de vestuário holográfico.",
    image: "/img/previews/hologlam.webp",
    width: 1200,
    height: 675,
    alt: "Peças visuais do projeto HoloGlam",
  },
  vegcoz: {
    title: "VegCoz — culinária consciente",
    description:
      "Projeto de UX/UI completo: pesquisa, benchmarking, personas, card sorting, wireframes e telas para um app de culinária vegetariana.",
    image: "/img/previews/vegcoz.webp",
    width: 1200,
    height: 849,
    alt: "Telas e artefatos de pesquisa do aplicativo VegCoz",
  },
  pilotis: {
    title: "Devs no Pilotis",
    description:
      "Identidade e peças para o encontro de desenvolvedores no pilotis: sinalização que funciona como placa de rua, não como dashboard.",
    image: "/img/previews/pilotis.webp",
    width: 1200,
    height: 383,
    alt: "Peças gráficas do evento Devs no Pilotis",
  },
  chinario: {
    title: "China–Rio: pontes para inovação",
    description:
      "Sistema visual e peças para o programa de intercâmbio de inovação entre China e Rio de Janeiro.",
    image: "/img/previews/chinario.webp",
    width: 1200,
    height: 801,
    alt: "Peças do programa China–Rio: pontes para inovação",
  },
  genlab: {
    title: "GenLab",
    description:
      "Um laboratório aberto no navegador, onde a análise de algoritmo vem com o olho de quem desenha.",
    image: "/img/previews/genlab.webp",
    width: 1200,
    height: 598,
    alt: "Interface do GenLab rodando no navegador",
  },
  juizo: {
    title: "Juízo: dinheiro sem sermão",
    description:
      "App autoral de finanças pessoais: produto, UX/UI e interface que trata as objeções de quem não quer ser sermonado sobre gasto.",
    image: "/img/previews/juizo.webp",
    width: 1200,
    height: 675,
    alt: "Telas do aplicativo de finanças Juízo",
  },
};

/** Monta o `metadata` de um case a partir do slug da rota. */
export function caseMetadata(slug: string): Metadata {
  const entry = CASES[slug];
  if (!entry) return {};

  return {
    /* Sem sufixo: o `title.template` do layout raiz acrescenta o nome. */
    title: entry.title,
    description: entry.description,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      type: "article",
      title: entry.title,
      description: entry.description,
      url: `/work/${slug}`,
      images: [
        {
          url: entry.image,
          width: entry.width,
          height: entry.height,
          alt: entry.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.description,
      images: [entry.image],
    },
  };
}

export const CASE_SLUGS = Object.keys(CASES);
