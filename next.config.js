/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse']
  },
  // Configure webpack to handle pdf-parse
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  // Add output configuration for Amplify hosting
  output: 'standalone',
}

module.exports = nextConfig
