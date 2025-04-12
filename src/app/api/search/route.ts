import { getPostByPostType } from '~/markdown/utils/fs'

export async function GET() {
  const data = (await getPostByPostType()).map((item) => ({
    date: new Date(item.meta.date).toISOString().split('T')[0],
    title: item.meta.title,
    path: item.path,
    type: item.type,
  }))
  return Response.json(data)
}
