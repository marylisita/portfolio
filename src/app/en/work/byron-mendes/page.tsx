import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";
import ByronMendesPage from "@/app/work/byron-mendes/page";

/* Versão em inglês do case: mesma página, idioma vindo da URL /en. */
export const metadata: Metadata = caseMetadata("byron-mendes", "en");

export default ByronMendesPage;
