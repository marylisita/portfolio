import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";

export const metadata: Metadata = caseMetadata("vegcoz");

export default function VegcozLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
