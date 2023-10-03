import ArticleBanner from '@/components/ui/Banner'
import { useRequest } from '@/lib/api'

interface Props {
  params: {
    name: string
  }
}

export async function generateStaticParams() {
  const tags = await useRequest<Tag[]>('tags')
  return tags.map((tag) => ({
    name: tag.name,
  }))
}

const TagsName = async ({ params }: Props) => {
  const posts = await useRequest<FullFrontMatter[]>(
    'article?tag=' + params.name,
  )

  return <ArticleBanner path="tags" posts={posts} name={params.name} />
}

export default TagsName
