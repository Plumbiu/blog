'use client'

import { forwardRef } from 'react'
import type { JSX } from 'react/jsx-runtime'
import styles from './Modal.module.css'
import { cn } from '@/lib/client'

interface ModalProps {
  children: JSX.Element | undefined
  [key: string]: any
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ children, className, ...rest }, ref) => {
    if (!children) {
      return
    }
    return (
      <div>
        <div className={styles.mask} />
        <div ref={ref} className={cn(className, styles.modal)} {...rest}>
          {children}
        </div>
      </div>
    )
  },
)

export default Modal
