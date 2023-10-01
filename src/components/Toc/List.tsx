'use client'
import type { Toc } from '@/lib/toc'
import { Button, ButtonGroup } from '@mui/material'
import { useState, type FC, useEffect } from 'react'
import { ArrowBack } from '@mui/icons-material'
import Hr from '../ui/Hr'

interface Props {
  tocs: Toc[]
}

const TocList: FC<Props> = ({ tocs }) => {
  const [currentHash, setCurrentHash] = useState(
    decodeURI(location.hash) || tocs[0].hash,
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i]
          if (entry.isIntersecting) {
            const target = entry.target
            const newHash = '#' + target.id
            location.href = newHash
            setCurrentHash(newHash)
          }
        }
      },
      {
        // FIXME: bottom title can not be observed
        rootMargin: '1% 0% -99% 0%',
      },
    )
    document.querySelectorAll('h1,h2,h3').forEach((title) => {
      observer.observe(title) // 开始观察每个图片元素
    })
  }, [])

  return (
    <>
      <div>
        <Hr />
      </div>
      <div
        style={{
          padding: '6px 0',
          maxHeight: '65vh',
          overflowY: 'scroll',
        }}
      >
        {tocs.map(({ level, hash, content }) => (
          <a
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
          </a>
        ))}
      </div>
      <Hr />
      <ButtonGroup
        variant="outlined"
        aria-label="outlined primary button group"
        size="small"
      >
        <Button
          startIcon={<ArrowBack />}
          href="/article"
          sx={{
            ml: '12px',
            mt: 1,
          }}
        >
          文章页
        </Button>
      </ButtonGroup>
    </>
  )
}

export default TocList
