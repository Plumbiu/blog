import { NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import { dateSort } from '@/lib/posts'
import parseFM from 'simple-md-front-matter'

export async function GET() {
  const postsPath = path.join(process.cwd(), 'src', 'posts')
  const rawPosts = await fs.readdir(postsPath)
  const posts: Res[] = []
  for (const post of rawPosts) {
    const file = await fs.readFile(path.join(postsPath, post), 'utf-8')
    const end = file.indexOf('---', 3)
    const desc = file.slice(end + 3, end + 120).replace(/[#`\s]/g, '')
    posts.push({
      id: post,
      desc,
      ...parseFM<RawMatter>(file),
    })
  }
  return NextResponse.json(posts.sort((a, b) => dateSort(b.date, a.date)))
}
