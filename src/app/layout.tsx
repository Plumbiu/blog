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
import { mono } from './fonts'
import Navigator from './_components/Navigator'

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="/theme.js"></script>
      </head>
      <link
        href="/icons/32x32.png"
        rel="icon"
        sizes="32x32"
        type="image/x-icon"
      />
      <body className={mono.className}>
        <ViewTransitions>
          <Header />
          <div className="main_children">
            {children}
          </div>
          <Footer />
          <Modal />
        </ViewTransitions>
      </body>
    </html>
  )
}
