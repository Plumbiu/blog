import { NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import parseFM from 'simple-md-front-matter'

async function getPosts() {
  const postsPath = path.join(process.cwd(), 'src', 'posts')
  const rawPosts = await fs.readdir(postsPath)
  const posts: FullFrontMatter[] = []
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
  posts.sort((a, b) => b.date.getTime() - a.date.getTime())
  return posts
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tag = searchParams.get('tag')
  // const pagenum = searchParams.get('pagenum')
  const posts = await getPosts()
  if (tag) {
    const filtedPosts = posts.filter((post) => post.tags.includes(tag)) ?? []
    return NextResponse.json(filtedPosts)
  }
  return NextResponse.json(posts)
}
