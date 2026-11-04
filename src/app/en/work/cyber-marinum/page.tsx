import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";
import CyberMarinumPage from "@/app/work/cyber-marinum/page";

/* Versão em inglês do case: mesma página, idioma vindo da URL /en. */
export const metadata: Metadata = caseMetadata("cyber-marinum", "en");

export default CyberMarinumPage;
