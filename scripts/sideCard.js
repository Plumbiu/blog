import fs from 'node:fs/promises'
import path from 'node:path'
import parseFM from 'simple-md-front-matter'

async function getPosts() {
  const postsPath = path.join(process.cwd(), 'src', 'posts')
  const rawPosts = await fs.readdir(postsPath)
  const posts = []
  for (const post of rawPosts) {
    const file = await fs.readFile(path.join(postsPath, post), 'utf-8')
    const end = file.indexOf('---', 3)
    const desc = file.slice(end + 3, end + 120).replace(/[#`\s]/g, '')
    posts.push({
      id: post,
      desc,
      ...parseFM(file),
    })
  }
  return posts
}

async function getCategories() {
  const posts = await getPosts()
  const map = new Map()
  for (const post of posts) {
    for (const category of post.categories) {
      const count = map.get(category)
      if (count) {
        map.set(category, count + 1)
      } else {
        map.set(category, 1)
      }
    }
  }
  return map
}

async function resolve() {
  const posts = await getPosts()

  const categoryMap = new Map()
  const tagMap = new Map()
  for (const post of posts) {
    for (const category of post.categories) {
      const count = categoryMap.get(category)
      if (count) {
        categoryMap.set(category, count + 1)
      } else {
        categoryMap.set(category, 1)
      }
    }
    for (const tag of post.tags) {
      const count = tagMap.get(tag)
      if (count) {
        tagMap.set(tag, count + 1)
      } else {
        tagMap.set(tag, 1)
      }
    }
  }
  const articleNum = posts.length
  const categoryNum = categoryMap.size
  const tagNum = tagMap.size
  fs.writeFile(
    path.join(process.cwd(), 'src', 'config', 'sideCard.json'),
    JSON.stringify({
      articleNum,
      categoryNum,
      tagNum,
    }),
  )
}

resolve()
