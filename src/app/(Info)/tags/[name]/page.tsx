import { useRequest } from '@/lib/api'
import TagsList from '@/components/Tags/List'

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
  console.log(params.name)

  const posts = await useRequest<FullFrontMatter[]>(
    'article?tag=' + params.name,
  )

  return <TagsList posts={posts} />
}

export default TagsName
