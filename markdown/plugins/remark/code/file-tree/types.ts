export interface ParseContentOptions {
  openAll: boolean
  parentMeta: string | undefined
  dir: string | undefined
  id: string | undefined
}

export interface TreeNode {
  label: string
  level: number
  path: string
  collapse: boolean
  children: TreeNode[]
}

export type TreeMap = Record<
  string,
  {
    code: string
    meta?: string
  }
>
