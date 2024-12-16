'use client'

import type { TabProps, CodePreviewProps } from '../types'
import { memo, useState } from 'react'
import styles from '../_styles/tab.module.css'
import { cn } from '@/utils/client'

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
        [styles.tab_active]: isActive,
      })}
    >
      {name}
    </div>
  )
})

const CodePreview = memo(
  ({ defaultSelector, nodeMap, tabs, hide, className }: CodePreviewProps) => {
    const [selector, setSelector] = useState(defaultSelector)
    const node = nodeMap[selector]
    const showTab = !hide && tabs.length > 1
    return (
      <div className={className}>
        {showTab && (
          <div className={styles.tab}>
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
        <pre>{node}</pre>
      </div>
    )
  },
)
export default CodePreview
