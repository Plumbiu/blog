import type { NextRequest } from 'next/server'
import { loadArchives } from '@/lib/archives'
import { getPosts } from '@/lib/node/article'

export async function GET(req: NextRequest) {
  const posts = await getPosts()
  const archives: IArcheve[] = loadArchives(posts)
  const years: IArcheveYear[] = archives.map(({ year, articles }) => ({
    year,
    num: articles.length,
  }))

  return Response.json(years)
}
