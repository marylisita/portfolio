import type { Metadata } from "next";
import { Instrument_Serif, Space_Mono, Poppins } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import FloatingBackToTop from "@/components/FloatingBackToTop";

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
        <SmoothScroll>
          {children}
          <FloatingBackToTop />
        </SmoothScroll>
      </body>
    </html>
  );
}
