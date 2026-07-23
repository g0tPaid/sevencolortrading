import type { MetadataRoute } from "next";

const routes = [
  "",
  "/about",
  "/services",
  "/industries",
  "/how-it-works",
  "/factory-verification",
  "/quality-inspection",
  "/private-label",
  "/oem-odm",
  "/logistics",
  "/case-studies",
  "/knowledge",
  "/contact",
  "/dashboard",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://sourcing.center";
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
