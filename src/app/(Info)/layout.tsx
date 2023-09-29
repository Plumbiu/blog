import type { Metadata } from 'next'
import InfoCard from '@/components/SideCard'
import Main from '@/components/ui/Main'

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
    <>
      <InfoCard />
      <Main>{children}</Main>
    </>
  )
}
