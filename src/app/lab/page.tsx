import type { Metadata } from 'next'
import LabCmp from '@/components/app/Lab'
import { name } from '@/lib/json'
import '@/components/app/Lab/index.css'

export const metadata: Metadata = {
  title: `${name} | 实验室`,
  description: `这里是 ${name} 的实验室`,
}

const Lab = () => {
  return <LabCmp />
}

export default Lab
