import { clsx } from 'clsx'
import Link from 'next/link'
import styles from './Footer.module.css'
import { RssIcon, GithubIcon } from './Icons'
import Card from './Card'

async function Footer() {
  return (
    <div className={clsx(styles.wrap, 'center')}>
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
        <Card>
          <Link target="_blank" href="/rss.xml">
            <RssIcon />
          </Link>
        </Card>
        <Card>
          <Link target="_blank" href="https://github.com/Plumbiu/blog">
            <GithubIcon />
          </Link>
        </Card>
      </div>
    </div>
  )
}

export default Footer
