import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";

export const metadata: Metadata = caseMetadata("hologlam");

export default function HologlamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
