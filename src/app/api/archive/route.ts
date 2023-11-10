import { loadArchives } from '@/lib/archives'
import { getPosts } from '@/lib/node/article'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const posts = await getPosts()
  let archives = loadArchives(posts)
  // 1. limit searchParams
  const limit = searchParams.get('limit')
  if (limit !== null) {
    return Response.json(archives[0].articles.slice(0, Number(limit)))
  }
  // 2. year searchParams
  const year = searchParams.get('year')
  if (year !== null) {
    archives = archives.filter((archive) => archive.year === year) ?? []
  }

  return Response.json(archives)
}
