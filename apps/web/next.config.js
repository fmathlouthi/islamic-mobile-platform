const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@tariq/shared'],
  output: 'standalone',
};

module.exports = withNextIntl(nextConfig);
