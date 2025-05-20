import { readdir, readFile } from 'node:fs/promises'
import { join } from 'pathe'
import { keys } from '@/lib/types'
import type { TreeMap, TreeNode, ParseContentOptions } from '../types'
import { formatPath } from './format'
import { isLabelStartswithConfigCh } from '../file-tree-utils'

export function treeMapToTree(treeMap: TreeMap, options: ParseContentOptions) {
  const tree: TreeNode[] = []

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

export async function buildTreeMapByFs({
  dir,
  parentMeta,
}: ParseContentOptions) {
  const treeMap: TreeMap = {}

  const files = await readdir(dir!, {
    recursive: true,
    encoding: 'utf-8',
    withFileTypes: true,
  })
  await Promise.all(
    files.map(async (p) => {
      const filePath = join(p.parentPath, p.name)
      if (p.isFile()) {
        const content = await readFile(filePath, 'utf-8')
        treeMap[formatPath(filePath)] = {
          code: content,
          meta: parentMeta,
        }
      }
    }),
  )

  return treeMap
}

/**
 * shorten dir path
 * @example src -> utils -> index.ts ==> src/utils -> index.ts
 */
export function shortenDirPath(node: TreeNode) {
  const initLevel = node.level

  while (node.children.length === 1 && node.children[0].children.length > 0) {
    node.label = node.label + '/' + node.children[0].label
    node.children = node.children[0].children
  }
  node.level = initLevel
  node.children.forEach((item) => (item.level = initLevel + 1))
}

const TreeLabelRegx = /^(\s*)-\s(.*)$/
export function buildTreeByContent(
  content: string,
  { openAll }: ParseContentOptions,
) {
  const root: TreeNode = {
    label: '',
    level: -1,
    path: '',
    collapse: false,
    children: [],
  }
  const stack: TreeNode[] = [root]
  const lines = content.split('\n')
  for (const line of lines) {
    const [_, space, label] = line.match(TreeLabelRegx) ?? []
    if (space == null || label == null) {
      continue
    }
    const firstCh = label[0]
    const level = Math.floor(space.length / 2)
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop()
    }
    const parent = stack[stack.length - 1]
    const p = formatPath(
      parent.path +
        '/' +
        (isLabelStartswithConfigCh(label) ? label.slice(1) : label),
    )
    const node: TreeNode = {
      label,
      level,
      collapse: firstCh === '+' ? false : firstCh === '-' ? true : !openAll,
      children: [],
      path: p,
    }

    parent.children.push(node)
    stack.push(node)
  }
  return root.children
}
