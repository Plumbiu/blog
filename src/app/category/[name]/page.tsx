import type { Metadata } from 'next'
import { useGet } from '@/lib/api'
import ArticleBanner from '@/components/ui/Banner'
import { name } from '@/lib/json'

interface Props {
  params: {
    name: string
  }
}

export async function generateStaticParams() {
  const categories = await useGet<Tag[]>('category')

  return categories.map(category => ({
    name: category.name,
  }))
}

const CategoryName = async ({ params }: Props) => {
  const posts = await useGet<IFrontMatter[]>('article?category=' + params.name)

  return <ArticleBanner posts={posts} name={params.name} />
}

export default CategoryName

export function generateMetadata({ params }: Props): Metadata {
  const decodedName = decodeURI(params.name)

  return {
    title: `${name} | 分类 - ${decodedName}`,
    description: `${name} 的分类页 - ${decodedName}`,
  }
}
