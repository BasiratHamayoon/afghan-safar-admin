import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // 1. Ignore TypeScript & ESLint blockers on Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 2. Prevent jspdf and html2canvas from crashing serverless memory during build
  serverExternalPackages: ["jspdf", "html2canvas"],

  reactStrictMode: false,

  // 3. Optimize bundle memory during Vercel builds
  experimental: {
    webpackBuildWorker: true,
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },

  // 4. Remote Image Domains
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },

  // 5. SVG Loader
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