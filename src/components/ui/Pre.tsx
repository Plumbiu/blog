'use client'

import {
  memo,
  type ReactNode,
  type RefObject,
  useCallback,
  useRef,
  useState,
} from 'react'
import { CopyCheckIcon, CopyErrorIcon, CopyIcon } from '@/components/Icons'
import { renderReactNodeToString } from '@/lib/client'
import styles from './Pre.module.css'
import { cn } from '@/lib/client'

interface PreComponentProps {
  ref?: RefObject<HTMLDivElement | null>
  children: ReactNode
  className?: string
}

const PreComponent = memo(({ children, className, ref }: PreComponentProps) => {
  const [icon, setIcon] = useState(<CopyIcon />)
  const code = useRef<string>(null)
  const copy = useCallback(async () => {
    try {
      if (!code.current) {
        code.current = renderReactNodeToString(children)
      }
      await navigator.clipboard.writeText(code.current)
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
    <div ref={ref} className={cn(styles.wrap, className)}>
      <div className={styles.action} onClick={copy}>
        {icon}
      </div>
      <pre>{children}</pre>
    </div>
  )
})

export default PreComponent
