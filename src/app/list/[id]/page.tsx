import Link from 'next/link'
import { Metadata } from 'next'
import styles from './page.module.css'
import { upperFirstChar } from '@/utils'
import { getPostsInfo, type FrontmatterKey } from '@/utils/node'
import { monthArr } from '@/constants'

const ids = ['note', 'life', 'blog', 'summary'] as const
export function generateStaticParams() {
  return ids.map((id) => ({
    id,
  }))
}

interface ListProps {
  params: {
    id: FrontmatterKey
  }
}

export async function getPosts(id: FrontmatterKey) {
  const posts = await getPostsInfo(id)
  return posts
}
function formatTime(time: string | number) {
  const d = new Date(time)
  const month = monthArr[d.getMonth()]
  return month + String(d.getDate()).padStart(3, ' 0')
}

async function ArtlistAll({ params }: ListProps) {
  const lists = await getPosts(params.id)
  return (
    <div className={styles.artlist}>
      {lists.length === 0 && (
        <div className={styles.empty}>这里空空如也.......</div>
      )}
      {lists.map(({ frontmatter: { title, date, desc, subtitle }, path }) => (
        <Link href={'/' + path} className={styles.link} key={path}>
          <div className={styles.top}>
            <span className={styles.title}>{title}</span>
            <span className={styles.date}>{formatTime(date)}</span>
          </div>
          <div className={styles.subtitle}>{subtitle}</div>
          <div className={styles.desc}>{desc}</div>
        </Link>
      ))}
    </div>
  )
}

export default ArtlistAll

export async function generateMetadata({
  params,
}: ListProps): Promise<Metadata> {
  return {
    title: `${upperFirstChar(params.id)} - 文章`,
  }
}
