import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { BlogAuthor, BlogTitle, BlogUrl, BlogDesc, GSC } from '~/data/site'
import { resolveAssetPath } from '@/lib/shared'
import Header from '@/components/layout/Header'
import ImageView from '@/components/layout/ImageView'
import '../styles/globals.css'
import '../styles/variable.css'
import '../styles/dark-variable.css'
import '../styles/overlayscrollbar.css'
import '../styles/preset.css'
import Footer from '@/components/layout/Footer'
import { robot } from './fonts'
import { generateSeoMetaData } from './seo'
import { getPost } from '~/markdown/utils/fs'
import SearchPanel from '@/components/layout/SearchPanel'
import SideBar from '@/components/layout/side-bar'
import Banner from '@/components/layout/Banner'

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
  const allLists = await getPost()
  const searchPanelData = allLists.map((item) => ({
    date: new Date(item.meta.date).toISOString().split('T')[0],
    title: item.meta.title,
    path: item.path,
    type: item.type,
  }))
  return searchPanelData
}

const IsDev = process.env.NODE_ENV === 'development'
const ScriptBasename = IsDev ? 'dev' : 'index'

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const searchData = await getSearchPanelData()
  return (
    <html
      lang="zh"
      suppressHydrationWarning
      data-overlayscrollbars-initialize
      data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYScroll"
    >
      <head>
        <meta name="google-site-verification" content={GSC} />
        <link
          href={resolveAssetPath('icons/icon.svg')}
          rel="icon"
          sizes="32x32"
          type="image/x-icon"
        />
      </head>
      <body data-overlayscrollbars-initialize className={robot.className}>
        <script src={resolveAssetPath(`assets/theme/${ScriptBasename}.js`)} />
        <script src={resolveAssetPath(`assets/scroll/${ScriptBasename}.js`)} />
        <Header />
        <Banner />
        <script src={resolveAssetPath(`assets/banner/${ScriptBasename}.js`)} />
        <div className="main_layout">
          <SideBar />
          <div className="main_children">{children}</div>
        </div>
        <Footer />
        <ImageView />
        <Analytics />
        <SearchPanel data={searchData} />
      </body>
    </html>
  )
}
