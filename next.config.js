const process = require('node:process')
const Analyzer = require('@next/bundle-analyzer')
const { default: classnamesMinifier } = require('@nimpl/classnames-minifier')

const IS_GITPAGE = !!process.env.GITPAGE
const BasePath = IS_GITPAGE ? `/${RepoName}` : ''

const withBundleAnalyzer = Analyzer({
  enabled: !!process.env.ANALYZE,
})

const withClassnamesMinifier = classnamesMinifier({
  prefix: '_',
  reservedNames: ['_en', '_de'],
  disabled: false,
})

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
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
    ]
  },
}

module.exports = withClassnamesMinifier(withBundleAnalyzer(nextConfig))
