import type { Metadata } from 'next'
import { upperFirstChar } from '@/lib/shared'
import { getPostByPostType } from '~/markdown/utils/fs'
import { PostDir } from '~/constants/shared'
import NotFound from '@/app/not-found'
import { generateSeoMetaData, joinWebUrl } from '@/app/seo'
import { MAX_PAGE_SIZE } from './constants'
import { BlogTitle } from '~/data/site'
import { formatPostByYear } from './utils'
import ArtList from './ui/List'
import ArtlistPagination from './ui/Pagination'

interface Params {
  // [type, pagenum]
  slug: string[] | undefined
}
export async function generateStaticParams() {
  const result: Params[] = PostDir.map((type) => ({
    slug: [type],
  }))
  result.push({
    slug: undefined,
  })

  let total = 0

  await Promise.all(
    PostDir.map(async (type) => {
      const posts = await getPostByPostType(type)
      total += posts.length
      for (let i = 1; i <= Math.ceil(posts.length / MAX_PAGE_SIZE); i++) {
        result.push({
          slug: [type, String(i)],
        })
      }
    }),
  )
  for (let i = 1; i < Math.ceil(total / MAX_PAGE_SIZE); i++) {
    result.push({
      slug: [String(i)],
    })
  }
  return result
}

interface ListProps {
  params: Promise<Params>
}
const NumRegx = /\d+/

function getParams(slug: string[] | undefined) {
  console.log(slug)
  if (!slug) {
    return { pagenum: 1 }
  }
  // list/1
  // list/blog
  if (slug.length === 1) {
    const ch = slug[0]
    if (NumRegx.test(ch)) {
      return { pagenum: +ch }
    }
    return { type: slug[0], pagenum: 1 }
  }
  // list/blog/1
  return {
    type: slug[0],
    pagenum: +slug[1],
  }
}

async function ArtlistAll(props: ListProps) {
  const params = await props?.params
  const { type, pagenum } = getParams(params.slug)
  const listData = await getPostByPostType(type)
  const pageCount = Math.ceil(listData.length / MAX_PAGE_SIZE)
  if (pagenum > pageCount) {
    return <NotFound />
  }
  const floatLists = formatPostByYear(listData)

  const showLists = formatPostByYear(
    listData.slice((pagenum - 1) * MAX_PAGE_SIZE, pagenum * MAX_PAGE_SIZE),
  )
  return (
    <>
      <div>
        <ArtList lists={showLists} />
        <ArtlistPagination
          type={type}
          pagenum={pagenum}
          lists={listData}
          pageCount={pageCount}
        />
      </div>
    </>
  )
}

export default ArtlistAll

export async function generateMetadata(props: ListProps): Promise<Metadata> {
  const params = await props.params
  let [type, pagenum = 1] = params?.slug ?? []
  pagenum = +pagenum

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
