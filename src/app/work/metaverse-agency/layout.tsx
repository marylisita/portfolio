import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";

export const metadata: Metadata = caseMetadata("metaverse-agency");

export default function MetaverseAgencyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
