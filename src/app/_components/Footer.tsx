import { clsx } from 'clsx'
import Link from 'next/link'
import styles from './Footer.module.css'
import { RssIcon } from './Icons'

async function Footer() {
  return (
    <div className={clsx('center', styles.wrap)}>
      <div>
        <Link
          className="link"
          target="_blank"
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
        >
          CC BY-NC-SA 4.0
        </Link>
        <span> 2024 © Plumbiu</span>
      </div>
      <div className={styles.right}>
        <Link target="_blank" href="/rss.xml">
          <RssIcon />
        </Link>
      </div>
    </div>
  )
}

export default Footer
