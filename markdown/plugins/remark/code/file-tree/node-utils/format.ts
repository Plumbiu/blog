import type { TreeMap } from '../types'
import { isString, keys } from '@/lib/types'

export function formatPath(s: string) {
  if (s[0] === '/') {
    return s.slice(1)
  }
  if (s[0] === '.' && s[1] === '/') {
    return s.slice(2)
  }
  return s
}

export function formatTreeMap(treeMap: TreeMap) {
  const map: TreeMap = {}
  const treeMapKeys = keys(treeMap)
  for (const key of treeMapKeys) {
    map[formatPath(key)] = treeMap[key]
  }
  return map
}

export function formatFileTreeDataMap(
  result: Record<string, any>,
  obj: Record<string, any>,
  path = '',
) {
  const keys = Object.keys(obj)
  for (const key of keys) {
    const data = obj[key]
    if (typeof data === 'object') {
      formatFileTreeDataMap(result, data, `${path}/${key}`)
    } else if (isString(data)) {
      // /markdown/foo.ts -> markdown/foo.ts
      result[`${path}/${key}`.slice(1)] = data
    }
  }
}
