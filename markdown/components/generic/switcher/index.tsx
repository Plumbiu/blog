'use client'

import CodePreview from '../_common/CodePreview'
import styles from './index.module.css'

const Switcher = (props: any) => {
  return (
    <CodePreview {...props} className={styles.container} showDivider={false} />
  )
}

export default Switcher
