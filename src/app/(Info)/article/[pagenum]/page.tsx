import { useRequest } from '@/lib/api'
import { Suspense } from 'react'
import Loading from './loading'
import Pagination from '@/components/ui/Pagination'
import { articleNum } from '@/config/sideCard.json'
import Banner from '@/components/ui/Banner'

interface Props {
  params: {
    pagenum: string
  }
}

export function generateStaticParams() {
  const nums = []
  for (let i = 1; i <= articleNum; i++) {
    nums.push({
      pagenum: String(i),
    })
  }
  return nums
}

export default async function ({ params }: Props) {
  const data = await useRequest<FullFrontMatter[]>(
    'article?pagenum=' + (Number(params.pagenum) - 1),
  )

  return (
    <Suspense fallback={<Loading />}>
      <Banner posts={data} name="文章页" path="/article/1" />
      <Pagination page={Number(params.pagenum)} />
    </Suspense>
  )
}
