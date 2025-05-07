import { handleComponentCodeTitle } from '~/markdown/plugins/constant'
import codeWrapperStyles from '../_common/CodeWrapper.module.css'
import styles from './index.module.css'
import PreComponent from '@/components/ui/Pre'

function PreTitle(props: any) {
  const title = handleComponentCodeTitle(props)
  return (
    <div className={codeWrapperStyles.wrapper}>
      <div className={codeWrapperStyles.bar}>{title}</div>
      <PreComponent className={styles.radius}>{props.children}</PreComponent>
    </div>
  )
}

export default PreTitle
