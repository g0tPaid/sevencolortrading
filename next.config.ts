import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [
      { source: "/admin", destination: "/dashboard", permanent: false },
      { source: "/admin/:path*", destination: "/dashboard/:path*", permanent: false },
      { source: "/quality-inspection", destination: "/inspection", permanent: true },
      { source: "/qc", destination: "/inspection", permanent: true },
    ];
  },
};

export default nextConfig;
