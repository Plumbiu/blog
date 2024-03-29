import type { Metadata } from 'next'
import FriendsCmp from '@/components/app/Friends'
import { name } from '@/lib/json'
import '@/components/app/Friends/index.css'

export const metadata: Metadata = {
  title: `${name} | 朋友们`,
  description: `这里是 ${name} 的朋友`,
}

const Friends = () => {
  return <FriendsCmp />
}

export default Friends
