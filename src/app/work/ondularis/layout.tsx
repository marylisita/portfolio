import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";

export const metadata: Metadata = caseMetadata("ondularis");

export default function OndularisLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
