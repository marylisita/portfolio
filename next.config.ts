import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // HoloGlam saiu do portfólio (out/2026). O arquivo da página continua em
  // src/app/work/hologlam caso volte; o redirect evita 404 em links antigos.
  async redirects() {
    return [
      { source: "/work/hologlam", destination: "/work", permanent: true },
    ];
  },
};

export default nextConfig;
