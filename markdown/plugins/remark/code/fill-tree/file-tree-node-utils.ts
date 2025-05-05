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

export function parseContent(content: string, id: string) {
  const data = fileTreeDataRawMap[id]
  if (data == null) {
    return
  }
  const root: TreeNode = {
    label: '',
    level: -1,
    lang: '',
    path: '',
    children: [],
    icon: '',
  }
  const stack: TreeNode[] = [root]
  const lines = content.trim().split('\n')

  for (const line of lines) {
    const [_, space, label] = line.match(TreeRegx) ?? []
    if (space == null || label == null) {
      continue
    }
    const level = Math.floor(space.length / 2)
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop()
    }
    const parent = stack[stack.length - 1]

    const path = `${parent.path}/${label}`
    const node: TreeNode = {
      label,
      level,
      children: [],
      path,
    }

    parent.children.push(node)
    stack.push(node)
  }

  const treeMap: TreeMap = {}
  function traverse(nodes: TreeNode[]) {
    for (const node of nodes) {
      const key = node.path
      const tokens = key.split('.')
      const lang =
        (tokens.length === 1 ? undefined : tokens[tokens.length - 1]) || 'txt'
      if (node.children.length === 0) {
        node.icon = getIconFromFileName(node.label)
        treeMap[key] = {
          lang,
          content: fileTreeDataFormatMap[`/${id}${key}`],
        }
      } else {
        traverse(node.children)
      }
    }
  }
  const tree = root.children
  traverse(tree)

  return { tree, treeMap }
}
