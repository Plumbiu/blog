import process from 'node:process'
import Analyzer from '@next/bundle-analyzer'
import classnamesMinifier from '@nimpl/classnames-minifier'
import type { NextConfig } from 'next'
import getResvervedClassnames from './optimize/reserved-classmame'

const IS_GITPAGE = !!process.env.GITPAGE
const BasePath = IS_GITPAGE ? '/blog' : ''
const IsDev = process.env.NODE_ENV === 'development'

const withBundleAnalyzer = Analyzer({
  enabled: !!process.env.ANALYZE,
})

const isMinifierEnabled = !IsDev && !process.env.ANALYZE
const withClassnamesMinifier = classnamesMinifier({
  prefix: '',
  reservedNames: isMinifierEnabled ? getResvervedClassnames() : [],
  disabled: !isMinifierEnabled,
})

const AtomChartsetHeader = [
  {
    key: 'Content-Type',
    value: 'application/atom+xml;  charset=utf-8',
  },
]

const nextConfig: NextConfig = {
  experimental: {
    cssChunking: false,
  },
  basePath: BasePath,
  assetPrefix: BasePath,
  serverExternalPackages: ['three', '@react-three/fiber', 'lil-gui'],
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: IS_GITPAGE,
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/feed.atom',
        headers: AtomChartsetHeader,
      },
      {
        source: '/rss.atom',
        headers: AtomChartsetHeader,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/list/',
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

const config: NextConfig = IsDev
  ? nextConfig
  : withClassnamesMinifier(withBundleAnalyzer(nextConfig))

if (IS_GITPAGE) {
  config.output = 'export'
}

export default config
