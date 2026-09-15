import type { Metadata } from "next";
import { company } from "@/lib/content";
import {
  amazonFba,
  amazonFbaFaqs,
  amazonFbaSteps,
  chinaVisitFaqs,
  dropshipping,
  dropshippingBenefits,
  dropshippingFaqs,
  dropshippingSteps,
  fulfillment,
  fulfillmentFaqs,
  fulfillmentHubs,
  fulfillmentSteps,
  homepageAggregateFaqs,
  inspection,
  inspectionFaqs,
  inspectionServices,
} from "@/lib/v2-content";

export const siteUrl = "https://sourcing.center";

export const seoKeywords = [
  "China sourcing desk",
  "China sourcing agent",
  "source from China",
  "Visit China factories",
  "factory visit China",
  "schedule China sourcing trip",
  "3PL China",
  "3PL Xiamen",
  "3PL Dubai",
  "warehouse fulfillment China",
  "China sourcing",
  "product sourcing from China",
  "Seven Color Trading",
  "Sourcing Center",
  "own warehouse 3PL",
  "pick pack ship China",
  "GCC 3PL",
  "Al Ain warehouse",
  "dropshipping from China",
  "China warehouse dropship",
  "Xiamen dropshipping",
  "Dubai dropship warehouse",
  "DTC China fulfillment",
  "Amazon seller China warehouse",
  "China sourcing reviews",
  "Seven Color Trading reviews",
  "sourcing agent vs Alibaba",
  "China 3PL vs freight",
  "factory visit vs QC",
  "China inspection services",
  "pre-shipment inspection China",
  "DUPRO inspection China",
  "factory audit Xiamen",
  "loading supervision China",
  "Amazon FBA private label China",
  "Amazon FBA prep China",
  "private label Amazon FBA sourcing",
  "on the ground in China",
  "Chinese factory website",
  "factory international presence",
  "China sourcing news",
  "China manufacturing news for importers",
  "China supply chain news",
];

export const defaultDescription =
  "China sourcing desk with factories across China. Visit China, own 3PL from our Xiamen warehouse and Dubai hub. No MOQ, QC, inspection USD 110/day since 2014.";

export function absoluteUrl(path = "") {
  if (!path) return siteUrl;
  return path.startsWith("http") ? path : `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: company.name,
        legalName: company.legalNameFull,
        alternateName: [company.legalName, "Seven Color Trading", "sourcing.center"],
        url: siteUrl,
        foundingDate: company.founded,
        duns: company.credentials.dunsNumber,
        email: company.emails.corporate,
        telephone: company.phones,
        description: defaultDescription,
        brand: { "@type": "Brand", name: company.brand },
        address: company.offices.map((o) => ({
          "@type": "PostalAddress",
          streetAddress: o.address,
          addressLocality: o.city,
          addressCountry: o.country,
        })),
        department: [
          {
            "@type": "Warehouse",
            name: "Sourcing Center 3PL: China hub warehouse in Xiamen",
            address: {
              "@type": "PostalAddress",
              streetAddress: company.offices[1]?.address,
              addressLocality: "Xiamen",
              addressRegion: "Fujian",
              addressCountry: "CN",
            },
          },
          {
            "@type": "Warehouse",
            name: "Sourcing Center 3PL: Dubai / Al Ain warehouse",
            address: {
              "@type": "PostalAddress",
              streetAddress: company.offices[0]?.address,
              addressLocality: "Al Ain",
              addressRegion: "Abu Dhabi",
              addressCountry: "AE",
            },
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: company.name,
        description: defaultDescription,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "en",
      },
      {
        "@type": "Service",
        "@id": `${siteUrl}/3pl#service`,
        name: "China 3PL warehouse fulfillment (Xiamen and Dubai hubs)",
        serviceType: "Third-party logistics",
        url: `${siteUrl}/3pl`,
        description: fulfillment.description,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: ["CN", "AE", "US", "EU", "GCC"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "3PL operations",
          itemListElement: fulfillmentSteps.map((step, i) => ({
            "@type": "Offer",
            position: i + 1,
            itemOffered: {
              "@type": "Service",
              name: `3PL ${step.title}`,
              description: step.text,
            },
          })),
        },
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "08:30",
          closes: "19:00",
        },
      },
      {
        "@type": "Service",
        "@id": `${siteUrl}/dropshipping#service`,
        name: "Dropshipping from own warehouses in China and Dubai",
        serviceType: "Dropshipping fulfillment",
        url: `${siteUrl}/dropshipping`,
        description: dropshipping.description,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: ["CN", "AE", "US", "EU", "GCC"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Dropship operations",
          itemListElement: dropshippingSteps.map((step, i) => ({
            "@type": "Offer",
            position: i + 1,
            itemOffered: {
              "@type": "Service",
              name: step.title,
              description: step.text,
            },
          })),
        },
      },
      {
        "@type": "Service",
        "@id": `${siteUrl}/inspection#service`,
        name: "On-the-ground inspection services in China",
        serviceType: "Product inspection",
        url: `${siteUrl}/inspection`,
        description: inspection.description,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: ["CN"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Inspection operations",
          itemListElement: inspectionServices.map((step, i) => ({
            "@type": "Offer",
            position: i + 1,
            itemOffered: {
              "@type": "Service",
              name: step.title,
              description: step.text,
            },
          })),
        },
      },
    ],
  };
}

export function threePlFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: fulfillmentFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function threePlPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/3pl#webpage`,
    url: `${siteUrl}/3pl`,
    name: "China 3PL warehouses in Xiamen and Dubai | Sourcing Center",
    description: fulfillment.description,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/3pl#service` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "[data-seo-answer]"],
    },
    mainEntity: fulfillmentHubs.map((hub) => ({
      "@type": "Place",
      name: `${hub.city} ${hub.role}`,
      description: hub.text,
    })),
  };
}

export function dropshippingFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dropshippingFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function dropshippingPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/dropshipping#webpage`,
    url: `${siteUrl}/dropshipping`,
    name: "Dropshipping from China warehouses | Sourcing Center",
    description: dropshipping.description,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/dropshipping#service` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "[data-seo-answer]"],
    },
    mainEntity: dropshippingBenefits.map((hub) => ({
      "@type": "Place",
      name: `${hub.city} ${hub.role}`,
      description: hub.text,
    })),
  };
}

export function inspectionFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: inspectionFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function inspectionPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/inspection#webpage`,
    url: `${siteUrl}/inspection`,
    name: "Inspection services in China | Sourcing Center",
    description: inspection.description,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/inspection#service` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "[data-seo-answer]"],
    },
  };
}

export function amazonFbaFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: amazonFbaFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function amazonFbaPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/amazon-fba#webpage`,
    url: `${siteUrl}/amazon-fba`,
    name: "Amazon FBA private label from China | Sourcing Center",
    description: amazonFba.description,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/amazon-fba#service` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "[data-seo-answer]"],
    },
    mainEntity: amazonFbaSteps.map((step) => ({
      "@type": "Service",
      name: step.title,
      description: step.text,
    })),
  };
}

export function visitFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: chinaVisitFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function faqPageJsonLd(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function homepageAggregateFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homepageAggregateFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** WebPage + breadcrumb only. No AggregateRating until approved reviews exist. */
export function reviewsPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/reviews#webpage`,
    url: `${siteUrl}/reviews`,
    name: "Reviews | Sourcing Center",
    description:
      "Buyer notes about Seven Color Trading / sourcing.center, China factory sourcing, own 3PL, and Visit China factory visits.",
    isPartOf: { "@id": `${siteUrl}/#website` },
    breadcrumb: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Reviews", path: "/reviews" },
    ]),
  };
}

export function caseStudiesIndexJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/case-studies#webpage`,
    url: `${siteUrl}/case-studies`,
    name: "Case Studies | Sourcing Center",
    description:
      "Example sourcing programs from Seven Color Trading, factory matching across China, own 3PL, and Visit China QC trips.",
    isPartOf: { "@id": `${siteUrl}/#website` },
    breadcrumb: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Case studies", path: "/case-studies" },
    ]),
  };
}

export function caseStudyPageJsonLd(study: { slug: string; title: string; summary: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/case-studies/${study.slug}#webpage`,
    url: `${siteUrl}/case-studies/${study.slug}`,
    name: `${study.title} | Sourcing Center`,
    description: study.summary,
    isPartOf: { "@id": `${siteUrl}/#website` },
    breadcrumb: breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Case studies", path: "/case-studies" },
      { name: study.title, path: `/case-studies/${study.slug}` },
    ]),
  };
}

export function routeMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type,
      url,
      siteName: "Sourcing Center",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function comparePageFaqJsonLd(page: {
  slug: string;
  title: string;
  description: string;
  faqs: Array<{ q: string; a: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/compare/${page.slug}#webpage`,
        url: `${siteUrl}/compare/${page.slug}`,
        name: `${page.title} | Sourcing Center`,
        description: page.description,
        isPartOf: { "@id": `${siteUrl}/#website` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-seo-answer]"],
        },
        breadcrumb: breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: page.title, path: `/compare/${page.slug}` },
        ]),
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/compare/${page.slug}#faq`,
        mainEntity: page.faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };
}
