import path from 'node:path'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { cn } from '@/lib/client'
import info from '~/data/links.json'
import getBlurDataUrl from '~/optimize/blurhash'
import { BlogAuthor, GithubRepoUrl } from '~/config/site'
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
    <div className={cn('load_ani', styles.wrap)}>
      <div>
        <h1>Links</h1>
        <div className={styles.subtitle}>朋友们</div>
      </div>
      <div className={styles.content}>
        {data.map(({ avatar, link, name, desc, base64 }) => (
          <div key={name} className={cn(styles.link)}>
            <Image
              alt={name || link}
              placeholder="blur"
              blurDataURL={base64}
              src={`/links/${avatar}`}
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
              <div className={styles.subtitle}>
                {desc || '该用户没有留下描述'}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        添加友链方式请查看&nbsp;
        <Link
          aria-label="Read more about links config file"
          href={`${GithubRepoUrl}/blob/main/assets/links.md`}
          className="link"
          target="_blank"
        >
          markdown 说明文件
        </Link>
      </div>
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
