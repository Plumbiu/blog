import { Metadata } from 'next'
import { upperFirstChar } from '@/utils'
import { getPostList } from '@/utils/node'
import { PostDir } from '@/constants'
import NotFound from '@/app/not-found'
import AsideLeft from './components/AsideLeft'
import { formatPostByYear } from './utils'
import ArtlistAction from './components/Action'
import ArtList from './components/List'
import ArtlistPagination from './components/Pagination'

const MAX_PAGE_SIZE = 4

interface Params {
  id: string
  pagenum: string
}
export async function generateStaticParams() {
  const result: Params[] = []

  await Promise.all(
    PostDir.map(async (id) => {
      const post = await getPostList(id)
      for (let i = 1; i <= Math.ceil(post.length / MAX_PAGE_SIZE); i++) {
        result.push({
          id,
          pagenum: String(i),
        })
      }
    }),
  )
  return result
}

interface ListProps {
  params: Promise<Params>
}

async function ArtlistAll(props: ListProps) {
  const params = await props.params
  const id = params.id

  const pagenum = +params.pagenum
  const allLists = await getPostList(id)
  const floatLists = formatPostByYear(allLists)
  const pageCount = Math.ceil(allLists.length / MAX_PAGE_SIZE)

  if (pagenum > pageCount) {
    return <NotFound />
  }

  const showLists = formatPostByYear(
    allLists.slice((pagenum - 1) * MAX_PAGE_SIZE, pagenum * MAX_PAGE_SIZE),
  )
  return (
    <div className="center">
      <AsideLeft items={floatLists} />
      <ArtlistAction id={id} />
      <ArtList lists={showLists} />
      <ArtlistPagination
        id={id}
        pagenum={pagenum}
        lists={allLists}
        pageCount={pageCount}
      />
    </div>
  )
}

export default ArtlistAll

export async function generateMetadata(props: ListProps): Promise<Metadata> {
  const params = (await props.params).id
  return {
    title: `${upperFirstChar(params || 'blog')} | 文章`,
  }
}
