import { useRequest } from '@/lib/api'
import ArticleBanner from '@/components/ui/Banner'

interface Props {
  params: {
    name: string
  }
}

export async function generateStaticParams() {
  const categories = await useRequest<Tag[]>('categories')
  return categories.map((category) => ({
    name: category.name,
  }))
}

const TagsName = async ({ params }: Props) => {
  const posts = await useRequest<FullFrontMatter[]>(
    'article?category=' + params.name,
  )

  return <ArticleBanner path="categories" posts={posts} name={params.name} />
}

export default TagsName
