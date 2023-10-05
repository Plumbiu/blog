import '@/styles/globals.css'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Container from '@/components/ui/Container'
import RightCard from '@/components/ui/SideCard/Right'

export const metadata: Metadata = {
  title: 'Plumbiu の 小屋',
  description: 'Welcome to my blog!',
  themeColor: '#1976d2',
  viewport: 'width=device-width, initial-scale=1.0',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <link rel="icon" type="image/x-icon" sizes="32x32" href="/icons/favico-32x32.png"></link>
      <link rel="icon" type="image/x-icon" sizes="96x96" href="/icons/favico-96x96.png"></link>
      <link rel="icon" type="image/x-icon" sizes="128x128" href="/icons/favico-128x128.png"></link>
      <link rel="icon" type="image/x-icon" sizes="192x192" href="/icons/favico-192x192.png"></link>
      <link rel="icon" type="image/x-icon" sizes="256x256" href="/icons/favico-256x256.png"></link>
      <link rel="icon" type="image/x-icon" sizes="512x512" href="/icons/favico-512x512.png"></link>

      <body
        style={{
          backgroundColor: '#F6F8FC',
        }}
      >
        <Header />
        <Container>
          {children}
          <RightCard />
        </Container>
      </body>
    </html>
  )
}
