# Backlog

Atualizado em 27 de julho de 2026.

## Alta prioridade

- [ ] **Atribuir o TBT mobile com um trace reproduzível.** As medições recentes
  registraram 276–294 ms. O número 86 citado anteriormente é uma pontuação de
  Lighthouse, não um baseline de TBT em milissegundos, e não deve ser comparado
  diretamente. Registrar a tarefa longa, o script responsável e a rota antes de
  remover efeitos.
- [ ] **Reproduzir a lentidão abaixo do acervo sem alterar a rolagem global.**
  Medir a transição entre o hero e `ScatteredWorks`, incluindo o ciclo do Lenis,
  listeners de scroll, observers e canvases ativos. A duplicação de scrollbars
  foi uma regressão de uma tentativa anterior, não o problema atual a ser
  “corrigido” com outro contêiner rolável.

## Média prioridade

- [ ] **Auditar contraste por função.** Texto de leitura, metadados e controles
  precisam de contraste adequado; gravuras decorativas podem continuar leves.
  Evitar aumentar globalmente a opacidade e destruir a hierarquia editorial.
- [ ] **Revisar a arquitetura de forma incremental.** Só mover componentes
  quando houver uma fronteira clara e testes para a rota afetada. Não combinar
  reorganização de pastas com investigação de performance ou scroll.
- [ ] **Preservar a Seratonin como ativo de identidade.** Qualquer otimização de
  fontes deve manter `--font-hand` e validar visualmente o wordmark e os títulos
  que dependem dela.

## Concluído nesta rodada

- [x] `ProjectShell.title` aceita `ReactNode`.
- [x] O modal de `CaseStudyKit` não passa `false` para a propriedade `exit`.
- [x] A segunda imagem de HoloGlam recebeu `alt` válido no lugar de JSX em
  `title`.
- [x] Os `x` decorativos foram removidos das etiquetas do hero; os colchetes
  permanecem como moldura suficiente.

## Restrições para a próxima investigação

- Manter uma única rolagem vertical, pertencente ao documento.
- Não usar `overflow: hidden`, `content-visibility` ou um novo scroll container
  como tentativa inicial de corrigir lentidão.
- Não misturar refatoração estrutural, troca tipográfica e otimização de runtime
  no mesmo lote.
- Comparar produção e local antes de descartar alterações não commitadas.
