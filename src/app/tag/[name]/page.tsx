import type { Metadata } from 'next'
import { useGet } from '@/lib/api'
import { name } from '@/lib/json'
import ArtList from '@/components/app/ArticleList'

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

  return <ArtList name={params.name} posts={posts} />
}

export default TagName

export function generateMetadata({ params }: Props): Metadata {
  const decodedName = decodeURI(params.name)

  return {
    title: `${name} | 标签 - ${decodedName}`,
    description: `${name} 的标签页 - ${decodedName}`,
  }
}
