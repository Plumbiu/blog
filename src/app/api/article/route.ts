import { getPosts } from '@/lib/node/article'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  let posts: FullFrontMatter[]
  const { searchParams } = new URL(req.url)
  // 1. pagenum searchParams
  const pagenum = searchParams.get('pagenum')
  // we need full articles for SSG
  if (pagenum !== null) {
    posts = await getPosts(Number(pagenum), true)
  } else {
    posts = await getPosts(Number(pagenum))
  }
  // 2. tag searchParams
  const tag = searchParams.get('tag')

  if (tag !== null) {
    posts = posts.filter((post) => post.tags.includes(tag)) ?? []
  }
  return NextResponse.json(posts)
}
