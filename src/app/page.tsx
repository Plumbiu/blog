import * as React from 'react'
import type { Metadata } from 'next'
import { useGet } from '@/lib/api'
import ArticleBanner from '@/components/ui/Banner'
import { name } from '@/lib/json'
import Nav from '@/components/app/Container/Nav'

export default async function Home() {
  const data = await useGet<IFrontMatter[]>('article?pagenum=0&limit=5')

  return (
    <>
      <Nav scope="home" />
      <ArticleBanner posts={data} name="文章页" />
    </>
  )
}

export const metadata: Metadata = {
  title: `${name} | 首页`,
  description: `这里是 ${name} 的个人介绍首页`,
}
