import type { Metadata } from 'next'
import ArticleBanner from '@/components/ui/Banner'
import { useGet } from '@/lib/api'
import { name } from '@/lib/json'

interface Props {
  params: {
    name: string
  }
}

export async function generateStaticParams() {
  const tags = await useGet<Tag[]>('tag')

  return tags.map((tag) => ({
    name: tag.name,
  }))
}

const TagName = async ({ params }: Props) => {
  const posts = await useGet<IFrontMatter[]>('article?tag=' + params.name)

  return <ArticleBanner name={params.name} posts={posts} />
}

export default TagName

export function generateMetadata({ params }: Props): Metadata {
  const decodedName = decodeURI(params.name)

  return {
    title: `${name} | 标签 - ${decodedName}`,
    description: `${name} 的标签页 - ${decodedName}`,
  }
}
