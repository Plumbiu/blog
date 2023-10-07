import { loadArchives } from '@/lib/archives'
import { getPosts } from '@/lib/node/article'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const posts = await getPosts()
  const archives: Archeve[] = loadArchives(posts)
  const years: ArcheveYear[] = archives.map(({ year, articles }) => ({
    year,
    num: articles.length,
  }))
  return NextResponse.json(years)
}
