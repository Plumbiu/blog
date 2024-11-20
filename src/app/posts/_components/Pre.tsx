'use client'

import { Fragment, ReactNode, useState } from 'react'
import { clsx } from 'clsx'
import { CopyCheckIcon, CopyErrorIcon, CopyIcon } from '@/app/_components/Icons'
import { mono } from '@/app/fonts'
import styles from './Pre.module.css'

interface PreComponentProps {
  children: ReactNode
  code?: string
}

function PreComponent({ children, code }: PreComponentProps) {
  const [icon, setIcon] = useState(<CopyIcon />)
  function copy() {
    navigator.clipboard
      .writeText(code!)
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
      {!!code && (
        <div className={styles.action} onClick={copy}>
          {icon}
        </div>
      )}
      <pre className={mono.className}>{children}</pre>
    </div>
  )
}

export default PreComponent
