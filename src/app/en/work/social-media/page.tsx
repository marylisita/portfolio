import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";
import SocialMediaPage from "@/app/work/social-media/page";

/* Versão em inglês do case: mesma página, idioma vindo da URL /en. */
export const metadata: Metadata = caseMetadata("social-media", "en");

export default SocialMediaPage;
