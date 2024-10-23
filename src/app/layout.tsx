import { type Metadata } from 'next'
import Header from './components/Header'
import Modal from './posts/components/Modal'
import './globals.css'
import './variable.css'
import './dark-variable.css'
// import '@pigment-css/react/styles.css'
import Footer from './components/Footer'
import { noto } from './fonts'
import LayoutWrap from './components/LayoutWrap'

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
        <LayoutWrap>
          <Header />
          {children}
          <Footer />
          <Modal />
        </LayoutWrap>
      </body>
    </html>
  )
}
