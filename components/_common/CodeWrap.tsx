'use client'

import { memo, ReactNode } from 'react'
import { RestartIcon } from '@/components/Icons'
import styles from './CodeWrap.module.css'

interface CodeWrapProps {
  barText: string
  children: ReactNode
  forceUpdate?: () => void
}

const CodeWrap = memo(({ barText, children, forceUpdate }: CodeWrapProps) => {
  return (
    <div>
      <div className={styles.bar}>
        <div>{barText}</div>
        {forceUpdate && (
          <div className={styles.btn} onClick={forceUpdate}>
            <RestartIcon />
          </div>
        )}
      </div>
      <div className={styles.container}>{children}</div>
    </div>
  )
})

export default CodeWrap
