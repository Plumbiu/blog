import ArticleList from '@/components/Article/List'
import PaginationCmp from '@/components/Article/Pagination'
import Hr from '@/components/ui/Hr'
import { useRequest } from '@/lib/api'
import { Suspense } from 'react'
import Loading from './loading'

interface Props {
  params: {
    pagenum: string
  }
}

export async function generateStaticParams() {
  const posts = await useRequest<FullFrontMatter[]>('article')
  const nums = posts.map((_post, index) => ({
    pagenum: String(index + 1),
  }))
  return nums
}

export default async function ({ params }: Props) {
  const data = await useRequest<FullFrontMatter[]>(
    'article?pagenum=' + (Number(params.pagenum) - 1),
  )

  return (
    <Suspense fallback={<Loading />}>
      <ArticleList list={data} />
      <Hr />
      <PaginationCmp page={Number(params.pagenum)} />
    </Suspense>
  )
}
