import { handlePreTitleValue } from '~/markdown/plugins/remark/code-block/pre-title-utils'
import codeWrapperStyles from '../_common/CodeWrapper.module.css'
import styles from './index.module.css'
import PreComponent from '@/components/ui/Pre'

function PreTitle(props: any) {
  const title = handlePreTitleValue(props)
  return (
    <div className={codeWrapperStyles.wrapper}>
      <div className={codeWrapperStyles.bar}>{title}</div>
      <PreComponent className={styles.radius}>{props.children}</PreComponent>
    </div>
  )
}

export default PreTitle
