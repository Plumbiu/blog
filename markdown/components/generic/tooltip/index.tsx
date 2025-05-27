import TooltipComponent from '@/components/function/Tooltip'
import styles from './index.module.css'

const Tooltip = (props: any) => {
  const label = props.label
  const title = props.title
  return (
    <TooltipComponent
      tagName="span"
      label={label}
      panelClassName={styles.panel}
      className={styles.label}
      mode="hover"
      offset={{
        y: -4,
      }}
    >
      <span className={styles.title}>{title}</span>
    </TooltipComponent>
  )
}

export default Tooltip
