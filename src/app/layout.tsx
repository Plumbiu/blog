import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { ViewTransitions } from 'next-view-transitions'
import { Analytics } from '@vercel/analytics/react'
import { BlogAuthor, BlogTitle, BlogUrl, BlogDesc, GSC } from '~/data/site'
import { resolveAssetPath } from '@/lib/shared'
import Header from '@/components/Header'
import ImageView from '@/components/ImageView'
import '../styles/globals.css'
import '../styles/variable.css'
import '../styles/dark-variable.css'
import '../styles/preset.css'
import Footer from '@/components/Footer'
import { mono } from './fonts'
import { generateSeoMetaData } from './seo'
import { getPostByPostType } from '~/markdown/utils/fs'
import SearchPanel from '@/components/SearchPanel'

export const metadata: Metadata = {
  title: BlogTitle,
  description: BlogDesc,
  ...generateSeoMetaData({
    title: BlogTitle,
    description: BlogDesc,
    url: BlogUrl,
    siteName: `${BlogAuthor}'s blog`,
  }),
}

const IS_GITPAGE = !!process.env.GITPAGE

const getSearchPanelData = async () => {
  if (!IS_GITPAGE) {
    return []
  }
  const allLists = await getPostByPostType()
  const searchPanelData = allLists.map((item) => ({
    date: new Date(item.meta.date).toISOString().split('T')[0],
    title: item.meta.title,
    path: item.path,
    type: item.type,
  }))
  return searchPanelData
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const searchData = await getSearchPanelData()
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content={GSC} />
        <link
          href={resolveAssetPath('icons/icon.svg')}
          rel="icon"
          sizes="32x32"
          type="image/x-icon"
        />
      </head>
      <body className={mono.className}>
        <script
          src={resolveAssetPath(
            `assets/theme/${
              process.env.NODE_ENV === 'development' ? 'dev' : 'index'
            }.js`,
          )}
        />
        <ViewTransitions>
          <Header />
          <div className="main_children">{children}</div>
          <Footer />
        </ViewTransitions>
        <ImageView />
        <Analytics />
        <SearchPanel data={searchData} />
      </body>
    </html>
  )
}
