import { NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import parseFM from 'simple-md-front-matter'

export async function GET() {
  const postsPath = path.join(process.cwd(), 'src', 'posts')
  const rawPosts = await fs.readdir(postsPath)
  const map = new Map<string, number>()
  for (const post of rawPosts) {
    const file = await fs.readFile(path.join(postsPath, post), 'utf-8')
    const fm = parseFM<RawMatter>(file)
    for (const tag of fm.tags) {
      const count = map.get(tag)
      if (count) {
        map.set(tag, count + 1)
      } else {
        map.set(tag, 1)
      }
    }
  }
  const tags: Tag[] = []
  for (const [name, count] of map) {
    tags.push({
      name,
      count,
    })
  }
  return NextResponse.json(tags.sort((a, b) => b.count - a.count))
}
