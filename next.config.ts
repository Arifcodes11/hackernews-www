import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/feeds/:path*",
        destination: "http://localhost:3000/feeds/:path*", // 👈 backend on port 3000
      },
    ];
  },
};

export default nextConfig;
