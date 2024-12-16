'use client'

import CodePreview from '../_common/CodePreview'
import styles from './index.module.css'

const Switcher = (props: any) => {
  return <CodePreview className={styles.container} {...props} />
}

export default Switcher
