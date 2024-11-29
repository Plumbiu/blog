import { Link } from 'next-view-transitions'
import { Metadata } from 'next'
import { clsx } from 'clsx'
import { getYear, upperFirstChar } from '@/utils'
import { getPostList } from '@/utils/node'
import IconCard from '@/app/_components/IconCard'
import { TimeWordInfo } from '@/app/_components/PostInfo'
import Card from '@/app/_components/Card'
import styles from './page.module.css'
import { FloatType } from './types'
import AsideLeft from './_components/AsideLeft'

const MAX_PAGE_SIZE = 4

const ids = ['blog', 'life', 'summary', 'note'] as const
interface Params {
  id: string
  pagenum: number
}
export async function generateStaticParams() {
  const result: Params[] = []

  await Promise.all(
    ids.map(async (id) => {
      const post = await getPostList(id)
      for (let i = 1; i <= post.length; i++) {
        result.push({
          id,
          pagenum: i,
        })
      }
    }),
  )
  return result
}

interface ListProps {
  params: Promise<Params>
}

const MAX_LEN = 135

async function ArtlistAll(props: ListProps) {
  const params = await props.params
  const id = params.id
  const pagenum = +params.pagenum
  const allLists = await getPostList(id)
  const floatMap: FloatType = {}
  for (const list of allLists) {
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
  const startIndex = pagenum - 1
  const showLists = allLists.slice(
    startIndex * MAX_PAGE_SIZE,
    (startIndex + 1) * MAX_PAGE_SIZE,
  )
  const pageEndIndex = Math.ceil(allLists.length / MAX_PAGE_SIZE)
  const pages = new Array(pageEndIndex).fill(1).map((_, i) => i + 1)
  return (
    <div className="center">
      <AsideLeft items={floatItems} />
      <div className={styles.action}>
        {ids.map((p) => (
          <Link
            className={clsx({
              [styles.active]: id === p,
            })}
            scroll={false}
            key={p}
            href={`/list/${p}/1`}
          >
            {upperFirstChar(p)}
          </Link>
        ))}
      </div>
      <div className={styles.artlist}>
        {showLists.map(
          ({ title, date, desc, subtitle, tags, wordLength, path }) => (
            <Link prefetch href={'/' + path} className={styles.link} key={path}>
              <div className={styles.title}>{title}</div>
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
      <div className={styles.bottom}>
        <Card disabled={pagenum === 1}>
          <Link
            className="fcc"
            scroll={false}
            href={`/list/${id}/${pagenum - 1}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6"></path>
            </svg>
            Previous
          </Link>
        </Card>
        {pages.map((n) => (
          <Card key={n} active={n === pagenum}>
            <Link scroll={false} href={`/list/${id}/${n}`}>
              {n}
            </Link>
          </Card>
        ))}
        <Card disabled={pagenum === pageEndIndex}>
          <Link
            className="fcc"
            scroll={false}
            href={`/list/${id}/${pagenum + 1}`}
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </Link>
        </Card>
      </div>
    </div>
  )
}

export default ArtlistAll

export async function generateMetadata(props: ListProps): Promise<Metadata> {
  const params = (await props.params).id
  return {
    title: `${upperFirstChar(params[0] || 'blog')} | 文章`,
  }
}
