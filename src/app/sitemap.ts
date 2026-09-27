import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

/**
 * Lista completa das rotas de case. Não é derivada de `caseMeta` de propósito:
 * aquele módulo cobre só os cases cujo OG foi centralizado, enquanto
 * cyber-marinum, ondularis e touchdesigner-workshop têm metadata próprio.
 * O sitemap precisa das treze.
 */
const CASE_ROUTES = [
  "chinario",
  "cyber-marinum",
  "ebat",
  "genlab",
  "graduation",
  "hologlam",
  "isadora",
  "juizo",
  "magazine",
  "ondularis",
  "pilotis",
  "touchdesigner-workshop",
  "vegcoz",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/work`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/colofao`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    ...CASE_ROUTES.map((slug) => ({
      url: `${SITE_URL}/work/${slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
