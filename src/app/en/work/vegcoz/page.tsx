import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";
import VegcozPage from "@/app/work/vegcoz/page";

/* Versão em inglês do case: mesma página, idioma vindo da URL /en. */
export const metadata: Metadata = caseMetadata("vegcoz", "en");

export default VegcozPage;
