/** Version 2 landing content — company facts always from src/lib/content.ts (v1) */

export const heroExamples = [
  "Portable blender",
  "Luxury packaging",
  "LED mirror",
  "Hotel furniture",
  "Wedding dress",
  "Pet accessories",
] as const;

/** Brand-new invention examples for the ideation search */
export const newIdeaExamples = [
  "A foldable travel steamer for silk",
  "Smart pet feeder with camera",
  "Refillable skincare pod system",
  "Modular hotel bedside light",
  "Child-safe magnetic building tiles",
] as const;

export const companyHighlights = [
  {
    label: "NO MOQ",
    detail: "Start from one unit",
  },
  {
    label: "Verified Factories",
    detail: "Audited suppliers only",
  },
  {
    label: "Photo & Video QC",
    detail: "Approve before it ships",
  },
] as const;

export const discoveryFilters = [
  "Trending Products",
  "Low Competition",
  "High Margin",
  "Fast Growing",
  "Private Label Ready",
  "OEM Ready",
] as const;

export const trendingProducts = [
  {
    name: "Portable Blender Bottle",
    tag: "Trending",
    growth: "+142%",
    moq: "50 pcs",
    price: "$3.80–$6.20",
    lead: "12–18 days",
    image: "/products/portable-blender-v2.jpg",
    tone: "from-[#1a1a1a] to-[#3a3a3a]",
  },
  {
    name: "Smart LED Vanity Mirror",
    tag: "High Margin",
    growth: "+98%",
    moq: "100 pcs",
    price: "$14–$22",
    lead: "18–25 days",
    image: "/products/led-mirror-v2.jpg",
    tone: "from-[#111827] to-[#374151]",
  },
  {
    name: "Matte Luxury Gift Box",
    tag: "Private Label",
    growth: "+76%",
    moq: "200 pcs",
    price: "$1.10–$2.40",
    lead: "10–15 days",
    image: "/products/luxury-gift-box-v2.jpg",
    tone: "from-[#3f0d12] to-[#7f1d1d]",
  },
  {
    name: "Hotel Lobby Lounge Chair",
    tag: "OEM Ready",
    growth: "+64%",
    moq: "20 pcs",
    price: "$85–$140",
    lead: "25–35 days",
    image: "/products/hotel-lounge-chair-v2.jpg",
    tone: "from-[#1c1917] to-[#44403c]",
  },
  {
    name: "Pet Travel Carrier",
    tag: "Fast Growing",
    growth: "+121%",
    moq: "100 pcs",
    price: "$9.50–$16",
    lead: "15–22 days",
    image: "/products/pet-carrier-v2.jpg",
    tone: "from-[#0c1a17] to-[#134e4a]",
  },
  {
    name: "Silk Blend Evening Dress",
    tag: "Low Competition",
    growth: "+55%",
    moq: "30 pcs",
    price: "$28–$48",
    lead: "20–30 days",
    image: "/products/evening-dress-v2.jpg",
    tone: "from-[#1e1033] to-[#4c1d95]",
  },
] as const;

/** Existing brand / catalog-style ideation demo */
export const ideationDemo = {
  input: "I want to start a skincare brand.",
  products: ["Vitamin C serum set", "Clay mask jars", "Travel mini kit"],
  costs: "$1.80–$4.60 / unit",
  regions: "Guangdong · Zhejiang",
  moq: "100–300 pcs",
  margins: "48–65% retail",
  shipping: "Air 5–8d · Sea 22–30d",
} as const;

/** Brand-new product invention demo — NDA first, then development */
export const newProductDemo = {
  input: "I invented a foldable travel steamer that fits in a laptop sleeve.",
  concept: "Compact dual-voltage garment steamer · silicone water tank · travel lock",
  protection: "NDA signed before we open the brief with any factory",
  development: "Materials · BOM · packaging · cost targets with buildable makers",
  sampling: "Prototype samples first — start from 1 unit, scale when ready",
  regions: "Shenzhen · Zhongshan (small appliances)",
  costs: "Tooling quote + $8–$14 / unit at 500 pcs",
  moq: "No MOQ for sampling · production when you are ready",
  shipping: "Sample air 4–7d · bulk sea 22–30d",
} as const;

export const ideaPathSteps = [
  {
    n: "01",
    title: "Share the idea (NDAs signed)",
    text: "A sketch, a sample photo, or just a sentence — protected under NDA before we open the brief.",
  },
  {
    n: "02",
    title: "Shape the design",
    text: "Materials, sizing, packaging, and cost targets — refined with factories that can actually build it.",
  },
  {
    n: "03",
    title: "Prototype & source",
    text: "Samples first. Verified makers. No MOQ games — start small, and scale when it is right.",
  },
  {
    n: "04",
    title: "Prove & ship",
    text: "Photo and video QC before anything leaves China. Then freight to your door.",
  },
] as const;

export const supplySteps = [
  "China Factory",
  "Warehouse",
  "Inspection",
  "Sea Freight",
  "USA",
  "Europe",
  "Middle East",
] as const;

export const whyPoints = [
  { title: "One dashboard", text: "Ideas, factories, QC, and freight in one place with your team." },
  { title: "Thousands of factories", text: "Mapped capacity across electronics, home, fashion, and industrial." },
  { title: "Verified suppliers", text: "License checks, audits, and production proof before you commit." },
  { title: "Factory audits", text: "On-ground teams in China validating what catalogs claim." },
  { title: "Inspection", text: "Photo & video QC — approve before anything ships." },
  { title: "Logistics", text: "Sea, air, and express with Dubai hub support." },
  { title: "Private label", text: "Packaging, branding, and white-label programs that scale." },
  { title: "OEM / ODM", text: "From concept and tooling to mass production — including brand-new inventions." },
  { title: "Product development", text: "Turn a sketch or new idea into a manufacturable SKU under NDA." },
] as const;

export const workflowSteps = [
  "Idea",
  "Research",
  "Factory Matching",
  "Quotation",
  "Sampling",
  "Production",
  "Inspection",
  "Shipping",
  "Delivered",
] as const;

export const dashboardModules = [
  "Orders",
  "Messages",
  "Invoices",
  "QC Reports",
  "Inspection Photos",
  "Shipment Tracking",
  "Factory Files",
  "Payments",
] as const;

export const platformStats = [
  { value: "10,000+", label: "Factories" },
  { value: "150+", label: "Industries" },
  { value: "40+", label: "Countries" },
  { value: "Millions", label: "Products" },
] as const;
