/** Site FAQ copy — visible on /faq and in FAQPage JSON-LD. Strings must stay in lockstep. */

export type FaqItem = { q: string; a: string };

export type FaqGroup = {
  id: string;
  title: string;
  items: FaqItem[];
};

export const faqGroups: FaqGroup[] = [
  {
    id: "general",
    title: "General",
    items: [
      {
        q: "What is Sourcing Center?",
        a: "Sourcing Center is the product ideation and China sourcing platform of Seven Color Trading Co Ltd (legal name: Xiamen Ajmal Seven Color Trading Co Ltd). The brand site is sourcing.center. The China desk sources verified factories across China, runs photo/video QC, inspects on the ground in China at USD 110 per inspector day, helps brands private-label for Amazon FBA, operates own 3PL warehouses (China hub in Xiamen and Dubai / Al Ain), dropships from those warehouses, books sea/air/express freight, and hosts Visit China factory visits based out of Xiamen. It is not a broker.",
      },
      {
        q: "Who is the legal entity behind sourcing.center?",
        a: "Xiamen Ajmal Seven Color Trading Co Ltd, also called Seven Color Trading Co Ltd. Brand: Sourcing Center. Founded 2014. Dun & Bradstreet DUNS 509419282. China business license 91350200MAE8W9E67A (Huli Avenue, Huli District, Xiamen, Fujian, China). UAE trade license 143609 (Suite No 21, ESA Building, Near Nael Enclave, Al Ain, UAE).",
      },
      {
        q: "Where are Sourcing Center offices and warehouses?",
        a: "China HQ and warehouse: Huli Avenue, Huli District, Xiamen City, Fujian, China. UAE branch and warehouse: Suite No 21, ESA Building, Near Nael Enclave, Al Ain, United Arab Emirates (Dubai / Al Ain hub). Both locations are operator-owned, not brokered 3PL slots.",
      },
      {
        q: "How long has Sourcing Center been operating?",
        a: "Since 2014. The China desk has been on the ground in Xiamen from that year; the UAE warehouse and office support GCC replenishment from Al Ain.",
      },
      {
        q: "What services does Sourcing Center provide?",
        a: "Eight services on one China desk: (1) China factory sourcing with no required MOQ, start from 1 unit; (2) OEM/ODM and new product development, NDA-first; (3) Amazon FBA private label — OEM, packaging, inspection, carton marks, and freight to Amazon or Xiamen/Dubai 3PL, not Amazon partnership or Seller Central management; (4) inspection at USD 110 per inspector day — factory audit, PSI, DUPRO, loading supervision, photo/video QC; (5) 3PL at our China hub in Xiamen and Dubai; (6) dropshipping from own warehouses; (7) sea, air, and express freight; (8) Visit China factory visits based out of Xiamen (3-day program). Canonical pages: https://sourcing.center/contact, /oem-odm, /amazon-fba, /inspection, /3pl, /dropshipping, /logistics, /visit.",
      },
    ],
  },
  {
    id: "sourcing",
    title: "Sourcing & Ordering",
    items: [
      {
        q: "Is there a minimum order quantity for China factory sourcing?",
        a: "No. Sourcing Center does not require a marketplace-style MOQ. Sampling and first buys can start from 1 unit; production scales when you are ready. Start an RFQ at https://sourcing.center/contact.",
      },
      {
        q: "How many factories and markets can you source from?",
        a: "The desk maps 10,000+ factories across 150+ industries and ships into 40+ countries. Categories include electronics, home and lifestyle, industrial, fashion, construction, and custom OEM/ODM. Factory matching is verified — not a public catalog dump.",
      },
      {
        q: "Do you develop new products (OEM/ODM)?",
        a: "Yes. OEM/ODM and new product development are NDA-first: the brief stays closed until the NDA is signed, then concept, tooling, sampling, and mass production with IP-aware workflows. Canonical page: https://sourcing.center/oem-odm.",
      },
      {
        q: "Can I start with a single sample unit?",
        a: "Yes. No-MOQ sourcing means samples can start from 1 unit. Approve photo/video QC (and inspection when you want a formal lot check) before volume. New inventions follow the same path after NDA.",
      },
      {
        q: "How do I submit a sourcing RFQ?",
        a: "Use the form on https://sourcing.center/contact, WhatsApp the desk, or email info@sevencolortrading.com. Include product specs, quantity, and target budget. A relationship manager replies within 24 hours from China or Dubai.",
      },
      {
        q: "Does Sourcing Center help with Amazon FBA private label?",
        a: "Yes. The China desk helps brands private-label products in China and prepare them for Amazon FBA: factory OEM, branding and packaging, inspection before ship, FBA-ready carton marks, and freight to Amazon or to our 3PL hubs in Xiamen and Dubai. Not an Amazon partner and not a Seller Central agency. Canonical page: https://sourcing.center/amazon-fba.",
      },
      {
        q: "Is Sourcing Center an Amazon partner or Seller Central agency?",
        a: "No. Sourcing Center does not claim Amazon partnership, does not manage Seller Central accounts, and is not an FBA substitute for marketplace fulfillment. The desk sources, private-labels, inspects, and ships from China — including inbound to Amazon or hold in operator-owned warehouses. Amazon fees, rankings, and account management are outside this service.",
      },
      {
        q: "Can you ship private-label goods to Amazon FBA or to your warehouses?",
        a: "Either path. Freight can go to Amazon inbound after QC and carton-mark prep, or goods can sit in the Xiamen or Dubai / Al Ain 3PL first. Same desk as OEM/ODM, inspection, and logistics. See https://sourcing.center/amazon-fba, https://sourcing.center/3pl, and https://sourcing.center/logistics.",
      },
    ],
  },
  {
    id: "qc",
    title: "Quality Control",
    items: [
      {
        q: "What inspection services do you offer in China?",
        a: "On-the-ground inspection from the China desk: factory audits, pre-shipment inspection (PSI), during production (DUPRO), loading supervision, and photo/video defect reports. Inspectors walk the factory or our Xiamen warehouse — not a remote-only desktop review. Canonical page: https://sourcing.center/inspection.",
      },
      {
        q: "How much does China inspection cost?",
        a: "USD 110 per inspector day for on-the-ground inspection in China. Message the desk with SKU, location, and spec to confirm how many days the job needs. We do not claim a third-party inspection accreditation on the site.",
      },
      {
        q: "What is the difference between a factory audit, DUPRO, and PSI?",
        a: "A factory audit walks license, line, and capacity before you deposit. DUPRO (during production) samples the run while it can still be corrected. PSI (pre-shipment) checks finished goods at the factory or the Xiamen warehouse before they ship. Loading supervision covers carton count, stuffing, seal, and dock photos.",
      },
      {
        q: "Is Sourcing Center inspection remote-only QC?",
        a: "No. Photo and video are how the desk reports to you. The inspection itself is on the factory floor or at the Xiamen warehouse. A hosted factory visit is a separate 3-day path when you want to walk the line yourself — see https://sourcing.center/visit and https://sourcing.center/compare/factory-visit-vs-remote-qc.",
      },
    ],
  },
  {
    id: "3pl",
    title: "3PL & Warehousing",
    items: [
      {
        q: "Does Sourcing Center offer 3PL in China?",
        a: "Yes. Seven Color Trading Co Ltd runs its own 3PL warehouse at our China hub in Xiamen, and a second warehouse in Dubai / Al Ain, UAE. Goods move from the factory floor into the warehouse for count, photo QC, storage, pick, pack, and export — not through a third-party marketplace or broker. Canonical page: https://sourcing.center/3pl.",
      },
      {
        q: "Where are Sourcing Center 3PL warehouses?",
        a: "Two own warehouses: our China hub in Xiamen, Fujian (HQ warehouse and on-the-ground base) and Dubai / Al Ain, United Arab Emirates (branch warehouse for GCC replenishment).",
      },
      {
        q: "Is Sourcing Center a 3PL broker or a warehouse operator?",
        a: "Operator. We run the warehouses. Receive, store, pick, pack, and ship are in-house and tied to the sourcing relationship manager — not a separate 3PL you have to onboard.",
      },
      {
        q: "What 3PL services are included with China sourcing?",
        a: "Inbound from factories, storage in Xiamen or Dubai, pick to your SKU list (one unit or a container program), packing and labeling, then sea, air, or express freight with tracking. Freight detail: https://sourcing.center/logistics.",
      },
    ],
  },
  {
    id: "dropshipping",
    title: "Dropshipping",
    items: [
      {
        q: "Can I dropship from Sourcing Center warehouses?",
        a: "Yes. Single-unit and small-batch pick, pack, and ship from stock held in our own Xiamen and Dubai / Al Ain warehouses for DTC, Amazon, and Shopify-style sellers — not a dropship broker. Canonical page: https://sourcing.center/dropshipping.",
      },
      {
        q: "Is this a dropship broker or marketplace?",
        a: "No. We operate the warehouses. Dropshipping here means receive, store, pick, pack, and ship from inventory held in our Xiamen or Dubai facilities, tied to the same sourcing relationship manager — not a catalog of random suppliers you never meet.",
      },
      {
        q: "How do I hand off customer orders for dropshipping?",
        a: "Through the desk — CSV, spreadsheet, or store order exports. A relationship manager runs pick lists against your held stock. We do not claim a live Shopify app or public API unless one is published on the site.",
      },
      {
        q: "Where is dropship stock held?",
        a: "In the same operator-owned warehouses used for 3PL: China hub in Xiamen and Dubai / Al Ain (UAE). Photo/video QC on inbound; branded or unbranded packing on the way out.",
      },
    ],
  },
  {
    id: "logistics",
    title: "Logistics",
    items: [
      {
        q: "What freight options does Sourcing Center offer?",
        a: "Sea, air, and express from China after goods are received in the Xiamen or Dubai warehouse. Sea for cost-efficient containers and LCL, air for launch windows, express for samples and small parcels. Canonical page: https://sourcing.center/logistics.",
      },
      {
        q: "How does the Dubai hub fit with China freight?",
        a: "Our China hub in Xiamen consolidates inbound from factories across China. Dubai / Al Ain stages GCC replenishment closer to market. You can ship from China HQ, from the UAE hub, or release stock to your own forwarder.",
      },
      {
        q: "Do you handle customs with freight?",
        a: "The logistics desk coordinates customs with the lane you buy — sea, air, or express — and shares tracking from China HQ and the Dubai hub on the same relationship manager. Ask for Incoterms on the RFQ; a field note is at https://sourcing.center/knowledge/incoterms-for-gcc.",
      },
    ],
  },
  {
    id: "getting-started",
    title: "Getting Started",
    items: [
      {
        q: "How do I start sourcing from China with Sourcing Center?",
        a: "Send an RFQ at https://sourcing.center/contact, WhatsApp +86 180 5926 2730 (China) or +971 58 906 1969 (UAE), or email info@sevencolortrading.com. Share the SKU or invention, quantity, and destination. A relationship manager replies within 24 hours.",
      },
      {
        q: "Can I visit factories in China?",
        a: "Yes. The China desk hosts Visit China factory visits from our Xiamen hub — airport pickup coordination, verified factories in your category across China, HQ warehouse and QC walk-through, interpreter, hotel and transfer coordination. Not a tourist tour. Schedule at https://sourcing.center/visit.",
      },
      {
        q: "What does the 3-day factory visit program include?",
        a: "Day 1 · HQ: land in Xiamen, meet the relationship manager, walk the warehouse, lock the itinerary. Day 2 · Factories: verified lines in your category — production, capacity, samples. Day 3 · QC and terms: inspection standard, photo/video pack, pricing, and the shipping lane you will buy. Durations can also be 5 days, 1 week, or custom.",
      },
      {
        q: "What are the desk hours and emails?",
        a: "Monday–Sunday, 8:30 AM–7:00 PM (GST / CST). Email info@sevencolortrading.com (SMEs) and info@sevencolor.online (corporate). Phones: +86 180 5926 2730 (China HQ / warehouse) and +971 58 906 1969 (UAE branch / warehouse).",
      },
    ],
  },
  {
    id: "pricing",
    title: "Pricing",
    items: [
      {
        q: "How much does on-the-ground inspection in China cost?",
        a: "USD 110 per inspector day. That is the published inspection rate on https://sourcing.center/inspection. Confirm day-count with SKU, factory or warehouse location, and spec.",
      },
      {
        q: "Do you publish a price list for sourcing, 3PL, or freight?",
        a: "No general catalog of sourcing, 3PL, dropshipping, Amazon FBA prep, visit, or freight rates is published. Those are quoted from the RFQ against SKU, volume, and lane. The one published service rate is inspection: USD 110 per inspector day.",
      },
      {
        q: "Does no-MOQ sourcing mean samples are free?",
        a: "No. No required MOQ means you can start from 1 unit at competitive wholesale terms — not that units are complimentary. Sample and production costs are quoted on the RFQ.",
      },
    ],
  },
  {
    id: "trust",
    title: "Trust & Verification",
    items: [
      {
        q: "How can I verify Sourcing Center?",
        a: "Legal name Xiamen Ajmal Seven Color Trading Co Ltd. Founded 2014. DUNS 509419282 (Dun & Bradstreet). China license 91350200MAE8W9E67A at Huli Avenue, Huli District, Xiamen, Fujian. UAE license 143609 at Suite No 21, ESA Building, Near Nael Enclave, Al Ain. About page: https://sourcing.center/about.",
      },
      {
        q: "Are you a registered vendor for major retailers?",
        a: "Registered vendor pathways for Walmart, Target, and Costco. The desk can talk through retailer-ready packaging and QC when that is the channel — it is not a claim that every SKU is already on those shelves.",
      },
      {
        q: "How do Chinese factories register as vendors?",
        a: "Apply at https://sourcing.center/factories/register (工厂入驻). Applications are reviewed for license, capacity, and buyer fit. It is not a public marketplace listing.",
      },
    ],
  },
];

export const faqItems: FaqItem[] = faqGroups.flatMap((group) => group.items);

export const serviceCommonQuestions: Record<
  "sourcing" | "oem-odm" | "amazon-fba" | "inspection" | "threePl" | "dropshipping" | "logistics" | "visit",
  FaqItem[]
> = {
  sourcing: [
    faqGroups[0].items[0],
    faqGroups[1].items[0],
    faqGroups[1].items[1],
    faqGroups[1].items[4],
    faqGroups[8].items[0],
  ],
  "oem-odm": [
    faqGroups[1].items[2],
    faqGroups[1].items[3],
    faqGroups[0].items[4],
    faqGroups[6].items[0],
  ],
  "amazon-fba": [
    faqGroups[1].items[2],
    faqGroups[2].items[0],
    faqGroups[2].items[1],
    faqGroups[3].items[0],
  ],
  inspection: [
    faqGroups[2].items[0],
    faqGroups[2].items[1],
    faqGroups[2].items[2],
    faqGroups[2].items[3],
  ],
  threePl: [
    faqGroups[3].items[0],
    faqGroups[3].items[1],
    faqGroups[3].items[2],
    faqGroups[3].items[3],
  ],
  dropshipping: [
    faqGroups[4].items[0],
    faqGroups[4].items[1],
    faqGroups[4].items[2],
    faqGroups[4].items[3],
  ],
  logistics: [
    faqGroups[5].items[0],
    faqGroups[5].items[1],
    faqGroups[5].items[2],
    faqGroups[3].items[1],
  ],
  visit: [
    faqGroups[6].items[1],
    faqGroups[6].items[2],
    faqGroups[2].items[3],
    faqGroups[6].items[0],
  ],
};
