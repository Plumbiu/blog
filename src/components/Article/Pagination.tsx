import type { FC } from 'react'
import { articleNum } from '@/config/sideCard.json'
import Link from 'next/link'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import LastPageIcon from '@mui/icons-material/LastPage'

interface Props {
  page: number
}

const Pagination: FC<Props> = ({ page }) => {
  const array = new Array(Math.ceil(articleNum / 12)).fill(0)
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        margin: '12px',
      }}
    >
      {page === 1 ? (
        <FirstPageIcon
          fontSize="small"
          sx={{
            opacity: 0.38,
          }}
        />
      ) : (
        <Link
          href="1"
          scroll={false}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FirstPageIcon fontSize="small" />
        </Link>
      )}
      <div
        style={{
          display: 'flex',
          gap: 12,
          fontSize: '0.875rem',
        }}
      >
        {array.map((item, i) => (
          <Link
            key={item}
            href={String(i + 1)}
            className={
              page - 1 === i ? 'hover-pagination-item-style' : 'hover-a-style'
            }
            style={{
              width: '32px',
              height: '32px',
              lineHeight: '32px',
              textAlign: 'center',
              backgroundColor: page - 1 === i ? '#9C27B0' : 'inherit',
              borderRadius: '50%',
              color: page - 1 === i ? '#fff' : 'rgba(0, 0, 0, 0.87)',
              cursor: 'pointer',
            }}
          >
            {i + 1}
          </Link>
        ))}
      </div>
      {page === Math.ceil(articleNum / 12) ? (
        <LastPageIcon
          fontSize="small"
          sx={{
            opacity: 0.38,
          }}
        />
      ) : (
        <Link
          href={String(Math.ceil(articleNum / 12))}
          scroll={false}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <LastPageIcon fontSize="small" />
        </Link>
      )}
    </div>
  )
}

export default Pagination
