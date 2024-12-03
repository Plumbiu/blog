import process from 'node:process'
import Analyzer from '@next/bundle-analyzer'
import { NextConfig } from 'next'
import { RepoName } from '@/constants'

const withBundleAnalyzer = Analyzer({
  enabled: !!process.env.ANALYZE,
})

const IS_GITPAGE = !!process.env.GITPAGE

const basePath = IS_GITPAGE ? `/${RepoName}` : ''

const nextConfig: NextConfig = {
  basePath,
  experimental: {
    useLightningcss: true,
    turbo: {
      treeShaking: process.env.NODE_ENV === 'production',
      // ...
    },
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
    path: `${basePath}/_next/image`,
  },
  serverExternalPackages: ['three', '@react-three/fiber'],
}

export default withBundleAnalyzer(nextConfig)
