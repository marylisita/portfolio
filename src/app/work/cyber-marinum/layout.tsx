import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";

export const metadata: Metadata = caseMetadata("cyber-marinum");

export default function CyberMarinumLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
