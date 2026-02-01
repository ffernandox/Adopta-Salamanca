import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'purepng.com',
      },
      {
        protocol: 'https',
        hostname: 'pngimg.com', // 👈 ESTE ES EL NUEVO QUE FALTABA
      },
    ],
  },
};

export default nextConfig;