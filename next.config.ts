import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.1.81', '192.168.18.116', 'localhost', '127.0.0.1', '*'],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Désactiver COMPLÈTEMENT les rewrites
  async rewrites() {
    return [];
  },
};

export default nextConfig;