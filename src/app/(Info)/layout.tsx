import { Suspense } from 'react'
import type { Metadata } from 'next'
import Loading from './loading'
import Main from '@/components/app/Container/Main'
import RightCard from '@/components/app/SideCard'
import { name } from '~/config.json'
import Nav from '@/components/app/Nav'

export const metadata: Metadata = {
  title: `${name} の 小屋`,
  description: 'Welcome to my blog!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<Loading />}>
      <Main>
        {children}
      </Main>
      <RightCard />
    </Suspense>
  )
}
