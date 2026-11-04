import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";
import MagazinePage from "@/app/work/magazine/page";

/* Versão em inglês do case: mesma página, idioma vindo da URL /en. */
export const metadata: Metadata = caseMetadata("magazine", "en");

export default MagazinePage;
