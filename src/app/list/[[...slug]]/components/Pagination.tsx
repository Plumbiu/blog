import Link from 'next/link'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/Icons'
import type { PostList } from '~/markdown/types'
import styles from './Pagination.module.css'
import { cn } from '@/lib/client'

interface ArtlistPaginationProps {
  type: string | undefined
  pagenum: number
  lists: PostList[]
  pageCount: number
}

const ItemClassName = cn(styles.item, 'fcc')

function ArtlistPagination({
  type,
  pagenum,
  lists,
  pageCount,
}: ArtlistPaginationProps) {
  const pages = new Array(pageCount).fill(1).map((_, i) => i + 1)
  const typeSegmentString = type == null ? '' : `${type}/`
  return (
    <div className={cn('fcc', styles.pagination)}>
      <Link
        className={cn(ItemClassName, {
          [styles.disabled]: pagenum === 1 || lists.length === 0,
        })}
        scroll={false}
        href={`/list/${typeSegmentString}${pagenum - 1}`}
      >
        <ArrowLeftIcon />
      </Link>
      {pages.map((n) => (
        <Link
          className={cn(ItemClassName, {
            [styles.active]: n === pagenum,
          })}
          scroll={false}
          key={n}
          href={`/list/${typeSegmentString}${n}`}
        >
          <div>{n}</div>
        </Link>
      ))}
      <Link
        className={cn(ItemClassName, {
          [styles.disabled]: pagenum === pageCount || lists.length === 0,
        })}
        scroll={false}
        href={`/list/${typeSegmentString}${pagenum + 1}`}
      >
        <ArrowRightIcon />
      </Link>
    </div>
  )
}

export default ArtlistPagination
