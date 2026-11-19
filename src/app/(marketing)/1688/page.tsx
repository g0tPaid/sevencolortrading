import type { Metadata } from "next";
import { Marketplace1688 } from "@/components/1688-sourcing/marketplace";
import { catalogEnabled } from "@/lib/catalog1688/provider";
import { routeMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = routeMetadata({
  title: "1688 Product Sourcing & Wholesale Quotes | Sourcing Center",
  description: "Find Chinese wholesale products by keyword, product link or photo. Request verified 1688 pricing, quality checks and shipping from our Xiamen sourcing desk.",
  path: "/1688",
});

export default function Page() {
  return <Marketplace1688 connected={catalogEnabled()} />;
}

