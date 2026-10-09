import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  trailingSlash: false,
  skipTrailingSlashRedirect: false,
  async redirects() {
    return [
      // Host consolidation: www → apex (covers public files middleware matcher skips).
      {
        source: "/",
        has: [{ type: "host", value: "www.sourcing.center" }],
        destination: "https://sourcing.center",
        statusCode: 301,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.sourcing.center" }],
        destination: "https://sourcing.center/:path*",
        statusCode: 301,
      },
      {
        source: "/",
        has: [{ type: "host", value: "sevencolor.online" }],
        destination: "https://sourcing.center",
        statusCode: 301,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "sevencolor.online" }],
        destination: "https://sourcing.center/:path*",
        statusCode: 301,
      },
      {
        source: "/",
        has: [{ type: "host", value: "www.sevencolor.online" }],
        destination: "https://sourcing.center",
        statusCode: 301,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.sevencolor.online" }],
        destination: "https://sourcing.center/:path*",
        statusCode: 301,
      },
      { source: "/admin", destination: "/dashboard", permanent: false },
      { source: "/admin/:path*", destination: "/dashboard/:path*", permanent: false },
      { source: "/quality-inspection", destination: "/inspection", permanent: true },
      { source: "/qc", destination: "/inspection", permanent: true },
      { source: "/inspect", destination: "/inspection", permanent: true },
      { source: "/dropship", destination: "/dropshipping", permanent: true },
      { source: "/fba", destination: "/amazon-fba", permanent: true },
      { source: "/factory-website", destination: "/factory-growth", permanent: true },
      { source: "/1688", destination: "/1688-sourcing", permanent: true },
      { source: "/china-sourcing-agent", destination: "/", permanent: true },
      { source: "/product-opportunities", destination: "/trending-products", permanent: true },
      {
        source: "/product-opportunities/:slug",
        destination: "/trending-products/:slug",
        permanent: true,
      },
      { source: "/blog", destination: "/knowledge", permanent: true },
      { source: "/blog/:slug", destination: "/knowledge/:slug", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/products", destination: "/trending-products", permanent: true },
      { source: "/opportunities", destination: "/trending-products", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/faqs", destination: "/faq", permanent: true },
      { source: "/warehouse", destination: "/3pl", permanent: true },
      { source: "/warehousing", destination: "/3pl", permanent: true },
      { source: "/fulfillment", destination: "/3pl", permanent: true },
      { source: "/sourcing", destination: "/", permanent: true },
      { source: "/uae", destination: "/sourcing-for/uae", permanent: true },
      { source: "/gcc", destination: "/sourcing-for/uae", permanent: true },
      { source: "/dubai", destination: "/sourcing-for/uae", permanent: true },
      { source: "/quality", destination: "/inspection", permanent: true },
      { source: "/quality-control", destination: "/inspection", permanent: true },
      { source: "/factory-visit", destination: "/visit", permanent: true },
      { source: "/factories", destination: "/factories/register", permanent: true },
      { source: "/oem", destination: "/oem-odm", permanent: true },
      { source: "/odm", destination: "/oem-odm", permanent: true },
      { source: "/amazon", destination: "/amazon-fba", permanent: true },
    ];
  },
};

export default nextConfig;
