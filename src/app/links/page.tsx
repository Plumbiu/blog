import path from 'node:path'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/utils/client'
import info from '~/data/links.json'
import { getBlurDataUrl } from '@/utils/node/optimize'
import styles from './page.module.css'

type Data = (typeof info)[number] & {
  base64: string
}

async function Links() {
  const data: Data[] = []
  await Promise.all(
    info.map(async (item) => {
      const imagePath = path.join('public', 'links', item.avatar)
      const { base64 } = await getBlurDataUrl(imagePath)
      if (base64) {
        data.push({
          ...item,
          base64,
        })
      }
    }),
  )
  return (
    <div className={'center'}>
      <div>
        <h1>Links</h1>
        <div className={styles.subtitle}>朋友们</div>
      </div>
      <div className={styles.content}>
        {data.map(({ avatar, link, name, desc, base64 }) => (
          <div key={name} className={cn(styles.link)}>
            <Image
              alt={name}
              placeholder="blur"
              blurDataURL={base64}
              src={'/links/' + avatar}
              className={styles.image}
              width={48}
              height={48}
            />
            <div>
              <Link
                href={link}
                target="_blank"
                className={cn('link', styles.title)}
              >
                {name}
              </Link>
              <div className={styles.subtitle}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
      <Link
        href="https://github.com/Plumbiu/blog/blob/main/data/links.json"
        target="_blank"
        className="link"
      >
        see `links.json`
      </Link>
    </div>
  )
}

export default Links
