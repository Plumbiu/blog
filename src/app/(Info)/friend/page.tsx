import type { Metadata } from 'next'
import Title from '@/components/ui/Title'
import FriendsCmp from '@/components/app/Friends'

export const metadata: Metadata = {
  title: 'Plumbiu | 朋友们',
  description: '这里是 Plumbiu 的朋友',
}

const Friends = () => {
  return (
    <>
      <Title>朋友们</Title>
      <FriendsCmp />
    </>
  )
}

export default Friends
