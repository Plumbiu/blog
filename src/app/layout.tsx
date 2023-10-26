import '@/styles/globals.css'
import type { Metadata } from 'next'
import Header from '@/components/app/Header'
import Container from '@/components/app/Container'
import RightCard from '@/components/app/SideCard/Right'
import { title } from '~/config.json'
import Footer from '@/components/app/Footer'

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
        href="/icons/favico-32x32.webp"
      />
      <body>
        <Header />
        <Container>
          {children}
          <RightCard />
        </Container>
        <Footer />
      </body>
    </html>
  )
}
