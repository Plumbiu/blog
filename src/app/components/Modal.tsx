'use client'

import { useRef } from 'react'
import useModalStore from '@/store/modal'
import styles from './Modal.module.css'

function Modal() {
  const { children, hidden } = useModalStore()
  const maskRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={maskRef}
      className={styles.mask}
      onClick={hidden.bind(null, maskRef)}
      style={{
        display: children == null ? 'none' : 'block',
      }}
    >
      <div className={styles.modal}>{children}</div>
    </div>
  )
}

export default Modal
