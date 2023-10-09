import { loadArchives } from '@/lib/archives'
import { getPosts } from '@/lib/node/article'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const posts = await getPosts()
  const archives: IArcheve[] = loadArchives(posts)
  const years: IArcheveYear[] = archives.map(({ year, articles }) => ({
    year,
    num: articles.length,
  }))
  return NextResponse.json(years)
}
