import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.191"],
  serverExternalPackages: [],
  experimental: {
    serverActions: {
      bodySizeLimit: "16mb",
    },
  },
  // Konfigurasi 301 Permanent Redirect ke domain baru
  async redirects() {
    return [
      {
        source: "/:path*",
        destination: "https://lpkkabblitar.vercel.app/:path*",
        permanent: true, // true = HTTP 301 Permanent Redirect (Mengalihkan ranking & SEO ke domain baru)
      },
    ];
  },
};

export default nextConfig;
