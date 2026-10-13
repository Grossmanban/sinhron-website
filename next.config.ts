import type { NextConfig } from "next";

// GitHub Pages serves the project site under /<repo>. Set NEXT_PUBLIC_BASE_PATH=""
// when moving to a custom domain — nothing else needs to change.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: { globalNotFound: true },
};

export default nextConfig;
