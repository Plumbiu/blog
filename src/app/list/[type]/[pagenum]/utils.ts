import { PostList } from '@/utils/node'
import { getYear } from '@/utils'
import { FloatType } from './types'

export function formatPostByYear(lists: PostList[]) {
  const map: FloatType = {}
  for (const list of lists) {
    const year = getYear(list.meta.date)
    if (!map[year]) {
      map[year] = []
    }
    map[year].push(list)
  }
  return Object.entries(map).sort(([a], [b]) => +b - +a)
}
