'use client'

import styles from './Modal.module.css'
import useModalStore from '@/store/modal'

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
