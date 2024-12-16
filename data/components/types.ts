import type { ReactNode } from 'react'

export interface TabItem {
  name: string
  onClick?: () => void
  hidden?: boolean
}

export interface CodePreviewProps {
  defaultSelector: string
  nodeMap: Record<string, ReactNode>
  tabs: TabItem[]
  hide: boolean
  className?: string
}

export interface TabProps extends TabItem {
  isActive: boolean
}
