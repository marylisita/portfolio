import type { Metadata } from "next";
import { caseMetadata } from "@/content/caseMeta";

export const metadata: Metadata = caseMetadata("social-media");

export default function SocialMediaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
