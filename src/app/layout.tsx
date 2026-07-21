import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
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

const itcGaramond = localFont({
  src: [
    { path: "./fonts/ITCGaramondStd-BkCond.ttf", weight: "400", style: "normal" },
    { path: "./fonts/ITCGaramondStd-BkCondIta.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-head",
  display: "swap",
  fallback: ["Georgia", "serif"],
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
  src: "./fonts/OffBit-DotBold.ttf",
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
    <html lang="en" className={`${aeonik.variable} ${itcGaramond.variable} ${spaceMono.variable} ${seratonin.variable} ${braille.variable} ${offBit.variable}`}>
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
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.78' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E\")",
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

