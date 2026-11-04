import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";
import PilotisPage from "@/app/work/pilotis/page";

/* Versão em inglês do case: mesma página, idioma vindo da URL /en. */
export const metadata: Metadata = caseMetadata("pilotis", "en");

export default PilotisPage;
