'use client'

import { ReactNode, useState } from 'react'
import { toString } from 'hast-util-to-string'
import { Nodes } from 'hast'
import { CopyCheckIcon, CopyErrorIcon, CopyIcon } from '@/app/components/Icons'
import { mono } from '@/app/fonts'
import styles from './Pre.module.css'

interface PreComponentProps {
  children: ReactNode
  node?: Nodes
}

function PreComponent({ children, node }: PreComponentProps) {
  const [icon, setIcon] = useState(<CopyIcon />)
  function copy() {
    navigator.clipboard
      .writeText(toString(node!))
      .then(() => {
        setIcon(<CopyCheckIcon />)
      })
      .catch(() => {
        setIcon(<CopyErrorIcon />)
      })
      .finally(() => {
        setTimeout(() => {
          setIcon(<CopyIcon />)
        }, 750)
      })
  }
  return (
    <div className={styles.wrap}>
      {!!node && (
        <div className={styles.action} onClick={copy}>
          {icon}
        </div>
      )}
      <pre className={mono.className}>{children}</pre>
    </div>
  )
}

export default PreComponent
