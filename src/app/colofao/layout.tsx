import type { Metadata } from "next";
import { languageAlternates } from "@/content/caseMeta";

export const metadata: Metadata = {
  title: "Colofão",
  alternates: languageAlternates("/colofao", "pt"),
  openGraph: { url: "/colofao", title: "Colofão | Maria Isabel Lisita" },
};

export default function ColofaoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
