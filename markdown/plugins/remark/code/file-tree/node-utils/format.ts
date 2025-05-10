import { normalizeString } from 'pathe'
import type { TreeMap } from '../types'
import { isString, keys } from '@/lib/types'

export function formatPath(s: string) {
  return normalizeString(s, false)
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
    const nextPath = `${path}/${key}`
    if (typeof data === 'object') {
      formatFileTreeDataMap(result, data, nextPath)
    } else if (isString(data)) {
      // /markdown/foo.ts -> markdown/foo.ts
      result[formatPath(nextPath)] = data
    }
  }
}
