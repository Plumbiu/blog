import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import '@/styles/globals.css'
import '@/styles/md/hljs.css'
import '@/styles/md/github-markdown.css'
import { Noto_Sans_SC } from 'next/font/google'
import Loading from './loading'
import Header from '@/components/app/Container/Header'
import Container from '@/components/app/Container'
import { title } from '@/lib/json'
import Footer from '@/components/app/Container/Footer'
import Side from '@/components/app/Container/Side'

const sans = Noto_Sans_SC({
  weight: ['400'],
  subsets: ['latin'],
  display: 'auto',
})
export const metadata: Metadata = {
  title,
  description: 'Welcome to my blog!',
}

export const viewport: Viewport = {
  themeColor: '#1976d2',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 6,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" theme="dark" className={sans.className}>
      <link
        href="/icons/favico-32x32.webp"
        rel="icon"
        sizes="32x32"
        type="image/x-icon"
      />
      <body>
        <Header />
        <Container>
          <Suspense fallback={<Loading />}>
            <div>
              <div className="Main-Children">{children}</div>
            </div>
          </Suspense>
        </Container>
        <Footer />
      </body>
    </html>
  )
}
