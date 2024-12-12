import path from 'node:path'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { cn } from '@/utils/client'
import info from '~/data/links.json'
import { getBlurDataUrl } from '@/utils/node/optimize'
import { BlogAuthor, RepoLinksUrl } from '~/data/site'
import styles from './page.module.css'
import { generateSeoMetaData, joinWebUrl } from '../seo'

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
                aria-label="Read more about links page"
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
        aria-label="Read more about links config file"
        href={RepoLinksUrl}
        className="link"
        target="_blank"
      >
        see `links.json`
      </Link>
    </div>
  )
}

const Title = `${BlogAuthor} | About`
const Desc = `${BlogAuthor}'s introduction`
export const metadata: Metadata = {
  title: Title,
  description: Desc,
  ...generateSeoMetaData({
    title: Title,
    description: Desc,
    url: joinWebUrl('links'),
  }),
}

export default Links
