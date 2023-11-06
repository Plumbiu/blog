import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import Loading from './loading'
import Header from '@/components/app/Header'
import Container from '@/components/app/Container'
import { title } from '@/lib/json'
import Footer from '@/components/app/Container/Footer'
import Side from '@/components/app/Container/Side'
import Nav from '@/components/app/Container/Nav'

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
    <html lang="en" theme="light">
      <link
        href="/icons/favico-32x32.webp"
        rel="icon"
        sizes="32x32"
        type="image/x-icon"
      />
      <body>
        <Header />
        {/* <HeaderBanner /> */}
        <Container>
          <Nav />
          <Suspense fallback={ <Loading /> }>
            {children}
          </Suspense>
          <Side />
        </Container>
        <Footer />
      </body>
    </html>
  )
}
