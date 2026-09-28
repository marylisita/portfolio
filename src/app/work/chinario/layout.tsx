import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";

export const metadata: Metadata = caseMetadata("chinario");

export default function ChinarioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
