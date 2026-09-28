import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";

export const metadata: Metadata = caseMetadata("graduation");

export default function GraduationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
