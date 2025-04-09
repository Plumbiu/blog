import type { PostList } from '@/lib/node/markdown'
import type { FloatType } from './types'
import { entries } from '@/lib/types'

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
  return entries(map).sort(([a], [b]) => +b - +a)
}
