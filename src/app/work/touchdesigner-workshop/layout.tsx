import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";

export const metadata: Metadata = caseMetadata("touchdesigner-workshop");

export default function TouchDesignerWorkshopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
