import fileTreeDataRawMap from '~/markdown/config/file-tree'
import type { TreeNode, TreeMap } from './file-tree-utils'
import { ExtensionIconMap, FileNameIconMap } from './file-tree-icon'
import { isString } from '@/lib/types'

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

const TreeRegx = /^(\s*)-\s(.*)$/

export function parseContent(content: string, id: string, openAll: boolean) {
  const data = fileTreeDataRawMap[id]
  if (data == null) {
    return
  }
  const root: TreeNode = {
    label: '',
    level: -1,
    path: '',
    collapse: false,
    children: [],
  }
  const stack: TreeNode[] = [root]
  const lines = content.trim().split('\n')

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

  const treeMap: TreeMap = {}
  const defaultSelectors: string[] = []
  const fileIconMap: Record<string, string> = {}
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
        treeMap[key] = fileTreeDataFormatMap[`/${id}${key}`]
      } else {
        traverse(node.children)
      }
    }
  }
  const tree = root.children
  traverse(tree)

  return { tree, treeMap, fileIconMap, defaultSelectors }
}
