/**
 * Daily China sourcing news: bilingual briefs for importers and procurement.
 * Pages read the merged store (volume JSON + this seed). Do not invent tariff or
 * policy facts here; the seed is a desk meta note, not a news story.
 */

import { company } from "@/lib/content";
import { absoluteUrl, siteUrl } from "@/lib/seo";
import type { JsonLdNode } from "@/lib/structured-data";

export type NewsLang = "en" | "zh";

export type NewsKind = "meta" | "brief";

export type NewsFaq = {
  qEn: string;
  aEn: string;
  qZh: string;
  aZh: string;
};

export type NewsPost = {
  slug: string;
  date: string;
  titleEn: string;
  titleZh: string;
  summaryEn: string;
  summaryZh: string;
  takeawayEn: string;
  takeawayZh: string;
  sourceName: string;
  sourceUrl: string;
  tags: string[];
  kind?: NewsKind;
  bodyEn?: string[];
  bodyZh?: string[];
  faqs?: NewsFaq[];
  updatedAt?: string;
};

export type NewsPublishInput = Omit<NewsPost, "updatedAt"> & {
  updatedAt?: string;
};

export const NEWS_PATH = "/news";
export const NEWS_STORE_FILE = "news-posts.json";

export const newsCopy = {
  langAria: { en: "News language", zh: "新闻语言" },
  langEn: "EN",
  langZh: "中文",
  kicker: { en: "China desk · sourcing news", zh: "中国采购台 · 采购新闻" },
  indexH1: {
    en: "Daily China sourcing news",
    zh: "每日中国采购新闻",
  },
  indexLead: {
    en: "Bilingual briefs from the Xiamen desk for importers and procurement: manufacturing, supply chain, tariffs, logistics, and factory or policy trends. We cite sources. We do not invent facts.",
    zh: "厦门采购台面向进口商与采购团队的中英双语简报：制造、供应链、关税、物流，以及工厂与政策动向。每篇标注来源，不编造事实。",
  },
  emptyEn:
    "No sourcing briefs are published yet. Desk notes (not a newsroom) stay on Updates. Check back here for cited China sourcing news.",
  emptyZh:
    "暂无采购简报。工作台短讯（不是新闻栏目）仍在 Updates。本页只发布有来源的中国采购新闻。",
  takeawayLabel: { en: "Importer takeaway", zh: "采购要点" },
  sourceLabel: { en: "Source", zh: "来源" },
  tagsLabel: { en: "Topics", zh: "标签" },
  relatedUpdates: {
    en: "Dated desk notes, not a news feed",
    zh: "工作台短讯，不是新闻流",
  },
  relatedUpdatesCta: { en: "Updates", zh: "Updates" },
  allNews: { en: "All news", zh: "全部新闻" },
  metaBadge: { en: "Desk note", zh: "栏目说明" },
  briefBadge: { en: "Brief", zh: "简报" },
  faqsHeading: { en: "About this news desk", zh: "关于本栏目" },
  ctaTitle: {
    en: "Need the factory-floor read on a story?",
    zh: "需要结合工厂一线解读这条新闻？",
  },
  ctaBody: {
    en: "The China desk can map a cited development to your SKU, QC, and lane, from Xiamen, with Dubai 3PL when the stock needs a hub.",
    zh: "厦门采购台可以把公开新闻对应到您的 SKU、质检与物流路径；需要中转时再用迪拜仓。",
  },
} as const;

export const newsIndexFaqs: NewsFaq[] = [
  {
    qEn: "Is this a general China news site?",
    aEn: "No. /news is a sourcing.center desk hub for importers and procurement: China sourcing, manufacturing, supply chain, tariffs, logistics, and factory or policy trends. It is not a general newsroom.",
    qZh: "这是综合中国新闻站吗？",
    aZh: "不是。/news 是 sourcing.center 面向进口商与采购的栏目：中国采购、制造、供应链、关税、物流，以及工厂与政策动向。不是综合新闻媒体。",
  },
  {
    qEn: "How is News different from Updates?",
    aEn: "Updates are short dated pointers into Knowledge, case studies, and comparison pages. News is the bilingual, source-cited hub for China sourcing developments. Both stay on the site; News is the SEO news hub.",
    qZh: "News 和 Updates 有什么不同？",
    aZh: "Updates 是指向知识库、案例与对比页的短讯。News 是有来源、中英双语的中国采购动态栏目。两页都保留；对外检索以 /news 为主。",
  },
  {
    qEn: "Do you invent tariff or policy facts?",
    aEn: "No. Briefs cite a public source URL. If the desk has not published a brief, the index stays empty-capable aside from this explainer note.",
    qZh: "会不会编造关税或政策事实？",
    aZh: "不会。简报必须带公开来源链接。若工作台尚未发布简报，除本说明帖外，列表可以为空。",
  },
];

/**
 * Seed holds the desk note plus fallback briefs when POST /api/news (volume) is
 * unavailable. Do not invent tariff or policy facts; cite a public source URL.
 */
export const seedNewsPosts: NewsPost[] = [
  {
    slug: "2026-09-18-maersk-suspends-tpx-transpacific-q4",
    date: "2026-09-18",
    kind: "brief",
    titleEn: "Maersk suspends TPX extra loader for the rest of Q4 after 29 Sep",
    titleZh: "马士基黄金周前停跨太加班航线TPX，9月29日后暂停至四季度末",
    summaryEn:
      "The Loadstar (17 Sep 2026) reports Maersk will suspend its standalone transpacific TPX extra-loader after the 4,200 teu Maersk Boston sails from Vung Tau on 29 Sep. TPX then stays down for the rest of Q4 2026. MSC separately said it will blank its Asia-US East Coast Emerald sailing in week 41 because of an expected Golden Week demand dip.",
    summaryZh:
      "The Loadstar（2026年9月17日）报道，马士基将在9月29日4200 TEU的Maersk Boston从头顿（Vung Tau）开出后，暂停独立跨太平洋加班航线TPX，并维持至2026年四季度结束。MSC另称，因预期黄金周前后需求回落，将抽掉第41周亚洲-美东Emerald航次。",
    takeawayEn:
      "Do not assume leftover TPX space after 29 Sep. Recheck westbound Gemini strings, and treat week 41 US East Coast bookings as at risk of a blank. Freight Right, cited in the same report, says stretch ocean lead time from about one week to two or three weeks while China holidays compress gate-in.",
    takeawayZh:
      "不要默认9月29日后还有TPX舱位。请核对西向Gemini航线，并把第41周美东订舱当作可能被抽班。同一报道援引货代Freight Right：中国长假压缩进港窗口，海运订舱最好从约一周提前到两到三周。",
    sourceName: "The Loadstar",
    sourceUrl: "https://theloadstar.com/maersk-cuts-transpacific-capacity-as-golden-week-slowdown-looms/",
    tags: ["logistics", "transpacific", "golden-week", "shipping"],
    bodyEn: [
      "The Loadstar (17 Sep 2026) says Maersk told customers the last TPX sailing this year is Maersk Boston (about 4,200 teu) from Vung Tau on 29 September. After that voyage, TPX remains suspended for the rest of Q4 2026. Maersk said any 2027 seasonal restart would be announced later.",
      "Xeneta's eeSea liner database, cited by The Loadstar, lists TPX as seven ships averaging about 4,400 teu on a Busan-Long Beach-Vung Tau rotation, originally expected to run into late November. Linerlytica figures in the same piece put Maersk's weekly transpacific offering at 32,200 teu; dropping TPX cuts that by more than 10%, leaving Gemini Cooperation services as the remaining Maersk capacity on the trade.",
      "MSC this week said it will blank the Asia-US East Coast Emerald sailing in week 41 because of the expected slowdown during and after Golden Week. US west coast forwarder Freight Right, also quoted, said China holidays are creating a last push before factory and logistics closures, with more blanks, rollovers, and shifting ETDs. It recommended booking two to three weeks out even if cargo is not yet ready.",
    ],
    bodyZh: [
      "The Loadstar（2026年9月17日）称，马士基通知客户：今年TPX最后一班是9月29日从头顿开出的约4200 TEU的Maersk Boston。此后该加班航线暂停至2026年四季度结束。马士基表示，2027年是否恢复季节性加班将另行通知。",
      "同一报道援引Xeneta的eeSea船期库：TPX配置7艘、平均约4400 TEU，挂港釜山-长滩-头顿，原计划跑到11月下旬。Linerlytica数据称马士基跨太周运力约32200 TEU，停TPX后下降逾10%，剩余运力主要在Gemini合作航线上。",
      "MSC本周表示，因黄金周期间及节后需求回落，将抽掉第41周亚洲-美东Emerald航次。美国西岸货代Freight Right称，工厂和物流即将停摆，出现最后一波出货，抽班、甩柜和ETD变动还会增加，即使货未备齐也建议提前两到三周锁舱。",
    ],
  },
  {
    slug: "2026-09-18-trump-xi-washington-summit-trade-agenda",
    date: "2026-09-18",
    kind: "brief",
    titleEn: "Trump-Xi 24 Sep Washington agenda: tariff truce, Boeing, rare earths",
    titleZh: "特朗普与习近平9月24日华盛顿议程：关税休战、波音与稀土",
    summaryEn:
      "Reuters (17 Sep 2026) says President Trump will host Xi Jinping in Washington on 24 Sep, Xi's first White House visit in a decade and their second meeting this year. Markets will watch whether last October's tariff truce, set to expire 10 Nov, is extended, plus any progress on a mutual tariff cut covering about $30 billion of goods, Boeing purchases, and rare-earth licence flow.",
    summaryZh:
      "路透社（2026年9月17日）称，特朗普将于9月24日在华盛顿接待习近平。这是习十年首次白宫访问，也是两人今年第二次会面。市场关注去年10月宣布、将于11月10日到期的关税休战是否延长，以及约300亿美元商品对等降税、波音采购和稀土许可是否有进展。",
    takeawayEn:
      "Do not reprice a PO on rumours before 24 Sep. Treat the 10 Nov truce expiry as a calendar risk, and keep dual-path docs ready if rare-earth or high-tech licence timing moves. The desk will only quote duty changes that a primary source has published.",
    takeawayZh:
      "9月24日前不要按传闻改报价。把11月10日关税休战到期当作日程风险；若稀土或高科技许可时间变化，准备两套单证路径。采购台只引用一手来源已公布的税率变化，不编造关税数字。",
    sourceName: "Reuters",
    sourceUrl: "https://www.reuters.com/world/china/what-will-trump-xi-discuss-washington-next-week-2026-09-17/",
    tags: ["tariffs", "us-china", "rare-earths", "procurement"],
    bodyEn: [
      "Reuters (17 Sep 2026) reports Trump will welcome Xi on 24 September in Washington, following Trump's May trip to Beijing. Xi arrives as China is on track for a second straight year of a $1 trillion trade surplus, Reuters says. USTR Jamieson Greer said this month the countries will make some announcements on agriculture and non-tariff barriers, and traders will watch a previously agreed mutual tariff reduction covering about $30 billion in goods.",
      "The same report says markets will watch for an extension of the tariff truce announced after the October 2025 Trump-Xi meeting in South Korea, currently set to expire on 10 November. That pause followed tit-for-tat tariffs that, Reuters writes, topped 100%. China said after the May summit it would buy 200 more Boeing jets, which Boeing called an initial tranche. Washington wants Beijing to ease rare earth and critical mineral shipments; Beijing wants a further delay of a US rule that would bar thousands of Chinese firms from advanced US technology.",
      "Treasury Secretary Scott Bessent is due to meet Vice Premier He Lifeng this weekend, with Iran-related financial ties also on the leaders' agenda. Reuters notes AI talks and fentanyl precursor flows as further files. This brief does not treat any of those as settled policy.",
    ],
    bodyZh: [
      "路透社（2026年9月17日）报道，特朗普将于9月24日在华盛顿接待习近平，此前特朗普5月访华。路透称，习到访时中国有望连续第二年录得约1万亿美元贸易顺差。美国贸易代表格里尔本月表示，双方将就农业和非关税壁垒作一些宣布；市场还在看此前商定的约300亿美元商品对等降税。",
      "同一报道称，市场关注2025年10月韩国峰会后宣布、现定于11月10日到期的关税休战是否延长。路透写道，休战前双方曾把报复性关税推到超过100%。中方在5月峰会后表示将再购200架波音飞机，波音称之为“首批”。华盛顿希望中方畅通稀土和关键矿产；北京希望进一步推迟限制数千家中国企业获取美国先进技术的规则。",
      "美国财长贝森特本周末将与何立峰会面，领导人议程还包括与伊朗相关的金融联系。路透亦提到人工智能对话和芬太尼前体。本简报不把上述议题写成已敲定的政策。",
    ],
  },
  {
    slug: "how-this-news-desk-works",
    date: "2026-09-15",
    kind: "meta",
    titleEn: "How Sourcing Center publishes China sourcing news",
    titleZh: "采购中心如何发布中国采购新闻",
    summaryEn:
      "This page is the bilingual news hub for sourcing.center, China factory sourcing, manufacturing, supply chain, tariffs, logistics, and policy that importers actually have to act on. It is a desk note about the section, not a report of a market event.",
    summaryZh:
      "本页是 sourcing.center 的中英双语新闻栏目：中国工厂采购、制造、供应链、关税、物流，以及进口商需要跟进的政策动向。本文是栏目说明，不是某条市场新闻。",
    takeawayEn:
      "Read /news for cited briefs. Use /updates for dated pointers into Knowledge and case studies. New briefs can go live from the China desk without a site redesign.",
    takeawayZh:
      "看 /news 读有来源的简报；/updates 仍是知识库与案例的短讯入口。新简报可由采购台直接发布，不必改版整站。",
    sourceName: "Sourcing Center China desk",
    sourceUrl: "https://sourcing.center/news",
    tags: ["sourcing", "procurement", "desk-note"],
    bodyEn: [
      "Sourcing Center (Xiamen Ajmal Seven Color Trading Co Ltd) runs a China desk from Xiamen with own warehouses in Xiamen and Dubai / Al Ain. Buyers already use Knowledge, Compare, and Updates. This News hub is the SEO and AI-readable place for dated, bilingual sourcing briefs.",
      "Each brief should name a public source, stay in importer language (what changed for factories, freight, tariffs, or QC), and ship in English and 中文. The desk will not publish unsourced tariff numbers or invented policy claims.",
      "Daily posts can be written to the live store (Railway volume /data/news-posts.json) through POST /api/news. The index stays empty-capable: if only this explainer exists, that is intentional until a sourced brief is published.",
    ],
    bodyZh: [
      "采购中心（厦门艾吉玛七色贸易有限公司）在厦门运营中国采购台，自有仓在厦门与迪拜 / 艾因。买家已在使用知识库、对比页和 Updates。本 News 栏目用于可检索、可被 AI 引用的中英双语采购简报。",
      "每篇简报应标注公开来源，用进口商能执行的语言写清工厂、货运、关税或质检的变化，并同时提供英文与中文。没有来源的关税数字或编造的政策，工作台不会发布。",
      "日常稿可通过 POST /api/news 写入线上存储（Railway 卷 /data/news-posts.json）。列表允许为空：若暂时只有这篇说明，是刻意的，直到有来源的简报发布。",
    ],
    faqs: newsIndexFaqs,
  },
];

export function pickNews(copy: { en: string; zh: string }, lang: NewsLang): string {
  return copy[lang];
}

export function newsPostPath(slug: string): string {
  return `${NEWS_PATH}/${slug}`;
}

export function newsPostUrl(slug: string): string {
  return absoluteUrl(newsPostPath(slug));
}

export function isNewsKind(value: unknown): value is NewsKind {
  return value === "meta" || value === "brief";
}

export function compareNewsDateDesc(a: NewsPost, b: NewsPost): number {
  if (a.date === b.date) return a.slug < b.slug ? 1 : a.slug > b.slug ? -1 : 0;
  return a.date < b.date ? 1 : -1;
}

export function newsKind(post: NewsPost): NewsKind {
  return post.kind ?? "brief";
}

export function formatNewsDate(iso: string, lang: NewsLang): string {
  const day = iso.slice(0, 10);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if (!match) return iso;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const date = Number(match[3]);
  if (lang === "zh") return `${year}年${month}月${date}日`;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date} ${months[month - 1]} ${year}`;
}

export function postTitle(post: NewsPost, lang: NewsLang): string {
  return lang === "zh" ? post.titleZh : post.titleEn;
}

export function postSummary(post: NewsPost, lang: NewsLang): string {
  return lang === "zh" ? post.summaryZh : post.summaryEn;
}

export function postTakeaway(post: NewsPost, lang: NewsLang): string {
  return lang === "zh" ? post.takeawayZh : post.takeawayEn;
}

export function postBody(post: NewsPost, lang: NewsLang): string[] {
  const paragraphs = lang === "zh" ? post.bodyZh : post.bodyEn;
  if (Array.isArray(paragraphs) && paragraphs.length > 0) return paragraphs;
  return [postSummary(post, lang)];
}

export function postFaqs(post: NewsPost): NewsFaq[] {
  return post.faqs ?? [];
}

function orgRef() {
  return { "@id": `${siteUrl}/#organization` };
}

export function newsIndexJsonLd(posts: NewsPost[]): JsonLdNode {
  const url = absoluteUrl(NEWS_PATH);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: "Daily China sourcing news | Sourcing Center",
        description: newsCopy.indexLead.en,
        inLanguage: ["en", "zh-CN"],
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: orgRef(),
        mainEntity: {
          "@type": "ItemList",
          "@id": `${url}#list`,
          numberOfItems: posts.length,
          itemListElement: posts.map((post, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: newsPostUrl(post.slug),
            name: post.titleEn,
          })),
        },
      },
      newsFaqGraph(newsIndexFaqs, `${url}#faq`, url),
    ],
  };
}

export function newsPostJsonLd(post: NewsPost): JsonLdNode {
  const url = newsPostUrl(post.slug);
  const type = newsKind(post) === "meta" ? "Article" : "NewsArticle";
  const published = post.date.length === 10 ? `${post.date}T00:00:00+08:00` : post.date;
  const modified = post.updatedAt || published;
  const author = {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: company.name,
  };

  const enArticle: JsonLdNode = {
    "@type": type,
    "@id": `${url}#article-en`,
    headline: post.titleEn,
    description: post.summaryEn,
    datePublished: published,
    dateModified: modified,
    inLanguage: "en",
    url,
    mainEntityOfPage: url,
    author,
    publisher: orgRef(),
    keywords: post.tags.join(", "),
    articleSection: "China sourcing",
    citation: post.sourceUrl,
  };

  const zhArticle: JsonLdNode = {
    "@type": type,
    "@id": `${url}#article-zh`,
    headline: post.titleZh,
    description: post.summaryZh,
    datePublished: published,
    dateModified: modified,
    inLanguage: "zh-CN",
    url,
    mainEntityOfPage: url,
    author,
    publisher: orgRef(),
    keywords: post.tags.join(", "),
    articleSection: "中国采购",
    citation: post.sourceUrl,
  };

  const graph: JsonLdNode[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: `${post.titleEn} | Sourcing Center`,
      description: post.summaryEn,
      inLanguage: ["en", "zh-CN"],
      isPartOf: { "@id": `${siteUrl}/#website` },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "News", item: absoluteUrl(NEWS_PATH) },
          { "@type": "ListItem", position: 3, name: post.titleEn, item: url },
        ],
      },
    },
    enArticle,
    zhArticle,
  ];

  const faqs = postFaqs(post);
  if (faqs.length > 0) {
    graph.push(newsFaqGraph(faqs, `${url}#faq`, url));
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

function newsFaqGraph(faqs: NewsFaq[], id: string, url: string): JsonLdNode {
  return {
    "@type": "FAQPage",
    "@id": id,
    url,
    mainEntity: faqs.flatMap((item) => [
      {
        "@type": "Question",
        name: item.qEn,
        inLanguage: "en",
        acceptedAnswer: { "@type": "Answer", text: item.aEn, inLanguage: "en" },
      },
      {
        "@type": "Question",
        name: item.qZh,
        inLanguage: "zh-CN",
        acceptedAnswer: { "@type": "Answer", text: item.aZh, inLanguage: "zh-CN" },
      },
    ]),
  };
}

export function newsIndexMetadataTitle(): string {
  return "China Sourcing News: Manufacturing, Tariffs, Logistics";
}

export function newsIndexMetadataDescription(): string {
  return "Bilingual China sourcing news for importers: factories, supply chain, tariffs, logistics, and policy. Cited briefs from the Xiamen desk. English and 中文.";
}

export function newsPostMetadataTitle(post: NewsPost): string {
  const title = post.titleEn.trim();
  if (title.length <= 56) return `${title} | Sourcing Center`;
  return title.slice(0, 60);
}

export function newsPostMetadataDescription(post: NewsPost): string {
  const text = post.summaryEn.trim();
  if (text.length <= 160) return text;
  return `${text.slice(0, 157)}...`;
}
