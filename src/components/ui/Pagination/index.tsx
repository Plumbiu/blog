import type { FC } from 'react'
import { articleNum } from '@/config/sideCard.json'
import Link from 'next/link'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import LastPageIcon from '@mui/icons-material/LastPage'
import './index.css'

interface Props {
  page: number
}

const Pagination: FC<Props> = ({ page }) => {
  const array = new Array(Math.ceil(articleNum / 12)).fill(0)
  return (
    <div className="Pagination">
      {page === 1 ? (
        <FirstPageIcon
          fontSize="small"
          sx={{
            opacity: 0.38,
          }}
        />
      ) : (
        <Link href="1" scroll={false} className="Pagination-Icon-Link">
          <div>
            <FirstPageIcon fontSize="small" />
          </div>
        </Link>
      )}
      <div className="Pagination-Link-Wrap">
        {array.map((_item, i) => (
          <Link
            key={i}
            href={String(i + 1)}
            className={`Pagination-Link ${
              page - 1 === i
                ? 'hover-pagination-item-style Pagination-Icon-Link-Active'
                : 'hover-a-style'
            }`}
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
          className="Pagination-Icon-Link"
        >
          <LastPageIcon fontSize="small" />
        </Link>
      )}
    </div>
  )
}

export default Pagination