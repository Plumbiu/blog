import InfoCard from '@/components/InfoCard'
import Main from '@/components/ui/Main'
import type { Metadata } from 'next'
import type { FC, ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Plumbiu の 小屋',
  description: 'Welcome to my blog!',
}

interface Props {
  children: ReactNode
}

const page: FC<Props> = ({ children }) => {
  return (
    <>
      <InfoCard />
      <Main>{children}</Main>
    </>
  )
}

export default page
