import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oficina de TouchDesigner — vídeo mapping | Maria Isabel Lisita",
  description:
    "Oficina introdutória de programação visual, gráficos em tempo real e vídeo mapping com TouchDesigner, realizada no LAID/UFRJ.",
  openGraph: {
    title: "Oficina de TouchDesigner — vídeo mapping",
    description:
      "Um percurso de quatro horas: da lógica nodal aos primeiros patches funcionais.",
    images: [
      {
        url: "https://portfolio-nine-lime-73.vercel.app/img/touchdesigner-workshop/cartaz-oficina-v2.webp",
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
