import { clsx } from 'clsx'
import Link from 'next/link'
import styles from './Footer.module.css'

async function Footer() {
  return (
    <div className={clsx(styles.wrap, 'center')}>
      <Link
        className="link"
        target="_blank"
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
      >
        CC BY-NC-SA 4.0
      </Link>
      <span>2024 © Plumbiu</span>
    </div>
  )
}

export default Footer
