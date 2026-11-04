import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";
import JuizoPage from "@/app/work/juizo/page";

/* Versão em inglês do case: mesma página, idioma vindo da URL /en. */
export const metadata: Metadata = caseMetadata("juizo", "en");

export default JuizoPage;
