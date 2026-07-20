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
      tags: `${t("p01_tag1")} / ${t("p01_tag2")}`,
      href: "/work/isadora",
      img: "/img/ISADORA CAPA-THUMBNAIL.webp",
    },
    {
      num: "02",
      title: flat(t("p02_title")),
      tags: `${t("p02_tag1")} / ${t("p02_tag2")}`,
      href: "/work/magazine",
      img: "/img/helvetica/9.jpg",
    },
    {
      num: "03",
      title: "genlab",
      tags: `${t("p03_tag1")} / ${t("p03_tag2")}`,
      href: "/work/genlab",
      img: "/img/genlab.png",
    },
    {
      num: "04",
      title: flat(t("p04_title")),
      tags: `${t("p04_tag1")} / ${t("p04_tag2")}`,
      href: "/work/ebat",
      img: "/img/ebat/manual-capa.jpg",
    },
    {
      num: "05",
      title: "apple academy: graduation",
      tags: t("p05_tags").replace(", ", " / "),
      href: "/work/graduation",
      img: "/img/graduation/7.jpg",
    },
    {
      num: "06",
      title: "devs no pilotis",
      tags: t("p06_tags").replace(", ", " / "),
      href: "/work/pilotis",
      img: "/img/pilotis/1.jpg",
    },
    {
      num: "07",
      title: "china–rio: pontes para inovação",
      tags: t("p07_tags").replace(", ", " / "),
      href: "/work/chinario",
      img: "/img/chinario/1.jpg",
    },
  ];
}
