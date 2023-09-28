import { getPosts } from './article'

export async function getTags() {
  const posts = await getPosts()
  const map = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.tags) {
      const count = map.get(tag)
      if (count) {
        map.set(tag, count + 1)
      } else {
        map.set(tag, 1)
      }
    }
  }
  return map
}
