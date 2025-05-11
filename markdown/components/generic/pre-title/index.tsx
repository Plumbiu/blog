import {
  handleComponentCodeTitle,
  handleIconMap,
} from '~/markdown/plugins/constant'
import codeWrapperStyles from '../_common/CodeWrapper.module.css'
import styles from './index.module.css'
import PreComponent from '@/components/ui/Pre'
import ImageIcon from '../_common/ImageIcon'

function PreTitle(props: any) {
  const title = handleComponentCodeTitle(props)
  const iconMap = handleIconMap(props)
  return (
    <div className={codeWrapperStyles.wrapper}>
      <div className={codeWrapperStyles.bar}>
        <div className="fcc">
          <ImageIcon icon={iconMap[title]} />
          {title}
        </div>
      </div>
      <PreComponent className={styles.radius}>{props.children}</PreComponent>
    </div>
  )
}

export default PreTitle
