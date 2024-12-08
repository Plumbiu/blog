import process from 'node:process'
import Analyzer from '@next/bundle-analyzer'
import { NextConfig } from 'next'
import classnamesMinifier from '@nimpl/classnames-minifier'
import { BasePath } from '@/constants'

const withBundleAnalyzer = Analyzer({
  enabled: !!process.env.ANALYZE,
})

const withClassnamesMinifier = classnamesMinifier({
  prefix: '_',
  reservedNames: ['_en', '_de'],
  disabled: false,
})

const nextConfig: NextConfig = {
  basePath: BasePath,
  experimental: {
    cssChunking: 'loose',
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
  },
  serverExternalPackages: ['three', '@react-three/fiber'],
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
    ]
  },
}

export default withClassnamesMinifier(withBundleAnalyzer(nextConfig))
