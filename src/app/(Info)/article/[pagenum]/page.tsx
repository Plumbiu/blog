import type { Metadata } from 'next'
import { Suspense } from 'react'
import Loading from './loading'
import { useGet } from '@/lib/api'
import Pagination from '@/components/ui/Pagination'
import { articleNum } from '~/config/sideCard.json'
import ArticleBanner from '@/components/ui/Banner'

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
  const data = await useGet<IFrontMatter[]>(
    'article?pagenum=' + (Number(params.pagenum) - 1),
  )

  return (
    <Suspense fallback={<Loading />}>
      <ArticleBanner col={1} posts={data} name="文章页" />
      <Pagination page={Number(params.pagenum)} />
    </Suspense>
  )
}

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `Plumbiu | 文章 - 第${params.pagenum}页`,
    description: 'Plumbiu 的文章页 - ' + params.pagenum,
  }
}
