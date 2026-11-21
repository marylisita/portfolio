import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";
import MetaverseAgencyPage from "@/app/work/metaverse-agency/page";

/* Versão em inglês do case: mesma página, idioma vindo da URL /en. */
export const metadata: Metadata = caseMetadata("metaverse-agency", "en");

export default MetaverseAgencyPage;
