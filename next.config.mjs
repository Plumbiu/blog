import process from 'node:process'
import Analyzer from '@next/bundle-analyzer'
import { withPigment, extendTheme } from '@pigment-css/nextjs-plugin'
import variable from './theme-variable.mjs'

const withBundleAnalyzer = Analyzer({
  enabled: !!process.env.ANALYZE,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  cleanDistDir: true,
  experimental: {},
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

// export default withBundleAnalyzer(
//   withPigment(nextConfig, {
//     theme: extendTheme({
//       colorSchemes: variable.colors,
//       ...variable.tokens,
//       getSelector: (scheme) =>
//         scheme === 'dark' ? "html[data-theme='dark']" : ':root',
//     }),
//   }),
// )
