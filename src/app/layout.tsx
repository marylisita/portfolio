import type { Metadata } from "next";
import { Space_Mono, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import FloatingBackToTop from "@/components/FloatingBackToTop";
import Cursor from "@/components/Cursor";
import { PageTransitionProvider } from "@/components/Curtains";
import { LanguageProvider } from "@/i18n/LanguageContext";

const aeonik = localFont({
  src: [
    { path: "./fonts/Aeonik-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Aeonik-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-head",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

/* Fontes dela (arquivos em src/app/fonts/) */
const seratonin = localFont({
  src: "./fonts/Seratonin.otf",
  variable: "--font-hand",
  display: "swap",
});

/* Só os 256 glifos do bloco braille (U+2800–U+28FF), tirados do DejaVu Sans:
   1,2 kB. NENHUMA outra fonte do site tem esses glifos — sem isso a arte dos
   ornamentos vira quadradinho de tofu fora do Windows. `display: block` porque
   um fallback aqui não degrada, destrói o desenho. */
const braille = localFont({
  src: "./fonts/BrailleMono.woff2",
  variable: "--font-braille",
  display: "block",
});

const offBit = localFont({
  src: "./fonts/OffBit-DotBold.woff2",
  weight: "700",
  style: "normal",
  variable: "--font-offbit",
  display: "swap",
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  title: "Mary Lisita | Portfolio",
  description: "Designer multidisciplinar. Projetos em Design Gráfico, Web Design, UX/UI e Programação Criativa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${aeonik.variable} ${instrumentSerif.variable} ${spaceMono.variable} ${seratonin.variable} ${braille.variable} ${offBit.variable}`}>
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="https://use.typekit.net/af/c7c109/0000000000000000774f2b0a/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="https://use.typekit.net/knv7rew.css" />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          <SmoothScroll>
            {/* Cursor fica FORA do PageTransitionProvider de propósito: o wrapper de
                transição aplica transform durante a saída, o que quebraria o
                position:fixed do canvas. Aqui ele também não some no fade da troca de página. */}
            <Cursor />
            <div
              aria-hidden="true"
              data-paper-grain="global"
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 950,
                pointerEvents: "none",
                backgroundImage: "url('/img/paper-noise.webp')",
                backgroundSize: "180px 180px",
                opacity: 0.065,
                mixBlendMode: "multiply",
              }}
            />
            <PageTransitionProvider>
              {children}
              <FloatingBackToTop />
            </PageTransitionProvider>
          </SmoothScroll>
        </LanguageProvider>
      </body>
    </html>
  );
}
