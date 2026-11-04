import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";
import TouchdesignerWorkshopPage from "@/app/work/touchdesigner-workshop/page";

/* Versão em inglês do case: mesma página, idioma vindo da URL /en. */
export const metadata: Metadata = caseMetadata("touchdesigner-workshop", "en");

export default TouchdesignerWorkshopPage;
