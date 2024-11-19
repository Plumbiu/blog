import IconCard from '@/app/components/IconCard'
import styles from './Top.module.css'

function ArtlistTop() {
  return (
    <div className={styles.wrap}>
      <h1>I'm Plumbiu 👋</h1>
      <div>
        <IconCard icon="#" text="Developer" />
        <IconCard icon="#" text="Student" />
        <IconCard icon="#" text="Web" />
      </div>
      <div>Happy reading! 🍺</div>
    </div>
  )
}

export default ArtlistTop
