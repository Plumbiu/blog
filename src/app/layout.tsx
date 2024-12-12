import { type Metadata } from 'next'
import { ViewTransitions } from 'next-view-transitions'
import { Analytics } from '@vercel/analytics/react'
import { BlogAuthor, BlogUrl } from '~/data/site'
import { resolveAssetPath } from '@/utils'
import Header from '@/components/Header'
import ImageView from '@/components/ImageView'
import '../styles/globals.css'
import '../styles/variable.css'
import '../styles/dark-variable.css'
import '../styles/preset.css'
import Footer from '@/components/Footer'
import { mono } from './fonts'
import { Blog_Desc, Blog_Title, generateSeoMetaData } from './seo'

export const metadata: Metadata = {
  title: Blog_Title,
  description: Blog_Desc,
  ...generateSeoMetaData({
    title: Blog_Title,
    description: Blog_Desc,
    url: BlogUrl,
    siteName: `${BlogAuthor}'s blog`,
  }),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <script src={resolveAssetPath('theme.js')}></script>
        <link
          href={resolveAssetPath('icons/icon.svg')}
          rel="icon"
          sizes="32x32"
          type="image/x-icon"
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
