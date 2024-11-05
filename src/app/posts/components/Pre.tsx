'use client'

import { FC, ReactNode, useState } from 'react'
import { clsx } from 'clsx'
import { CopyCheckIcon, CopyErrorIcon, CopyIcon } from '@/app/components/Icons'
import { mono } from '@/app/fonts'
import styles from './Pre.module.css'

interface PreComponentProps {
  children: ReactNode
  code?: string
}

function PreComponent({ children, code }: PreComponentProps) {
  return (
    <pre className={clsx(mono.className, styles.wrap)}>
      {!!code && (
        <div className={styles.action}>
          <Copy code={code} />
        </div>
      )}
      {children}
    </pre>
  )
}

const Copy: FC<{
  code: string
}> = ({ code }) => {
  const [icon, setIcon] = useState(<CopyIcon />)
  function copy() {
    navigator.clipboard
      .writeText(code)
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
    <div className={styles.copy} onClick={copy}>
      {icon}
    </div>
  )
}

export default PreComponent
