import type { TreeNode, TreeMap, ParseContentOptions } from '../types'
import { buildFiles } from '~/markdown/plugins/remark/utils'
import { CodeTabSplitString } from '~/markdown/plugins/constant'
import { formatFileTreeDataMap, formatPath, formatTreeMap } from './format'
import fileTreeDataRawMap from '~/markdown/config/file-tree'
import {
  buildTreeByContent,
  buildTreeMapByFs,
  shortenDirPath,
  treeMapToTree,
  treeSort,
} from './support'
import { isLabelStartswithConfigCh } from '../file-tree-utils'
import { getIconExt, getIconFromFileName } from '~/markdown/utils/vscode-icon'

const fileTreeDataFormatMap: Record<string, string> = {}

formatFileTreeDataMap(fileTreeDataFormatMap, fileTreeDataRawMap)

export async function parseContent(
  content: string,
  options: ParseContentOptions,
) {
  const { dir, id } = options
  let treeMap: TreeMap = {}
  const defaultSelectors: string[] = []
  const iconMap: Record<string, string> = {}
  let tree: TreeNode[] = []
  const isCustomContent = content.startsWith(CodeTabSplitString)

  if (dir && !isCustomContent) {
    treeMap = await buildTreeMapByFs(options)
    tree = treeMapToTree(treeMap, options)
  } else if (isCustomContent) {
    treeMap = formatTreeMap(buildFiles(content))
    tree = treeMapToTree(treeMap, options)
  } else {
    tree = buildTreeByContent(content, options)
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
        iconMap[getIconExt(key)] = getIconFromFileName(node.label)
        // set treeMap by id ```FileTree id="xxx" ```
        if (id && !dir) {
          treeMap[key] = {
            code: fileTreeDataFormatMap[formatPath(`${id}/${key}`)],
            meta: treeMap[key]?.meta,
          }
        }
      } else {
        shortenDirPath(node)
        node.children.sort(treeSort)
        traverse(node.children)
      }
    }
  }
  traverse(tree)
  tree.sort(treeSort)
  return { tree, treeMap, iconMap, defaultSelectors }
}
