'use client'

import { useState, useEffect, type FC } from 'react'
import Link from 'next/link'
import './index.css'

interface Props {
  tocs: Toc[]
}

const TocList: FC<Props> = ({ tocs }) => {
  const [currentHash, setCurrentHash] = useState('目录')
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const target = entry.target
            const newHash = '#' + target.id
            setCurrentHash(newHash)
            break
          }
        }
      },
      {
        // FIXME: top and bottom title can not be observed
        rootMargin: '7% 0% -99% 0%',
      },
    )
    document.querySelectorAll('h1,h2,h3').forEach((title) => {
      observer.observe(title) // 开始观察每个图片元素
    })

    return () => {
      observer.disconnect()
    }
  }, [tocs])

  return (
    <div className="Toc-List">
      {tocs.map(({ level, hash, content }) => (
        <Link
          key={hash}
          className={`Toc-List-Anchor Toc-P-${level} ${
            currentHash === hash ? 'Toc-List-Active' : ''
          }`}
          href={hash}
        >
          {content}
        </Link>
      ))}
    </div>
  )
}

export default TocList
