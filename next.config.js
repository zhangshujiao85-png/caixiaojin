/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/caixiaojin',
  assetPrefix: '/caixiaojin',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  trailingSlash: true,
};

module.exports = nextConfig;
