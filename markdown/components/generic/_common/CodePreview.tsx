'use client'

import { memo, type ReactNode, useMemo, useState } from 'react'
import tabStyles from '../_styles/tab.module.css'
import { cn } from '@/lib/client'
import {
  handleComponentDefaultSelectorKey,
  handleFileMapItemKey,
  handleFileMap,
} from '~/markdown/plugins/constant'
import PreComponent from '@/components/ui/Pre'
import { arrayify, keys } from '@/lib/types'

const Tab = memo((props: TabProps) => {
  const { name, onClick, isActive } = props
  return (
    <div
      data-testid="code-tab"
      key={name}
      onClick={onClick}
      className={cn({
        [tabStyles.tab_active]: isActive,
      })}
    >
      {name}
    </div>
  )
})

interface TabItem {
  name: string
  onClick?: () => void
}
interface TabProps extends TabItem {
  isActive: boolean
}

interface CodePreviewProps {
  defaultSelector: string
  nodeMap: Record<string, ReactNode>
  tabs: TabItem[]
  className?: string
}

const CodeTabs = memo(
  ({ defaultSelector, nodeMap, tabs, className }: CodePreviewProps) => {
    const [selector, setSelector] = useState(defaultSelector)
    const node = nodeMap[selector]
    const showTab = tabs.length > 1
    return (
      <div className={className}>
        {showTab && (
          <div className={tabStyles.tab}>
            {tabs.map((tabProps) => (
              <Tab
                key={tabProps.name}
                {...tabProps}
                isActive={tabProps.name === selector}
                onClick={() => {
                  setSelector(tabProps.name)
                }}
              />
            ))}
            <div />
          </div>
        )}
        <PreComponent>{node}</PreComponent>
      </div>
    )
  },
)
const CodePreview = memo((props: any) => {
  const { defaultSelector, codeNodeMap, codeTabs } = useMemo(() => {
    const children = arrayify(props.children)
    const defaultSelector = handleComponentDefaultSelectorKey(props)
    const codeNodeMap = Object.fromEntries(
      children.map((node: any) => [handleFileMapItemKey(node.props), node]),
    )
    const files = handleFileMap(props)
    const codeTabs = keys(files).map((name) => ({ name }))

    return {
      defaultSelector,
      codeNodeMap,
      codeTabs,
    }
  }, [props])

  return (
    <CodeTabs
      className={cn('codeblock_split', props.className)}
      tabs={codeTabs}
      nodeMap={codeNodeMap}
      defaultSelector={defaultSelector}
    />
  )
})

export default CodePreview
