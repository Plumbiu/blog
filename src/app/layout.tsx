import '@/styles/globals.css'
import '@/styles/blog.css'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Container from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'Plumbiu の 小屋',
  description: 'Welcome to my blog!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <link rel="icon" type="image/x-icon" href="/favico.jpg"></link>
      <body
        style={{
          backgroundColor: '#F6F8FC',
        }}
      >
        <Header />
        <Container>{children}</Container>
      </body>
    </html>
  )
}
