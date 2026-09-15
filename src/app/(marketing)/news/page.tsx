import type { Metadata } from "next";
import { NewsIndexView } from "@/components/news/news-index-view";
import { JsonLd } from "@/components/seo/json-ld";
import { newsIndexJsonLd } from "@/lib/news";
import { listNews } from "@/lib/news-store";
import { pages } from "@/lib/route-seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pages.news,
  openGraph: {
    ...pages.news.openGraph,
    locale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  alternates: {
    ...pages.news.alternates,
    languages: {
      en: "https://sourcing.center/news",
      "zh-CN": "https://sourcing.center/news",
    },
  },
  other: {
    "og:locale:alternate": "zh_CN",
  },
};

export default async function NewsIndexPage() {
  const posts = await listNews();
  return (
    <>
      <JsonLd data={newsIndexJsonLd(posts)} />
      <NewsIndexView posts={posts} />
    </>
  );
}
