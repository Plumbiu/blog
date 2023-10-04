import type { Metadata } from 'next'
import CategoriesCmp from '@/components/Categories'
import { useRequest } from '@/lib/api'

const Categories = async () => {
  const categories = await useRequest<Tag[]>('categories')

  return <CategoriesCmp categories={categories} />
}

export default Categories

export const metadata: Metadata = {
  title: 'Plumbiu | 分类',
  description: '这里是 Plumbiu 的文章分类页',
}
