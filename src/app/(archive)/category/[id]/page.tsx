import { getPost } from '~/markdown/utils/fs'
import TimeLine from '../../components/Timeline'
import { Categoires } from '~/constants/shared'

interface Params {
  // [category, pagenum]
  id: string
}

interface CategoryProps {
  params: Promise<Params>
}

export async function generateStaticParams() {
  const result: Params[] = Categoires.map((type) => ({
    id: type,
  }))
  return result
}

async function CategoryPage(props: CategoryProps) {
  const { id } = await props.params
  const posts = await getPost((post) => post.type === id)

  return <TimeLine posts={posts} />
}

export default CategoryPage
