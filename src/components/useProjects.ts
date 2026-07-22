"use client";
import { useT } from "@/i18n/LanguageContext";
import type { IndexItem } from "./EditorialIndex";

/** Lista única de projetos — usada pela landing e pela página /work. */
export function useProjects(): IndexItem[] {
  const { t } = useT();
  const flat = (s: string) => s.replace(/\n/g, " ");

  return [
    {
      num: "01",
      title: "isadora ruppert press kit",
      tags: `${t("cat_freela")} / ${t("p01_tag1")} / ${t("p01_tag2")}`,
      href: "/work/isadora",
      ratio: 0.562,
      img: "/img/ISADORA CAPA-THUMBNAIL.webp",
    },
    {
      num: "02",
      title: flat(t("p02_title")),
      tags: `${t("cat_college")} / ${t("p02_tag1")} / ${t("p02_tag2")}`,
      href: "/work/magazine",
      ratio: 0.667,
      img: "/img/helvetica/9.jpg",
    },
    {
      num: "03",
      title: "genlab",
      tags: `${t("cat_collab")} / ${t("p03_tag1")} / ${t("p03_tag2")}`,
      href: "/work/genlab",
      ratio: 0.498,
      img: "/img/genlab.png",
    },
    {
      num: "04",
      title: flat(t("p04_title")),
      tags: `${t("cat_client")} / ${t("p04_tag1")} / ${t("p04_tag2")}`,
      href: "/work/ebat",
      ratio: 0.562,
      img: "/img/ebat/capa-ebat.png",
    },
    {
      num: "05",
      title: "apple academy: graduation",
      tags: `${t("cat_collab")} / ` + t("p05_tags").replace(", ", " / "),
      href: "/work/graduation",
      ratio: 0.494,
      img: "/img/graduation/animacao.webp",
    },
    {
      num: "06",
      title: "devs no pilotis",
      tags: `${t("cat_collab")} / ` + t("p06_tags").replace(", ", " / "),
      href: "/work/pilotis",
      ratio: 0.319,
      img: "/img/pilotis/1.jpg",
    },
    {
      num: "07",
      title: "china–rio: pontes para inovação",
      tags: `${t("cat_client")} / ` + t("p07_tags").replace(", ", " / "),
      href: "/work/chinario",
      ratio: 0.667,
      img: "/img/chinario/1.jpg",
    },
    {
      num: "08",
      title: "hologlam: fashion reloaded",
      tags: `${t("cat_college")} / ` + t("p08_tags").replace(", ", " / "),
      href: "/work/hologlam",
      ratio: 0.424, // trio.webp 1710x725
      img: "/img/hologlam/trio.webp",
    },
    {
      num: "09",
      title: "vegcoz",
      tags: `${t("cat_college")} / ` + t("p09_tags").replace(", ", " / "),
      href: "/work/vegcoz",
      ratio: 0.8, // cropped capa.png ratio
      img: "/img/vegcoz/capa.png",
    },
  ];
}
