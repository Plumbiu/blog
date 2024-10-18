import { Link } from 'next-view-transitions'
import styles from './Header.module.css'
import { GithubIcon, RssIcon } from '@/components/Icons'

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/list/blog">Home</Link>
      </div>
      <div className={styles.right}>
        <a target="_blank" href="/rss.xml">
          <RssIcon />
        </a>
        <Link href="/github">
          <GithubIcon />
        </Link>
      </div>
    </header>
  )
}

export default Header
