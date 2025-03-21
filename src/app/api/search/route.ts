import { getPostList } from '@/utils/node/markdown'

export async function GET() {
  const data = (await getPostList()).map((item) => ({
    date: new Date(item.meta.date).toISOString().split('T')[0],
    title: item.meta.title,
    path: item.path,
    type: item.type,
  }))
  return Response.json(data)
}
