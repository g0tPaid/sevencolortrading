import type { Metadata } from "next";
import { FactoryGrowthPage } from "@/components/factory-growth/factory-growth-page";
import { JsonLd } from "@/components/seo/json-ld";
import {
  factoryGrowthBreadcrumbJsonLd,
  factoryGrowthFaqJsonLd,
  factoryGrowthPageJsonLd,
  factoryGrowthServiceJsonLd,
  growthSeo,
} from "@/lib/factory-growth";
import { pages } from "@/lib/route-seo";

export const metadata: Metadata = {
  ...pages.factoryGrowth,
  keywords: [...growthSeo.keywords],
  openGraph: {
    ...pages.factoryGrowth.openGraph,
    locale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  other: {
    "og:locale:alternate": "zh_CN",
  },
  alternates: {
    ...pages.factoryGrowth.alternates,
    languages: {
      en: "https://sourcing.center/factory-growth",
      "zh-CN": "https://sourcing.center/factory-growth",
    },
  },
};

export default function FactoryGrowthRoute() {
  return (
    <>
      <JsonLd data={factoryGrowthPageJsonLd()} />
      <JsonLd data={factoryGrowthServiceJsonLd()} />
      <JsonLd data={factoryGrowthFaqJsonLd()} />
      <JsonLd data={factoryGrowthBreadcrumbJsonLd()} />
      <FactoryGrowthPage />
    </>
  );
}
