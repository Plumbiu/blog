'use client'

import { memo, ReactNode } from 'react'

import styles from './CodeWrap.module.css'

interface CodeWrapProps {
  barText: string
  children: ReactNode
}

const CodeWrap = memo((props: CodeWrapProps) => {
  return (
    <div>
      <div className={styles.bar}>{props.barText}</div>
      <div className={styles.container}>{props.children}</div>
    </div>
  )
})

export default CodeWrap
