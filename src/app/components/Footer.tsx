import { clsx } from 'clsx'
import styles from './Footer.module.css'

function Footer() {
  return (
    <div className={clsx(styles.wrap, 'center')}>
      <a
        target="_blank"
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
      >
        CC BY-NC-SA 4.0
      </a>
      <span>2024 © Plumbiu</span>
    </div>
  )
}

export default Footer
