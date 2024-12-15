'use client'

import { type ReactNode, useState } from 'react'
import { CopyCheckIcon, CopyErrorIcon, CopyIcon } from '@/components/Icons'
import { renderReactNodeToString } from '@/utils'
import styles from './Pre.module.css'

interface PreComponentProps {
  children: ReactNode
}

function PreComponent({ children }: PreComponentProps) {
  const [icon, setIcon] = useState(<CopyIcon />)
  async function copy() {
    try {
      const code = renderReactNodeToString(children)
      await navigator.clipboard.writeText(code)
      setIcon(<CopyCheckIcon />)
    } catch (error) {
      setIcon(<CopyErrorIcon />)
    } finally {
      setTimeout(() => {
        setIcon(<CopyIcon />)
      }, 750)
    }
  }
  return (
    <div className={styles.wrap}>
      <div className={styles.action} onClick={copy}>
        {icon}
      </div>
      <pre>{children}</pre>
    </div>
  )
}

export default PreComponent
