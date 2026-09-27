import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";

export const metadata: Metadata = caseMetadata("ebat");

export default function EbatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
