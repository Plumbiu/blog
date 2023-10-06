import '@/styles/globals.css'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Container from '@/components/ui/Container'

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
      <body>
        <Header />
        <Container>
          {children}
        </Container>
      </body>
    </html>
  )
}
