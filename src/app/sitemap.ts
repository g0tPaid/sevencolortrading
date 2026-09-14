import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/case-studies";
import { comparePages } from "@/lib/compare";
import { knowledgeArticles } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/visit", priority: 0.92, changeFrequency: "weekly" },
  { path: "/3pl", priority: 0.95, changeFrequency: "weekly" },
  { path: "/dropshipping", priority: 0.93, changeFrequency: "weekly" },
  { path: "/logistics", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/industries", priority: 0.6, changeFrequency: "monthly" },
  { path: "/how-it-works", priority: 0.6, changeFrequency: "monthly" },
  { path: "/factory-verification", priority: 0.6, changeFrequency: "monthly" },
  { path: "/factories/register", priority: 0.65, changeFrequency: "monthly" },
  { path: "/inspection", priority: 0.92, changeFrequency: "weekly" },
  { path: "/amazon-fba", priority: 0.92, changeFrequency: "weekly" },
  { path: "/private-label", priority: 0.6, changeFrequency: "monthly" },
  { path: "/oem-odm", priority: 0.6, changeFrequency: "monthly" },
  { path: "/case-studies", priority: 0.7, changeFrequency: "monthly" },
  { path: "/reviews", priority: 0.7, changeFrequency: "weekly" },
  { path: "/faq", priority: 0.9, changeFrequency: "weekly" },
  { path: "/knowledge", priority: 0.7, changeFrequency: "weekly" },
  { path: "/compare", priority: 0.72, changeFrequency: "weekly" },
  { path: "/updates", priority: 0.45, changeFrequency: "weekly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const citeable = new Set([
    "how-to-source-from-china",
    "china-quality-inspection-guide",
    "3pl-warehouses-xiamen-dubai",
    "china-sourcing-company-xiamen-dubai-3pl",
    "dropshipping-from-china-own-warehouse",
    "factory-visit-xiamen-hosted-sourcing-trip",
    "china-3pl-vs-broker-vs-fba",
  ]);

  const articles = knowledgeArticles.map((article) => ({
    url: `${siteUrl}/knowledge/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: citeable.has(article.slug) ? 0.75 : 0.55,
  }));

  const studies = caseStudies.map((study) => ({
    url: `${siteUrl}/case-studies/${study.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const compares = comparePages.map((page) => ({
    url: `${siteUrl}/compare/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.74,
  }));

  return [...staticRoutes, ...articles, ...studies, ...compares];
}
