import type { Metadata } from "next";
import { languageAlternates } from "@/content/caseMeta";
import { SITE_NAME, SITE_TAGLINE_EN } from "@/content/site";
import Home from "@/app/page";

/* Home em inglês: mesma página, idioma vindo da URL /en. */
export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} | Portfolio` },
  description: SITE_TAGLINE_EN,
  alternates: languageAlternates("/", "en"),
  openGraph: {
    url: "/en",
    locale: "en_US",
    title: `${SITE_NAME} — multidisciplinary designer`,
    description: SITE_TAGLINE_EN,
  },
  twitter: {
    title: `${SITE_NAME} — multidisciplinary designer`,
    description: SITE_TAGLINE_EN,
  },
};

export default Home;
