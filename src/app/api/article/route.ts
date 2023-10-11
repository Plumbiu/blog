import { getPosts } from '@/lib/node/article'

export async function GET(req: Request) {
  let posts: IFullFrontMatter[]
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
    posts = posts.filter(post => post.tags.includes(tag)) ?? []
  }
  // 3. category searchParams
  const category = searchParams.get('category')
  if (category !== null) {
    posts = posts.filter(post => post.categories.includes(category)) ?? []
  }
  // 4. limit searchParams
  const limit = searchParams.get('limit')
  if (limit !== null) {
    posts = posts.slice(0, Number(limit))
  }

  return Response.json(posts)
}
