import Image from 'next/image'
import { GithubRepoUrl } from '~/data/site'
import { RssIcon, GithubIcon } from './Icons'
import styles from './UserInfo.module.css'
import { Link } from 'next-view-transitions'
import { cn } from '@/lib/client'
import Title from './Title'
import { PostDir } from '~/constants/shared'
import { upperFirstChar } from '@/lib/shared'

const rightData = [
  { href: '/rss.xml', children: <RssIcon />, target: '_blank' },
  { href: GithubRepoUrl, children: <GithubIcon />, target: '_blank' },
]

function UserInfo() {
  return (
    <div className={styles.wrap}>
      <div className={styles.user}>
        <Image
          width={240}
          height={240}
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
      <div className={styles.category}>
        <Title className={styles.title}>分类</Title>
        <div className={styles.category_content}>
          {PostDir.map((dir) => (
            <Link href={`/list/${dir}`} key={dir}>
              {upperFirstChar(dir)}
              <div className={styles.category_card}>1</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserInfo
