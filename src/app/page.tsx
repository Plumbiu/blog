import type { Metadata } from 'next'
import { useGet } from '@/lib/api'
import { articleNum, name } from '@/lib/json'
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
    'article',
  )

  return (
    <ArticleBanner posts={data} name="文章页" />
  )
}

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `${name} | 文章`,
    description: `${name} 的文章页`,
  }
}
