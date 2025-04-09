import { handlePreTitleValue } from '~/markdown/plugins/remark/code-block/pre-title-utils'
import styles from '../_common/CodeWrapper.module.css'
import PreComponent from '@/components/Pre'

function PreTitle(props: any) {
  const title = handlePreTitleValue(props)
  return (
    <div className={styles.wrapper}>
      <div className={styles.bar}>{title}</div>
      <PreComponent>{props.children}</PreComponent>
    </div>
  )
}

export default PreTitle
