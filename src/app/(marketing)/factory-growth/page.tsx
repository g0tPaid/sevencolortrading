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
  title: { absolute: growthSeo.titleOg },
  description: growthSeo.descriptionSocial,
  keywords: [...growthSeo.keywords],
  openGraph: {
    ...pages.factoryGrowth.openGraph,
    title: growthSeo.titleOg,
    description: growthSeo.descriptionSocial,
    locale: "zh_CN",
    alternateLocale: ["en_US"],
  },
  twitter: {
    ...pages.factoryGrowth.twitter,
    title: growthSeo.titleOg,
    description: growthSeo.descriptionSocial,
  },
  other: {
    "og:locale:alternate": "en_US",
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
