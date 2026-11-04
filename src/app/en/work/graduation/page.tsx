import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";
import GraduationPage from "@/app/work/graduation/page";

/* Versão em inglês do case: mesma página, idioma vindo da URL /en. */
export const metadata: Metadata = caseMetadata("graduation", "en");

export default GraduationPage;
