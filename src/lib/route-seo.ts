import { GROWTH_PATH, growthSeo } from "@/lib/factory-growth";
import { routeMetadata } from "@/lib/seo";

/** Buyer-intent titles (50–60 chars) and descriptions (140–160 chars). ASCII sourcing.center only. */
export const pages = {
  home: routeMetadata({
    title: "China Sourcing Agent: Visit China, Own 3PL, 1688 Buying",
    description:
      "China sourcing agent with factories, 1688 buying into our Xiamen warehouse, Visit China, own 3PL in Xiamen and Dubai. No MOQ. Inspection USD 110/day since 2014.",
    path: "/",
  }),
  contact: routeMetadata({
    title: "China Factory Sourcing: No MOQ and Photo/Video QC",
    description:
      "China factory sourcing with no MOQ, start from 1 unit. Photo/video QC. Legal entity Xiamen Ajmal Seven Color Trading Co Ltd since 2014. DUNS 509419282.",
    path: "/contact",
  }),
  oemOdm: routeMetadata({
    title: "China OEM/ODM and New Product Development (NDA-First)",
    description:
      "OEM/ODM and new product development under NDA first. Concept, tooling, sampling, and mass production from the China desk. Founded 2014. DUNS 509419282.",
    path: "/oem-odm",
  }),
  amazonFba: routeMetadata({
    title: "Amazon FBA Private Label from China | OEM and Prep",
    description:
      "Private-label in China for Amazon FBA with sourcing.center: OEM, branding, packaging, inspection, carton marks, and freight to Amazon or our China/UAE 3PL.",
    path: "/amazon-fba",
  }),
  inspection: routeMetadata({
    title: "China Inspection Service: USD 110/Day, PSI & DUPRO",
    description:
      "On-the-ground China inspection at USD 110 per inspector day: factory audit, PSI, DUPRO, loading supervision, photo/video QC. Not a remote-only review.",
    path: "/inspection",
  }),
  threePl: routeMetadata({
    title: "China 3PL: Own Warehouses in Xiamen and Dubai / Al Ain",
    description:
      "Own China 3PL from our Xiamen warehouse and Dubai / Al Ain hub, receive, store, pick, pack, and ship. Operator-owned, not a 3PL broker. Since 2014.",
    path: "/3pl",
  }),
  dropshipping: routeMetadata({
    title: "Dropshipping from China: Own Xiamen and Dubai Hubs",
    description:
      "Dropship single units from own warehouses: China hub in Xiamen and Dubai / Al Ain. Photo/video QC for DTC and marketplace sellers. Not a dropship broker.",
    path: "/dropshipping",
  }),
  logistics: routeMetadata({
    title: "Sea, Air, and Express Freight from China via Dubai",
    description:
      "Sea, air, and express freight from China after inbound to our Xiamen warehouse or Dubai / Al Ain hub. Customs on the same desk as sourcing and 3PL.",
    path: "/logistics",
  }),
  visit: routeMetadata({
    title: "Visit China Factories: Hosted Trip Based in Xiamen",
    description:
      "Visit China factories from our Xiamen hub: airport pickup, verified lines, warehouse and QC, interpreter. Not a tourist tour. On the ground since 2014.",
    path: "/visit",
  }),
  faq: routeMetadata({
    title: "China Sourcing FAQs: MOQ, QC, 3PL, and Inspection",
    description:
      "Answers on no-MOQ China sourcing, USD 110/day inspection, Amazon FBA private label, own China/UAE 3PL, dropshipping, freight, Visit China, DUNS 509419282.",
    path: "/faq",
  }),
  about: routeMetadata({
    title: "About Sourcing Center: China Sourcing Desk Since 2014",
    description:
      "Xiamen Ajmal Seven Color Trading Co Ltd has sourced from China since 2014. DUNS 509419282. China hub warehouse in Xiamen and Dubai / Al Ain. Licenses listed.",
    path: "/about",
  }),
  services: routeMetadata({
    title: "China Sourcing Services: QC, OEM, 3PL, Dropshipping",
    description:
      "Full China sourcing desk: USD 110/day inspection, OEM/ODM, Amazon FBA private label, Visit China, own 3PL from our Xiamen warehouse and Dubai, dropshipping.",
    path: "/services",
  }),
  knowledge: routeMetadata({
    title: "China Sourcing Knowledge Base: 3PL, QC, and Visits",
    description:
      "Field guides from Sourcing Center: how to source from China, inspection (PSI, DUPRO, AQL), own-warehouse 3PL, dropshipping, Visit China factory trips, RFQs.",
    path: "/knowledge",
  }),
  compare: routeMetadata({
    title: "Compare China Sourcing Agent, 3PL, and Factory Visits",
    description:
      "Sourcing agent vs Alibaba, China 3PL vs DIY freight, factory visit vs remote QC. Straight answers from the China desk, operating since 2014.",
    path: "/compare",
  }),
  howItWorks: routeMetadata({
    title: "How China Factory Sourcing Works: RFQ to Delivery",
    description:
      "Four-step China sourcing: share requirements, source verified factories, photo/video QC, then ship. No MOQ. Own 3PL from Xiamen warehouse and Dubai since 2014.",
    path: "/how-it-works",
  }),
  industries: routeMetadata({
    title: "China Sourcing for Retail, DTC, Fashion, and Industrial",
    description:
      "Playbooks for ecommerce, retail, hospitality, industrial, fashion, and construction buyers sourcing from China with QC and our Xiamen/Dubai warehouses.",
    path: "/industries",
  }),
  factoryVerification: routeMetadata({
    title: "China Factory Verification: License and Capacity Audits",
    description:
      "On-ground factory audits in China: license, production lines, capacity, and quality systems before you fund a PO. China desk operating since 2014.",
    path: "/factory-verification",
  }),
  privateLabel: routeMetadata({
    title: "Private Label Manufacturing in China with Photo QC",
    description:
      "Private label programs in China: packaging artwork, labels, carton marks, and photo/video QC before mass release. OEM path under NDA when needed.",
    path: "/private-label",
  }),
  reviews: routeMetadata({
    title: "References, Not Star Ratings",
    description:
      "Sourcing Center does not publish star ratings or anonymous quotes. Verify licenses on the about page, then WhatsApp the desk for a live reference.",
    path: "/reviews",
  }),
  caseStudies: routeMetadata({
    title: "China Sourcing Case Studies: Factory, 3PL, and Visits",
    description:
      "Example engagements: factory matching across China, own 3PL from our Xiamen warehouse and Dubai, Visit China QC trips. Conservative anonymized outcomes.",
    path: "/case-studies",
  }),
  updates: routeMetadata({
    title: "Sourcing Center Updates: Guides, Comparisons, Cases",
    description:
      "Dated notes from the Sourcing Center China desk into knowledge guides, comparison pages, and case studies on China sourcing, 3PL, and factory visits.",
    path: "/updates",
  }),
  news: routeMetadata({
    title: "China Sourcing News: Manufacturing, Tariffs, Logistics",
    description:
      "Bilingual China sourcing news for importers: factories, supply chain, tariffs, logistics, and policy. Cited briefs from the Xiamen desk. English and 中文.",
    path: "/news",
  }),
  factoriesRegister: routeMetadata({
    title: "China Factory Vendor Registration (工厂入驻) for Buyers",
    description:
      "Chinese factories apply to supply Sourcing Center buyers via Xiamen Ajmal Seven Color Trading Co Ltd. 工厂入驻: reviewed vendors, not a marketplace.",
    path: "/factories/register",
  }),
  factoryGrowth: routeMetadata({
    title: growthSeo.titleOg,
    description: growthSeo.descriptionSocial,
    path: GROWTH_PATH,
  }),
  sourcing1688: routeMetadata({
    title: "1688 Sourcing Agent: We Buy, QC in Xiamen, Export",
    description:
      "China desk pays 1688 in RMB, receives into our Xiamen warehouse, photo/video QC, then 3PL or freight. Not a 1688 app. Inspection USD 110/day.",
    path: "/1688-sourcing",
  }),
  sourcingForUae: routeMetadata({
    title: "China Sourcing for the UAE: Own Dubai / Al Ain Warehouse",
    description:
      "China factory desk plus operator-owned UAE warehouse in Al Ain. Inspect in China, stage GCC stock in Dubai / Al Ain. License 143609. Since 2014.",
    path: "/sourcing-for/uae",
  }),
  industriesEcommerceDtc: routeMetadata({
    title: "China Sourcing for DTC and Ecommerce Sellers",
    description:
      "No-MOQ sampling, photo/video QC, Amazon FBA private-label prep, and own-warehouse dropship from Xiamen and Dubai. One China desk, not a broker.",
    path: "/industries/ecommerce-dtc",
  }),
} as const;

export const knowledgeMeta: Record<string, { title: string; description: string }> = {
  "how-to-source-from-china": {
    title: "How to Source from China: Factory to Delivery Guide",
    description:
      "Define the product, find factories, sample, negotiate, inspect, ship, and receive. Marketplace vs desk. No MOQ. Own 3PL from our Xiamen warehouse and Dubai.",
  },
  "china-quality-inspection-guide": {
    title: "China Quality Inspection Guide: PSI, DUPRO, and AQL",
    description:
      "Factory audit, DUPRO, PSI, loading supervision, photo/video QC, and AQL. Remote vs on-the-ground. USD 110 per inspector day from the China desk.",
  },
  "3pl-warehouses-xiamen-dubai": {
    title: "3PL Warehouses in Xiamen and Dubai for China Importers",
    description:
      "Own 3PL from our China hub in Xiamen and Dubai / Al Ain, UAE. Receive, store, pick, pack, and ship on the same desk as factory sourcing. Not a 3PL broker.",
  },
  "china-sourcing-company-xiamen-dubai-3pl": {
    title: "China Sourcing Company with Own 3PL in China and UAE",
    description:
      "Sourcing Center by Xiamen Ajmal Seven Color Trading Co Ltd. Founded 2014. DUNS 509419282. China hub in Xiamen and Dubai warehouse. Sourcing plus 3PL desk.",
  },
  "dropshipping-from-china-own-warehouse": {
    title: "Dropshipping from China: Own Warehouse vs a Broker",
    description:
      "Dropship from stock in Sourcing Center warehouses (China hub in Xiamen and Dubai) after China sourcing and photo/video QC. Not a dropship broker marketplace.",
  },
  "factory-visit-xiamen-hosted-sourcing-trip": {
    title: "Visit China Factories: Hosted Trip from Xiamen Hub",
    description:
      "Visit China factory trips from our Xiamen hub: airport pickup, verified factories across China, warehouse, interpreter, and QC wrap. Not a tourist tour.",
  },
  "china-3pl-vs-broker-vs-fba": {
    title: "China 3PL vs Broker vs FBA: Which Fits an Importer?",
    description:
      "Compare operator-owned China 3PL (Xiamen warehouse + Dubai) with 3PL brokers and Amazon FBA. Sourcing Center runs warehouses on the same desk as sourcing.",
  },
  "how-to-write-an-rfq": {
    title: "How to Write RFQs That Chinese Factories Will Answer",
    description:
      "RFQ fields factories respond to: specs, quantity, target price, photos, Incoterms. No-MOQ sampling from 1 unit via the Sourcing Center China desk.",
  },
  "factory-audit-checklist": {
    title: "China Factory Audit Checklist for First-Time Importers",
    description:
      "License, lines, capacity, quality system, and payment safeguards before you deposit. Pair with on-the-ground inspection at USD 110 per inspector day.",
  },
  "incoterms-for-gcc": {
    title: "Incoterms That Matter for China → GCC Shipping Lanes",
    description:
      "Incoterms for China to GCC freight when stock can sit in Xiamen or Dubai / Al Ain. Sea, air, and express from the same desk as Sourcing Center 3PL.",
  },
  "how-to-choose-china-sourcing-agent": {
    title: "How to Choose a China Sourcing Agent (Verify the Desk)",
    description:
      "Legal name, licenses, DUNS, own warehouses vs broker, on-ground inspection, published vs quoted prices. No #1 claim. Checklist from Sourcing Center.",
  },
  "how-to-source-from-1688": {
    title: "How to Source from 1688 Without a Chinese Account",
    description:
      "1688 is a domestic catalog. Xiamen desk pays in RMB, receives into our warehouse, inspects, then exports. Not a 1688 app. Guide from Sourcing Center.",
  },
  "china-sourcing-agent-cost": {
    title: "China Sourcing Agent Cost: USD 110 Inspection, RFQ Quotes",
    description:
      "Published inspection rate: USD 110 per inspector day. Sourcing, 3PL, and freight are quoted from the RFQ. No invented commission percentage.",
  },
  "how-to-find-a-chinese-factory": {
    title: "How to Find a Chinese Factory You Can Actually Buy From",
    description:
      "Listings are a scan. License, factory vs trader, samples from 1 unit, and verification from the Xiamen desk of Sourcing Center.",
  },
  "factory-vs-trading-company": {
    title: "Factory vs Trading Company in China: What to Verify",
    description:
      "A trader is not automatically a red flag. A hidden trader is. License, line walk, and who issues the invoice. Field note from Sourcing Center.",
  },
  "landed-cost-from-china": {
    title: "Landed Cost from China: Checklist, Not a Duty Table",
    description:
      "Stack EXW, inland, USD 110/day inspection, freight, and your destination fees. Sourcing Center does not publish HS-code duty tables.",
  },
  "private-label-packaging": {
    title: "Private Label Packaging: Approve Before Production",
    description:
      "Artwork, labels, inserts, and carton marks to lock before a private-label run in China. Photo/video QC and optional PSI at USD 110 per inspector day.",
  },
};

export const compareMeta: Record<string, { title: string; description: string }> = {
  "sourcing-agent-vs-alibaba": {
    title: "Sourcing Agent vs Alibaba: When a China Desk Wins",
    description:
      "Alibaba is a catalog. Sourcing Center is an on-ground China desk: verified factories, no MOQ, photo/video QC, own 3PL from Xiamen and Dubai, visits since 2014.",
  },
  "china-3pl-vs-diy-freight": {
    title: "China 3PL vs DIY Freight: Warehouse or You Stitch It",
    description:
      "Own 3PL from our Xiamen warehouse and Dubai / Al Ain vs booking factory, warehouse, and forwarder yourself. Operator: Xiamen Ajmal Seven Color Trading Co Ltd.",
  },
  "factory-visit-vs-remote-qc": {
    title: "Visit China vs Remote QC: When to Walk the Factory Floor",
    description:
      "Hosted Visit China trip from Xiamen versus inspection at USD 110/day. Same China desk for both. Photo/video is the report, not a remote-only check.",
  },
  "sourcing-agent-vs-1688": {
    title: "Sourcing Agent vs 1688: When a China Desk Buys for You",
    description:
      "1688 is a domestic catalog. Sourcing Center pays in RMB, receives into our Xiamen warehouse, inspects, and exports from own 3PL in Xiamen and Dubai.",
  },
};
