import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsPostView } from "@/components/news/news-post-view";
import { JsonLd } from "@/components/seo/json-ld";
import {
  newsPostJsonLd,
  newsPostMetadataDescription,
  newsPostMetadataTitle,
  newsPostPath,
} from "@/lib/news";
import { getNewsPost, listNews } from "@/lib/news-store";
import { absoluteUrl, routeMetadata } from "@/lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) return { title: "News" };
  const path = newsPostPath(post.slug);
  const title = newsPostMetadataTitle(post);
  const description = newsPostMetadataDescription(post);
  const base = routeMetadata({
    title,
    description,
    path,
    type: "article",
  });
  return {
    ...base,
    openGraph: {
      title,
      description,
      type: "article",
      url: absoluteUrl(path),
      siteName: "Sourcing Center",
      locale: "en_US",
      alternateLocale: ["zh_CN"],
      publishedTime: post.date,
      modifiedTime: post.updatedAt ?? post.date,
    },
    alternates: {
      canonical: `https://sourcing.center${path}`,
      languages: {
        en: `https://sourcing.center${path}`,
        "zh-CN": `https://sourcing.center${path}`,
      },
    },
    other: {
      "og:locale:alternate": "zh_CN",
    },
  };
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) notFound();
  const related = (await listNews()).filter((item) => item.slug !== post.slug).slice(0, 4);

  return (
    <>
      <JsonLd data={newsPostJsonLd(post)} />
      <NewsPostView post={post} related={related} />
    </>
  );
}
