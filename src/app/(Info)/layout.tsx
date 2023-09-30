import type { Metadata } from 'next'
import InfoCard from '@/components/SideCard'
import Main from '@/components/ui/Main'
import { Suspense } from 'react'
import Loading from './loading'

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
      <Suspense fallback={<Loading />}>
        <Main>{children}</Main>
      </Suspense>
    </>
  )
}
