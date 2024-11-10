/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ucarecdn.com',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/, // add rule for handling SVGs
      use: ['@svgr/webpack'],
    });
    return config;
  },
}

export default nextConfig
