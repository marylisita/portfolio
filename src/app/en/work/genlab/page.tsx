import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";
import GenlabPage from "@/app/work/genlab/page";

/* Versão em inglês do case: mesma página, idioma vindo da URL /en. */
export const metadata: Metadata = caseMetadata("genlab", "en");

export default GenlabPage;
