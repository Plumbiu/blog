import fsp from 'node:fs/promises'
import path from 'node:path'
import parseFM from 'simple-md-front-matter'

const limit = 12

export async function getPosts(pagenum = 0, isLimit = false) {
  const postsPath = path.join(process.cwd(), 'src', 'posts')
  const start = pagenum * limit
  const DATEREG = /([\d]{4}-[\d]+-[\d]+)/
  let rawPosts = (await fsp.readdir(postsPath)).sort((a, b) => {
    return (
      Number(DATEREG.exec(b)?.[0].replace(/-/g, '')) -
      Number(DATEREG.exec(a)?.[0].replace(/-/g, ''))
    )
  })
  if (isLimit) {
    rawPosts = rawPosts.slice(start, start + limit)
  }
  const posts: FullFrontMatter[] = []
  for (const post of rawPosts) {
    const file = await fsp.readFile(path.join(postsPath, post), 'utf-8')
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
