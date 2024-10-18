import styles from './Loading.module.css'

const Loading = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.cube}>
        <div className={styles.sides}>
          <div className={styles.front} />
          <div className={styles.back} />
          <div className={styles.top} />
          <div className={styles.bottom} />
          <div className={styles.left} />
          <div className={styles.right} />
        </div>
      </div>
    </div>
  )
}

export default Loading
