import type { Metadata } from 'next'
import OpenSourceCmp from '@/components/OpenSource'

export default function Home() {
  return <OpenSourceCmp />
}

export const metadata: Metadata = {
  title: 'Plumbiu | 开源之旅',
  description: '这里是 Plumbiu 开源旅程',
}
