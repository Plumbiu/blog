import process from 'node:process'
import Analyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = Analyzer({
  enabled: !!process.env.ANALYZE,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  cleanDistDir: true,
  experimental: {
    instrumentationHook: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
}

export default withBundleAnalyzer(nextConfig)
