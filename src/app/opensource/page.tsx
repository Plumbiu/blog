import type { Metadata } from 'next'
import OpenSourceCmp from '@/components/app/OpenSource'
import { name } from '@/lib/json'
import Nav from '@/components/app/Container/Nav'

export default function Opensource() {
  return (
    <>
      <Nav scope="opensource" />
      <OpenSourceCmp />
    </>
  )
}

export const metadata: Metadata = {
  title: `${name} | 开源之旅`,
  description: `这里是 ${name} 开源旅程`,
}
