import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@notify/react', '@notify/js'],
};

export default nextConfig;
