import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";

export const metadata: Metadata = caseMetadata("magazine");

export default function MagazineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
