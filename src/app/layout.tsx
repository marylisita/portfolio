import type { Metadata } from "next";
import { Instrument_Serif, Space_Mono, Poppins } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import FloatingBackToTop from "@/components/FloatingBackToTop";
import Cursor from "@/components/Cursor";
import { PageTransitionProvider } from "@/components/Curtains";
import { LanguageProvider } from "@/i18n/LanguageContext";

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-body",
});

const instrument = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-head",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
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
    <html lang="en" className={`${poppins.variable} ${instrument.variable} ${spaceMono.variable}`}>
      <head>
        <link rel="stylesheet" href="https://cdn.cursors-4u.net/cursors/animated/red-cat-a526d80e-32.css" />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          <SmoothScroll>
            {/* Cursor fica FORA do PageTransitionProvider de propósito: o wrapper de
                transição aplica transform durante a saída, o que quebraria o
                position:fixed do canvas. Aqui ele também não some no fade da troca de página. */}
            <Cursor />
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

