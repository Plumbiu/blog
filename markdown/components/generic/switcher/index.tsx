'use client'

import CodePreview from '../_common/CodePreview'
import styles from './index.module.css'

const Switcher = (props: any) => {
  return <CodePreview {...props} className={styles.container} />
}

export default Switcher
