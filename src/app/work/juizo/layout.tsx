import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";

export const metadata: Metadata = caseMetadata("juizo");

export default function JuizoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
