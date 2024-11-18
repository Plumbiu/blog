import { Link } from 'next-view-transitions'
import { Metadata } from 'next'
import { clsx } from 'clsx'
import { getYear, upperFirstChar } from '@/utils'
import { getPostsInfo, type FrontmatterKey } from '@/utils/node'
import { monthArr } from '@/constants'
import styles from './page.module.css'
import { FloatType } from './types'
import AsideLeft from './components/AsideLeft'
import AsideRight from './components/AsideRight'

const ids = ['blog', 'life', 'summary', 'note']
export function generateStaticParams() {
  return ids.map((id) => ({
    id,
  }))
}

interface ListProps {
  params: Promise<{
    id: FrontmatterKey
  }>
}

function formatTime(time: string | number) {
  const d = new Date(time)
  const month = monthArr[d.getMonth()]
  return month + String(d.getDate()).padStart(3, ' 0')
}

async function ArtlistAll(props: ListProps) {
  const params = await props.params
  const lists = await getPostsInfo(params.id)

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
    <div className={styles.wrap}>
      <AsideLeft items={[]} />
      <div className="center">
        <div className={clsx(styles.action)}>
          {ids.map((p) => (
            <Link
              className={clsx({
                [styles.active]: params.id === p,
              })}
              scroll={false}
              key={p}
              href={p}
            >
              {upperFirstChar(p)}
            </Link>
          ))}
        </div>
        <div className={styles.artlist}>
          {lists.length === 0 && (
            <div className={styles.empty}>这里空空如也.......</div>
          )}
          {lists.map(
            ({ frontmatter: { title, date, desc, subtitle, tags }, path }) => (
              <div className={styles.link} key={path}>
                <div className={styles.top}>
                  <Link prefetch href={'/' + path} className={styles.title}>
                    {title}
                  </Link>
                  {tags && tags.length === 1 && (
                    <div className={styles.tag}>#{tags[0]}</div>
                  )}
                  <span className={styles.date}>{formatTime(date)}</span>
                </div>
                {tags && tags.length > 1 && (
                  <div className={styles.tagwrap}>
                    {tags.map((tag) => (
                      <div className={styles.tag} key={tag}>
                        #{tag}
                      </div>
                    ))}
                  </div>
                )}
                <div className={styles.subtitle}>{subtitle}</div>
                <div className={styles.desc}>{desc}</div>
              </div>
            ),
          )}
        </div>
      </div>
      <AsideRight />
    </div>
  )
}

export default ArtlistAll

export async function generateMetadata(props: ListProps): Promise<Metadata> {
  const params = await props.params
  return {
    title: `${upperFirstChar(params.id)} - 文章`,
  }
}