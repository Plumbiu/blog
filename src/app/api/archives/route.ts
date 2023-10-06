import { loadArchives } from '@/lib/archives'
import { getPosts } from '@/lib/node/article'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const posts = await getPosts()
  let archives: Archeve[] | Archeve = loadArchives(posts).sort((a, b) => Number(b.year) - Number(a.year))
  const limit = searchParams.get('limit')
  if (limit !== null) {
    archives = archives[0]
    archives.articles = archives.articles.slice(0, Number(limit))
  }
  return NextResponse.json(archives)
}
