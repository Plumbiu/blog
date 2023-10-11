import { getPosts } from './article'

export async function getCategories() {
  const posts = await getPosts()
  const map = new Map<string, number>()
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
