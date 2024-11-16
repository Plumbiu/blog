'use client'

import { useRef, useState } from 'react'
import { clsx } from 'clsx'
import useModalStore from '@/store/modal'
import styles from './Modal.module.css'
import { LucideZoomIn, LucideZoomOut } from './Icons'

const MAX_STEP = 0.25

function Modal() {
  const { children, hidden } = useModalStore()
  const maskRef = useRef<HTMLDivElement>(null)
  const actionRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  function zoom(step: number) {
    if (step < 0 && scale <= 1) {
      return
    }
    setScale(scale + step)
  }

  return (
    <div
      ref={maskRef}
      className={styles.mask}
      onClick={(e) => {
        const target = e.target as HTMLElement
        const tagName = target.tagName.toLowerCase()
        if (tagName === 'img' || actionRef.current!.contains(target)) {
          return
        }
        console.log(tagName)
        hidden(maskRef)
      }}
      style={{
        display: children == null ? 'none' : 'block',
      }}
    >
      <div
        className={styles.modal}
        style={{
          transform: `scale(${scale})`,
        }}
        onWheel={(e) => {
          const step = Math.abs(e.deltaY)
          const deltaScale = step > 1 ? MAX_STEP : step
          if (e.deltaY < 0) {
            zoom(deltaScale)
          } else if (scale > 1) {
            zoom(-deltaScale)
          }
        }}
      >
        {children}
      </div>
      <div ref={actionRef} className={clsx(styles.action, 'fcc')}>
        <LucideZoomOut onClick={() => zoom(-0.25)} />
        <LucideZoomIn onClick={() => zoom(0.25)} />
      </div>
    </div>
  )
}

export default Modal
