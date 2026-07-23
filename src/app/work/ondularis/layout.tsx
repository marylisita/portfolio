import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ondularis — Coletivo Endosymbiosis | Maria Isabel Lisita",
  description:
    "Exposição coletiva na intersecção entre arte, ciência e tecnologia. Um oceano artificial, instável e fabulado na Meta Gallery, Rio de Janeiro.",
  openGraph: {
    title: "Ondularis — Coletivo Endosymbiosis",
    description:
      "Esculturas tentaculares, resíduos industriais, atmosfera imersiva e projeções que reagem ao som.",
    images: [
      {
        url: "https://portfolio-nine-lime-73.vercel.app/img/ondularis/capa.webp",
        width: 1080,
        height: 1350,
        alt: "Cartaz da exposição Ondularis, do coletivo Endosymbiosis",
      },
    ],
  },
};

export default function OndularisLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
