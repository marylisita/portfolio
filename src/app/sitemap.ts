import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { CASE_SLUGS } from "@/content/caseMeta";

/**
 * Cada página entra duas vezes, em português e na versão /en, e as duas se
 * apontam como alternativas de idioma. É assim que o Google entende que
 * /work/juizo e /en/work/juizo são a mesma página em línguas diferentes, em
 * vez de conteúdo duplicado.
 */
type Entry = MetadataRoute.Sitemap[number];

function pair(
  ptPath: string,
  changeFrequency: Entry["changeFrequency"],
  priority: number,
  lastModified: Date,
): Entry[] {
  const pt = `${SITE_URL}${ptPath === "/" ? "" : ptPath}`;
  const en = `${SITE_URL}/en${ptPath === "/" ? "" : ptPath}`;
  const alternates = { languages: { "pt-BR": pt, en } };
  return [
    { url: pt, lastModified, changeFrequency, priority, alternates },
    { url: en, lastModified, changeFrequency, priority: Math.max(priority - 0.1, 0.1), alternates },
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    ...pair("/", "monthly", 1, lastModified),
    ...pair("/work", "monthly", 0.9, lastModified),
    ...pair("/colofao", "yearly", 0.5, lastModified),
    ...CASE_SLUGS.flatMap((slug) => pair(`/work/${slug}`, "yearly", 0.7, lastModified)),
  ];
}
