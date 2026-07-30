import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cyber Marinum — arte interespécies | Maria Isabel Lisita",
  description:
    "Instalação interativa em que um aquário vivo, sensores e imagens generativas respondem à presença do público. Em exibição na Meta Gallery, Rio de Janeiro.",
  openGraph: {
    title: "Cyber Marinum — arte interespécies",
    description:
      "Um ecossistema vivo transforma presença em dados, imagem e luz.",
    images: [
      {
        url: "https://portfolio-nine-lime-73.vercel.app/img/cyber-marinum/11-aquario-magenta-hero.webp",
        width: 1254,
        height: 1254,
        alt: "Cyber Marinum: aquário plantado diante de uma imagem generativa magenta e verde",
      },
    ],
  },
};

export default function CyberMarinumLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
