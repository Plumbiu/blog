'use client'

import { memo, type ReactNode, useMemo, useState } from 'react'
import tabStyles from '../_styles/tab.module.css'
import { cn } from '@/lib/client'
import {
  handleComponentDefaultSelectorKey,
  handleFileMapItemKey,
  handleFileMap,
  handleIconMap,
} from '~/markdown/plugins/constant'
import PreComponent from '@/components/ui/Pre'
import { arrayify, keys } from '@/lib/types'
import { DefaultFile } from '~/markdown/plugins/remark/code/file-tree/file-tree-utils'
import ImageIcon from './ImageIcon'

const Tab = memo((props: TabProps) => {
  const { name, onClick, isActive, icon } = props
  return (
    <div
      data-testid="code-tab"
      key={name}
      onClick={onClick}
      className={cn('fcc', {
        [tabStyles.tab_active]: isActive,
      })}
    >
      <ImageIcon icon={icon || DefaultFile} />
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
  icon: string
}

interface CodeTabsProps {
  defaultSelector: string
  nodeMap: Record<string, ReactNode>
  tabs: TabItem[]
  className?: string
  iconmap: Record<string, string>
}

const CodeTabs = memo(
  ({ defaultSelector, nodeMap, tabs, className, iconmap }: CodeTabsProps) => {
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
                icon={iconmap[tabProps.name]}
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
  const { defaultSelector, codeNodeMap, codeTabs, iconmap } = useMemo(() => {
    const children = arrayify(props.children)
    const defaultSelector = handleComponentDefaultSelectorKey(props)
    const codeNodeMap = Object.fromEntries(
      children.map((node: any) => [handleFileMapItemKey(node.props), node]),
    )
    const files = handleFileMap(props)
    const codeTabs = keys(files).map((name) => ({ name }))
    const iconmap = handleIconMap(props)
    return {
      defaultSelector,
      codeNodeMap,
      codeTabs,
      iconmap,
    }
  }, [props])

  return (
    <CodeTabs
      className={cn('codeblock_split', props.className)}
      tabs={codeTabs}
      nodeMap={codeNodeMap}
      defaultSelector={defaultSelector}
      iconmap={iconmap}
    />
  )
})

export default CodePreview
