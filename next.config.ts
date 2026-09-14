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
      { source: "/admin", destination: "/dashboard", permanent: false },
      { source: "/admin/:path*", destination: "/dashboard/:path*", permanent: false },
      { source: "/quality-inspection", destination: "/inspection", permanent: true },
      { source: "/qc", destination: "/inspection", permanent: true },
      { source: "/inspect", destination: "/inspection", permanent: true },
      { source: "/dropship", destination: "/dropshipping", permanent: true },
      { source: "/fba", destination: "/amazon-fba", permanent: true },
    ];
  },
};

export default nextConfig;
