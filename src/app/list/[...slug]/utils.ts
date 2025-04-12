import type { PostList } from '~/markdown/utils/fs'
import { entries } from '@/lib/types'

type FloatType = Record<string, PostList[]>

function getYear(date: number) {
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
