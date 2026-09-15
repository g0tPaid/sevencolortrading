import type { Metadata } from "next";
import { Sourcing1688Page } from "@/components/1688-sourcing/1688-sourcing-page";
import { pages } from "@/lib/route-seo";

export const metadata: Metadata = pages.sourcing1688;

export default function Page() {
  return <Sourcing1688Page />;
}
