import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";
import ChinarioPage from "@/app/work/chinario/page";

/* Versão em inglês do case: mesma página, idioma vindo da URL /en. */
export const metadata: Metadata = caseMetadata("chinario", "en");

export default ChinarioPage;
