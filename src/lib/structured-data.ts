import { company } from "@/lib/content";
import { faqItems } from "@/lib/faq";
import { siteUrl } from "@/lib/seo";
import {
  amazonFba,
  chinaVisit,
  dropshipping,
  fulfillment,
  inspection,
  inspectionPrice,
} from "@/lib/v2-content";

export type JsonLdNode = Record<string, unknown>;

const orgId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;
const xiamenId = `${siteUrl}/#localbusiness-xiamen`;
const alAinId = `${siteUrl}/#localbusiness-al-ain`;

const xiamenOffice = company.offices[1];
const alAinOffice = company.offices[0];

export const serviceCopy = {
  sourcing: {
    path: "/contact",
    name: "China factory sourcing (no MOQ)",
    serviceType: "Product sourcing",
    description:
      "China factory sourcing with no required MOQ, start from 1 unit. Photo and video QC before goods ship. China desk of Xiamen Ajmal Seven Color Trading Co Ltd since 2014, with own warehouses: China hub in Xiamen and Dubai / Al Ain.",
  },
  "oem-odm": {
    path: "/oem-odm",
    name: "OEM/ODM and new product development (NDA-first)",
    serviceType: "OEM/ODM product development",
    description:
      "OEM/ODM and new product development under NDA first, from concept and tooling to mass production with IP-aware workflows. Brand-new inventions stay closed until the NDA is signed.",
  },
  "amazon-fba": {
    path: "/amazon-fba",
    name: "Amazon FBA private label from China",
    serviceType: "Amazon FBA private label",
    description: amazonFba.description,
  },
  inspection: {
    path: "/inspection",
    name: "On-the-ground inspection services in China",
    serviceType: "Product inspection",
    description: inspection.description,
  },
  "3pl": {
    path: "/3pl",
    name: "China 3PL warehouse fulfillment (Xiamen and Dubai hubs)",
    serviceType: "Third-party logistics",
    description: fulfillment.description,
  },
  dropshipping: {
    path: "/dropshipping",
    name: "Dropshipping from own warehouses in China and Dubai",
    serviceType: "Dropshipping fulfillment",
    description: dropshipping.description,
  },
  logistics: {
    path: "/logistics",
    name: "Sea, air, and express freight from China",
    serviceType: "Freight forwarding",
    description:
      "Sea, air, and express freight from China with Dubai hub support, after goods are received in our China hub in Xiamen or Dubai / Al Ain warehouses. Consolidate in China, stage through Dubai when needed, and deliver with tracking.",
  },
  visit: {
    path: "/visit",
    name: "Visit China: hosted factory visits based in Xiamen",
    serviceType: "Hosted factory visit",
    description: chinaVisit.description,
  },
} as const;

export type ServiceOfferId = keyof typeof serviceCopy;

function postalAddress(office: (typeof company.offices)[number], region: string, countryCode: string) {
  return {
    "@type": "PostalAddress",
    streetAddress: office.address,
    addressLocality: office.city,
    addressRegion: region,
    addressCountry: countryCode,
  };
}

function openingHours() {
  return {
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
  };
}

export function websiteNode(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: siteUrl,
    name: "Sourcing Center",
    alternateName: ["sourcing.center", "Seven Color Trading"],
    description: company.tagline,
    inLanguage: "en",
    publisher: { "@id": orgId },
  };
}

export function organizationNode(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": orgId,
    name: company.name,
    legalName: company.legalNameFull,
    alternateName: [company.legalName, "Seven Color Trading", "sourcing.center"],
    url: siteUrl,
    foundingDate: company.founded,
    duns: company.credentials.dunsNumber,
    email: [company.emails.sme, company.emails.corporate],
    telephone: ["+86 180 5926 2730", "+971 58 906 1969"],
    description:
      "China sourcing desk of Xiamen Ajmal Seven Color Trading Co Ltd. Source from factories across China. Own 3PL warehouses: China hub in Xiamen and Dubai / Al Ain.",
    brand: { "@type": "Brand", name: company.brand },
    identifier: [
      {
        "@type": "PropertyValue",
        name: "DUNS",
        value: company.credentials.dunsNumber,
      },
      {
        "@type": "PropertyValue",
        name: "China Business License",
        value: "91350200MAE8W9E67A",
      },
      {
        "@type": "PropertyValue",
        name: "UAE Trade License",
        value: "143609",
      },
    ],
    address: [
      postalAddress(xiamenOffice, "Fujian", "CN"),
      postalAddress(alAinOffice, "Abu Dhabi", "AE"),
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+86-180-5926-2730",
        contactType: "sales",
        areaServed: "CN",
        availableLanguage: ["English", "Chinese"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+971-58-906-1969",
        contactType: "sales",
        areaServed: "AE",
        availableLanguage: ["English"],
      },
    ],
    knowsAbout: [
      "China factory sourcing",
      "OEM/ODM",
      "Amazon FBA private label",
      "Product inspection",
      "Third-party logistics",
      "Dropshipping",
      "Freight forwarding",
      "Factory visits",
      "Visit China",
      "China sourcing news",
    ],
    areaServed: ["CN", "AE", "US", "EU", "GCC"],
    location: [{ "@id": xiamenId }, { "@id": alAinId }],
  };
}

export function xiamenLocalBusinessNode(): JsonLdNode {
  return {
    "@type": ["LocalBusiness", "Warehouse"],
    "@id": xiamenId,
    name: "Sourcing Center: China hub and warehouse in Xiamen",
    legalName: company.legalNameFull,
    url: siteUrl,
    parentOrganization: { "@id": orgId },
    telephone: "+86 180 5926 2730",
    email: company.emails.sme,
    foundingDate: company.founded,
    duns: company.credentials.dunsNumber,
    address: postalAddress(xiamenOffice, "Fujian", "CN"),
    openingHoursSpecification: openingHours(),
    description:
      "China hub and warehouse of Xiamen Ajmal Seven Color Trading Co Ltd, on-the-ground base for factory sourcing across China. Business license 91350200MAE8W9E67A. Huli Avenue, Huli District, Xiamen, Fujian, China.",
  };
}

export function alAinLocalBusinessNode(): JsonLdNode {
  return {
    "@type": ["LocalBusiness", "Warehouse"],
    "@id": alAinId,
    name: "Sourcing Center: Dubai / Al Ain warehouse",
    legalName: company.legalNameFull,
    url: siteUrl,
    parentOrganization: { "@id": orgId },
    telephone: "+971 58 906 1969",
    email: company.emails.sme,
    address: postalAddress(alAinOffice, "Abu Dhabi", "AE"),
    openingHoursSpecification: openingHours(),
    description:
      "UAE branch and warehouse of Xiamen Ajmal Seven Color Trading Co Ltd. Trade license 143609. Suite No 21, ESA Building, Near Nael Enclave, Al Ain, United Arab Emirates. GCC 3PL and dropship hub.",
  };
}

/** Site-wide graph injected on every page: WebSite, Organization, LocalBusiness × 2. No ratings. */
export function siteWideGraph(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": [
      websiteNode(),
      organizationNode(),
      xiamenLocalBusinessNode(),
      alAinLocalBusinessNode(),
    ],
  };
}

export function offerNode(id: ServiceOfferId): JsonLdNode {
  const service = serviceCopy[id];
  const url = `${siteUrl}${service.path}`;
  const offer: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "Offer",
    "@id": `${url}#offer`,
    url,
    name: service.name,
    description: service.description,
    seller: { "@id": orgId },
    itemOffered: {
      "@type": "Service",
      "@id": `${url}#service`,
      name: service.name,
      serviceType: service.serviceType,
      url,
      description: service.description,
      provider: { "@id": orgId },
      areaServed: id === "inspection" || id === "visit" ? ["CN"] : ["CN", "AE", "US", "EU", "GCC"],
    },
  };

  if (id === "inspection") {
    offer.price = "110";
    offer.priceCurrency = "USD";
    offer.unitText = "inspector day";
    offer.priceSpecification = {
      "@type": "UnitPriceSpecification",
      price: "110",
      priceCurrency: "USD",
      unitText: "inspector day",
      name: inspectionPrice.display,
    };
  }

  return offer;
}

export function faqGraph(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/faq#faq`,
    url: `${siteUrl}/faq`,
    name: "Sourcing Center FAQ",
    isPartOf: { "@id": websiteId },
    about: { "@id": orgId },
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function breadcrumbGraph(items: Array<{ name: string; path: string }>): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.path.startsWith("http") ? item.path : `${siteUrl}${item.path === "/" ? "" : item.path}`,
    })),
  };
}
