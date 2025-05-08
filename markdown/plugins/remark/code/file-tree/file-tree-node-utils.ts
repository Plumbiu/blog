import fileTreeDataRawMap from '~/markdown/config/file-tree'
import type { TreeNode, TreeMap } from './file-tree-utils'
import { ExtensionIconMap, FileNameIconMap } from './file-tree-icon'
import { isString } from '@/lib/types'
import { readdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { keys } from 'es-toolkit/compat'

const DefaultFile = 'default_file'

const fileTreeDataFormatMap: Record<string, string> = {}
function formatFileTreeDataMap(obj: Record<string, any>, path = '') {
  const keys = Object.keys(obj)
  for (const key of keys) {
    const data = obj[key]
    if (typeof data === 'object') {
      formatFileTreeDataMap(data, `${path}/${key}`)
    } else if (isString(data)) {
      fileTreeDataFormatMap[`${path}/${key}`] = data
    }
  }
  return fileTreeDataFormatMap
}

formatFileTreeDataMap(fileTreeDataRawMap)

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

function formatTreeMapKey(s: string) {
  if (s[0] === '/') {
    return s
  }
  if (s[0] === '.' && s[1] === '/') {
    return s.slice(1)
  }
  return '/' + s
}

const TreeRegx = /^(\s*)-\s(.*)$/

export async function parseContent(
  content: string,
  openAll: boolean,
  dir: string | undefined,
  id: string | undefined,
) {
  const root: TreeNode = {
    label: '',
    level: -1,
    path: '',
    collapse: false,
    children: [],
  }
  const stack: TreeNode[] = [root]
  const lines = content.trim().split('\n')

  const treeMap: TreeMap = {}
  const defaultSelectors: string[] = []
  const fileIconMap: Record<string, string> = {}
  let tree: TreeNode[] = []
  if (dir) {
    const files = readdirSync(dir, {
      recursive: true,
      encoding: 'utf-8',
      withFileTypes: true,
    })
    await Promise.all(
      files.map(async (p) => {
        const filePath = `${p.parentPath}/${p.name}`.replaceAll('\\', '/')
        if (p.isFile()) {
          const content = await readFile(filePath, 'utf-8')
          treeMap[formatTreeMapKey(filePath)] = content
        }
      }),
    )
    const prefixDir = formatTreeMapKey(dir)
    const levelOffset = prefixDir.split('/').length - 1
    const tmp: Record<string, any> = { result: tree }
    for (const paths of keys(treeMap)) {
      const segments = paths.slice(1).split('/')
      segments.reduce((r, label, i) => {
        if (!r[label]) {
          r[label] = { result: [] }
          const firstCh = label[0]
          const node: TreeNode = {
            label,
            level: i - levelOffset,
            collapse:
              firstCh === '+' ? false : firstCh === '-' ? true : !openAll,
            children: r[label].result,
            path: formatTreeMapKey(segments.slice(0, i + 1).join('/')),
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
    tree = currTree
  } else {
    for (const line of lines) {
      const [_, space, label] = line.match(TreeRegx) ?? []
      if (space == null || label == null) {
        continue
      }
      const firstCh = label[0]
      const level = Math.floor(space.length / 2)
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop()
      }
      const parent = stack[stack.length - 1]
      const path = `${parent.path}/${
        firstCh === '+' || firstCh === '-' ? label.slice(1) : label
      }`
      const node: TreeNode = {
        label,
        level,
        collapse: firstCh === '+' ? false : firstCh === '-' ? true : !openAll,
        children: [],
        path,
      }

      parent.children.push(node)
      stack.push(node)
    }

    tree = root.children
  }
  function traverse(nodes: TreeNode[]) {
    for (const node of nodes) {
      const key = node.path
      const firstCh = node.label[0]
      if (firstCh === '+' || firstCh === '-') {
        node.label = node.label.slice(1)
      }
      if (node.children.length === 0) {
        if (firstCh === '+') {
          defaultSelectors.push(node.path)
        }
        fileIconMap[key] = getIconFromFileName(node.label)
        if (id && !dir) {
          treeMap[key] = fileTreeDataFormatMap[formatTreeMapKey(id + key)]
        }
      } else {
        node.children.sort(childSort)
        traverse(node.children)
      }
    }
  }
  traverse(tree)
  tree.sort(childSort)
  return { tree, treeMap, fileIconMap, defaultSelectors }
}

function childSort(prev: TreeNode, next: TreeNode) {
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
