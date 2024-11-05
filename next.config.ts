import process from 'node:process'
import Analyzer from '@next/bundle-analyzer'
import { NextConfig } from 'next'
import { withPigment, extendTheme } from '@pigment-css/nextjs-plugin'
import variable from './theme-variable.js'

const withBundleAnalyzer = Analyzer({
  enabled: !!process.env.ANALYZE,
})

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      // ...
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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
