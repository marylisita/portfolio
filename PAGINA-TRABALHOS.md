# Página de trabalhos — estado e decisões

Atualizado em 30 de julho de 2026. Escrito para que uma conversa nova comece
informada em vez de redescobrir tudo. Leia isto antes de mexer em
`src/app/work/page.tsx`, `src/components/useProjects.ts` ou
`src/content/projectStories.ts`.

## Estado atual de `/work`

A página mostra **7 projetos** (não 12) e tem um **filtro por área** em coluna
vertical na borda direita.

Base da decisão dos 7: Barnes et al. (2022), *Portfolio Literacy and the
Transition to Work for Graphic Design Graduates*, iJADE 41(2) — survey com 53
empregadores de design gráfico. As preferências se concentram em **4 a 7
projetos**; 81% pedem amostra de trabalho já no primeiro e-mail. Não relitigar
isso sem motivo novo.

### Núcleo (`CORE_HREFS` em `work/page.tsx`)

Cada um cobre um território que nenhum outro cobre:

| # | projeto | território |
|---|---|---|
| 01 | graduation | gráfico, ilustração, objeto produzido — o visual mais forte, abre a página |
| 02 | ebat | cliente, manual de marca, o único com números (190 inscrições / 100 aprovados) |
| 03 | cyber-marinum | arte-tech, coletivo, credencial de exposição |
| 04 | magazine | tipografia como assunto |
| 05 | isadora | direção de arte, cliente freela |
| 06 | hologlam | pesquisa especulativa + autocrítica |
| 07 | touchdesigner-workshop | ensino — prova facilitação e tradução de conhecimento |

Fora do núcleo: vegcoz, ondularis, pilotis, chinario, genlab. **Continuam na
fonte (`useProjects`) de propósito** — o `ProjectShell` usa a lista completa
para as tags e a navegação anterior/próximo. Se você filtrar a fonte, essas 5
páginas abrem sem tag e sem navegação. Já foi verificado; não "otimize" isso.

**Vaga de produto/UX:** aí o vegcoz entra no núcleo e o touchdesigner sai. Não
ter nenhum trabalho de produto é pior que ter um com visual datado.

### Taxonomia das abas (`AREAS` + `TABS`)

Eixo é **área**, nunca contexto. Cliente / acadêmico / colaboração / autoral
seguem como etiqueta na linha de tags, não como aba.

- **destaques** — os 7 do núcleo, na ordem de `CORE_HREFS`
- **design gráfico** — graduation, ebat, isadora, magazine, pilotis, chinario
- **arte & tecnologia** — cyber-marinum, ondularis, hologlam, touchdesigner, genlab
- **pesquisa & educação** — hologlam, touchdesigner, genlab, vegcoz

Um projeto pode estar em mais de uma área. "Destaques" mostra só o núcleo; as
outras abas consultam os 12 — assim a curadoria segue sendo a primeira
impressão e nada fica inacessível.

**Não criar aba de UX/UI ainda:** só o vegcoz cairia nela. Quando existir um
segundo case forte de interface, "produto & interfaces" passa a fazer sentido.

**Não usar braille como contagem.** Foi tentado e descartado: os pontos
levantados eram o número, ficou bonito e ilegível. Braille segue como ornamento
no site, nunca como único portador de informação.

## Estética: o que sai e o que fica

**FICA: textura.** Ela gosta. `paper-noise.webp` (9 usos) e a paleta
`--paper-*` permanecem.

**SAI: colagem.** Fita, folha torta, recorte empilhado. Ainda não foi feito:

- `--paper-tape` (fita) — 3 usos: `globals.css`, `work/page.tsx`, `CaseStudyKit.tsx`
- folhas tortas — 25 props `tilt=` nos cases + ~63 rotações em CSS
- legendas "folha 01 / lâmina 02" — 13 ocorrências

Fazer num bloco só, com ela olhando. `globals.css` e `CaseStudyKit.tsx` são
compartilhados com a outra sessão.

## Registro da copy

Passou por uma limpeza grande de linguagem de IA em 30/07. Regras que valem
para qualquer texto novo:

1. **Sem alegação de resultado que ninguém mediu.** Nada de "recorde de
   engajamento", "atingiu público inédito", "a pessoa realmente levou para
   casa". Onde não há dado, descreva a decisão de projeto.
2. **Sem template.** `"How might…"` está em zero no `src/` — eram 12 de 12.
   Também evitar todo `challenge` abrindo com "Como…?" e a antítese "X sem Y".
3. **Sem tríade decorativa de adjetivo** ("claras, desejáveis e acionáveis").
   Enumeração de coisa concreta pode.
4. **Sem "X, e não Y" que diminui outra profissão.** Ela achou prepotente e
   está certa — há literatura sobre penalidade de autopromoção assertiva
   (Rudman; Moss-Racusin & Rudman 2010; Krings et al. 2023).
5. **Descrever decisão, não aparência.** O Barnes chama isso de não ser
   "meramente um estilista". "Papel rasgado e cor vintage" é estilista;
   "a estrutura veio dos usuários, não do meu gosto" é designer.

Referência de voz boa, já no site: o case da VegCoz (`vz_*` no dicionário),
o bloco "o que não fecha" do HoloGlam, e o case do Graduation.

## Armadilhas verificadas

- **Sessão paralela.** Outra IA edita este repo ao mesmo tempo (menu, header,
  `cyber-marinum/`, `touchdesigner-workshop/`, `ProjectShell.tsx`,
  `app/page.tsx`, `globals.css`). Checar `mtime` antes de editar; se gravou nos
  últimos minutos, esperar.
- **Copy duplicada.** `cyber-marinum/page.tsx` e `touchdesigner-workshop/page.tsx`
  têm o texto de `projectStories.ts` **hardcoded no JSX**. Já sincronizado à mão,
  mas vai divergir de novo. Consertar de verdade = essas páginas lerem de
  `projectStories.ts` como as outras dez.
- **Terminações de linha mistas** (CRLF e LF no mesmo arquivo) em
  `dictionaries.ts` e `projectStories.ts`. Script que faz `split('\r\n')` corrompe.
  Usar substituição literal de string, não manipulação por linha.
- **Dev server:** `npm run dev` → porta **3456** (não 3000). Turbopack trava
  em rotas específicas depois de erro de compilação e passa a servir chunk
  velho — reiniciar resolve. Para só visualizar, `npm run build` + `npm run preview`.
- Atalho na área de trabalho dela: `abrir portfolio.bat`.

## Pendente

- [ ] Tirar fita, folhas tortas e legendas "folha/lâmina" (bloco único)
- [ ] Home destaca `isadora · genlab · ebat · vegcoz · ondularis`, e 3 desses
      estão fora do núcleo. Sugestão: `graduation · ebat · cyber-marinum ·
      magazine · isadora`. Fica em `FEATURED_PROJECT_HREFS` em `app/page.tsx`
      (arquivo da outra sessão).
- [ ] Case do Graduation: faltam 4 fatos que só ela tem — se "CHECKLIZT" com Z
      é piada com o chiado carioca, quantos ícones desenhou e quantos entraram,
      quantos kits foram produzidos, e se a impressão em uma cor foi restrição
      de custo ou escolha.
- [ ] `HANDOFF.md` na raiz está com lixo de saída de ferramenta — limpar ou apagar.
