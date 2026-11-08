import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [
      // Host consolidation: www → apex (covers public files middleware matcher skips).
      {
        source: "/",
        has: [{ type: "host", value: "www.sourcing.center" }],
        destination: "https://sourcing.center/",
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
        destination: "https://sourcing.center/",
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
        destination: "https://sourcing.center/",
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
    ];
  },
  async headers() {
    const attachment = (filename: string, type: string) => [
      { key: "Content-Type", value: type },
      { key: "Content-Disposition", value: `attachment; filename="${filename}"` },
      { key: "X-Content-Type-Options", value: "nosniff" },
    ];
    return [
      {
        source: "/downloads/sourcing-center-mutual-nda-template.pdf",
        headers: attachment(
          "sourcing-center-mutual-nda-template.pdf",
          "application/pdf",
        ),
      },
      {
        source: "/downloads/sourcing-center-mutual-nda-template.docx",
        headers: attachment(
          "sourcing-center-mutual-nda-template.docx",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ),
      },
    ];
  },
};

export default nextConfig;
