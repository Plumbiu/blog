import { Link } from 'next-view-transitions'
import { Metadata } from 'next'
import { clsx } from 'clsx'
import { getYear, upperFirstChar } from '@/utils'
import { getPostsInfo, type FrontmatterKey } from '@/utils/node'
import { monthArr } from '@/constants'
import styles from './page.module.css'
import { FloatType } from './types'
import ListFloat from './components/Aside'

const ids = ['blog', 'life', 'summary', 'note']
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

  const floatMap: FloatType = {}
  for (const list of lists) {
    const year = getYear(list.frontmatter.date)
    if (!floatMap[year]) {
      floatMap[year] = []
    }
    floatMap[year].push({
      path: `/${list.path}`,
      title: list.frontmatter.title,
    })
  }
  const floatItems = Object.entries(floatMap).sort(([a], [b]) => +b - +a)

  return (
    <div className={clsx('center', styles.wrap)}>
      <ListFloat items={floatItems} />
      <div className={clsx(styles.action)}>
        {ids.map((p) => (
          <Link
            className={clsx({
              [styles.active]: params.id === p,
            })}
            key={p}
            href={'/list/' + p}
          >
            {upperFirstChar(p)}
          </Link>
        ))}
      </div>
      <div className={styles.artlist}>
        {lists.length === 0 && (
          <div className={styles.empty}>这里空空如也.......</div>
        )}
        {lists.map(({ frontmatter: { title, date, desc, subtitle }, path }) => (
          <Link prefetch href={'/' + path} className={styles.link} key={path}>
            <div className={styles.top}>
              <span className={styles.title}>{title}</span>
              <span className={styles.date}>{formatTime(date)}</span>
            </div>
            <div className={styles.subtitle}>{subtitle}</div>
            <div className={styles.desc}>
              {desc}
            </div>
          </Link>
        ))}
      </div>
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
