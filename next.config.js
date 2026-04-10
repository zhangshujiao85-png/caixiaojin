/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // GitHub Pages 需要设置 basePath
  basePath: '/caixiaojin',
  // 确保资源路径正确
  assetPrefix: '/caixiaojin',
  images: {
    unoptimized: true,
  },
  // 禁用 trailingSlash 重定向
  trailingSlash: true,
};

module.exports = nextConfig;
