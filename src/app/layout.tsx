/* eslint-disable @stylistic/max-len */
import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'
import Script from 'next/script'
import Header from '@/components/app/Container/Header'
import Container from '@/components/app/Container'
import { title } from '@/lib/json'

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
    <html lang="en">
      <link
        href="/icons/favico-32x32.webp"
        rel="icon"
        sizes="32x32"
        type="image/x-icon"
      />
      <body>
        <Script id="theme" strategy="beforeInteractive">
          {`
          const localTheme = localStorage.getItem('theme')
          const theme = localTheme ? localTheme : window.matchMedia("(prefers-color-scheme:light)").matches ? 'light' : 'dark'
          localStorage.setItem('theme', theme)
          document.documentElement.setAttribute('theme', theme)`}
        </Script>
        <Header />
        <Container>{children}</Container>
      </body>
    </html>
  )
}
