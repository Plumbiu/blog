import { readdir, readFile } from 'node:fs/promises'
import type { TreeNode, TreeMap, ParseContentOptions } from '../types'
import { buildFiles } from '~/markdown/plugins/remark/utils'
import { CodeTabSplitString } from '~/markdown/plugins/constant'
import { formatFileTreeDataMap, formatPath, formatTreeMap } from './format'
import { getSuffix } from '~/markdown/plugins/utils'
import fileTreeDataRawMap from '~/markdown/config/file-tree'
import { getIconFromFileName, treeMapToTree, treeSort } from './support'
import { isLabelStartswithConfigCh } from '../file-tree-utils'

const fileTreeDataFormatMap: Record<string, string> = {}

formatFileTreeDataMap(fileTreeDataFormatMap, fileTreeDataRawMap)

const TreeLabelRegx = /^(\s*)-\s(.*)$/
export async function parseContent(
  content: string,
  options: ParseContentOptions,
) {
  const { openAll, parentMeta, dir, id } = options

  const root: TreeNode = {
    label: '',
    level: -1,
    path: '',
    collapse: false,
    children: [],
  }
  const stack: TreeNode[] = [root]
  let treeMap: TreeMap = {}
  const defaultSelectors: string[] = []
  const fileIconMap: Record<string, string> = {}
  let tree: TreeNode[] = []
  const isCustomContent = content.startsWith(CodeTabSplitString)
  if (dir && !isCustomContent) {
    const files = await readdir(dir, {
      recursive: true,
      encoding: 'utf-8',
      withFileTypes: true,
    })
    await Promise.all(
      files.map(async (p) => {
        const filePath = `${p.parentPath}/${p.name}`.replaceAll('\\', '/')
        if (p.isFile()) {
          const content = await readFile(filePath, 'utf-8')
          treeMap[formatPath(filePath)] = {
            code: content,
            meta: parentMeta,
          }
        }
      }),
    )
    tree = treeMapToTree(treeMap, tree, options)
  } else if (isCustomContent) {
    treeMap = formatTreeMap(buildFiles(content))
    tree = treeMapToTree(treeMap, tree, options)
  } else {
    const lines = content.trim().split('\n')
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
        `${parent.path}/${
          firstCh === '+' || firstCh === '-' ? label.slice(1) : label
        }`,
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
    tree = root.children
  }
  function traverse(nodes: TreeNode[]) {
    for (const node of nodes) {
      const key = node.path
      const firstCh = node.label[0]
      if (isLabelStartswithConfigCh(node.label)) {
        node.label = node.label.slice(1)
      }
      if (node.children.length === 0) {
        if (firstCh === '+') {
          defaultSelectors.push(key)
        }
        fileIconMap[getSuffix(key)] = getIconFromFileName(node.label)
        if (id && !dir) {
          treeMap[key] = {
            code: fileTreeDataFormatMap[formatPath(`${id}/${key}`)],
            meta: treeMap[key]?.meta,
          }
        }
      } else {
        node.children.sort(treeSort)
        traverse(node.children)
      }
    }
  }
  traverse(tree)
  tree.sort(treeSort)
  return { tree, treeMap, fileIconMap, defaultSelectors }
}
