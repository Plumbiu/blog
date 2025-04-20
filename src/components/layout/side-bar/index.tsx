import Image from 'next/image'
import { GithubRepoUrl } from '~/data/site'
import { RssIcon, GithubIcon } from '../../Icons'
import styles from './index.module.css'
import Link from 'next/link'
import { cn } from '@/lib/client'
import Title from '../../ui/Title'
import { upperFirstChar } from '@/lib/shared'
import Search from './Search'
import { getCategories } from '~/markdown/utils/fs'

const rightData = [
  { href: '/rss.xml', children: <RssIcon />, target: '_blank' },
  { href: GithubRepoUrl, children: <GithubIcon />, target: '_blank' },
]

async function SideBar() {
  const categories = await getCategories()
  return (
    <div className={cn('load_ani', styles.wrap)}>
      <div className={cn(styles.user, styles.wrap_item)}>
        <Image
          width={200}
          height={200}
          src="https://avatars.githubusercontent.com/u/99574369?v=4"
          alt="avatar"
        />
        <div className={styles.user_name}>Plumbiu</div>
        <div className={styles.user_desc}>这人很勤奋，啥都没留</div>
        <div className={cn('fcc', styles.user_link)}>
          {rightData.map((data) => (
            <Link
              key={data.href}
              href={data.href}
              target={data.target}
              prefetch={data.href !== '/rss.xml'}
            >
              {data.children}
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.sticky}>
        <Search className={styles.wrap_item} />
        <div className={cn(styles.category, styles.wrap_item)}>
          <Title className={styles.title}>分类</Title>
          <div className={styles.category_content}>
            {categories.map(({ type, count }) => (
              <Link href={`/list/${type}`} key={type}>
                {upperFirstChar(type)}
                <div className={styles.category_card}>{count}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideBar
