import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";

export const metadata: Metadata = caseMetadata("isadora");

export default function IsadoraLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
