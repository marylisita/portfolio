"use client";

/**
 * Divisores ASCII fofos (escolha dela, 2026-07-21) no lugar das linhas
 * tracejadas (`repeating-linear-gradient`). É texto puro repetido e cortado
 * na largura do container — leve, sem imagem, sem JS.
 *
 * `braille`: usa a BrailleMono (já carregada pros ornamentos) — glifos ⠂⠄⠁
 * renderizam garantido. Os outros padrões (︶ ꒷ ꒦ ◠ ⊹ ˚ ₊) vêm de blocos
 * unicode bem cobertos por Segoe/Noto — conferir no print se algum virar tofu.
 *
 * `repeat={false}`: peça única centralizada (ex.: a carinha ૮₍ ´ ꒳ ` ₎ა)
 * em vez de padrão repetido de ponta a ponta.
 */
export default function AsciiDivider({
  pattern = "︶꒷꒦︶",
  repeat = true,
  braille = false,
  opacity = 0.5,
  size = ".7rem",
  className,
  style,
}: {
  pattern?: string;
  repeat?: boolean;
  braille?: boolean;
  opacity?: number;
  size?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        /* filhos de flex/grid: sem isso o texto repetido (nowrap, enorme)
           vira min-content gigante e EXPLODE a coluna — aprendido na marra
           quando a tabela de ferramentas foi parar fora da tela */
        minWidth: 0,
        maxWidth: "100%",
        textAlign: "center",
        lineHeight: 1,
        fontFamily: braille ? "var(--font-braille), monospace" : "var(--font-mono), monospace",
        fontSize: size,
        opacity,
        color: "var(--ink)",
        userSelect: "none",
        pointerEvents: "none",
        ...style,
      }}
    >
      {repeat ? pattern.repeat(Math.max(1, Math.ceil(240 / pattern.length))) : pattern}
    </div>
  );
}
