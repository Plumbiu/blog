import type { Metadata } from 'next'
import { upperFirstChar } from '@/lib'
import { getPostByPostType } from '@/lib/node/markdown'
import { PostDir } from '@/constants'
import NotFound from '@/app/not-found'
import { generateSeoMetaData, joinWebUrl } from '@/app/seo'
import { MAX_PAGE_SIZE } from '@/app/list/[...slug]/constants'
import { BlogTitle } from '~/data/site'
import AsideLeft from './ui/AsideLeft'
import { formatPostByYear } from './utils'
import ArtlistAction from './ui/Action'
import ArtList from './ui/List'
import ArtlistPagination from './ui/Pagination'

interface Params {
  // [type, pagenum]
  slug: string[]
}
export async function generateStaticParams() {
  const result: Params[] = PostDir.map((type) => ({
    slug: [type],
  }))
  await Promise.all(
    PostDir.map(async (type) => {
      const post = await getPostByPostType(type)
      for (let i = 1; i <= Math.ceil(post.length / MAX_PAGE_SIZE); i++) {
        result.push({
          slug: [type, String(i)],
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
  let [type, pagenum = 1] = params.slug
  pagenum = +pagenum

  const allLists = await getPostByPostType(type)
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
  const params = await props.params
  const [type, pagenum = 1] = params.slug

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
