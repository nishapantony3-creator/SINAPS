import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  outputFileTracingExcludes: {
    "*": [
      "./public/**/*",
      "./website pic/**/*",
    ],
  },
};

export default nextConfig;
