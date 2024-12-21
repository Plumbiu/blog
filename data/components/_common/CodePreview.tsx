'use client'

import type { TabProps, CodePreviewProps } from '../types'
import { memo, useMemo, useState } from 'react'
import tabStyles from '../_styles/tab.module.css'
import { cn } from '@/utils/client'
import {
  handleComponentSelectorKey,
  handleComponentFileKey,
  handleFileMap,
} from '@/plugins/constant'
import PreComponent from '@/app/posts/components/Pre'
import { isArray, keys } from '@/utils/types'

const Tab = memo((props: TabProps) => {
  const { name, onClick, hidden = false, isActive } = props
  if (hidden) {
    return null
  }
  return (
    <div
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

const CodeTabs = memo(
  ({ defaultSelector, nodeMap, tabs, hide, className }: CodePreviewProps) => {
    const [selector, setSelector] = useState(defaultSelector)
    const node = nodeMap[selector]
    const showTab = !hide && tabs.length > 1
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
                  tabProps.onClick?.()
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
    const children = isArray(props.children)
      ? props.children
      : [props.children]
    const defaultSelector = handleComponentSelectorKey(props)
    const codeNodeMap = Object.fromEntries(
      children.map((node: any) => [handleComponentFileKey(node.props), node]),
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
      hide={false}
    />
  )
})

export default CodePreview
