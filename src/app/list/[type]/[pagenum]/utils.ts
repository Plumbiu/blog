import { PostList } from '@/utils/node/markdown'
import { FloatType } from './types'

export function getYear(date: number) {
  return String(new Date(date).getFullYear())
}

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
