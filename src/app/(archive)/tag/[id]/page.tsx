import { getAllTags, getPost } from '~/markdown/utils/fs'
import TimeLine from '../../components/Timeline'

interface Params {
  // [category, pagenum]
  id: string
}

interface CategoryProps {
  params: Promise<Params>
}

export async function generateStaticParams() {
  const tags = await getAllTags()
  return tags.map((tag) => ({
    id: tag,
  }))
}

async function TagPage(props: CategoryProps) {
  const { id } = await props.params
  const posts = await getPost((post) => !!post.meta.tags?.includes(id))

  return (
    <div className="main_content">
      <TimeLine posts={posts} />
    </div>
  )
}

export default TagPage
