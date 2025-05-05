import { buildHandlerFunction } from '../../../utils'
import { ComponentKey } from '../../../constant'

export interface TreeNode {
  label: string
  level: number
  lang?: string
  path: string
  icon?: string
  children: TreeNode[]
}

export const FileTreeName = 'file-tree'

export type TreeMap = Record<
  string,
  {
    lang: string
    content: string
  }
>

const fileTreeDataKey = 'file-tree-data'
export const handleFileTree = buildHandlerFunction<TreeNode[]>(
  fileTreeDataKey,
  JSON.parse,
)
const fileTreeMapKey = 'file-tree-map'
export const handleFileTreeMap = buildHandlerFunction<TreeMap>(
  fileTreeMapKey,
  JSON.parse,
)
export const FileTreeMapItemKey = 'file-tree-map-key'
export const handleFileFileTreeMapItemKey =
  buildHandlerFunction<string>(FileTreeMapItemKey)

export const isFileTree = (props: any) => props[ComponentKey] === FileTreeName
