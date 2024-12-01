import { Link } from 'next-view-transitions'
import { Metadata } from 'next'
import { clsx } from 'clsx'
import { ReactNode } from 'react'
import { upperFirstChar } from '@/utils'
import { getPostList } from '@/utils/node'
import IconCard from '@/app/_components/IconCard'
import { TimeWordInfo } from '@/app/_components/PostInfo'
import Card from '@/app/_components/Card'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BlogIcon,
  LifeIcon,
  NoteIcon,
  SummaryIcon,
} from '@/app/_components/Icons'
import styles from './page.module.css'
import AsideLeft from './_components/AsideLeft'
import { formatPostByYear } from './utils'

const MAX_PAGE_SIZE = 4
const ids = ['blog', 'life', 'summary', 'note'] as const

const iconMap: Record<(typeof ids)[number], ReactNode> = {
  blog: <BlogIcon style={{ backgroundColor: 'var(--c-green-soft)' }} />,
  life: <LifeIcon style={{ backgroundColor: 'var(--c-red-soft)' }} />,
  summary: <SummaryIcon style={{ backgroundColor: 'var(--c-indigo-soft)' }} />,
  note: <NoteIcon style={{ backgroundColor: 'var(--c-gray-soft)' }} />,
}

interface Params {
  id: string
  pagenum: string
}
export async function generateStaticParams() {
  const result: Params[] = []

  await Promise.all(
    ids.map(async (id) => {
      const post = await getPostList(id)
      for (let i = 1; i <= Math.ceil(post.length / MAX_PAGE_SIZE); i++) {
        result.push({
          id,
          pagenum: String(i),
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
  const floatLists = formatPostByYear(allLists)

  const showLists = formatPostByYear(
    allLists.slice((pagenum - 1) * MAX_PAGE_SIZE, pagenum * MAX_PAGE_SIZE),
  )
  const pageEndIndex = Math.ceil(allLists.length / MAX_PAGE_SIZE)
  const pages = new Array(pageEndIndex).fill(1).map((_, i) => i + 1)
  return (
    <div className="center">
      <AsideLeft items={floatLists} />
      <div className={styles.action}>
        {ids.map((p) => (
          <Link
            className={clsx(styles.action_item, {
              [styles.active]: id === p,
            })}
            scroll={false}
            key={p}
            href={`/list/${p}/1`}
          >
            {upperFirstChar(p)}
            {iconMap[p]}
          </Link>
        ))}
      </div>
      <div className={styles.artlist}>
        {showLists.map(([year, post]) => (
          <div key={year} className={styles.linkwrap}>
            <div className={styles.year}>{year}</div>
            {post.map(
              ({ title, date, desc, subtitle, tags, wordLength, path }) => (
                <Link
                  key={path}
                  prefetch
                  href={'/' + path}
                  className={styles.link}
                >
                  <div className={styles.title}>{title}</div>
                  <TimeWordInfo wordLength={wordLength} date={date} />
                  {subtitle && (
                    <div className={styles.subtitle}>{subtitle}</div>
                  )}
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
        ))}
      </div>
      <div className={styles.bottom}>
        <Link
          className="fcc"
          scroll={false}
          href={`/list/${id}/${pagenum - 1}`}
        >
          <Card disabled={pagenum === 1 || allLists.length === 0}>
            <ArrowLeftIcon />
            Previous
          </Card>
        </Link>
        {pages.map((n) => (
          <Link key={n} scroll={false} href={`/list/${id}/${n}`}>
            <Card active={n === pagenum}>{n}</Card>
          </Link>
        ))}
        <Link
          className="fcc"
          scroll={false}
          href={`/list/${id}/${pagenum + 1}`}
        >
          <Card disabled={pagenum === pageEndIndex || allLists.length === 0}>
            Next
            <ArrowRightIcon />
          </Card>
        </Link>
      </div>
    </div>
  )
}

export default ArtlistAll

export async function generateMetadata(props: ListProps): Promise<Metadata> {
  const params = (await props.params).id
  return {
    title: `${upperFirstChar(params || 'blog')} | 文章`,
  }
}
