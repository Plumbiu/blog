import type { Metadata } from 'next'
import FriendsCmp from '@/components/app/Friends'

export const metadata: Metadata = {
  title: 'Plumbiu | 朋友们',
  description: '这里是 Plumbiu 的朋友',
}

const Friends = () => {
  return <FriendsCmp />
}

export default Friends
