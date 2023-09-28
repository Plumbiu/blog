import fsp from 'node:fs/promises'
import path from 'node:path'
import parseFM from 'simple-md-front-matter'

export async function getPosts() {
  const postsPath = path.join(process.cwd(), 'src', 'posts')

  const rawPosts = await fsp.readdir(postsPath)
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
