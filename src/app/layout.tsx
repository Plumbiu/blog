import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import Loading from './loading'
import Header from '@/components/app/Header'
import Container from '@/components/app/Container'
import { title } from '~/config.json'
import Footer from '@/components/app/Container/Footer'
import HeaderMenu from '@/components/app/Header/Menu'
import Nav from '@/components/app/Container/Nav'
import HeaderBanner from '@/components/app/Header/Banner'
import Side from '@/components/app/Container/Side'

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
        rel="icon"
        type="image/x-icon"
        sizes="32x32"
        href="/icons/favico-32x32.webp"
      />
      <body>
        <HeaderMenu />
        <Header />
        <HeaderBanner />
        <Container>
          <Nav />
          <Suspense fallback={<Loading />}>{children}</Suspense>
          <Side />
        </Container>
        <Footer />
      </body>
    </html>
  )
}
