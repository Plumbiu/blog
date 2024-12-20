const process = require('node:process')
const Analyzer = require('@next/bundle-analyzer')
const { default: classnamesMinifier } = require('@nimpl/classnames-minifier')

const IS_GITPAGE = !!process.env.GITPAGE
const BasePath = IS_GITPAGE ? '/blog' : ''

const withBundleAnalyzer = Analyzer({
  enabled: !!process.env.ANALYZE,
})

const withClassnamesMinifier = classnamesMinifier({
  prefix: '_',
  reservedNames: ['_en', '_de'],
  disabled: process.env.NODE_ENV === 'development',
})

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  basePath: BasePath,
  experimental: {
    cssChunking: 'loose',
    serverComponentsExternalPackages: [
      'three',
      '@react-three/fiber',
      'lil-gui',
    ],
  },
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    minimumCacheTTL: 31536000,
    path: `${BasePath}/_next/image`,
    remotePatterns: [
      {
        // "https://avatars.githubusercontent.com/u/99574369?v=4"
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  output: IS_GITPAGE ? 'export' : undefined,
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/list/blog/1',
      },
      {
        source: '/list',
        destination: '/list/blog/1',
      },
      {
        source: '/list/:id',
        destination: '/list/:id/1',
      },
      {
        source: '/feed',
        destination: '/rss.xml',
      },
      {
        source: '/feed.xml',
        destination: '/rss.xml',
      },
      {
        source: '/feed.json',
        destination: '/rss.json',
      },
      {
        source: '/feed.atom',
        destination: '/rss.atom',
      },
      {
        source: '/rss',
        destination: '/rss.xml',
      },
    ]
  },
}

module.exports = withClassnamesMinifier(withBundleAnalyzer(nextConfig))
