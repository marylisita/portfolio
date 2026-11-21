import type { CaseVariant } from "@/components/CaseStudyKit";

/**
 * Página /work/social-media: MetaGallery, Metaverse Agency e Byron Mendes,
 * um capítulo por cliente.
 *
 * Fonte: pacote enviado pela Maria em novembro de 2026 (peças originais,
 * textos e capturas dos painéis profissionais dos perfis).
 *
 * Métricas: números do PERFIL numa janela de 30 dias, transcritos das
 * capturas de novembro de 2026; a variação é o comparativo do próprio painel.
 * Resultados de posts individuais são registros pontuais, na data da captura.
 * Não atribuir a variação do perfil às peças: não houve comparação controlada.
 * Não acrescentar número que não esteja nas capturas.
 *
 * Imagens das peças da Metaverse Agency foram recortadas das capturas do
 * carrossel publicado (só a moldura da interface saiu). Quando houver o export
 * original, substituir os arquivos em /img/social-media/metaverse-agency
 * mantendo os nomes e a ordem.
 */
type L = { pt: string; en: string };

export type SocialImage = {
  src: string;
  width: number;
  height: number;
  alt: L;
  caption: L;
};

export type SocialSection = {
  label: L;
  title: L;
  intro: L;
  /** `carousel` preserva a sequência publicada; `grid` mostra peças avulsas. */
  layout: "carousel" | "grid-two" | "grid-three";
  images: SocialImage[];
};

/** Um cliente = um capítulo da página /work/social-media. */
export type SocialClient = {
  id: string;
  variant: CaseVariant;
  client: string;
  sections: SocialSection[];
  stats: Array<{ value: L; label: L; detail: L }>;
  highlight: L;
  credits: Array<{ label: L; value: L }>;
};

const DIR = "/img/social-media";
const FEED = { width: 1080, height: 1350 };
const GORO = { width: 1080, height: 1424 };
const TOBIAS = { width: 691, height: 867 };

export const SOCIAL_CLIENTS: SocialClient[] = [
  {
    id: "metagallery",
    variant: "metagallery",
    client: "MetaGallery",
    sections: [
      {
        label: { pt: "01 / campanha de inauguração", en: "01 / opening campaign" },
        title: { pt: "uma nova casa para a arte", en: "a new home for art" },
        intro: {
          pt: "Peças para a inauguração e o novo espaço da galeria na Praça XV. Convite, cobertura da abertura e repercussão na imprensa usam imagens da exposição, tipografia de alto contraste e as cores da marca.",
          en: "Pieces for the opening of the gallery's new space at Praça XV. The invitation, opening coverage and press pickup use exhibition photography, high-contrast type and the brand colors.",
        },
        layout: "grid-two",
        images: [
          {
            src: `${DIR}/metagallery/meta-hero.webp`,
            ...FEED,
            alt: {
              pt: "Arte de inauguração da MetaGallery com escultura dourada e a chamada Uma nova casa para a arte.",
              en: "MetaGallery opening artwork with a golden sculpture and the headline A new home for art.",
            },
            caption: { pt: "peça principal da inauguração", en: "main opening piece" },
          },
          {
            src: `${DIR}/metagallery/meta-ambiente.webp`,
            ...FEED,
            alt: {
              pt: "Fotografia de visitantes na exposição com a chamada Arte, movimento e encontros.",
              en: "Photograph of visitors in the exhibition with the headline Art, movement and encounters.",
            },
            caption: { pt: "cobertura da abertura", en: "opening coverage" },
          },
          {
            src: `${DIR}/metagallery/meta-imprensa.webp`,
            ...FEED,
            alt: {
              pt: "Peça da MetaGallery sobre a matéria do jornal O Globo com registro do novo espaço.",
              en: "MetaGallery post about the O Globo newspaper feature on the new space.",
            },
            caption: { pt: "repercussão na imprensa", en: "press pickup" },
          },
          {
            src: `${DIR}/metagallery/meta-convite.webp`,
            ...FEED,
            alt: {
              pt: "Convite da reinauguração da sede da MetaGallery na Praça XV, em 05.11.2026.",
              en: "Invitation to the reopening of MetaGallery's space at Praça XV, on 05.11.2026.",
            },
            caption: { pt: "convite para 05.11.2026", en: "invitation for 05.11.2026" },
          },
        ],
      },
      {
        label: { pt: "02 / carrossel editorial", en: "02 / editorial carousel" },
        title: { pt: "goro, de jonas esteves", en: "goro, by jonas esteves" },
        intro: {
          pt: "Três telas: a obra inteira, o detalhe dos materiais e o artista. A sequência dá ritmo à leitura sem competir com as fotografias da peça.",
          en: "Three slides: the whole work, a close look at its materials, then the artist. The sequence sets a reading pace without competing with the photographs of the piece.",
        },
        layout: "carousel",
        images: [
          {
            src: `${DIR}/metagallery/meta-goro-01.webp`,
            ...GORO,
            alt: {
              pt: "Primeira tela do carrossel Goro: Um pequeno corpo em movimento.",
              en: "First slide of the Goro carousel: A small body in motion.",
            },
            caption: { pt: "um pequeno corpo em movimento", en: "a small body in motion" },
          },
          {
            src: `${DIR}/metagallery/meta-goro-02.webp`,
            ...GORO,
            alt: {
              pt: "Segunda tela do carrossel Goro: Cascas, musgos e motores.",
              en: "Second slide of the Goro carousel: Bark, moss and motors.",
            },
            caption: { pt: "cascas, musgos e motores", en: "bark, moss and motors" },
          },
          {
            src: `${DIR}/metagallery/meta-goro-03.webp`,
            ...GORO,
            alt: {
              pt: "Terceira tela do carrossel Goro, com o artista Jonas Esteves.",
              en: "Third slide of the Goro carousel, featuring the artist Jonas Esteves.",
            },
            caption: { pt: "goro, por jonas esteves", en: "goro, by jonas esteves" },
          },
        ],
      },
    ],
    stats: [
      {
        value: { pt: "2.843", en: "2,843" },
        label: { pt: "visualizações", en: "views" },
        detail: { pt: "+89,8% vs. período comparado", en: "+89.8% vs. comparison period" },
      },
      {
        value: { pt: "391", en: "391" },
        label: { pt: "visualizadores", en: "viewers" },
        detail: { pt: "+26,5% vs. período comparado", en: "+26.5% vs. comparison period" },
      },
      {
        value: { pt: "+18", en: "+18" },
        label: { pt: "seguidores líquidos", en: "net followers" },
        detail: { pt: "491 seguidores no total", en: "491 followers in total" },
      },
    ],
    highlight: {
      pt: "Posts, no dia da captura: “Uma nova casa para a arte” com 855 visualizações, 38 curtidas, 3 comentários e 11 compartilhamentos; o anúncio do novo endereço com 540; o carrossel de Goro com 468.",
      en: "Posts, on the day of capture: “A new home for art” with 855 views, 38 likes, 3 comments and 11 shares; the new-address announcement with 540; the Goro carousel with 468.",
    },
    credits: [
      { label: { pt: "obra (goro)", en: "artwork (goro)" }, value: { pt: "Jonas Esteves", en: "Jonas Esteves" } },
    ],
  },
  {
    id: "metaverse-agency",
    variant: "metaverse-agency",
    client: "Metaverse Agency",
    sections: [
      {
        label: { pt: "01 / carrossel", en: "01 / carousel" },
        title: { pt: "tobias explorou o evento", en: "tobias explored the event" },
        intro: {
          pt: "A capa apresenta Tobias; as telas seguintes passam pelo objetivo da visita, pelas conversas com o público e pelo encerramento. Ciano e roxo destacam as frases sobre as fotos do evento.",
          en: "The cover introduces Tobias; the following slides cover the goal of the visit, conversations with visitors and the wrap-up. Cyan and purple pick out the lines over the event photos.",
        },
        layout: "carousel",
        images: [
          {
            src: `${DIR}/metaverse-agency/agency-tobias-01.webp`,
            ...TOBIAS,
            alt: {
              pt: "Capa do carrossel: Tobias explorou o Rio Innovation Week, com o robô segurando um microfone.",
              en: "Carousel cover: Tobias explored Rio Innovation Week, with the robot holding a microphone.",
            },
            caption: { pt: "tobias explorou o rio innovation week", en: "tobias explored rio innovation week" },
          },
          {
            src: `${DIR}/metaverse-agency/agency-tobias-02.webp`,
            ...TOBIAS,
            alt: {
              pt: "Tela 2: primeiro objetivo, explorar um evento de inovação.",
              en: "Slide 2: first goal, exploring an innovation event.",
            },
            caption: { pt: "primeiro objetivo", en: "first goal" },
          },
          {
            src: `${DIR}/metaverse-agency/agency-tobias-03.webp`,
            ...TOBIAS,
            alt: {
              pt: "Tela 3: A curiosidade sempre vence, com Tobias sendo entrevistado por uma criança.",
              en: "Slide 3: Curiosity always wins, with Tobias being interviewed by a child.",
            },
            caption: { pt: "a curiosidade sempre vence", en: "curiosity always wins" },
          },
          {
            src: `${DIR}/metaverse-agency/agency-tobias-04.webp`,
            ...TOBIAS,
            alt: {
              pt: "Tela 4: a inovação acontece entre pessoas, com uma visitante ao lado de Tobias.",
              en: "Slide 4: innovation happens between people, with a visitor next to Tobias.",
            },
            caption: { pt: "inovação entre pessoas", en: "innovation between people" },
          },
          {
            src: `${DIR}/metaverse-agency/agency-tobias-05.webp`,
            ...TOBIAS,
            alt: {
              pt: "Tela 5: encerramento do evento com Tobias.",
              en: "Slide 5: closing slide of the event with Tobias.",
            },
            caption: { pt: "as ideias continuam", en: "the ideas carry on" },
          },
        ],
      },
    ],
    stats: [
      {
        value: { pt: "3.866", en: "3,866" },
        label: { pt: "visualizações", en: "views" },
        detail: { pt: "+28,6% vs. período comparado", en: "+28.6% vs. comparison period" },
      },
      {
        value: { pt: "1.063", en: "1,063" },
        label: { pt: "visualizadores", en: "viewers" },
        detail: { pt: "+85,8% vs. período comparado", en: "+85.8% vs. comparison period" },
      },
      {
        value: { pt: "+23", en: "+23" },
        label: { pt: "seguidores líquidos", en: "net followers" },
        detail: { pt: "7.796 seguidores no total", en: "7,796 followers in total" },
      },
    ],
    highlight: {
      pt: "O carrossel “Tobias explorou o Rio Innovation Week” tinha 220 visualizações no dia da captura.",
      en: "The “Tobias explored Rio Innovation Week” carousel had 220 views on the day of capture.",
    },
    credits: [
      { label: { pt: "evento", en: "event" }, value: { pt: "Rio Innovation Week 2026", en: "Rio Innovation Week 2026" } },
    ],
  },
  {
    id: "byron-mendes",
    variant: "byron-mendes",
    client: "Byron Mendes",
    sections: [
      {
        label: { pt: "01 / série editorial", en: "01 / editorial series" },
        title: { pt: "a cultura vista de perto", en: "culture up close" },
        intro: {
          pt: "Três temas, três enquadramentos: bastidores, encontro e arquivo. Roxo profundo, tipografia ampla, acentos em ciano e filetes finos organizam a informação; uma etiqueta no topo diz de que série é o post.",
          en: "Three topics, three framings: behind the scenes, encounters and archive. Deep purple, wide type, cyan accents and thin rules organize the information; a tag at the top says which series the post belongs to.",
        },
        layout: "grid-three",
        images: [
          {
            src: `${DIR}/byron-mendes/byron-bastidores.webp`,
            ...FEED,
            alt: {
              pt: "Post Antes de abrir as portas: o trabalho por trás de uma exposição, com Byron Mendes diante de uma instalação visual.",
              en: "Post Before the doors open: the work behind an exhibition, with Byron Mendes in front of a visual installation.",
            },
            caption: { pt: "bastidores: antes de abrir as portas", en: "behind the scenes: before the doors open" },
          },
          {
            src: `${DIR}/byron-mendes/byron-encontros.webp`,
            ...FEED,
            alt: {
              pt: "Post A arte também aproxima, com visitante junto à mostra Objetos Sonho.",
              en: "Post Art also brings people closer, with a visitor at the Objetos Sonho show.",
            },
            caption: { pt: "encontros: a arte também aproxima", en: "encounters: art also brings people closer" },
          },
          {
            src: `${DIR}/byron-mendes/byron-oceanos.webp`,
            ...FEED,
            alt: {
              pt: "Post Década dos Oceanos, com vista de exposição imersiva no CCBB.",
              en: "Post Década dos Oceanos (Ocean Decade), with a view of an immersive exhibition at CCBB.",
            },
            caption: { pt: "do meu arquivo: década dos oceanos", en: "from my archive: década dos oceanos" },
          },
        ],
      },
    ],
    stats: [
      {
        value: { pt: "1.649", en: "1,649" },
        label: { pt: "visualizações", en: "views" },
        detail: { pt: "−12,1% vs. período comparado", en: "−12.1% vs. comparison period" },
      },
      {
        value: { pt: "255", en: "255" },
        label: { pt: "visualizadores", en: "viewers" },
        detail: { pt: "−22,5% vs. período comparado", en: "−22.5% vs. comparison period" },
      },
      {
        value: { pt: "+8", en: "+8" },
        label: { pt: "seguidores líquidos", en: "net followers" },
        detail: { pt: "2.005 seguidores no total", en: "2,005 followers in total" },
      },
    ],
    highlight: {
      pt: "Posts, no dia da captura: “A arte também aproxima” com 219 visualizações; “Década dos Oceanos” com 119.",
      en: "Posts, on the day of capture: “Art also brings people closer” with 219 views; “Década dos Oceanos” with 119.",
    },
    credits: [
      {
        label: { pt: "foto (década dos oceanos)", en: "photo (década dos oceanos)" },
        value: { pt: "Pedro Napolitano Prata", en: "Pedro Napolitano Prata" },
      },
    ],
  },
];

