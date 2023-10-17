import path from 'path'
import fs from 'node:fs/promises'
import parseFM from 'simple-md-front-matter'

export async function getPosts() {
  const postsPath = path.join(process.cwd(), 'posts')
  const DATEREG = /([\d]{4}-[\d]+-[\d]+)/
  const rawPosts = (await fs.readdir(postsPath)).sort((a, b) => {
    return (
      Number(DATEREG.exec(b)?.[0].replace(/-/g, '')) -
      Number(DATEREG.exec(a)?.[0].replace(/-/g, ''))
    )
  })
  const posts = []
  for (const post of rawPosts) {
    const file = await fs.readFile(path.join(postsPath, post), 'utf-8')
    const end = file.indexOf('---', 3)
    const desc = file
      .slice(end + 3, end + 200)
      .replace(/[#`\s-*]/g, '')
      .replace(/\[[\w\W]*\]\(/g, ' ')
      .replace(')', ' ')
    posts.push({
      id: post,
      desc,
      ...parseFM(file),
    })
  }

  return posts
}

export async function readJSON(path) {
  const raw = await fs.readFile(path, 'utf-8')

  return JSON.parse(raw)
}
