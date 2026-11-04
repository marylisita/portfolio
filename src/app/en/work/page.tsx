import type { Metadata } from "next";
import { languageAlternates } from "@/content/caseMeta";
import Work from "@/app/work/page";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Visual identity, art direction, web, UX/UI, interactive art and research: every project by Maria Isabel Lisita.",
  alternates: languageAlternates("/work", "en"),
  openGraph: { url: "/en/work", locale: "en_US", title: "Work | Maria Isabel Lisita" },
};

export default Work;
