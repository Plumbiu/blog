import fsp from 'node:fs/promises'
import path from 'node:path'
import parseFM from 'simple-md-front-matter'
import { articleLimit } from '../config'

export async function getPosts(pagenum = 0, isLimit = false) {
  const postsPath = path.join(process.cwd(), 'posts')
  const start = pagenum * articleLimit
  const DATEREG = /([\d]{4}-[\d]+-[\d]+)/
  let rawPosts = (await fsp.readdir(postsPath)).sort((a, b) => {
    return (
      Number(DATEREG.exec(b)?.[0].replace(/-/g, '')) -
      Number(DATEREG.exec(a)?.[0].replace(/-/g, ''))
    )
  })
  if (isLimit) {
    rawPosts = rawPosts.slice(start, start + articleLimit)
  }
  const posts: FullFrontMatter[] = []
  for (const post of rawPosts) {
    const file = await fsp.readFile(path.join(postsPath, post), 'utf-8')
    const end = file.indexOf('---', 3)
    const desc = file
      .slice(end + 3, end + 150)
      .replace(/[#`\s-*]/g, '')
      .replace(/\[[\w\W]*\]\(/g, ' ')
      .replace(')', ' ')
    posts.push({
      id: post,
      desc,
      ...parseFM<RawMatter>(file),
    })
  }
  posts.sort((a, b) => b.date.getTime() - a.date.getTime())
  return posts
}
