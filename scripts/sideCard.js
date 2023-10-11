import fs from 'node:fs/promises'
import path from 'node:path'
import { getPosts } from './utils.js'

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
    path.join(process.cwd(), 'config', 'sideCard.json'),
    JSON.stringify({
      articleNum,
      categoryNum,
      tagNum,
    }),
  )
}

resolve()
