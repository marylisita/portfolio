import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";
import EbatPage from "@/app/work/ebat/page";

/* Versão em inglês do case: mesma página, idioma vindo da URL /en. */
export const metadata: Metadata = caseMetadata("ebat", "en");

export default EbatPage;
