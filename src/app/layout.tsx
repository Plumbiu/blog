import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { ViewTransitions } from 'next-view-transitions'
import { Analytics } from '@vercel/analytics/react'
import { BlogAuthor, BlogTitle, BlogUrl, BlogDesc } from '~/data/site'
import { resolveAssetPath } from '@/utils'
import Header from '@/components/Header'
import ImageView from '@/components/ImageView'
import '../styles/globals.css'
import '../styles/variable.css'
import '../styles/dark-variable.css'
import '../styles/preset.css'
import Footer from '@/components/Footer'
import { mono } from './fonts'
import { generateSeoMetaData } from './seo'

export const metadata: Metadata = {
  applicationName: BlogTitle,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: BlogTitle,
  },
  formatDetection: {
    telephone: false,
  },
  title: { default: BlogTitle, template: BlogTitle },
  description: BlogDesc,
  ...generateSeoMetaData({
    title: BlogTitle,
    description: BlogDesc,
    url: BlogUrl,
    siteName: `${BlogAuthor}'s blog`,
  }),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <script src={resolveAssetPath('theme.js')} />
        <link
          rel="icon"
          type="image/svg+xml"
          href={resolveAssetPath('icons/favicon.svg')}
        />
        <link
          rel="icon"
          type="image/png"
          href={resolveAssetPath('icons/favicon-96x96.png')}
          sizes="96x96"
        />
        <link
          rel="shortcut icon"
          href={resolveAssetPath('icons/favicon.ico')}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={resolveAssetPath('icons/apple-touch-icon.png')}
        />
        <meta name="apple-mobile-web-app-title" content={BlogTitle} />
        <link
          rel="manifest"
          href={resolveAssetPath('icons/site.webmanifest')}
        />
      </head>
      <body className={mono.className}>
        <ViewTransitions>
          <Header />
          <div className="main_children">{children}</div>
          <Footer />
        </ViewTransitions>
        <ImageView />
        <Analytics />
      </body>
    </html>
  )
}
