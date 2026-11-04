import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";
import OndularisPage from "@/app/work/ondularis/page";

/* Versão em inglês do case: mesma página, idioma vindo da URL /en. */
export const metadata: Metadata = caseMetadata("ondularis", "en");

export default OndularisPage;
