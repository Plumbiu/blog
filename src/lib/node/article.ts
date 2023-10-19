import fsp from 'node:fs/promises'
import path from 'node:path'
import parseFM from 'simple-md-front-matter'
import { articleLimit } from '../config'
import { perfixTime } from '../time'

function datePriority(d: string) {
  return Number(perfixTime(d).replace(/-/g, ''))
}

export async function getPosts(pagenum = 0, isLimit = false) {
  const postsPath = path.join(process.cwd(), 'posts')
  const start = pagenum * articleLimit
  const DATEREG = /([\d]{4}-[\d]+-[\d]+)/
  let rawPosts = (await fsp.readdir(postsPath)).sort((a, b) => {
    const d1 = datePriority(DATEREG.exec(a)?.[0]!)
    const d2 = datePriority(DATEREG.exec(b)?.[0]!)

    return d2 - d1
  })
  if (isLimit) {
    rawPosts = rawPosts.slice(start, start + articleLimit)
  }
  const posts: IFrontMatter[] = []
  for (const post of rawPosts) {
    const file = await fsp.readFile(path.join(postsPath, post), 'utf-8')
    const end = file.indexOf('---', 3)
    const desc = file
      .slice(end + 3, end + 200)
      .replace(/[#`\s-*!]/g, '')
      .replace(/\[[\w\W]*\]\(/g, ' ')
      .replace(')', ' ')
    posts.push({
      id: post,
      ...parseFM<TRawFrontMatter>(file),
      desc,
    })
  }
  posts.sort((a, b) => b.date.getTime() - a.date.getTime())

  return posts
}
