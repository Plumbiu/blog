import { getTags } from '@/lib/node/tags'

export async function GET() {
  const map = await getTags()
  const tags: Tag[] = []
  for (const [name, count] of map) {
    tags.push({
      name,
      count,
    })
  }

  return Response.json(tags.sort((a, b) => b.count - a.count))
}
