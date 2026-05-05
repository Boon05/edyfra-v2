import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow production builds to succeed even if there are ESLint warnings
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
