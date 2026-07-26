"use client";
import { useT } from "@/i18n/LanguageContext";
import { getProjectStory } from "@/content/projectStories";
import type { IndexItem } from "./EditorialIndex";

/** Lista única de projetos — usada pela landing e pela página /work. */
export function useProjects(): IndexItem[] {
  const { t, lang } = useT();
  const flat = (s: string) => s.replace(/\n/g, " ");
  const impact = (href: string) => getProjectStory(href, lang)?.shortImpact ?? "";

  return [
    {
      num: "01",
      title: "isadora ruppert press kit",
      tags: `${t("cat_freela")} / ${t("p01_tag1")} / ${t("p01_tag2")}`,
      href: "/work/isadora",
      impact: impact("/work/isadora"),
      ratio: 0.562,
      img: "/img/previews/isadora.webp",
    },
    {
      num: "02",
      title: flat(t("p02_title")),
      tags: `${t("cat_college")} / ${t("p02_tag1")} / ${t("p02_tag2")}`,
      href: "/work/magazine",
      impact: impact("/work/magazine"),
      ratio: 0.667,
      img: "/img/previews/magazine.webp",
    },
    {
      num: "03",
      title: "genlab",
      tags: `${t("cat_collab")} / ${t("p03_tag1")} / ${t("p03_tag2")}`,
      href: "/work/genlab",
      impact: impact("/work/genlab"),
      ratio: 0.498,
      img: "/img/previews/genlab.webp",
    },
    {
      num: "04",
      title: flat(t("p04_title")),
      tags: `${t("cat_client")} / ${t("p04_tag1")} / ${t("p04_tag2")}`,
      href: "/work/ebat",
      impact: impact("/work/ebat"),
      ratio: 0.562,
      img: "/img/previews/ebat.webp",
    },
    {
      num: "05",
      title: "apple academy: graduation",
      tags: `${t("cat_collab")} / ` + t("p05_tags").replace(", ", " / "),
      href: "/work/graduation",
      impact: impact("/work/graduation"),
      ratio: 0.494,
      img: "/img/graduation/animacao-poster.webp",
    },
    {
      num: "06",
      title: "devs no pilotis",
      tags: `${t("cat_collab")} / ` + t("p06_tags").replace(", ", " / "),
      href: "/work/pilotis",
      impact: impact("/work/pilotis"),
      ratio: 0.319,
      img: "/img/previews/pilotis.webp",
    },
    {
      num: "07",
      title: "china–rio: pontes para inovação",
      tags: `${t("cat_client")} / ` + t("p07_tags").replace(", ", " / "),
      href: "/work/chinario",
      impact: impact("/work/chinario"),
      ratio: 0.667,
      img: "/img/previews/chinario.webp",
    },
    {
      num: "08",
      title: "hologlam: fashion reloaded",
      tags: `${t("cat_college")} / ` + t("p08_tags").replace(", ", " / "),
      href: "/work/hologlam",
      impact: impact("/work/hologlam"),
      ratio: 0.562, // trio.webp 1600x900 (recorte dela, 2026-07-23)
      img: "/img/previews/hologlam.webp",
    },
    {
      num: "09",
      title: "vegcoz",
      tags: `${t("cat_college")} / ` + t("p09_tags").replace(", ", " / "),
      href: "/work/vegcoz",
      impact: impact("/work/vegcoz"),
      ratio: 0.708, // capa.png 1400x991 (recorte dela, 2026-07-23 — termina nas telas, sem o "Sobre o projeto" cortado)
      img: "/img/previews/vegcoz.webp",
    },
    {
      num: "10",
      title: "ondularis",
      tags: `${t("cat_collab")} / ${
        lang === "pt" ? "arte, ciência e tecnologia / exposição" : "art, science & technology / exhibition"
      }`,
      href: "/work/ondularis",
      impact: impact("/work/ondularis"),
      ratio: 1.25,
      img: "/img/previews/ondularis.webp",
    },
  ];
}
