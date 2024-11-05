import Link from 'next/link'
import { clsx } from 'clsx'
import Image from 'next/image'
import info from '@/links.json'
import styles from './page.module.css'

function Links() {
  return (
    <div className={clsx('center', styles.wrap)}>
      <div>
        <h1 className={styles.top_title}>Links</h1>
        <div className={styles.subtitle}>朋友们</div>
      </div>
      <div className={styles.main_content}>
        {info.map(({ avatar, link, name, desc }) => (
          <div key={name} className={clsx(styles.link)}>
            <Image
              alt={name}
              src={'/links/' + avatar}
              className={styles.image}
              width={48}
              height={48}
            />
            <div>
              <Link
                href={link}
                target="_blank"
                className={clsx('link', styles.title)}
              >
                {name}
              </Link>
              <div className={styles.subtitle}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
      <Link
        href="https://github.com/Plumbiu/blog/blob/main/src/links.json"
        target="_blank"
        className="link"
      >
        see `links.json`
      </Link>
    </div>
  )
}

export default Links
