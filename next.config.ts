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
  basePath: BasePath,
  serverExternalPackages: ['three', '@react-three/fiber', 'lil-gui'],
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
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  output: IS_GITPAGE ? 'export' : undefined,
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

module.exports = IsDev
  ? nextConfig
  : withClassnamesMinifier(withBundleAnalyzer(nextConfig))
