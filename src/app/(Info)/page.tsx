import * as React from 'react'
import type { Metadata } from 'next'
import { useGet } from '@/lib/api'
import ArticleBanner from '@/components/ui/Banner'

export default async function Home() {
  const data = await useGet<IFrontMatter[]>('article?pagenum=0')

  return <ArticleBanner col={1} posts={data} name="文章页" />
}

export const metadata: Metadata = {
  title: 'Plumbiu | 首页',
  description: '这里是 Plumbiu 的个人介绍首页',
}
