import type { Metadata } from 'next'
import Header from './components/Header'
import Modal from './posts/components/Modal'
import './globals.css'
import './variable.css'
import Footer from './components/Footer'
import Float from './components/Float'
import { noto } from './fonts'
import ThemeWrap from './components/ThemeWrap'

export const metadata: Metadata = {
  title: 'Plumbiuの博客',
  description: 'Note, life, summary and blog',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <link
        href="/icons/32x32.png"
        rel="icon"
        sizes="32x32"
        type="image/x-icon"
      />
      <body className={noto.className}>
        <ThemeWrap>
          <Header />
          {children}
          <Footer />
          <Float />
          <Modal />
        </ThemeWrap>
      </body>
    </html>
  )
}
