import type { Metadata } from "next";
import { languageAlternates } from "@/content/caseMeta";
import Colophon from "@/app/colofao/page";

export const metadata: Metadata = {
  title: "Colophon",
  alternates: languageAlternates("/colofao", "en"),
  openGraph: { url: "/en/colofao", locale: "en_US", title: "Colophon | Maria Isabel Lisita" },
};

export default Colophon;
