'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import styles from './Modal.module.css'
import { cn } from '@/utils/client'

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  children: JSX.Element | undefined
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
