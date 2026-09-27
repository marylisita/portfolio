import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";

export const metadata: Metadata = caseMetadata("pilotis");

export default function PilotisLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
