// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   allowedDevOrigins: ['192.168.1.81', '192.168.18.116', 'localhost', '127.0.0.1', '*'],
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: '**',
//         port: '',
//         pathname: '/**',
//       },
//     ],
//   },
//   // Désactiver COMPLÈTEMENT les rewrites
//   async rewrites() {
//     return [];
//   },
// };

// export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.1.81', '192.168.18.116', 'localhost', '127.0.0.1','192.168.18.191'],
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
  // Configuration du proxy pour éviter les problèmes CORS
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;