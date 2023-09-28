import { getTags } from '@/lib/node/tags'
import { NextResponse } from 'next/server'

export async function GET() {
  const map = await getTags()
  const tags: Tag[] = []
  for (const [name, count] of map) {
    tags.push({
      name,
      count,
    })
  }
  return NextResponse.json(tags.sort((a, b) => b.count - a.count))
}
