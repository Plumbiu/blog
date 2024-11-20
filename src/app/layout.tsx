import { type Metadata } from 'next'
import { ViewTransitions } from 'next-view-transitions'
import Header from './_components/Header'
import Modal from './_components/Modal'
import './_styles/globals.css'
import './_styles/variable.css'
import './_styles/dark-variable.css'
import './_styles/preset.css'
// import '@pigment-css/react/styles.css'
import Footer from './_components/Footer'
import { noto } from './fonts'
import LayoutWrap from './_components/LayoutWrap'

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
        <ViewTransitions>
          <LayoutWrap>
            <Header />
            <div className="main_children">{children}</div>
            <Footer />
            <Modal />
          </LayoutWrap>
        </ViewTransitions>
      </body>
    </html>
  )
}
