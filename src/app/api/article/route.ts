import { getPosts } from '@/lib/node/article'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tag = searchParams.get('tag')

  const posts = await getPosts()
  if (tag) {
    const filtedPosts = posts.filter((post) => post.tags.includes(tag)) ?? []
    return NextResponse.json(filtedPosts)
  }
  return NextResponse.json(posts)
}
