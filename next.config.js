/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['better-auth'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'node:sqlite': false,
        'sqlite3': false,
        'fs': false,
        'path': false,
        'os': false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;