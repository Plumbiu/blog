'use client'
import type { Toc } from '@/lib/toc'
import { useState, type FC, useEffect } from 'react'
import Link from 'next/link'
import './index.css'
interface Props {
  tocs: Toc[]
}

const TocList: FC<Props> = ({ tocs }) => {
  const [currentHash, setCurrentHash] = useState('')
  useEffect(() => {
    if (location?.hash) {
      setCurrentHash(decodeURI(location.hash))
    } else {
      setCurrentHash(tocs[0]?.hash)
    }
    const observer = new IntersectionObserver(
      entries => {
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i]
          if (entry.isIntersecting) {
            const target = entry.target
            const newHash = '#' + target.id
            /*
              FIXME: This will effect the broswer url,
              history API will better, but it can notbe back to /article
              // location.href = newHash
            */
            setCurrentHash(newHash)
          }
        }
      },
      {
        // FIXME: top and bottom title can not be observed
        rootMargin: '7% 0% -99% 0%',
      },
    )
    document.querySelectorAll('h1,h2,h3').forEach(title => {
      observer.observe(title) // 开始观察每个图片元素
    })
  }, [tocs])

  return (
    <div className="Toc-List-Wrap">
      {tocs.map(({ level, hash, content }) => (
        <Link
          key={hash}
          className={`Toc-List Toc-List-Level-${level} ${currentHash === hash ? 'Toc-List-Active' : ''}`}
          href={hash}
        >
          {currentHash === hash && <div className="Toc-Block" />}
          {content}
        </Link>
      ))}
    </div>
  )
}

export default TocList
