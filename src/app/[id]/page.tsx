import { Link } from 'next-view-transitions'
import { Metadata } from 'next'
import { clsx } from 'clsx'
import { getYear, upperFirstChar } from '@/utils'
import { getPostList } from '@/utils/node'
import { FrontmatterKey, monthArr } from '@/constants'
import styles from './page.module.css'
import { FloatType } from './types'
import AsideLeft from './_components/AsideLeft'
import IconCard from '../_components/IconCard'
import { TimeWordInfo } from '../_components/PostInfo'

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
  return `${month} ${String(d.getDate()).padStart(3, ' 0')}, ${d.getFullYear()}`
}

const MAX_LEN = 135

async function ArtlistAll(props: ListProps) {
  const params = await props.params
  const lists = await getPostList(params.id)

  const floatMap: FloatType = {}
  for (const list of lists) {
    const year = getYear(list.date)
    if (!floatMap[year]) {
      floatMap[year] = []
    }
    floatMap[year].push({
      path: `/${list.path}`,
      title: list.title,
    })
  }
  const floatItems = Object.entries(floatMap).sort(([a], [b]) => +b - +a)

  return (
    <div className="center">
      <AsideLeft items={floatItems} />
      <div className={styles.action}>
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
        {lists.map(
          ({ title, date, desc, subtitle, tags, wordLength, path }) => (
            <Link prefetch href={'/' + path} className={styles.link} key={path}>
              <div className={styles.top}>
                <div className={styles.title}>{title}</div>
              </div>
              <TimeWordInfo
                className="text_sm"
                wordLength={wordLength}
                date={date}
              />
              {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
              <div className={styles.desc}>
                {desc.length > MAX_LEN
                  ? desc.slice(0, MAX_LEN - 3) + '...'
                  : desc}
              </div>
              {tags && (
                <div className={styles.tags}>
                  {tags.map((tag) => (
                    <IconCard key={tag} icon="#" text={tag} />
                  ))}
                </div>
              )}
            </Link>
          ),
        )}
      </div>
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
