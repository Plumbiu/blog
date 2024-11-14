'use client'

import { memo, ReactNode } from 'react'
import { RestartIcon } from '@/app/components/Icons'
import styles from './CodeWrap.module.css'

interface CodeWrapProps {
  barText: string
  children: ReactNode
  runFunction?: () => void
}

const CodeWrap = memo(({ barText, children, runFunction }: CodeWrapProps) => {
  return (
    <div>
      <div className={styles.bar}>
        <div>{barText}</div>
        {runFunction && (
          <div className={styles.btn} onClick={runFunction}>
            <RestartIcon />
          </div>
        )}
      </div>
      <div className={styles.container}>{children}</div>
    </div>
  )
})

export default CodeWrap
