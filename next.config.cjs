/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@docsearch/react'],
  },
}

module.exports = nextConfig
