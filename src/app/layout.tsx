import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { BlogAuthor, BlogTitle, BlogUrl, BlogDesc, GSC } from '~/config/site'
import { resolveBasePath } from '@/lib/shared'
import Header from '@/components/layout/Header'
import ImageView from '@/components/layout/ImageView'
import '../styles/variable.css'
import '../styles/dark-variable.css'
import '../styles/globals.css'
import '../styles/preset.css'
import Footer from '@/components/layout/Footer'
import { robot } from './fonts'
import { generateSeoMetaData } from './seo'
import SearchPanel from '@/components/layout/SearchPanel'
import SideBar from '@/components/layout/side-bar'
import Banner from '@/components/layout/Banner'
import OverlayScrollbar from '@/components/layout/OverlayScrollbar'
import getSearchApiData from '@/lib/node/search-data'

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

const IsDev = process.env.NODE_ENV === 'development'
const ScriptBasename = IsDev ? 'dev' : 'index'

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const searchData = await getSearchApiData()
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content={GSC} />
        <link
          href={resolveBasePath('icon.svg')}
          rel="icon"
          sizes="32x32"
          type="image/x-icon"
        />
      </head>
      <body className={robot.className}>
        <script src={resolveBasePath(`assets/theme/${ScriptBasename}.js`)} />
        <OverlayScrollbar />
        <Header />
        <Banner />
        <script src={resolveBasePath(`assets/banner/${ScriptBasename}.js`)} />
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
