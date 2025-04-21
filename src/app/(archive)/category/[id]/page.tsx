import { getPost } from '~/markdown/utils/fs'
import TimeLine from '../../components/Timeline'

interface Params {
  // [category, pagenum]
  id: string
}

interface CategoryProps {
  params: Promise<Params>
}

function formatYear(n: number) {
  const date = new Date(n)

  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

async function CategoryPage(props: CategoryProps) {
  const { id } = await props.params
  const posts = await getPost((post) => post.type === id)

  return <TimeLine posts={posts} />
}

export default CategoryPage
