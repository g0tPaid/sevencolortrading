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
 * Seed is a how-this-works desk note only. Daily stories are appended via
 * POST /api/news to the Railway volume (news-posts.json), not invented here.
 */
export const seedNewsPosts: NewsPost[] = [
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
