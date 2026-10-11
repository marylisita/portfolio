import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

/**
 * Cartão social padrão do site. Vale para qualquer rota que não defina a
 * própria imagem (home, /work, /colofao).
 *
 * Pensado para a miniatura, não para o tamanho cheio: no Threads e no
 * WhatsApp o cartão aparece com uns 400px de largura, um terço do original.
 * Por isso nada aqui fica abaixo de 26px, não há letterspacing largo (a
 * redução comia letras inteiras da versão anterior) e quem carrega o cartão
 * são os trabalhos, não o texto.
 *
 * A linguagem é a do site: papel creme, onda em ASCII no rosa quieto,
 * etiqueta preta entre colchetes e a faixa preta do marquee. A PF Pixelscript
 * não entra porque vem do Adobe Fonts e não existe como arquivo; a voz
 * pixelada fica com a OffBit.
 *
 * Satori (motor do ImageResponse) só aceita ttf/otf/woff e não decodifica
 * webp, por isso as imagens passam pelo sharp antes: viram JPEG já recortado
 * no tamanho do cartão. Também exige `display: flex` explícito em todo
 * elemento com mais de um filho.
 *
 * A saída é JPEG, não o PNG do ImageResponse: com fotos o PNG passa de
 * 600 kB, e o WhatsApp deixa de mostrar a prévia acima de uns 300 kB.
 */
export const alt =
  "Maria Isabel Lisita, designer multidisciplinar, com peças do portfólio: press kit da Isadora Ruppert, cartaz da exposição Ondularis, app Juízo e identidade China–Rio";

export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

const PAPER = "#EDE7DA";
const INK = "#1C1B18";
/* --site-accent: o rosa que pode virar texto sobre o creme (4.74:1). */
const ACCENT = "#C4125F";
/* --site-accent-hot: só sobre a faixa preta, como no marquee. */
const HOT = "#FF2E9A";
/* --ascii-ink: o rosa fechado da gravura, para a onda não competir. */
const ASCII_INK = "#A81B55";

const BAND = ["identidade visual", "direção de arte", "web & código", "social media", "editorial"];

const publicDir = join(process.cwd(), "public");

/** Recorta a peça no tamanho do cartão (2x, para a rotação não serrilhar). */
async function photo(path: string, width: number, height: number, position = "centre") {
  const buf = await sharp(join(publicDir, path))
    .resize(width * 2, height * 2, { fit: "cover", position })
    .jpeg({ quality: 82 })
    .toBuffer();
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

/* Mesmo enquadramento do StaticKanagawa no herói: "cover" do cartão, 8% a
   mais, centralizado na horizontal e colado no topo. Assim a crista cai atrás
   do título, como no site; deslocada para a direita ela sumia atrás das peças
   e só sobravam pedaços soltos da gravura. */
const WAVE_WIDTH = Math.round(Math.max(size.width / 1521, size.height / 996) * 1.08 * 1521);
const WAVE_LEFT = Math.round((size.width - WAVE_WIDTH) / 2);

/** A gravura da onda vem azul; aqui ela vira o rosa da gravura do site. */
async function wave(width: number) {
  const { data, info } = await sharp(join(publicDir, "img/kanagawa-ascii-transparent.webp"))
    .resize(width)
    .ensureAlpha()
    .extractChannel(3)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const buf = await sharp({
    create: { width: info.width, height: info.height, channels: 3, background: ASCII_INK },
  })
    .joinChannel(data, { raw: { width: info.width, height: info.height, channels: 1 } })
    .png()
    .toBuffer();
  return { src: `data:image/png;base64,${buf.toString("base64")}`, width: info.width, height: info.height };
}

/* O ✳︎ do site. Nenhuma das fontes carregadas tem o glifo, então vai em SVG. */
function Star({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {[0, 45, 90, 135].map((angle) => (
        <rect key={angle} x={10.6} y={1} width={2.8} height={22} rx={1.4} fill={color} transform={`rotate(${angle} 12 12)`} />
      ))}
    </svg>
  );
}

type PrintProps = { src: string; x: number; y: number; w: number; h: number; rotate: number; tape: number };

/* Peça impressa presa com fita no papel. */
function Print({ src, x, y, w, h, rotate, tape }: PrintProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        display: "flex",
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 18px 34px rgba(28,27,24,.26), 0 2px 6px rgba(28,27,24,.16)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} width={w} height={h} alt="" style={{ width: w, height: h, objectFit: "cover" }} />
      <div
        style={{
          position: "absolute",
          left: w / 2 - 44,
          top: -15,
          width: 88,
          height: 28,
          background: "rgba(237,231,218,.8)",
          transform: `rotate(${tape}deg)`,
          boxShadow: "0 1px 2px rgba(28,27,24,.15)",
        }}
      />
    </div>
  );
}

export default async function Image() {
  const fontsDir = join(process.cwd(), "src/app/fonts");
  const [regular, bold, offBit, juizo, isadora, ondularis, china, kanagawa] = await Promise.all([
    readFile(join(fontsDir, "Aeonik-Regular.ttf")),
    readFile(join(fontsDir, "Aeonik-Bold.ttf")),
    readFile(join(fontsDir, "OffBit-DotBold.ttf")),
    photo("img/previews/juizo.webp", 190, 190),
    photo("img/isadora_vertical/Prancheta 1.webp", 222, 314, "north"),
    photo("img/ondularis/capa.webp", 226, 283),
    photo("img/chinario/1.webp", 262, 175),
    wave(WAVE_WIDTH),
  ]);

  const card = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: PAPER,
          color: INK,
          fontFamily: "Aeonik",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={kanagawa.src}
          width={kanagawa.width}
          height={kanagawa.height}
          alt=""
          style={{ position: "absolute", left: WAVE_LEFT, top: 0, opacity: 0.3 }}
        />

        <div
          style={{
            position: "absolute",
            left: 64,
            top: 56,
            width: 560,
            height: 452,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 32, fontWeight: 700, letterSpacing: "-0.01em" }}>
            <Star size={26} color={ACCENT} />
            maria isabel lisita
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 700, lineHeight: 0.98, letterSpacing: "-0.04em" }}>
            <div style={{ display: "flex" }}>designer</div>
            <div style={{ display: "flex", color: ACCENT }}>multidisciplinar</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            {/* A etiqueta preta dos botões do site ([ sobre ], [ ver projetos ]). */}
            <div
              style={{
                display: "flex",
                background: INK,
                color: PAPER,
                fontSize: 28,
                padding: "12px 22px",
                transform: "rotate(-3deg)",
                boxShadow: "4px 5px 0 rgba(28,27,24,.22)",
              }}
            >
              [ ver projetos ]
            </div>
            <div style={{ display: "flex", fontFamily: "OffBit", fontWeight: 700, fontSize: 26, opacity: 0.75 }}>
              rio de janeiro · 2026
            </div>
          </div>
        </div>

        {/* Mural: ordem de pintura importa, o último fica por cima. */}
        <Print src={juizo} x={700} y={340} w={190} h={190} rotate={5} tape={4} />
        <Print src={isadora} x={676} y={44} w={222} h={314} rotate={-5} tape={-4} />
        <Print src={ondularis} x={922} y={34} w={226} h={283} rotate={4} tape={3} />
        <Print src={china} x={892} y={334} w={262} h={175} rotate={-2.5} tape={-2} />

        {/* Faixa do marquee. 78px de altura porque o Threads corta o cartão
            em 2:1 e come uns 15px de cada borda. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: 1200,
            height: 78,
            display: "flex",
            alignItems: "center",
            gap: 22,
            paddingLeft: 40,
            background: INK,
            overflow: "hidden",
            whiteSpace: "nowrap",
            fontFamily: "OffBit",
            fontWeight: 700,
            fontSize: 32,
          }}
        >
          {BAND.flatMap((word, i) => [
            <div key={word} style={{ display: "flex", color: i % 2 ? PAPER : HOT }}>
              {word}
            </div>,
            <Star key={`${word}-star`} size={20} color={HOT} />,
          ])}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Aeonik", data: regular, style: "normal", weight: 400 },
        { name: "Aeonik", data: bold, style: "normal", weight: 700 },
        { name: "OffBit", data: offBit, style: "normal", weight: 700 },
      ],
    },
  );

  const jpeg = await sharp(Buffer.from(await card.arrayBuffer()))
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();

  /* Mantém os cabeçalhos de cache do ImageResponse; só o tipo muda. */
  const headers = new Headers(card.headers);
  headers.set("Content-Type", contentType);
  return new Response(new Uint8Array(jpeg), { headers });
}
