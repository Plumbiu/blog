import { Link } from 'next-view-transitions'
import styles from './Header.module.css'
import { GithubIcon, RssIcon } from '@/app/components/Icons'
import clsx from 'clsx'

async function Header() {
  return (
    <header className={styles.wrap}>
      <div className={clsx("center", styles.header)}>
        <div className={styles.left}>
          <Link href="/list/blog">Home</Link>
        </div>
        <div className={styles.right}>
          <a target="_blank" href="/rss.xml">
            <RssIcon />
          </a>
          <Link target="_blank" href="https://github.com/Plumbiu/blog">
            <GithubIcon />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
