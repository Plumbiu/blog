import { Link } from 'next-view-transitions'
import Card from '@/components/Card'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/Icons'
import { PostList } from '@/utils/node'
import styles from './Pagination.module.css'

interface ArtlistPaginationProps {
  id: string
  pagenum: number
  lists: PostList[]
  pageCount: number
}

function ArtlistPagination({
  id,
  pagenum,
  lists,
  pageCount,
}: ArtlistPaginationProps) {
  const pages = new Array(pageCount).fill(1).map((_, i) => i + 1)

  return (
    <div className={styles.pagination}>
      <Link className="fcc" scroll={false} href={`/list/${id}/${pagenum - 1}`}>
        <Card disabled={pagenum === 1 || lists.length === 0}>
          <ArrowLeftIcon />
          Previous
        </Card>
      </Link>
      {pages.map((n) => (
        <Link key={n} scroll={false} href={`/list/${id}/${n}`}>
          <Card active={n === pagenum}>{n}</Card>
        </Link>
      ))}
      <Link className="fcc" scroll={false} href={`/list/${id}/${pagenum + 1}`}>
        <Card disabled={pagenum === pageCount || lists.length === 0}>
          Next
          <ArrowRightIcon />
        </Card>
      </Link>
    </div>
  )
}

export default ArtlistPagination
