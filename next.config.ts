import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1"],
  typescript: { ignoreBuildErrors: true },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
