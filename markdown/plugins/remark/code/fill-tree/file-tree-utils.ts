import { buildHandlerFunction } from '../../../utils'
import { ComponentKey } from '../../../constant'

export interface TreeNode {
  label: string
  level: number
  path: string
  icon?: string
  children: TreeNode[]
}

export const FileTreeName = 'file-tree'

export type TreeMap = Record<string, string>

export const fileTreeDataKey = 'file-tree-data'
export const handleFileTree = buildHandlerFunction<TreeNode[]>(
  fileTreeDataKey,
  JSON.parse,
)
export const fileTreeMapKey = 'file-tree-map'
export const handleFileTreeMap = buildHandlerFunction<TreeMap>(
  fileTreeMapKey,
  JSON.parse,
)
export const FileTreeMapItemKey = 'file-tree-map-key'
export const handleFileFileTreeMapItemKey =
  buildHandlerFunction<string>(FileTreeMapItemKey)

export const isFileTree = (props: any) => props[ComponentKey] === FileTreeName
