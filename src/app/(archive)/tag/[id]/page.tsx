import { getPost } from '~/markdown/utils/fs'
import TimeLine from '../../components/Timeline'

interface Params {
  // [category, pagenum]
  id: string
}

interface CategoryProps {
  params: Promise<Params>
}

async function TagPage(props: CategoryProps) {
  const { id } = await props.params
  const posts = await getPost((post) => post.meta.tags?.includes(id))

  return <TimeLine posts={posts} />
}

export default TagPage
