import { loadArchives } from '@/lib/archives'
import { getPosts } from '@/lib/node/article'
import { NextResponse } from 'next/server'

export async function GET() {
  const posts = await getPosts()
  const archives = loadArchives(posts)
  return NextResponse.json(archives.sort((a, b) => Number(b.year) - Number(a.year)))
}
