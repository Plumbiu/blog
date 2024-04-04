'use client'

import './index.css'
import { useState, type FC, useEffect } from 'react'
import Link from 'next/link'
import { createPortal } from 'react-dom'

interface Props {
  tocs: Toc[]
}

const TocCmp: FC<Props> = ({ tocs }) => {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  return isMounted ? createPortal(
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
  ) : null
}

export default TocCmp
