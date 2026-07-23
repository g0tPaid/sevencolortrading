/** Version 2 landing content — uses v1 company credentials elsewhere */

export const heroExamples = [
  "Portable blender",
  "Luxury packaging",
  "LED mirror",
  "Hotel furniture",
  "Wedding dress",
  "Pet accessories",
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
    tone: "from-[#1a1a1a] to-[#3a3a3a]",
  },
  {
    name: "Smart LED Vanity Mirror",
    tag: "High Margin",
    growth: "+98%",
    moq: "100 pcs",
    price: "$14–$22",
    lead: "18–25 days",
    tone: "from-[#111827] to-[#374151]",
  },
  {
    name: "Matte Luxury Gift Box",
    tag: "Private Label",
    growth: "+76%",
    moq: "200 pcs",
    price: "$1.10–$2.40",
    lead: "10–15 days",
    tone: "from-[#3f0d12] to-[#7f1d1d]",
  },
  {
    name: "Hotel Lobby Lounge Chair",
    tag: "OEM Ready",
    growth: "+64%",
    moq: "20 pcs",
    price: "$85–$140",
    lead: "25–35 days",
    tone: "from-[#1c1917] to-[#44403c]",
  },
  {
    name: "Pet Travel Carrier",
    tag: "Fast Growing",
    growth: "+121%",
    moq: "100 pcs",
    price: "$9.50–$16",
    lead: "15–22 days",
    tone: "from-[#0c1a17] to-[#134e4a]",
  },
  {
    name: "Silk Blend Evening Dress",
    tag: "Low Competition",
    growth: "+55%",
    moq: "30 pcs",
    price: "$28–$48",
    lead: "20–30 days",
    tone: "from-[#1e1033] to-[#4c1d95]",
  },
] as const;

export const ideationDemo = {
  input: "I want to start a skincare brand.",
  products: ["Vitamin C serum set", "Clay mask jars", "Travel mini kit"],
  costs: "$1.80–$4.60 / unit",
  regions: "Guangdong · Zhejiang",
  moq: "100–300 pcs",
  margins: "48–65% retail",
  shipping: "Air 5–8d · Sea 22–30d",
} as const;

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
  { title: "One dashboard", text: "Ideas, factories, QC, and freight in a single OS." },
  { title: "Thousands of factories", text: "Mapped capacity across electronics, home, fashion, and industrial." },
  { title: "Verified suppliers", text: "License checks, audits, and production proof before you commit." },
  { title: "Factory audits", text: "On-ground teams in China validating what catalogs claim." },
  { title: "Inspection", text: "Photo & video QC — approve before anything ships." },
  { title: "Logistics", text: "Sea, air, and express with Dubai hub support." },
  { title: "Private label", text: "Packaging, branding, and white-label programs that scale." },
  { title: "OEM / ODM", text: "From concept and tooling to mass production." },
  { title: "Product development", text: "Turn a sketch into a manufacturable SKU." },
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
