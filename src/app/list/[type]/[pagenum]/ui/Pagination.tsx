import { Link } from 'next-view-transitions'
import Card from '@/components/Card'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/Icons'
import type { PostList } from '@/lib/node/markdown'
import styles from './Pagination.module.css'
import { cn } from '@/lib/client'

interface ArtlistPaginationProps {
  type: string
  pagenum: number
  lists: PostList[]
  pageCount: number
}

function ArtlistPagination({
  type,
  pagenum,
  lists,
  pageCount,
}: ArtlistPaginationProps) {
  const pages = new Array(pageCount).fill(1).map((_, i) => i + 1)
  return (
    <div className={cn('fcc', styles.pagination)}>
      <Card
        href={`/list/${type}/${pagenum - 1}`}
        scroll={false}
        disabled={pagenum === 1 || lists.length === 0}
      >
        <ArrowLeftIcon />
      </Card>
      {pages.map((n) => (
        <Link key={n} scroll={false} href={`/list/${type}/${n}`}>
          <Card active={n === pagenum}>{n}</Card>
        </Link>
      ))}
      <Card
        href={`/list/${type}/${pagenum + 1}`}
        scroll={false}
        disabled={pagenum === pageCount || lists.length === 0}
      >
        <ArrowRightIcon />
      </Card>
    </div>
  )
}

export default ArtlistPagination
