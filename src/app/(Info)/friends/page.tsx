import type { Metadata } from 'next'
// import friends from '~/config/friends.json'
import Title from '@/components/ui/Title'

export const metadata: Metadata = {
  title: 'Plumbiu | 朋友们',
  description: '这里是 Plumbiu 的朋友',
}

const Friends = () => {
  return (
    <>
      <Title>朋友们(暂未开发完成)</Title>
      暂未开发完成
    </>
  )
}

export default Friends
