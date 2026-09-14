import type { WhatsAppPreset } from "@/lib/whatsapp";

export type CompareFaq = { q: string; a: string };

export type CompareColumn = {
  name: string;
  tag: string;
  points: string[];
};

export type ComparePage = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  answer: string;
  left: CompareColumn;
  right: CompareColumn;
  verdict: string;
  faqs: CompareFaq[];
  related: Array<{ href: string; label: string }>;
  whatsappPreset: WhatsAppPreset;
};

export const comparePages: ComparePage[] = [
  {
    slug: "sourcing-agent-vs-alibaba",
    eyebrow: "Compare",
    title: "Sourcing agent vs Alibaba",
    description:
      "When a China sourcing desk with own warehouses beats browsing a marketplace — and when a catalog is enough.",
    answer:
      "Alibaba is a marketplace of listings. A sourcing agent (Sourcing Center / Seven Color Trading) is an on-ground desk: verified factories, photo/video QC, optional hosted visit, and own 3PL in Xiamen and Dubai. Use a marketplace to scan. Use a desk when you need a factory you can actually buy from, proof before a deposit, and stock that can sit in a warehouse you did not have to onboard separately.",
    left: {
      name: "Sourcing Center desk",
      tag: "On-ground agent",
      points: [
        "China relationship manager shortlists verified makers — not a public catalog dump.",
        "Photo/video QC before goods leave; hold the ship until you sign off.",
        "Own 3PL from our Xiamen warehouse and Dubai on the same desk as sourcing.",
        "Hosted factory visit when catalog photos are not enough.",
        "D&B registered China–UAE trade company, not a listing account.",
      ],
    },
    right: {
      name: "Alibaba / marketplace",
      tag: "Catalog",
      points: [
        "Fast way to see many SKUs and price bands.",
        "You still vet license, capacity, and quality yourself — or pay extra.",
        "MOQ theater and listing photos are common; factory identity can be a trading layer.",
        "Warehouse, QC, and freight are usually separate vendors to stitch.",
        "Fine for a scan or a known SKU with a supplier you already trust.",
      ],
    },
    verdict:
      "Scan the marketplace if you want a map of the category. Switch to a sourcing desk when you need a factory match, QC, and a warehouse in Xiamen or Dubai without assembling a broker stack.",
    faqs: [
      {
        q: "Is a sourcing agent the same as buying on Alibaba?",
        a: "No. Alibaba is a marketplace of supplier listings. Sourcing Center is Seven Color Trading Co Ltd — a China–UAE desk that shortlists verified factories, runs photo/video QC, and can hold stock in its own Xiamen and Dubai warehouses.",
      },
      {
        q: "When should I use a sourcing agent instead of Alibaba?",
        a: "When you need a first SKU path, samples without a 3,000-piece speech, proof before a deposit, a hosted factory visit, or 3PL next to the factory relationship. Use Alibaba to browse; use the desk to buy.",
      },
      {
        q: "Does Sourcing Center replace Alibaba search?",
        a: "You can still scan catalogs. The desk’s job is matching, verification, QC, and fulfillment — not hosting a public storefront of every factory in China.",
      },
      {
        q: "Is there a minimum order quantity?",
        a: "Sourcing Center does not require a marketplace-style MOQ. Sampling can start from one unit; production scales when you are ready.",
      },
    ],
    related: [
      { href: "/case-studies/china-factory-sourcing", label: "Factory sourcing example" },
      { href: "/knowledge/how-to-source-from-china", label: "How to source from China" },
      { href: "/reviews", label: "Buyer notes" },
    ],
    whatsappPreset: "compareAgent",
  },
  {
    slug: "china-3pl-vs-diy-freight",
    eyebrow: "Compare",
    title: "China 3PL vs DIY freight",
    description:
      "Operator-owned warehouses in Xiamen and Dubai versus booking the factory, a warehouse, and a forwarder yourself.",
    answer:
      "DIY freight means you (or a broker) stitch factory release, a third-party warehouse, and a forwarder. China 3PL at Sourcing Center is receive–store–pick–pack–ship in warehouses we operate in Xiamen and Dubai / Al Ain — on the same desk as sourcing and photo QC. Use DIY when you already run a freight team. Use own 3PL when inbound QC and GCC replenishment should not live in three inboxes.",
    left: {
      name: "Sourcing Center 3PL",
      tag: "Operator",
      points: [
        "Own warehouses at our China hub in Xiamen (HQ) and Dubai / Al Ain — not a brokered slot.",
        "Inbound from the factory floor is counted and photographed before it sits as stock.",
        "Pick, pack, and ship from either hub on one relationship manager.",
        "Sea, air, or express after the warehouse — same company as sourcing.",
        "Dropship single units from the same held stock when you need it.",
      ],
    },
    right: {
      name: "DIY freight",
      tag: "You assemble",
      points: [
        "You choose factory Incoterms, a warehouse vendor, and a forwarder.",
        "More control if you already have a logistics team and volume.",
        "Handoffs: factory → brokered 3PL → carrier → destination broker.",
        "QC photos and carton counts often live in a different inbox than freight.",
        "Makes sense for a mature importer with existing warehouse contracts.",
      ],
    },
    verdict:
      "Keep DIY if freight is already a core competency. Choose own China 3PL when you want factory inbound, photo QC, and a Dubai hub without onboarding a separate warehouse vendor.",
    faqs: [
      {
        q: "What is China 3PL at Sourcing Center?",
        a: "Seven Color Trading Co Ltd runs its own warehouses in Xiamen, China and Dubai / Al Ain, UAE. Goods move from the factory into those warehouses for count, photo QC, storage, pick, pack, and ship — not through a 3PL broker.",
      },
      {
        q: "Is DIY freight cheaper?",
        a: "It can be at high volume if you already have rates and staff. DIY is more expensive in time and error when you are still matching factories and need inbound QC. Ask the desk for a lane quote rather than assuming a broker is cheaper.",
      },
      {
        q: "Can I still book my own forwarder?",
        a: "Yes. Stock can sit in Xiamen or Dubai and release to your carrier, or the desk can book sea, air, or express. The warehouse operation does not lock you into one airline.",
      },
      {
        q: "How is this different from a 3PL broker?",
        a: "A broker introduces someone else’s warehouse. Sourcing Center operates the buildings and ties fulfillment to the same manager as factory sourcing. See also /knowledge/china-3pl-vs-broker-vs-fba.",
      },
    ],
    related: [
      { href: "/3pl", label: "3PL warehouses" },
      { href: "/case-studies/xiamen-dubai-3pl", label: "3PL example engagement" },
      { href: "/knowledge/china-3pl-vs-broker-vs-fba", label: "3PL vs broker vs FBA" },
    ],
    whatsappPreset: "compareFreight",
  },
  {
    slug: "factory-visit-vs-remote-qc",
    eyebrow: "Compare",
    title: "Factory visit vs remote QC only",
    description:
      "When a hosted Visit China trip is worth the flight, and when photo/video inspection from the desk is enough.",
    answer:
      "Remote QC (photo/video packs, hold-the-ship) is the default for replenishment and known makers. A hosted factory visit is for first commitments, new tooling, or when catalog photos cannot unlock a deposit. Sourcing Center runs both from the China desk — Visit China based out of Xiamen, same warehouses, same interpreter-ready floor visits, not a tourist tour.",
    left: {
      name: "Hosted factory visit",
      tag: "On the floor",
      points: [
        "Airport coordination, HQ warehouse walk-through, locked itinerary.",
        "Two verified factories in your category — line, capacity, samples on the table.",
        "Agree defect language and commercial terms in the same room.",
        "Interpreter, hotel, and transfers with the desk that later runs QC.",
        "Best before a first container, OEM tooling, or a supplier you have never walked.",
      ],
    },
    right: {
      name: "Remote QC only",
      tag: "Photo / video",
      points: [
        "Photo and video pack on inbound or pre-shipment — you approve before it moves.",
        "Carton issues flagged; desk can hold the ship until you sign off.",
        "No flight, faster for repeat POs with a locked spec.",
        "You do not walk capacity or in-process goods yourself.",
        "Enough when the factory is already verified and the SKU is stable.",
      ],
    },
    verdict:
      "Start remote if the SKU and factory are known. Book a visit when the deposit is large, the product is new, or you need to see capacity before you commit. Many buyers do one visit, then run remote QC on repeat lots.",
    faqs: [
      {
        q: "What is included in a Sourcing Center factory visit?",
        a: "A hosted working trip from the China desk, based out of Xiamen: airport coordination, HQ warehouse, verified factory appointments across China, interpreter, hotel and transfer coordination, then QC standard and commercial wrap. Not a tourist factory tour.",
      },
      {
        q: "Is remote QC enough for a first order?",
        a: "It can be for a small pilot with a verified maker and a clear spec. For a container, new tooling, or an unknown factory, a visit (or at least an on-ground audit) is the more conservative path.",
      },
      {
        q: "Can I do remote QC after a visit?",
        a: "Yes. The usual pattern is lock the standard on the floor, then photo/video QC on later lots from the same desk.",
      },
      {
        q: "How do I book either path?",
        a: "Visit: sourcing.center/visit or WhatsApp the China desk (+86 180 5926 2730). On-the-ground inspection (PSI / DUPRO / loading) starts at sourcing.center/inspection — the relationship manager attaches the evidence pack to the PO.",
      },
    ],
    related: [
      { href: "/visit", label: "Schedule a China visit" },
      { href: "/case-studies/factory-visit-qc", label: "Visit example engagement" },
      { href: "/inspection", label: "Inspection services" },
      { href: "/knowledge/china-quality-inspection-guide", label: "China inspection guide" },
    ],
    whatsappPreset: "compareVisit",
  },
];

export function getComparePage(slug: string) {
  return comparePages.find((page) => page.slug === slug);
}
