import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // 1. Ignore TypeScript type-checking errors during Vercel deployment
  typescript: {
    ignoreBuildErrors: true,
  },

  // 2. Ignore ESLint errors during Vercel deployment
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 3. Exclude heavy client-side libraries from bloating serverless bundle size
  serverExternalPackages: ["jspdf", "html2canvas"],

  reactStrictMode: false,

  // 4. Allowed image sources
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },

  // 5. SVG loader support via SVGR
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);