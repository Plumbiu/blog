'use client'

import useModalStore from '@/store/modal'
import styles from './Modal.module.css'

function Modal() {
  const { children, hidden } = useModalStore()
  return (
    <div
      className={styles.mask}
      onClick={hidden}
      style={{
        display: children == null ? 'none' : 'block',
      }}
    >
      <div className={styles.modal}>{children}</div>
    </div>
  )
}

export default Modal
