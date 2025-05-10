import { keys } from '@/lib/types'
import type { TreeMap, TreeNode, ParseContentOptions } from '../types'
import { formatPath } from './format'
import { ExtensionIconMap, FileNameIconMap } from './icon'
import { DefaultFile } from '../file-tree-utils'

export function treeMapToTree(
  treeMap: TreeMap,
  tree: TreeNode[],
  options: ParseContentOptions,
) {
  const { openAll, dir } = options
  const prefixDir = dir ? formatPath(dir) : null
  const levelOffset = prefixDir ? prefixDir.split('/').length : 0
  const tmp: Record<string, any> = { result: tree }
  for (const paths of keys(treeMap)) {
    const segments = paths.split('/')
    segments.reduce((r, label, i) => {
      if (!r[label]) {
        r[label] = { result: [] }
        const firstCh = label[0]
        const node: TreeNode = {
          label,
          level: i - levelOffset,
          collapse: firstCh === '+' ? false : firstCh === '-' ? true : !openAll,
          children: r[label].result,
          path: segments.slice(0, i + 1).join('/'),
        }
        r.result.push(node)
      }

      return r[label]
    }, tmp)
  }
  let currTree = tree
  while (currTree && currTree.length === 1) {
    const firstChildren = currTree[0]
    currTree = firstChildren.children
    if (firstChildren.path === prefixDir) {
      break
    }
  }
  return currTree
}

export function getIconFromFileName(filename: string) {
  if (FileNameIconMap[filename]) {
    return FileNameIconMap[filename]
  }
  const extIdx = filename.lastIndexOf('.')
  if (extIdx === -1) {
    return DefaultFile
  }
  const ext = filename.slice(extIdx + 1)
  return ExtensionIconMap[ext] || DefaultFile
}

export function treeSort(prev: TreeNode, next: TreeNode) {
  const nextChildrenLen = next.children.length
  const prevChildrenLen = prev.children.length

  if (prevChildrenLen > 0 && nextChildrenLen > 0) {
    return prev.label.localeCompare(next.label)
  }
  if (prevChildrenLen === 0 || nextChildrenLen === 0) {
    return nextChildrenLen - prevChildrenLen
  }
  return 0
}
