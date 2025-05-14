import Dropdown from '@/components/function/Dropdown'
import styles from './index.module.css'

const Tooltip = (props: any) => {
  const label = props.label
  const title = props.title
  return (
    <Dropdown
      tagName="span"
      label={label}
      panelClassName={styles.panel}
      mode="hover"
      offset={{
        y: -4,
      }}
    >
      <span className={styles.title}>{title}</span>
    </Dropdown>
  )
}

export default Tooltip
