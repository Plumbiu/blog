import { type Metadata } from 'next'
import { ViewTransitions } from 'next-view-transitions'
import { Analytics } from '@vercel/analytics/react'
import Header from './_components/Header'
import Modal from './_components/Modal'
import './_styles/globals.css'
import './_styles/variable.css'
import './_styles/dark-variable.css'
import './_styles/preset.css'
// import '@pigment-css/react/styles.css'
import Footer from './_components/Footer'
import { mono } from './fonts'
import GitPage from './git-page'

export const metadata: Metadata = {
  title: 'Plumbiuの博客',
  description: 'Note, life, summary and blog',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isGitPage = !!process.env.GITPAGE
  return (
    <html lang="en" suppressHydrationWarning>
      <head>{isGitPage ? <GitPage /> : <script src="/theme.js"></script>}</head>
      <link
        href="/icons/icon.svg"
        rel="icon"
        sizes="32x32"
        type="image/x-icon"
      />
      <body className={mono.className}>
        <ViewTransitions>
          <Header />
          <div className="main_children">{children}</div>
          <Footer />
          <Modal />
        </ViewTransitions>
        <Analytics />
      </body>
    </html>
  )
}
