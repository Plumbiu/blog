import { buildHandlerFunction } from '../../../utils'
import { ComponentKey } from '../../../constant'

export interface TreeNode {
  label: string
  level: number
  path: string
  collapse: boolean
  children: TreeNode[]
}

export const FileTreeName = 'file-tree'

export type TreeMap = Record<string, string>

export const fileTreeDataKey = `${FileTreeName}-data`
export const handleFileTree = buildHandlerFunction<TreeNode[]>(
  fileTreeDataKey,
  JSON.parse,
)
export const fileTreeMapKey = `${FileTreeName}-map`
export const handleFileTreeMap = buildHandlerFunction<TreeMap>(
  fileTreeMapKey,
  JSON.parse,
)
export const FileTreeMapItemKey = `${FileTreeName}-map-key`
export const handleFileFileTreeMapItemKey =
  buildHandlerFunction<string>(FileTreeMapItemKey)

export const isFileTree = (props: any) => props[ComponentKey] === FileTreeName

export const FileTreeDefaultSelector = `${FileTreeName}-default-seletor`
export const handleFileTreeDefaultSelector = buildHandlerFunction<string[]>(
  FileTreeDefaultSelector,
  JSON.parse,
)

export const FileTreeFileIconMapKey = `${FileTreeName}-file-icon-map`
export const handleFileTreeFileIconMapKey = buildHandlerFunction<
  Record<string, string>
>(FileTreeFileIconMapKey, JSON.parse)

export const FileTreeHasPreviewKey = `${FileTreeName}-preview`
export const handleFileTreeHasPreviewKey = buildHandlerFunction<boolean>(
  FileTreeHasPreviewKey,
)

export const FileTreeDirName = `${FileTreeName}-dirname`
export const handleFileTreeDirName = buildHandlerFunction<boolean>(
  FileTreeDirName,
)
