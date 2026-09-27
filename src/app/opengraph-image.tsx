import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Cartão social padrão do site. Vale para qualquer rota que não defina a
 * própria imagem (home, /work, /colofao).
 *
 * Desenhado na mesma linguagem do site — papel creme, tinta quase preta,
 * régua tracejada em ASCII e rótulos entre colchetes — em vez de um print de
 * página, que fica ilegível no tamanho de miniatura do WhatsApp.
 *
 * Satori (motor do ImageResponse) só aceita ttf/otf/woff, nunca woff2, e
 * exige `display: flex` explícito em todo elemento com mais de um filho.
 */
export const alt =
  "Maria Isabel Lisita — designer multidisciplinar: design gráfico, web, UX/UI e programação criativa";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#EDE7DA";
const INK = "#1C1B18";
/* Terracota do --hero-highlight: a única nota cromática do tema padrão. */
const HIGHLIGHT = "#75332f";

export default async function Image() {
  const fontsDir = join(process.cwd(), "src/app/fonts");
  const [regular, bold] = await Promise.all([
    readFile(join(fontsDir, "Aeonik-Regular.ttf")),
    readFile(join(fontsDir, "Aeonik-Bold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          color: INK,
          fontFamily: "Aeonik",
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            fontSize: 22,
            letterSpacing: "0.12em",
            textTransform: "lowercase",
          }}
        >
          <div style={{ display: "flex" }}>maria isabel lisita</div>
          <div style={{ display: "flex", color: HIGHLIGHT }}>portfólio</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              textTransform: "lowercase",
            }}
          >
            designer
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              textTransform: "lowercase",
            }}
          >
            multidisciplinar
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Régua tracejada: `nowrap` + `overflow: hidden` fazem a linha ser
              cortada na borda em vez de quebrar em três linhas. O repeat é
              generoso de propósito, para sempre sobrar e nunca faltar. */}
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 24,
              overflow: "hidden",
              whiteSpace: "nowrap",
              fontSize: 20,
              letterSpacing: "0.32em",
              color: INK,
              opacity: 0.72,
              marginBottom: 26,
            }}
          >
            {"------ ".repeat(40)}
          </div>
          <div
            style={{
              display: "flex",
              gap: 26,
              fontSize: 24,
              letterSpacing: "0.04em",
              textTransform: "lowercase",
            }}
          >
            <div style={{ display: "flex" }}>[ design gráfico ]</div>
            <div style={{ display: "flex" }}>[ web ]</div>
            <div style={{ display: "flex" }}>[ ux/ui ]</div>
            <div style={{ display: "flex" }}>[ programação criativa ]</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Aeonik", data: regular, style: "normal", weight: 400 },
        { name: "Aeonik", data: bold, style: "normal", weight: 700 },
      ],
    },
  );
}
