'use client'

import './index.css'
import type { FC } from 'react'
import Link from 'next/link'
import { createPortal } from 'react-dom'

interface Props {
  tocs: Toc[]
}

const TocCmp: FC<Props> = ({ tocs }) => {
  return createPortal(
    <div className="Toc">
      <div className="Toc-List">
        {tocs.map(({ level, hash, content }) => (
          <Link
            key={hash}
            className={`Toc-List-Anchor Toc-P-${level}`}
            href={hash}
          >
            {content}
          </Link>
        ))}
      </div>
    </div>,
    document.body,
  )
}

export default TocCmp
