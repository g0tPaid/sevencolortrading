"use client";

import { FactoryGrowthProvider } from "./locale-context";
import { FactoryGrowthView } from "./factory-growth-view";
import type { PackageId } from "@/lib/factory-growth";

export function FactoryGrowthPage({ initialPackage }: { initialPackage?: PackageId }) {
  return (
    <FactoryGrowthProvider initialPackage={initialPackage}>
      <FactoryGrowthView />
    </FactoryGrowthProvider>
  );
}
