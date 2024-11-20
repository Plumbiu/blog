import { CSSProperties } from 'react'
import styles from './Divider.module.css'

interface DividerProps {
  width?: CSSProperties['width']
  my?: number
}

function Divider(props: DividerProps) {
  return (
    <div
      className={styles.divider}
      style={{
        width: props.width,
        marginTop: props.my,
        marginBottom: props.my,
      }}
    />
  )
}

export default Divider
