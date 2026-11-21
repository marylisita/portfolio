import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";
import MetagalleryPage from "@/app/work/metagallery/page";

/* Versão em inglês do case: mesma página, idioma vindo da URL /en. */
export const metadata: Metadata = caseMetadata("metagallery", "en");

export default MetagalleryPage;
