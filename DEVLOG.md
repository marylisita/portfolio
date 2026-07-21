# Devlog: do terminal à colagem editorial

21 de julho de 2026

Nas últimas semanas, reconstruí meu portfólio enquanto ele já estava funcionando. A primeira versão tinha referências digitais que eu gosto, mas começou a parecer uma interface de terminal. Eu queria preservar os caracteres, os pixels e a experimentação sem deixar o site frio ou excessivamente técnico.

A direção que encontrei foi a de uma colagem editorial impressa. O ASCII passou a funcionar como gravura sobre papel. As imagens ganharam camadas deslocadas, pequenas rotações e legendas que encostam nas capas. A composição continua assimétrica, mas cada projeto tem espaço para respirar.

## Tipografia

O sistema tipográfico agora combina três vozes:

- Aeonik nos textos corridos;
- ITC Garamond Condensed Book nos momentos editoriais e serifados;
- OffBit Dot Bold nos números, legendas pequenas e informações dos projetos.

A OffBit fica em negrito e com espaçamento normal em todas as páginas. A ideia é lembrar impressão matricial e bolinhas, sem imitar uma tela de código.

## Projetos e composição

A home apresenta nove trabalhos em uma colagem livre: Isadora Ruppert, Helvetica: Discórdia, Genlab, EBAT, Apple Academy Graduation, Pilotis, China-Rio, HoloGlam e VegCoz.

Cada capa reage ao mouse. A imagem sai do estado pixelado conforme se aproxima e fica nítida no hover. O fundo também recebe um tom ligado ao projeto ativo. Essa mudança de cor acabou sendo uma das interações mais simples e mais importantes do site, porque conecta a composição à identidade de cada trabalho.

Criei ainda um modo “mesa”, mais organizado, para quem prefere percorrer os projetos sem a dispersão da colagem. No mobile, as peças continuam levemente inclinadas para não perder a personalidade.

## ASCII sem cara de terminal

Os ornamentos em Braille e Unicode ocupam áreas vazias como desenhos impressos. Eles aparecem na home, no índice de trabalhos e dentro dos projetos, sempre com baixa opacidade e sem competir com as imagens.

Algumas experiências saíram durante o processo. Removi símbolos que pareciam indicadores de sistema, desenhos repetidos, uma constelação colorida da hero e um easter egg com selos arrastáveis. Cortar essas peças deixou a linguagem mais clara: os caracteres agora decoram e dão ritmo, em vez de sugerirem uma interface fictícia.

O cursor continua sendo a exceção mais divertida. Seu rastro usa estrelas, corações tipográficos e sinais matemáticos em pink, lilás pastel, branco e preto. O limite de partículas é controlado para preservar a fluidez.

## Movimento e acessibilidade

As transições de página lembram uma troca de folha. Capas, camadas de papel e ornamentos se movem em velocidades diferentes, mas as animações mais pesadas só entram quando o elemento está próximo da tela.

O site respeita `prefers-reduced-motion`. Em dispositivos com ponteiro de toque, o cursor customizado é ocultado. Também reduzi efeitos no modo mesa depois de perceber queda de desempenho em composições maiores.

## Limpeza técnica

Durante a revisão, encontrei vídeos soltos, protótipos antigos, backups de sprites, fontes sem uso e componentes que já não pertenciam a nenhuma rota. A limpeza removeu cerca de 175 MB do projeto publicado. A pasta `public` caiu de 234,2 MB para 61,4 MB.

Também retirei 15 componentes antigos e reconstruí o cache local de desenvolvimento. Depois da limpeza, validei as 12 páginas do site e 30 caminhos de arquivos estáticos.

O projeto usa Next.js 16, React 19, Framer Motion e Lenis. As fontes principais são locais, então o desenho tipográfico não depende de quem visita ter os arquivos instalados.

## Publicação

A versão descrita aqui foi publicada no commit [`c7a433d`](https://github.com/marylisita/portfolio/commit/c7a433d) e está disponível em [portfolio-nine-lime-73.vercel.app](https://portfolio-nine-lime-73.vercel.app/).

No próximo ciclo, quero revisar a compressão do vídeo da EBAT e continuar ajustando o equilíbrio entre imagem, ornamento e espaço vazio. O objetivo não é deixar tudo preenchido. É fazer cada vazio parecer intencional.
