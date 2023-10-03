'use client'
import type { Toc } from '@/lib/toc'
import { useState, type FC, useEffect } from 'react'
import Link from 'next/link'
interface Props {
  tocs: Toc[]
}

const TocList: FC<Props> = ({ tocs }) => {
  const [currentHash, setCurrentHash] = useState('')
  useEffect(() => {
    if (location.hash) {
      setCurrentHash(decodeURI(location.hash))
    } else {
      setCurrentHash(tocs[0].hash)
    }
    const observer = new IntersectionObserver(
      (entries) => {
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
    document.querySelectorAll('h1,h2,h3').forEach((title) => {
      observer.observe(title) // 开始观察每个图片元素
    })
  }, [])

  return (
    <div
      style={{
        padding: '6px 0',
        maxHeight: '65vh',
        overflowY: 'scroll',
      }}
    >
      {tocs.map(({ level, hash, content }) => (
        <Link
          key={hash}
          className="toc-list"
          href={hash}
          style={{
            paddingLeft: level * 16 + 'px',
            color: currentHash === hash ? '#1976D2' : 'inherit',
            backgroundColor: currentHash === hash ? '#F8F8F8' : 'inherit',
          }}
        >
          {currentHash === hash && <div className="toc-block" />}
          {content}
        </Link>
      ))}
    </div>
  )
}

export default TocList
