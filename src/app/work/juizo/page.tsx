"use client";

import ProjectShell from "@/components/ProjectShell";
import { CaseCanvas, CaseSection, CaseFigure, CasePanel } from "@/components/CaseStudyKit";
import { useT } from "@/i18n/LanguageContext";

/* Telas em modo exemplo do próprio app: os números são fictícios, nenhum dado
 * financeiro real da Mary aparece aqui. */
const SHOTS = [
  {
    src: "/img/juizo/print-home.webp",
    altPt: "Tela inicial do Juízo mostrando quanto ainda cabe no combinado do mês",
    altEn: "Juízo home screen showing how much room is left in the month's budget",
    capPt: "home · o número que decide o dia",
    capEn: "home · the number that decides the day",
  },
  {
    src: "/img/juizo/print-extrato.webp",
    altPt: "Tela de extrato com cada compra traduzida em horas de trabalho",
    altEn: "Statement screen translating each purchase into hours of work",
    capPt: "extrato · cada compra em horas de trabalho",
    capEn: "statement · each purchase in hours of work",
  },
  {
    src: "/img/juizo/print-wishlist.webp",
    altPt: "Wishlist com quarentena de 24 horas antes da compra",
    altEn: "Wishlist with a 24-hour quarantine before buying",
    capPt: "wishlist · a sala de espera das compras",
    capEn: "wishlist · the waiting room for purchases",
  },
] as const;

const localStyles = `
  .jz-shot { max-width: 22rem; margin-inline: auto; }

  .jz-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
    gap: clamp(1.25rem, 3vw, 2.25rem);
  }
  .jz-stat { display: flex; flex-direction: column; gap: .5rem; }
  .jz-stat__num {
    font-family: var(--font-head);
    font-size: clamp(2.4rem, 5.5vw, 3.6rem);
    line-height: .9;
    letter-spacing: -.03em;
    font-variant-numeric: tabular-nums;
    color: var(--tc-accent-text);
  }
  .jz-stat__desc {
    margin: 0;
    font-family: var(--font-body);
    font-size: var(--type-small);
    line-height: 1.45;
    opacity: .82;
    text-wrap: pretty;
  }

  .jz-list { margin: 0; padding: 0; list-style: none; display: grid; gap: .9rem; }
  .jz-list li {
    position: relative;
    padding-left: 1.5rem;
    font-family: var(--font-body);
    font-size: var(--type-small);
    line-height: 1.5;
    text-wrap: pretty;
  }
  .jz-list li::before {
    content: "—";
    position: absolute;
    left: 0;
    color: var(--tc-accent-text);
  }
  .jz-list strong { font-weight: 600; }
`;

export default function JuizoProject() {
  const { lang } = useT();
  const pt = lang !== "en";

  const stats = pt
    ? [
        { num: "285", desc: "lançamentos reais de extrato usados como banco de teste, em vez de dados de exemplo." },
        { num: "0 → 39%", desc: "do valor categorizado sozinho depois de ensinar o app a ler as abreviações do banco." },
        { num: "32%", desc: "do gasto estava escondido atrás da fatura do cartão — invisível no extrato da conta." },
        { num: "47%", desc: "das saídas eram de até R$ 20: o gasto que some dentro de “Outros” e soma mais que o delivery." },
      ]
    : [
        { num: "285", desc: "real bank-statement entries used as the test set, instead of sample data." },
        { num: "0 → 39%", desc: "of the total auto-categorised once the app learned to read the bank's abbreviations." },
        { num: "32%", desc: "of spending was hidden behind the credit-card bill — invisible in the account statement." },
        { num: "47%", desc: "of outflows were under R$ 20: the spending that disappears into “Other” and outweighs delivery." },
      ];

  return (
    <ProjectShell
      accent="#9e2f4f"
      title={
        <>
          <strong style={{ color: "#9e2f4f", fontWeight: 700 }}>JUÍZO:</strong>{" "}
          {pt ? "dinheiro sem sermão" : "money without the lecture"}
        </>
      }
      desc={
        <>
          {pt
            ? "Um aplicativo de finanças pessoais que comecei porque eu mesma precisava. Ganho diferente todo mês, e os apps que testei partem de um salário fixo. Este mostra quanto ainda cabe até o próximo pagamento, traduz cada compra em horas de trabalho e "
            : "A personal finance app I started because I needed one. My income changes every month, and the apps I tried assume a fixed salary. This one shows how much room is left until the next payment, translates each purchase into hours of work and "}
          <span className="pj-em">
            {pt ? "pergunta antes de decidir qualquer coisa" : "asks before deciding anything"}
          </span>
          .
        </>
      }
      role={
        pt
          ? "Projeto solo: ideia, pesquisa, design de produto, identidade, UX/UI e desenvolvimento — do primeiro rascunho ao APK."
          : "Solo project: idea, research, product design, identity, UX/UI and development — from the first sketch to the APK."
      }
      meta={[
        { label: pt ? "Projeto" : "Project", value: pt ? "Produto autoral" : "Self-initiated product" },
        { label: pt ? "Atuação" : "Role", value: pt ? "Idealizadora, designer e desenvolvedora" : "Creator, designer and developer" },
        { label: pt ? "Início" : "Started", value: pt ? "julho de 2026" : "July 2026" },
        { label: "Status", value: pt ? "em construção" : "work in progress" },
      ]}
    >
      <CaseCanvas variant="juizo">
        <style>{localStyles}</style>

        <CaseSection
          ink
          label={pt ? "01 / o problema" : "01 / the problem"}
          title={pt ? "os apps que testei começam perguntando o salário" : "the apps I tried start by asking for your salary"}
          intro={
            pt
              ? "Trabalho como freelancer e a renda muda todo mês, então esse número simplesmente não existe pra mim. Tentei adaptar alguns apps e não deu certo. No Juízo a pergunta é outra: quanto ainda cabe até o próximo pagamento. Essa resposta ficou sozinha no topo da tela, e o resto do app foi organizado em volta dela."
              : "I work freelance and my income changes every month, so that number simply doesn't exist for me. I tried adapting a few apps and it didn't work. In Juízo the question is different: how much room is left until the next payment. That answer sits alone at the top of the screen, and the rest of the app is organised around it."
          }
        >
          {/* asym-reverse: a coluna estreita fica com o print de celular, a larga com o texto */}
          <div className="tc-grid tc-grid--asym-reverse">
            <CaseFigure
              className="jz-shot"
              src={SHOTS[0].src}
              width={860}
              height={1864}
              alt={pt ? SHOTS[0].altPt : SHOTS[0].altEn}
              caption={pt ? SHOTS[0].capPt : SHOTS[0].capEn}
              index={pt ? "imagem 01" : "image 01"}
              priority
              sizes="(max-width: 900px) 88vw, 360px"
            />
            <CasePanel label={pt ? "coisas que ele não faz" : "things it doesn't do"}>
              <ul className="jz-list">
                <li>
                  {pt
                    ? "Não movimenta dinheiro: nada de Pix, pagamento de conta ou investimento."
                    : "It doesn't move money: no transfers, bill payment or investing."}
                </li>
                <li>
                  {pt
                    ? "Não usa dado bancário para publicidade e não faz ranking de gastos."
                    : "It doesn't use bank data for advertising and doesn't rank your spending."}
                </li>
                <li>
                  {pt
                    ? "Sugere, mas não aplica sozinho — nada entra na conta antes de um “sim”."
                    : "It suggests but doesn't apply on its own — nothing counts before a “yes”."}
                </li>
                <li>
                  {pt
                    ? "Quando faz piada, é com a situação, não com quem está usando."
                    : "When it makes a joke, it's about the situation, not about the person using it."}
                </li>
              </ul>
            </CasePanel>
          </div>
        </CaseSection>

        <CaseSection
          label={pt ? "02 / a pesquisa" : "02 / the research"}
          title={pt ? "testei com extrato de verdade e tive que refazer bastante coisa" : "I tested it with real statements and had to redo a lot"}
          intro={
            pt
              ? "Usei sete meses de extrato bancário real como base de teste. Quase nada disso aparecia enquanto eu trabalhava com dados de exemplo. Foi a etapa que mais mudou o produto, e é por isso que importar a fatura do cartão está na frente de refinar a leitura do extrato no que vem a seguir."
              : "I used seven months of real bank statements as the test set. Almost none of this showed up while I was working with sample data. It was the stage that changed the product most, and it's why importing the card bill now comes before refining statement parsing."
          }
        >
          <div className="jz-stats">
            {stats.map((stat) => (
              <div className="jz-stat" key={stat.num}>
                <span className="jz-stat__num">{stat.num}</span>
                <p className="jz-stat__desc">{stat.desc}</p>
              </div>
            ))}
          </div>

          <div className="tc-grid tc-grid--asym" style={{ marginTop: "clamp(3rem, 7vw, 6rem)" }}>
            <CasePanel label={pt ? "o bug que apagava compras" : "the bug that deleted purchases"}>
              <ul className="jz-list">
                <li>
                  {pt
                    ? "A deduplicação sumia com 9 lançamentos reais. A lista de ruído dizia “transferencia”, mas o banco escreve “TRANSF” — então todo Pix casava com qualquer outro Pix de mesmo valor."
                    : "Deduplication was deleting 9 real entries. The noise list said “transferencia”, but the bank writes “TRANSF” — so every transfer matched any other transfer of the same amount."}
                </li>
                <li>
                  {pt
                    ? "A correção foi deixar o app menos confiante: quando não sobra nome aproveitável dos dois lados, ele não afirma que é repetição."
                    : "The fix was making the app less confident: when neither side leaves a usable name, it doesn't claim it's a duplicate."}
                </li>
                <li>
                  {pt
                    ? "O que ele suspeita não entra no total nem some — fica numa fila visível, com dois botões: “é outra compra” / “é repetida”."
                    : "What it suspects neither counts nor disappears — it waits in a visible queue with two buttons: “different purchase” / “duplicate”."}
                </li>
              </ul>
            </CasePanel>
            <CaseFigure
              className="jz-shot"
              src={SHOTS[1].src}
              width={860}
              height={1864}
              alt={pt ? SHOTS[1].altPt : SHOTS[1].altEn}
              caption={pt ? SHOTS[1].capPt : SHOTS[1].capEn}
              index={pt ? "imagem 02" : "image 02"}
              sizes="(max-width: 900px) 88vw, 360px"
            />
          </div>
        </CaseSection>

        <CaseSection
          ink
          label={pt ? "03 / anti-impulso" : "03 / anti-impulse"}
          title={pt ? "a parte difícil foi escolher a hora de falar" : "the hard part was choosing when to speak"}
          intro={
            pt
              ? "Fazer a conta era o mais simples. O complicado foi decidir quando o app abre a boca: cedo demais vira ruído e a gente ignora, tarde demais a compra já aconteceu. Acabei tirando quase tudo da home fixa — essas telas aparecem quando o risco existe e somem quando não existe."
              : "The maths was the easy part. The tricky bit was deciding when the app speaks up: too early and it's noise you ignore, too late and the purchase already happened. I ended up taking almost everything off the fixed home — these screens show up when the risk is real and disappear when it isn't."
          }
        >
          <div className="tc-grid tc-grid--asym-reverse">
            <CaseFigure
              className="jz-shot"
              src={SHOTS[2].src}
              width={860}
              height={1864}
              alt={pt ? SHOTS[2].altPt : SHOTS[2].altEn}
              caption={pt ? SHOTS[2].capPt : SHOTS[2].capEn}
              index={pt ? "imagem 03" : "image 03"}
              sizes="(max-width: 900px) 88vw, 360px"
            />
            <CasePanel label={pt ? "como funciona na prática" : "how it works in practice"}>
              <ul className="jz-list">
                <li>
                  <strong>{pt ? "Quarentena de 24h. " : "24h quarantine. "}</strong>
                  {pt
                    ? "O desejo entra numa sala de espera com preço-alvo. Se ainda fizer sentido depois, compra."
                    : "The want goes into a waiting room with a target price. If it still makes sense later, buy it."}
                </li>
                <li>
                  <strong>{pt ? "Reserva viva. " : "Living reserve. "}</strong>
                  {pt
                    ? "Ao resistir, o app pergunta se quer separar aquele valor de verdade. Só o que é confirmado vira saldo — o relatório mostra dinheiro guardado, nunca economia imaginada."
                    : "When you resist, the app asks if you want to actually set that amount aside. Only what's confirmed becomes balance — the report shows money saved, never imagined savings."}
                </li>
                <li>
                  <strong>{pt ? "O gotejamento. " : "The drip. " }</strong>
                  {pt
                    ? "Compras pequenas repetidas no mesmo lugar viram pontinhos na tela, sem nenhum comentário junto — só a soma."
                    : "Small purchases repeated at the same place become dots on screen, with no commentary attached — just the total."}
                </li>
                <li>
                  <strong>{pt ? "Sentimento pós-compra. " : "Post-purchase feeling. "}</strong>
                  {pt
                    ? "“Olhando agora, valeu?” só aparece 24h depois — na hora, quem responde é a empolgação."
                    : "“Looking back, was it worth it?” only appears 24h later — in the moment, excitement is the one answering."}
                </li>
              </ul>
            </CasePanel>
          </div>
        </CaseSection>

        <CaseSection
          label={pt ? "04 / arquitetura" : "04 / architecture"}
          title={pt ? "por que ele roda só no aparelho" : "why it runs only on the device"}
          intro={
            pt
              ? "O app inteiro roda no celular e os dados ficam no armazenamento local — sem servidor, sem nuvem e sem conta. A troca é real: não sincroniza entre aparelhos, e quem troca de celular precisa levar o backup na mão. Achei que valia a pena, já que é um app que lê extrato bancário."
              : "The whole app runs on the phone and the data stays in local storage — no server, no cloud, no account. The trade-off is real: it doesn't sync across devices, and switching phones means carrying the backup by hand. I thought it was worth it, given this is an app that reads your bank statement."
          }
        >
          <div className="tc-grid tc-grid--two">
            <CasePanel label={pt ? "como está feito" : "how it's built"}>
              <ul className="jz-list">
                <li>{pt ? "Interface em React e TypeScript, empacotada com Vite." : "Interface in React and TypeScript, bundled with Vite."}</li>
                <li>{pt ? "Android via Capacitor, gerando APK do mesmo código." : "Android via Capacitor, producing an APK from the same code."}</li>
                <li>{pt ? "Persistência local, com “salvar cópia” e “restaurar” em arquivo." : "Local persistence, with file-based “save a copy” and “restore”."}</li>
                <li>{pt ? "Quatro entradas de dados misturáveis: manual, CSV/OFX, notificação do Android e Open Finance." : "Four mixable data inputs: manual, CSV/OFX, Android notifications and Open Finance."}</li>
              </ul>
            </CasePanel>
            <CasePanel label={pt ? "o que essa escolha me deu de trabalho" : "the work that choice created"}>
              <ul className="jz-list">
                <li>
                  {pt
                    ? "Como não existe conta, também não existe recuperação: tive que fazer o backup manual antes de qualquer outra coisa."
                    : "Since there's no account, there's no recovery either: I had to build manual backup before anything else."}
                </li>
                <li>
                  {pt
                    ? "Sem servidor, toda a leitura de extrato acontece no aparelho — e arquivo de banco vem bem bagunçado."
                    : "With no server, all statement parsing happens on the device — and bank files come in pretty messy."}
                </li>
                <li>
                  {pt
                    ? "O Open Finance depende de aprovação da Pluggy, não de código. É a parte que não está na minha mão."
                    : "Open Finance depends on approval from Pluggy, not on code. It's the part that isn't in my hands."}
                </li>
              </ul>
            </CasePanel>
          </div>
        </CaseSection>

        <CaseSection
          ink
          label={pt ? "05 / onde está agora" : "05 / where it stands"}
          title={pt ? "o que ainda falta" : "what's still missing"}
          intro={
            pt
              ? "É um projeto em andamento, tocado por uma pessoa só, então tem bastante coisa pela metade. Deixo a lista aqui do mesmo jeito que ela está no repositório — é mais útil pra conversar sobre o produto do que uma vitrine só com o que já funciona."
              : "It's an ongoing project run by one person, so plenty of it is half-finished. I'm leaving the list here exactly as it is in the repository — it's more useful for talking about the product than a showcase of only the working parts."
          }
        >
          <div className="tc-grid tc-grid--two">
            <CasePanel label={pt ? "próximo no backlog" : "next in the backlog"}>
              <ul className="jz-list">
                <li>{pt ? "Onboarding: ainda não existe, e é o que mais faz falta na primeira sessão." : "Onboarding: doesn't exist yet, and it's what's most missed in the first session."}</li>
                <li>{pt ? "Explicar os números — hoje nenhum valor mostra como foi calculado nem deixa corrigir." : "Explaining the numbers — right now no value shows how it was calculated or lets you fix it."}</li>
                <li>{pt ? "Fazer a categorização lembrar da regra quando chegar um lançamento novo." : "Making categorisation remember the rule when a new entry arrives."}</li>
                <li>{pt ? "Importar a fatura do cartão sem contar o mesmo gasto duas vezes." : "Importing the card bill without counting the same spend twice."}</li>
                <li>{pt ? "Testes automatizados: a deduplicação foi validada na mão, contra o extrato real." : "Automated tests: deduplication was validated by hand, against the real statement."}</li>
              </ul>
            </CasePanel>
            <CasePanel label={pt ? "sobre o projeto" : "about the project"}>
              <ul className="jz-list">
                <li>
                  {pt
                    ? "Ideia, nome, identidade, pesquisa, UX/UI e desenvolvimento: Mary Lisita, desde julho de 2026."
                    : "Idea, name, identity, research, UX/UI and development: Mary Lisita, since July 2026."}
                </li>
                <li>
                  {pt
                    ? "As telas desta página estão em modo exemplo — os valores são fictícios."
                    : "The screens on this page are in demo mode — the values are fictional."}
                </li>
                <li>
                  {pt
                    ? "Estou aberta a parceria e adoraria conversar sobre o produto."
                    : "I'm open to partnership and would love to talk about the product."}
                </li>
              </ul>
            </CasePanel>
          </div>
        </CaseSection>
      </CaseCanvas>
    </ProjectShell>
  );
}
