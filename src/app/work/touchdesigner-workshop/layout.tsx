import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oficina de TouchDesigner — vídeo mapping",
  description:
    "Oficina de quatro horas de introdução à programação visual e à arte generativa no TouchDesigner, realizada no LAID/UFRJ como pesquisa experimental de PIBIC e TCC.",
  openGraph: {
    title: "Oficina de TouchDesigner — vídeo mapping",
    description:
      "Programação criativa sem código escrito: 17 inscrições, 10 vagas e protótipos próprios no fim.",
    images: [
      {
        url: "/img/touchdesigner-workshop/cartaz-oficina-v2.webp",
        width: 675,
        height: 880,
        alt: "Cartaz da Oficina de Vídeo Mapping: introdução ao TouchDesigner",
      },
    ],
  },
};

export default function TouchDesignerWorkshopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
