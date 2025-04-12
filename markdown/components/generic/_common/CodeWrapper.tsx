'use client'

import { memo, type ReactNode } from 'react'
import { RestartIcon } from '@/components/Icons'
import styles from './CodeWrapper.module.css'

interface CodeWrapProps {
  barText?: string
  children: ReactNode
  forceUpdate?: () => void
}

const CodeWrapper = memo(
  ({ barText, children, forceUpdate }: CodeWrapProps) => {
    return (
      <div className={styles.wrapper}>
        {!!barText && (
          <div className={styles.bar}>
            <div>{barText}</div>
            {forceUpdate && (
              <div className={styles.rerun} onClick={forceUpdate}>
                <RestartIcon />
              </div>
            )}
          </div>
        )}
        <div className={styles.container}>{children}</div>
      </div>
    )
  },
)

export default CodeWrapper
