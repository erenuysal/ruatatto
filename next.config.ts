import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  outputFileTracingExcludes: {
    "*": ["node_modules/@swc/**", "node_modules/webpack/**"],
  },
};

export default nextConfig;
