import process from 'node:process'
import Analyzer from '@next/bundle-analyzer'
import { NextConfig } from 'next'

const withBundleAnalyzer = Analyzer({
  enabled: !!process.env.ANALYZE,
})

const nextConfig: NextConfig = {
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
  },
  serverExternalPackages: ['three', '@react-three/fiber'],
}

export default withBundleAnalyzer(nextConfig)
