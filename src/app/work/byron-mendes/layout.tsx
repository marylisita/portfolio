import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";

export const metadata: Metadata = caseMetadata("byron-mendes");

export default function ByronMendesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
