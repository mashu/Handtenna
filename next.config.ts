import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // For GitHub Pages deployment - set this to your repo name
  // basePath: '/Handtenna',
  // assetPrefix: '/Handtenna/',
};

export default nextConfig;

