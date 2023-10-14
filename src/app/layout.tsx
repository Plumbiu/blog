import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import Header from '@/components/app/Header'
import Container from '@/components/app/Container'
import RightCard from '@/components/app/SideCard/Right'
import { title } from '~/config.json'

export const metadata: Metadata = {
  title,
  description: 'Welcome to my blog!',
  themeColor: '#1976d2',
  viewport: 'width=device-width, initial-scale=1.0',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" theme="dark">
      <link
        rel="icon"
        type="image/x-icon"
        sizes="32x32"
        href="/icons/favico-32x32.png"
      />
      <body>
        <Header />
        <Container>
          {children}
          <RightCard />
        </Container>
        <Analytics />
      </body>
    </html>
  )
}
