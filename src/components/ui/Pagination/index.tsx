import type { FC } from 'react'
import Link from 'next/link'
import './index.css'
import { paginationTotal } from '@/lib/config'
import { FirstPageIcon, LastPageIcon } from '@/components/icons'

interface Props {
  page: number
}

const Pagination: FC<Props> = ({ page }) => {
  const array = new Array(paginationTotal).fill(0)

  return (
    <div className="Pagination">
      {page === 1 ? (
        <FirstPageIcon
          style={{
            opacity: 0.38,
          }}
        />
      ) : (
        <Link className="Pagination-Icon-Link" href="1" scroll={false}>
          <FirstPageIcon />
        </Link>
      )}
      {array.map((_item, i) => (
        <Link
          key={i}
          className={`Pagination-Link ${
            page - 1 === i ? 'Pagination-Link-Active' : 'Hover'
          }`}
          href={String(i + 1)}
        >
          {i + 1}
        </Link>
      ))}
      {page === paginationTotal ? (
        <LastPageIcon
          style={{
            opacity: 0.38,
          }}
        />
      ) : (
        <Link
          className="Pagination-Icon-Link"
          href={String(paginationTotal)}
          scroll={false}
        >
          <LastPageIcon />
        </Link>
      )}
    </div>
  )
}

export default Pagination
