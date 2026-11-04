import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";
import IsadoraPage from "@/app/work/isadora/page";

/* Versão em inglês do case: mesma página, idioma vindo da URL /en. */
export const metadata: Metadata = caseMetadata("isadora", "en");

export default IsadoraPage;
