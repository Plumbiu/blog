'use client'

import { type ReactNode, useCallback, useState } from 'react'
import { CopyCheckIcon, CopyErrorIcon, CopyIcon } from '@/components/Icons'
import { renderReactNodeToString } from '@/lib/client'
import styles from './Pre.module.css'
import { cn } from '@/lib/client'
import { mono } from '@/app/fonts'

interface PreComponentProps {
  children: ReactNode
  className?: string
}

function PreComponent({ children, className }: PreComponentProps) {
  const [icon, setIcon] = useState(<CopyIcon />)

  const copy = useCallback(async () => {
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
  }, [])
  return (
    <div className={cn(mono.className, styles.wrap, className)}>
      <div className={styles.action} onClick={copy}>
        {icon}
      </div>
      <pre>{children}</pre>
    </div>
  )
}

export default PreComponent
