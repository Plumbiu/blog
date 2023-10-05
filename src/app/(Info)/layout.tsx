import type { Metadata } from 'next'
import LeftSideCard from '@/components/ui/SideCard/Left'
import Main from '@/components/ui/Container/Main'
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
      <LeftSideCard />
      <Suspense fallback={<Loading />}>
        <Main>{children}</Main>
      </Suspense>
    </>
  )
}
