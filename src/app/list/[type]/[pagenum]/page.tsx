import type { Metadata } from 'next'
import { upperFirstChar } from '@/utils'
import { getPostList } from '@/utils/node/markdown'
import { PostDir } from '@/constants'
import NotFound from '@/app/not-found'
import { generateSeoMetaData, joinWebUrl } from '@/app/seo'
import { MAX_PAGE_SIZE } from '@/app/list/constants'
import { BlogTitle } from '~/data/site'
import AsideLeft from './components/AsideLeft'
import { formatPostByYear } from './utils'
import ArtlistAction from './components/Action'
import ArtList from './components/List'
import ArtlistPagination from './components/Pagination'

interface Params {
  type: string
  pagenum: string
}
export async function generateStaticParams() {
  const result: Params[] = []

  await Promise.all(
    PostDir.map(async (type) => {
      const post = await getPostList(type)
      for (let i = 1; i <= Math.ceil(post.length / MAX_PAGE_SIZE); i++) {
        result.push({
          type,
          pagenum: String(i),
        })
      }
    }),
  )
  return result
}

interface ListProps {
  params: Params
}

async function ArtlistAll({ params }: ListProps) {
  const type = params.type

  const pagenum = +params.pagenum
  const allLists = await getPostList(type)
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
      <ArtlistAction type={type} />
      <ArtList lists={showLists} />
      <ArtlistPagination
        type={type}
        pagenum={pagenum}
        lists={allLists}
        pageCount={pageCount}
      />
    </div>
  )
}

export default ArtlistAll

export async function generateMetadata(props: ListProps): Promise<Metadata> {
  const { type, pagenum } = props.params
  const title = `${upperFirstChar(type || 'blog')} | ${BlogTitle}`
  return {
    title,
    ...generateSeoMetaData({
      title,
      description: `${upperFirstChar(type)}文章 - 第${pagenum}页`,
      url: joinWebUrl('list', type, pagenum),
    }),
  }
}
