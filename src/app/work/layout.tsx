import type { Metadata } from "next";
import { languageAlternates } from "@/content/caseMeta";
import { SITE_NAME } from "@/content/site";

/* Sem este layout, /work herdava a canônica "/" do layout raiz e o Google
   tratava a lista de trabalhos como cópia da home. Os cases sobrescrevem. */
export const metadata: Metadata = {
  /* O template precisa ser repetido aqui: um título simples neste layout
     cortaria o "| Maria Isabel Lisita" dos cases que ficam abaixo dele. */
  title: { absolute: `Trabalhos | ${SITE_NAME}`, template: `%s | ${SITE_NAME}` },
  description:
    "Identidade visual, direção de arte, web, UX/UI, arte interativa e pesquisa: todos os projetos de Maria Isabel Lisita.",
  alternates: languageAlternates("/work", "pt"),
  openGraph: { url: "/work", title: "Trabalhos | Maria Isabel Lisita" },
};

export default function WorkLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
