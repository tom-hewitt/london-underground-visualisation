import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  cacheComponents: true,
  cacheMaxMemorySize: 100000000, // 100MB
};

export default nextConfig;
