'use client'

import { cloneElement, type HTMLAttributes } from 'react'
import styles from './Modal.module.css'
import { cn } from '@/utils/client'

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  children: JSX.Element | undefined
}

const Modal = ({ children }: ModalProps) => {
  if (!children) {
    return
  }
  return (
    <div>
      <div className={styles.mask} />
      {cloneElement(children, {
        className: cn(children.props.className, styles.modal),
      })}
    </div>
  )
}

export default Modal
