import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";

export const metadata: Metadata = caseMetadata("genlab");

export default function GenlabLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
