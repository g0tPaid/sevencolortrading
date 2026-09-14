/** Factory-facing international presence services. English default; Chinese for factory owners. */

import { siteUrl } from "@/lib/seo";

export type GrowthLang = "en" | "zh";

export type Bilingual = { en: string; zh: string };

export const GROWTH_PATH = "/factory-growth";

/** Exact published prices — never present as monthly. */
export const GROWTH_PRICES = {
  websiteCny: 3888,
  growthCny: 4888,
  marketingFromCny: 2888,
  upgradeDeltaCny: 1000,
} as const;

export function formatCny(amount: number): string {
  return `¥${amount.toLocaleString("en-US")}`;
}

export const PRICE_WEBSITE = formatCny(GROWTH_PRICES.websiteCny);
export const PRICE_GROWTH = formatCny(GROWTH_PRICES.growthCny);
export const PRICE_MARKETING = formatCny(GROWTH_PRICES.marketingFromCny);
export const PRICE_UPGRADE = formatCny(GROWTH_PRICES.upgradeDeltaCny);

export const PACKAGE_IDS = ["website", "growth", "marketing", "unsure"] as const;
export type PackageId = (typeof PACKAGE_IDS)[number];

export function isPackageId(value: unknown): value is PackageId {
  return typeof value === "string" && (PACKAGE_IDS as readonly string[]).includes(value);
}

export const packageLabels: Record<PackageId, Bilingual> = {
  website: {
    en: `International Factory Website — ${PRICE_WEBSITE}`,
    zh: `国际工厂官网基础版 — ${PRICE_WEBSITE}`,
  },
  growth: {
    en: `International Buyer Growth — ${PRICE_GROWTH}`,
    zh: `国际买家增长版 — ${PRICE_GROWTH}`,
  },
  marketing: {
    en: `International Marketplace & Marketing Management — from ${PRICE_MARKETING} / 3 months`,
    zh: `海外电商平台与国际营销管理 — 3个月起价 ${PRICE_MARKETING}`,
  },
  unsure: {
    en: "Not sure yet — please advise",
    zh: "暂不确定，希望沟通建议",
  },
};

export function pick(copy: Bilingual, lang: GrowthLang): string {
  return copy[lang];
}

export const growthCopy = {
  kicker: {
    en: "Factory international presence · sourcing.center",
    zh: "工厂国际化形象服务 · sourcing.center",
  },
  h1: {
    en: "Build Your Factory's International Presence",
    zh: "打造您的工厂国际化品牌与线上形象",
  },
  subhead: {
    en: "Helping Chinese factories build a professional international presence — so overseas buyers can take you seriously before they ever visit the line.",
    zh: "帮助中国工厂建立专业的国际形象，让海外买家在实地看厂之前，就能认真看待您的实力与产品。",
  },
  concept: {
    en: "Factory → international presence → international buyers.",
    zh: "工厂 → 国际化形象 → 国际买家。",
  },
  support: {
    en: "Xiamen desk replies in English and 中文. This is an inquiry — not a checkout. Vendor registration stays free and separate.",
    zh: "厦门团队提供中英文沟通。本页是咨询，不是在线付款。工厂供应商登记仍然免费，与是否购买服务无关。",
  },
  ctaStart: { en: "Get Started", zh: "立即开始" },
  ctaCompare: { en: "Compare Packages", zh: "查看套餐" },
  langEn: "EN",
  langZh: "中文",
  langAria: {
    en: "Page language",
    zh: "页面语言",
  },

  problemKicker: { en: "The gap", zh: "现实差距" },
  problemTitle: {
    en: "Your factory may be better than your website makes it look.",
    zh: "您的工厂实力，可能远比现有网站看起来更强。",
  },
  problemBody: {
    en: "International buyers decide in minutes whether a factory looks export-ready. A Chinese-only site, missing specs, or a thin Alibaba storefront often under-sells a capable plant.",
    zh: "国际买家往往几分钟内就会判断一家工厂是否具备出口合作的专业度。只有中文网站、资料不全，或过于单薄的平台店铺，很容易让真正有实力的工厂被低估。",
  },

  checklistKicker: { en: "Buyer lens", zh: "买家视角" },
  checklistTitle: {
    en: "What international buyers need to see",
    zh: "国际买家真正想看到什么",
  },
  checklistLead: {
    en: "A professional presence does not invent claims. It presents your real factory, products, and process in the language and structure buyers already use.",
    zh: "专业的国际形象不是编造亮点，而是把工厂、产品和流程，用买家习惯的语言与结构如实呈现。",
  },

  overviewKicker: { en: "Services", zh: "服务概览" },
  overviewTitle: {
    en: "Three ways to show up internationally",
    zh: "三种面向国际市场的呈现方式",
  },

  packagesKicker: { en: "Packages", zh: "服务套餐" },
  websiteName: { en: "International Factory Website", zh: "国际工厂官网基础版" },
  websiteCta: { en: "Build My Factory Website", zh: "打造我的工厂官网" },
  growthName: { en: "International Buyer Growth", zh: "国际买家增长版" },
  growthBadge: { en: "Best value", zh: "超值推荐" },
  growthCta: { en: "Build My International Presence", zh: "打造我的国际形象" },
  includesWebsite: {
    en: `Includes everything in International Factory Website (${PRICE_WEBSITE})`,
    zh: `包含「国际工厂官网基础版」（${PRICE_WEBSITE}）全部内容`,
  },

  compareKicker: { en: "Compare", zh: "套餐对比" },
  compareTitle: { en: "Website or Growth — side by side", zh: "基础版与增长版对比" },

  upgradeKicker: { en: "Why Growth", zh: "为何升级" },
  upgradeTitle: {
    en: `Why upgrade to Growth? Extra ${PRICE_UPGRADE} of buyer-facing work.`,
    zh: `为何升级到增长版？多 ${PRICE_UPGRADE}，多一层面向国际买家的准备。`,
  },
  upgradeBody: {
    en: `The difference is ${PRICE_UPGRADE} — not a new website from scratch. Growth adds listing-starter work and a stronger buyer path on top of the same professional factory site.`,
    zh: `差价是 ${PRICE_UPGRADE}，不是重新做一套网站。增长版是在同一套专业工厂官网之上，补上listing起步与更完整的买家路径。`,
  },

  marketKicker: { en: "Amazon US + eBay", zh: "Amazon 美国站 + eBay" },
  marketTitle: {
    en: "Marketplace readiness — without affiliation claims",
    zh: "平台准备，但不声称官方合作",
  },
  marketBody: {
    en: "We help you prepare materials and listings from your real product data. sourcing.center is not affiliated with Amazon or eBay, is not an official partner, and does not manage seller passwords.",
    zh: "我们根据您提供的真实产品资料，协助准备平台资料与listing。sourcing.center 不是亚马逊或 eBay 的关联公司或官方合作伙伴，也不会要求或管理卖家账号密码。",
  },
  marketDisclaimer: {
    en: "Marketplace account approval, ranking, advertising performance, and sales are not guaranteed. Amazon, eBay, and the buyer decide those outcomes. We never fabricate specifications.",
    zh: "我们不保证亚马逊或 eBay 店铺/账号审核通过，也不保证排名、广告效果、订单或销售额。平台规则、账号资质与最终成交由平台及买家决定。我们绝不编造产品参数。",
  },
  marketWebsiteNote: {
    en: `Marketplace readiness kit is included in International Factory Website (${PRICE_WEBSITE}).`,
    zh: `平台准备资料包包含在国际工厂官网基础版（${PRICE_WEBSITE}）中。`,
  },
  marketGrowthNote: {
    en: `Listing Starter — up to 5 listings from your real product data — is included in International Buyer Growth (${PRICE_GROWTH}).`,
    zh: `Listing起步（最多5个listing，全部基于您提供的真实产品资料）包含在国际买家增长版（${PRICE_GROWTH}）中。`,
  },

  workflowKicker: { en: "Listing path", zh: "上架路径" },
  workflowTitle: {
    en: "From factory product to international customer",
    zh: "从工厂产品到国际客户",
  },
  workflowNote: {
    en: "Specs, photos, and claims come from you. We structure and present them — we do not invent them.",
    zh: "规格、图片与表述均来自工厂提供的资料。我们负责整理与呈现，绝不编造。",
  },

  marketingKicker: { en: "3-month service", zh: "三个月服务" },
  marketingName: {
    en: "International Marketplace & Marketing Management",
    zh: "海外电商平台与国际营销管理",
  },
  marketingPrice: {
    en: `From ${PRICE_MARKETING} / 3 months`,
    zh: `3个月起价 ${PRICE_MARKETING}`,
  },
  marketingBody: {
    en: "A scoped three-month engagement to keep marketplace materials and light international marketing in motion. Quoted from your catalogue, channels, and capacity — not a fixed monthly plan and not auto-renewed.",
    zh: "按您的产品、渠道与产能确定范围的三个月服务，用于维护平台资料并配合轻度国际营销。按项目报价，不是按月套餐，也不会自动续费。",
  },
  marketingDisclaimer: {
    en: "Scope is customized after we see your products and current marketplace status. Price shown is a starting point for three months, not a monthly rate. Results (traffic, orders, ranking) are not promised.",
    zh: "具体范围需在了解产品与现有平台情况后确定。所示价格为三个月服务起价，不是月费。不承诺流量、订单或排名结果。",
  },
  marketingCta: { en: "Discuss a 3-month scope", zh: "咨询三个月服务范围" },

  timelineKicker: { en: "Three months", zh: "三个月节奏" },
  timelineTitle: {
    en: "A working rhythm — not a results guarantee",
    zh: "工作节奏说明，而非结果承诺",
  },

  whyKicker: { en: "Why this desk", zh: "为何选择我们" },
  whyTitle: {
    en: "Why sourcing.center for this work",
    zh: "为什么由 sourcing.center 来做",
  },
  whyBody: {
    en: "We already sit between Chinese factories and international buyers — sourcing, QC, and 3PL from Xiamen and Dubai. This service uses that intersection. We are not a generic web-design agency, and we do not claim to be the largest or #1 anything.",
    zh: "我们本就处在中国工厂与国际买家之间：厦门与迪拜的采购、验货与仓储。这项服务正是用好这一交汇点。我们不是普通建站公司，也不自称第一、最大或行业第一。",
  },

  needKicker: { en: "Materials", zh: "所需资料" },
  needTitle: { en: "What we need from you", zh: "我们需要您提供什么" },
  needBody: {
    en: "The quality of the presence matches the quality of the source files. Send what you have; we will tell you what is still missing.",
    zh: "国际形象的质量，取决于您提供的原始资料。先把已有材料发来，我们会明确还缺什么。",
  },

  processKicker: { en: "Process", zh: "合作流程" },
  processTitle: { en: "How an engagement runs", zh: "服务如何推进" },
  processNote: {
    en: "Steps 01–05 apply to website and Growth packages. Step 06 applies when you add marketplace & marketing management.",
    zh: "01–05 适用于官网与增长套餐；06 仅在选择海外电商与国际营销管理时进行。",
  },

  crossKicker: { en: "Vendor desk", zh: "供应商登记" },
  crossTitle: {
    en: "Already a registered vendor? Take the next step.",
    zh: "已经完成供应商登记？可以走下一步。",
  },
  crossBody: {
    en: "Vendor registration is free and independent. You do not buy a package to become a vendor, and you do not need to be a vendor to inquire about international presence. Many factories do both: register to supply Sourcing Center buyers, then build a presence for the wider market.",
    zh: "供应商登记免费，且与本页服务相互独立。成为供应商不必购买套餐；咨询国际化服务也不必先成为供应商。不少工厂会两者都做：先登记对接 Sourcing Center 买家，再建立面向更广泛国际市场的形象。",
  },
  crossRegister: { en: "Register as a vendor (free)", zh: "免费登记成为供应商" },
  crossGrowth: { en: "Inquire about growth services", zh: "咨询国际化服务" },

  formKicker: { en: "Inquiry", zh: "咨询表单" },
  formTitle: { en: "Tell the Xiamen desk about your factory", zh: "向厦门团队介绍您的工厂" },
  formLead: {
    en: "Send an inquiry. We contact you — there is no online payment on this page.",
    zh: "提交咨询后由我们联系您。本页不支持在线付款。",
  },
  formSubmit: { en: "Send inquiry", zh: "提交咨询" },
  formSubmitting: { en: "Sending…", zh: "提交中…" },
  formSuccessTitle: { en: "Inquiry received", zh: "咨询已收到" },
  formSuccessBody: {
    en: "The Xiamen desk will review your note and contact you. This is not a purchase and not vendor approval.",
    zh: "厦门团队会查看您的资料并与您联系。这不是付款，也不等于供应商审核通过。",
  },

  faqKicker: { en: "FAQ", zh: "常见问题" },
  faqTitle: { en: "Straight answers", zh: "直接回答" },

  honestyKicker: { en: "Transparency", zh: "坦诚说明" },
  honestyTitle: { en: "What we don't promise — and what we focus on", zh: "我们不承诺什么，我们专注什么" },
  noPromiseTitle: { en: "What we don't promise", zh: "我们不承诺" },
  focusTitle: { en: "What we focus on", zh: "我们专注" },

  finalTitle: {
    en: "Ready to present your factory to international buyers?",
    zh: "准备好把工厂专业地呈现给国际买家了吗？",
  },
  finalBody: {
    en: "Start with an inquiry. Compare packages if you want a number. Register as a vendor if you also want to supply Sourcing Center buyers — that path stays free.",
    zh: "可以从咨询开始；需要比价就查看套餐。如果也希望对接 Sourcing Center 的买家，供应商登记仍然免费。",
  },
} as const;

export const problemCards: Array<{ title: Bilingual; text: Bilingual }> = [
  {
    title: { en: "English that sounds like a factory, not a brochure mill", zh: "像工厂、而不像模板站的英文表达" },
    text: {
      en: "Buyers skim About, capacity, and how to ask for a quote. Vague slogans waste the visit.",
      zh: "买家会先看工厂介绍、产能和如何询价。空洞口号等于浪费一次被认真对待的机会。",
    },
  },
  {
    title: { en: "Products with real photos and real specs", zh: "真实图片与真实参数的产品呈现" },
    text: {
      en: "They need SKU logic, materials, and what you actually make — not stock photos or invented numbers.",
      zh: "他们需要品类逻辑、材料和您真正在生产的产品，而不是图库照片或编造的数据。",
    },
  },
  {
    title: { en: "A path to talk to you", zh: "能够真正联系到您" },
    text: {
      en: "WhatsApp, email, and WeChat that a foreign buyer can use. A form that reaches a person in Xiamen or at the plant.",
      zh: "海外买家用得上的 WhatsApp、邮箱和微信，以及能到达厦门团队或工厂负责人的询盘入口。",
    },
  },
  {
    title: { en: "Export-ready signals, honestly stated", zh: "如实呈现的出口合作信号" },
    text: {
      en: "License, process, markets you already ship to — only what you can stand behind.",
      zh: "执照、工艺、已有出口市场——只写您能够负责的内容。",
    },
  },
];

export const buyerChecklist: Array<{ title: Bilingual; text: Bilingual }> = [
  {
    title: { en: "Who you are", zh: "工厂是谁" },
    text: { en: "Legal name, location, and a plain description of the plant.", zh: "企业名称、所在地，以及工厂的清楚介绍。" },
  },
  {
    title: { en: "What you make", zh: "生产什么" },
    text: { en: "Main products in English, grouped the way a buyer sources.", zh: "主营产品的英文呈现，按买家采购习惯分类。" },
  },
  {
    title: { en: "Real photographs", zh: "实拍照片" },
    text: { en: "Products and, where you allow, workshop shots — not borrowed images.", zh: "产品实拍；在您允许的前提下，可配车间照片。不使用盗用图片。" },
  },
  {
    title: { en: "Specifications you own", zh: "您自己的规格" },
    text: { en: "Materials, sizes, and options from your data. We do not fabricate specs.", zh: "材料、尺寸与选项均来自您的资料。我们不编造参数。" },
  },
  {
    title: { en: "MOQ and lead time", zh: "起订量与交期" },
    text: { en: "Even a range helps. Silence looks like a trading company hiding the factory.", zh: "哪怕是区间也好。完全不写，容易被看成贸易公司在隐瞒工厂。" },
  },
  {
    title: { en: "Capacity, plainly", zh: "产能说明" },
    text: { en: "Lines, shifts, or monthly output as you state it — no inflated figures.", zh: "产线、班次或月产量，按您提供的如实写，不夸大。" },
  },
  {
    title: { en: "Quality process", zh: "质量控制" },
    text: { en: "How you check work in process and finished goods, in buyer language.", zh: "用买家能懂的语言说明过程检与成品检怎么做。" },
  },
  {
    title: { en: "Credentials", zh: "资质文件" },
    text: { en: "Business license and certificates you actually hold.", zh: "营业执照及您真实持有的认证。" },
  },
  {
    title: { en: "How to inquire", zh: "如何询盘" },
    text: { en: "Email, WhatsApp, WeChat, and who answers.", zh: "邮箱、WhatsApp、微信，以及由谁回复。" },
  },
  {
    title: { en: "Shipping posture", zh: "出货方式" },
    text: { en: "Incoterms you work with, export experience, markets already served.", zh: "可接受的贸易术语、出口经验、已服务的市场。" },
  },
];

export const serviceOverview: Array<{ title: Bilingual; text: Bilingual; href: string }> = [
  {
    title: { en: "International Factory Website", zh: "国际工厂官网" },
    text: {
      en: "A professional English site that presents the plant to overseas buyers — not a generic agency template.",
      zh: "面向海外买家的专业英文工厂官网，而不是普通建站模板。",
    },
    href: "#package-website",
  },
  {
    title: { en: "International Buyer Growth", zh: "国际买家增长" },
    text: {
      en: "The website plus listing-starter work so buyers can find products where they already shop.",
      zh: "在官网基础上，加上listing起步，让买家在他们已经使用的平台上看到产品。",
    },
    href: "#package-growth",
  },
  {
    title: { en: "International Marketplace & Marketing Management", zh: "海外电商平台与国际营销管理" },
    text: {
      en: "A three-month scoped service to maintain listings and light international marketing. Customized; not auto-renewed.",
      zh: "为期三个月、范围定制的listing维护与轻度国际营销。按项目合作，不自动续费。",
    },
    href: "#package-marketing",
  },
];

export const websiteFeatures: Bilingual[] = [
  { en: "English factory website structured for international buyers", zh: "面向国际买家结构的英文工厂官网" },
  { en: "Home, factory profile, product pages, and contact / inquiry", zh: "首页、工厂介绍、产品页、联系与询盘" },
  { en: "Mobile-first layout in the sourcing.center visual language of clarity — on your domain", zh: "移动优先的清晰版式，使用您自己的域名" },
  { en: "Copy drafted from your materials — we do not invent specs, awards, or volumes", zh: "文案基于您提供的资料撰写，不编造参数、奖项或产量" },
  { en: "Product catalog from your photos and data (we will flag gaps instead of filling them with fiction)", zh: "产品目录来自您的照片与资料（缺什么会明确告知，而不是用虚构内容填补）" },
  { en: "WhatsApp, email, and WeChat contact paths", zh: "WhatsApp、邮箱与微信联系方式" },
  { en: "Marketplace readiness kit for Amazon US and eBay (account/listing prep materials — not approval)", zh: "Amazon 美国站与 eBay 的平台准备资料包（用于开店/上架准备，不代表审核通过）" },
  { en: "Basic international SEO for factory and product terms you actually use", zh: "针对您真实使用的工厂与产品词的基础国际SEO" },
  { en: "One guided revision round after first draft", zh: "初稿后包含一轮有指导的修改" },
  { en: "Launch support and a short handover for your team", zh: "上线支持，并向您的团队做简短交接" },
];

export const growthExtras: Bilingual[] = [
  { en: "Listing Starter: up to 5 Amazon US and/or eBay listings from your real product data", zh: "Listing起步：最多5个 Amazon 美国站和/或 eBay listing，全部基于您的真实产品资料" },
  { en: "Stronger product pages aimed at RFQ and repeat buyer questions", zh: "更完整的产品页，便于询盘与复购买家提问" },
  { en: "Inquiry routing notes so the right person at the factory answers", zh: "询盘路径说明，方便工厂内部由合适的人回复" },
  { en: "Certificate and capability layout when you provide the files", zh: "在您提供文件的前提下，做资质与能力展示结构" },
  { en: "A second revision round focused on buyer-facing clarity", zh: "第二轮修改，重点打磨对买家更清楚的表达" },
];

export const compareRows: Array<{
  feature: Bilingual;
  website: Bilingual;
  growth: Bilingual;
}> = [
  {
    feature: { en: "English international factory website", zh: "英文国际工厂官网" },
    website: { en: "Included", zh: "包含" },
    growth: { en: "Included", zh: "包含" },
  },
  {
    feature: { en: "Product pages from your specs and photos", zh: "基于您的参数与照片的产品页" },
    website: { en: "Included", zh: "包含" },
    growth: { en: "Included, with a stronger RFQ structure", zh: "包含，且询盘结构更完整" },
  },
  {
    feature: { en: "Marketplace readiness kit (Amazon US + eBay)", zh: "平台准备资料包（Amazon 美国站 + eBay）" },
    website: { en: "Included", zh: "包含" },
    growth: { en: "Included", zh: "包含" },
  },
  {
    feature: { en: "Listing Starter (up to 5 listings)", zh: "Listing起步（最多5个）" },
    website: { en: "Not included", zh: "不含" },
    growth: { en: "Included", zh: "包含" },
  },
  {
    feature: { en: "Revision rounds", zh: "修改轮次" },
    website: { en: "One", zh: "一轮" },
    growth: { en: "Two", zh: "两轮" },
  },
  {
    feature: { en: "3-month marketplace & marketing management", zh: "三个月海外平台与营销管理" },
    website: { en: "Optional add-on", zh: "可另选" },
    growth: { en: "Optional add-on", zh: "可另选" },
  },
  {
    feature: { en: "Investment", zh: "费用" },
    website: { en: PRICE_WEBSITE, zh: PRICE_WEBSITE },
    growth: { en: `${PRICE_GROWTH} · Best value`, zh: `${PRICE_GROWTH} · 超值推荐` },
  },
];

export const upgradePoints: Bilingual[] = [
  { en: "Up to five live listing drafts from the same product files used on the website", zh: "最多五个listing草稿，与官网使用同一套产品资料" },
  { en: "Buyer questions (MOQ, lead time, packing) surfaced instead of buried", zh: "把起订量、交期、包装等买家问题放在显眼位置，而不是藏起来" },
  { en: "A clearer handoff from website visit to a human conversation", zh: "从访问网站到真人沟通的路径更清楚" },
  { en: "One extra revision pass after you see how the listings read in English", zh: "您看过英文listing后再多一轮修改" },
];

export const workflowSteps: Array<{ kicker: Bilingual; title: Bilingual }> = [
  { kicker: { en: "01", zh: "01" }, title: { en: "Factory product", zh: "工厂产品" } },
  { kicker: { en: "02", zh: "02" }, title: { en: "Your specs & photos", zh: "您的参数与照片" } },
  { kicker: { en: "03", zh: "03" }, title: { en: "International presence", zh: "国际形象呈现" } },
  { kicker: { en: "04", zh: "04" }, title: { en: "International buyer", zh: "国际买家" } },
  { kicker: { en: "05", zh: "05" }, title: { en: "International customer", zh: "国际客户" } },
];

export const marketingPoints: Bilingual[] = [
  { en: "Listing maintenance from updates you send (new photos, discontinued SKUs, packing changes)", zh: "根据您提供的更新维护listing（新照片、停产型号、包装变化等）" },
  { en: "Light international marketing coordination — content and channel notes, not fake ad spend claims", zh: "轻度国际营销配合：内容与渠道建议，不虚构广告投放效果" },
  { en: "A single Xiamen contact for the three-month window", zh: "三个月内由厦门团队专人对接" },
  { en: "Written scope before work starts — customized, not a hidden monthly subscription", zh: "开工前书面确认范围：按项目定制，不是隐性包月" },
];

export const timelineMonths: Array<{ month: Bilingual; title: Bilingual; text: Bilingual }> = [
  {
    month: { en: "Month 1", zh: "第1个月" },
    title: { en: "Foundation", zh: "基础搭建" },
    text: {
      en: "Lock scope, gather files, clean product data you provide, and set listing or site structure. No traffic promise.",
      zh: "确定范围、收集资料、整理您提供的产品数据，并搭建listing或页面结构。不承诺流量。",
    },
  },
  {
    month: { en: "Month 2", zh: "第2个月" },
    title: { en: "Growth", zh: "推进成长" },
    text: {
      en: "Publish agreed pages/listings, adjust from your feedback, and keep marketplace materials consistent with the factory site.",
      zh: "按约定发布页面/listing，根据您的反馈调整，并保持平台资料与工厂官网一致。",
    },
  },
  {
    month: { en: "Month 3", zh: "第3个月" },
    title: { en: "Optimization", zh: "优化收束" },
    text: {
      en: "Refine wording and structure from what we learned. Optimization means clearer presentation — not guaranteed rank or sales.",
      zh: "根据前两月情况优化表达与结构。优化指更清楚的呈现，不保证排名或销售。",
    },
  },
];

export const whyCards: Array<{ title: Bilingual; text: Bilingual }> = [
  {
    title: { en: "We already know both sides", zh: "我们同时了解两边" },
    text: {
      en: "Factories in China, buyers overseas. The site is written for how importers actually shortlist.",
      zh: "一边是中国工厂，一边是海外买家。页面按进口商真正筛选供应商的方式来写。",
    },
  },
  {
    title: { en: "Xiamen desk, not a distant agency", zh: "厦门团队，不是远程空壳公司" },
    text: {
      en: "Seven Color Trading has been on the ground since 2014. Presence work is coordinated from the same city as sourcing.",
      zh: "Seven Color Trading 自2014年起扎根厦门。形象服务与采购业务由同一座城市的团队协调。",
    },
  },
  {
    title: { en: "No theatre", zh: "不做表面功夫" },
    text: {
      en: "No fake awards, no invented output, no “#1 factory in China.” If a claim cannot be sourced from you, it stays off the page.",
      zh: "没有虚假奖项、没有编造产量、没有“中国第一工厂”。无法从您资料中落实的表述，不会出现在页面上。",
    },
  },
];

export const materialsNeeded: Bilingual[] = [
  { en: "Company / factory legal name (Chinese and English if you have both)", zh: "公司/工厂法定名称（如有中英文请同时提供）" },
  { en: "Location (city, province) and a short plant introduction", zh: "所在地（城市、省份）及工厂简介" },
  { en: "Main products and the specifications you already use with buyers", zh: "主营产品及您已在与买家沟通中使用的规格" },
  { en: "Product photos you own (and workshop photos if you wish to show them)", zh: "您拥有使用权的产品照片（如需展示车间，可另附）" },
  { en: "MOQ, lead time, packing, and export markets — even if approximate", zh: "起订量、交期、包装与出口市场（大致范围亦可）" },
  { en: "Business license and certificates you want shown", zh: "希望展示的营业执照与认证" },
  { en: "Existing website, Alibaba page, or marketplace URLs", zh: "现有官网、阿里巴巴页面或平台链接" },
  { en: "Contacts that international buyers may use (email, phone, WeChat, WhatsApp)", zh: "国际买家可用的联系方式（邮箱、电话、微信、WhatsApp）" },
];

export const processSteps: Array<{ n: string; title: Bilingual; text: Bilingual }> = [
  {
    n: "01",
    title: { en: "Inquiry", zh: "咨询" },
    text: { en: "You send factory basics and the package you are considering. We reply from Xiamen.", zh: "您提交工厂基本情况与意向套餐，厦门团队回复。" },
  },
  {
    n: "02",
    title: { en: "Scope & materials", zh: "范围与资料" },
    text: { en: "We list what we can build from the files you have, and what still needs to come from the plant.", zh: "根据现有资料列出可完成的内容，以及工厂还需补充什么。" },
  },
  {
    n: "03",
    title: { en: "Build", zh: "制作" },
    text: { en: "Website and, for Growth, listing drafts — always from your specs and photos.", zh: "制作官网；增长版同时起草listing。始终基于您的参数与照片。" },
  },
  {
    n: "04",
    title: { en: "Review", zh: "确认" },
    text: { en: "You correct anything that is not how the factory works. We revise.", zh: "由您核对是否符合工厂实际情况，我们再修改。" },
  },
  {
    n: "05",
    title: { en: "Launch", zh: "上线" },
    text: { en: "Site goes live on your domain; listings submitted only with your marketplace access — never your password in our forms.", zh: "官网在您的域名上线；listing仅在您提供平台操作权限时提交——表单中绝不要求账号密码。" },
  },
  {
    n: "06",
    title: { en: "Manage (optional)", zh: "运营（可选）" },
    text: { en: "If you add the 3-month service: foundation, growth, optimization — scoped, not auto-renewed.", zh: "如加选三个月服务：基础、推进、优化——事先定范围，不自动续费。" },
  },
];

export const noPromises: Bilingual[] = [
  { en: "A guaranteed number of international buyers, inquiries, or orders", zh: "不保证国际买家数量、询盘量或订单量" },
  { en: "Amazon or eBay account approval, restoration, or “official partnership”", zh: "不保证亚马逊或 eBay 账号通过、找回，也不构成官方合作" },
  { en: "Search ranking, advertising ROAS, or a monthly sales target", zh: "不保证搜索排名、广告回报或月销售额" },
  { en: "That buying a package is required to register as a Sourcing Center vendor", zh: "绝不把购买套餐当作供应商登记的条件" },
  { en: "Specifications, certificates, or output figures we did not receive from you", zh: "不使用您未提供的规格、证书或产量数字" },
];

export const focusPoints: Bilingual[] = [
  { en: "A professional English presence that matches the factory you actually run", zh: "与工厂实际情况相符的专业英文形象" },
  { en: "Clear product and inquiry paths for overseas buyers", zh: "方便海外买家看懂产品并完成询盘的路径" },
  { en: "Marketplace materials and listings grounded in your data", zh: "基于您真实资料的平台材料与listing" },
  { en: "Honest positioning: factory → international presence → international buyers", zh: "清晰定位：工厂 → 国际化形象 → 国际买家" },
];

export const growthFaqs: Array<{ q: Bilingual; a: Bilingual }> = [
  {
    q: { en: "Do I have to buy a package to register as a vendor?", zh: "必须购买套餐才能登记成为供应商吗？" },
    a: {
      en: "No. Vendor registration at /factories/register is free and independent. Growth services are optional. We will never treat purchase as a condition of becoming a vendor.",
      zh: "不必。工厂供应商登记（/factories/register）免费且独立。国际化服务是可选项。我们绝不会把购买服务作为成为供应商的条件。",
    },
  },
  {
    q: { en: "Do you guarantee buyers?", zh: "能保证带来买家吗？" },
    a: {
      en: "No. We do not guarantee buyers, inquiries, or orders. A professional international presence makes it easier for serious buyers to understand and contact you. Whether they purchase is their decision — and marketplace platforms decide their own approval and ranking. Anyone who guarantees buyers is overselling.",
      zh: "不能。我们不保证买家、询盘或订单。专业的国际形象，是让认真的买家更容易理解并联系您。买不买由对方决定；平台审核与排名也由平台决定。任何保证“一定有买家”的说法都不可信。",
    },
  },
  {
    q: { en: "What is the difference between ¥3,888 and ¥4,888?", zh: "¥3,888 和 ¥4,888 有什么区别？" },
    a: {
      en: `International Factory Website (${PRICE_WEBSITE}) is the professional English factory site plus a marketplace readiness kit. International Buyer Growth (${PRICE_GROWTH}) includes all of that, plus Listing Starter (up to 5 listings) and a stronger buyer path — ${PRICE_UPGRADE} more, not a second website.`,
      zh: `国际工厂官网基础版（${PRICE_WEBSITE}）是专业英文工厂官网 + 平台准备资料包。国际买家增长版（${PRICE_GROWTH}）包含以上全部，并加上最多5个listing起步和更完整的买家路径——多 ${PRICE_UPGRADE}，不是再做一套网站。`,
    },
  },
  {
    q: { en: "Is the marketing service ¥2,888 per month?", zh: "营销服务是每月 ¥2,888 吗？" },
    a: {
      en: `No. International Marketplace & Marketing Management starts from ${PRICE_MARKETING} for three months, not per month. It is not ${PRICE_MARKETING}/month, and it is not an auto-renewing subscription. Scope is customized.`,
      zh: `不是。海外电商平台与国际营销管理为三个月起价 ${PRICE_MARKETING}，不是每月 ${PRICE_MARKETING}，也不会自动续费。范围按工厂情况定制。`,
    },
  },
  {
    q: { en: "Do you need our Amazon or eBay passwords?", zh: "需要提供亚马逊或 eBay 密码吗？" },
    a: {
      en: "No. Never send marketplace passwords through this site or this form. If listing work requires access, we will agree a safe method with you separately — not a password field on a public page.",
      zh: "不需要。请勿通过本网站或本表单发送任何平台密码。如listing工作需要操作权限，我们会另行约定安全方式，而不会在公开页面设置密码栏。",
    },
  },
  {
    q: { en: "Are you affiliated with Amazon or eBay?", zh: "你们是亚马逊或 eBay 的官方合作伙伴吗？" },
    a: {
      en: "No. sourcing.center / Seven Color Trading is not an Amazon or eBay affiliate, partner, or official agency. We prepare factory-side materials and listings from your data.",
      zh: "不是。sourcing.center / Seven Color Trading 不是亚马逊或 eBay 的关联机构、合作伙伴或官方代理。我们只根据您的资料做工厂侧的材料与listing准备。",
    },
  },
  {
    q: { en: "Will you invent product specifications?", zh: "会不会代写或编造产品参数？" },
    a: {
      en: "No. If a spec is missing, we ask you. Pages and listings stay empty or qualified rather than filled with guessed numbers.",
      zh: "不会。缺参数就向您确认。页面和listing宁可留空或注明待补，也不会用猜测的数字填满。",
    },
  },
  {
    q: { en: "We already have a Chinese website. Is this still useful?", zh: "我们已经有中文网站，还有必要做吗？" },
    a: {
      en: "Often yes. International buyers rarely treat a domestic Chinese site as export-ready. This work is an international layer — English structure, inquiry paths, and optional marketplace listings — not a duplicate of your domestic brochure.",
      zh: "通常有必要。国际买家很少把国内中文站当作可出口合作的依据。这项服务是国际化一层：英文结构、询盘路径，以及可选的平台listing，而不是把国内宣传册再复制一份。",
    },
  },
  {
    q: { en: "Can we use our existing domain?", zh: "可以用现有域名吗？" },
    a: {
      en: "Yes. We can launch on a domain you already own, or help you register one. Domain registrar fees, if any, are separate and quoted plainly.",
      zh: "可以。可使用您已有域名，也可协助新注册。如产生域名注册费用，会单独如实说明。",
    },
  },
  {
    q: { en: "How do we start?", zh: "如何开始？" },
    a: {
      en: "Submit the inquiry form on this page or WhatsApp the Xiamen desk. We review and contact you. There is no online checkout here.",
      zh: "在本页提交咨询表单，或通过 WhatsApp 联系厦门团队。我们评估后与您联系。本页没有在线结算。",
    },
  },
  {
    q: { en: "Is vendor registration related to this fee?", zh: "供应商登记和这项费用有关系吗？" },
    a: {
      en: "No. Registering to supply Sourcing Center buyers is a separate, free application reviewed for license, capacity, and fit. Growth services do not replace it and are not required for it.",
      zh: "没有关系。对接 Sourcing Center 买家的供应商登记是另一项免费申请，厦门团队按执照、产能与匹配度审核。国际化服务不能替代登记，也不是登记的前提。",
    },
  },
];

export const formFields = {
  company: { en: "Company / factory name", zh: "公司 / 工厂名称" },
  contact: { en: "Contact person", zh: "联系人" },
  phone: { en: "Phone", zh: "电话" },
  wechat: { en: "WeChat", zh: "微信" },
  whatsapp: { en: "WhatsApp", zh: "WhatsApp" },
  email: { en: "Email", zh: "邮箱" },
  location: { en: "Factory location", zh: "工厂所在地" },
  products: { en: "Main products", zh: "主营产品" },
  website: { en: "Existing website", zh: "现有网站" },
  package: { en: "Package interested in", zh: "意向套餐" },
  message: { en: "Message", zh: "补充说明" },
  locationPh: { en: "City, province — e.g. Xiamen, Fujian", zh: "城市、省份，如：厦门，福建" },
  productsPh: { en: "What you actually manufacture", zh: "请填写真实在产的产品" },
  websitePh: { en: "https:// or leave blank", zh: "https:// 或留空" },
  messagePh: { en: "Markets, timeline, or questions — optional", zh: "目标市场、时间或问题（选填）" },
  required: { en: "Please complete the required fields.", zh: "请填写必填项。" },
  invalidEmail: { en: "Please enter a valid email.", zh: "请输入有效邮箱。" },
  invalidPhone: { en: "Please enter a valid phone number.", zh: "请输入有效电话号码。" },
  network: { en: "Network error. Please try again.", zh: "网络错误，请重试。" },
  fail: { en: "Could not submit. Please try again.", zh: "提交失败，请重试。" },
} as const;

export const growthSeo = {
  title: "Factory International Presence for Chinese Plants",
  description:
    "Helping Chinese factories build a professional international presence: English website ¥3,888, buyer growth ¥4,888, marketplace management from ¥2,888/3 months. Vendor registration stays free.",
  descriptionZh:
    "帮助中国工厂打造专业国际形象：英文工厂官网 ¥3,888，国际买家增长版 ¥4,888，海外平台与营销管理三个月起价 ¥2,888。供应商登记仍免费、与是否购买无关。",
  keywords: [
    "Chinese factory website",
    "factory international presence",
    "international factory website China",
    "factory Amazon listing",
    "工厂国际化官网",
    "工厂出海官网",
  ],
} as const;

const orgId = `${siteUrl}/#organization`;
const pageUrl = `${siteUrl}${GROWTH_PATH}`;

export function factoryGrowthPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: growthSeo.title,
    description: growthSeo.description,
    inLanguage: ["en", "zh-CN"],
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${pageUrl}#service` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "[data-seo-answer]"],
    },
  };
}

export function factoryGrowthServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: "Factory international presence for Chinese factories",
    serviceType: "International factory website and marketplace presence",
    url: pageUrl,
    description: growthSeo.description,
    provider: { "@id": orgId },
    areaServed: ["CN"],
    audience: {
      "@type": "Audience",
      audienceType: "Chinese factories seeking an international buyer-facing presence",
    },
    offers: [
      {
        "@type": "Offer",
        "@id": `${pageUrl}#offer-website`,
        name: "International Factory Website",
        description:
          "Professional English factory website for international buyers, plus a marketplace readiness kit for Amazon US and eBay. Not marketplace approval.",
        price: String(GROWTH_PRICES.websiteCny),
        priceCurrency: "CNY",
        url: `${pageUrl}#package-website`,
        seller: { "@id": orgId },
      },
      {
        "@type": "Offer",
        "@id": `${pageUrl}#offer-growth`,
        name: "International Buyer Growth",
        description:
          "Includes the factory website plus Listing Starter (up to 5 listings from the factory’s real product data) and a stronger buyer inquiry path.",
        price: String(GROWTH_PRICES.growthCny),
        priceCurrency: "CNY",
        url: `${pageUrl}#package-growth`,
        seller: { "@id": orgId },
      },
      {
        "@type": "Offer",
        "@id": `${pageUrl}#offer-marketing`,
        name: "International Marketplace & Marketing Management",
        description:
          "Customized three-month marketplace and light international marketing management. Starting price for three months, not a monthly rate, not auto-renewed. Results not guaranteed.",
        url: `${pageUrl}#package-marketing`,
        seller: { "@id": orgId },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: String(GROWTH_PRICES.marketingFromCny),
          priceCurrency: "CNY",
          unitText: "3 months",
          name: `From ${PRICE_MARKETING} / 3 months`,
        },
      },
    ],
  };
}

export function factoryGrowthFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    url: pageUrl,
    name: "Factory international presence FAQ",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${pageUrl}#service` },
    mainEntity: growthFaqs.map((item) => ({
      "@type": "Question",
      name: item.q.en,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a.en,
      },
    })),
  };
}

export function factoryGrowthBreadcrumbJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Factories",
        item: `${siteUrl}/factories/register`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Factory international presence",
        item: pageUrl,
      },
    ],
  };
}
