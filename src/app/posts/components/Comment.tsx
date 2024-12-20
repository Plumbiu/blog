'use client'

import useObserver from '@/hooks/useObservser'
import Script from 'next/script'
import { useRef } from 'react'
import Loading from '~/data/components/_common/Loading'

function Comment() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isIntersecting = useObserver(containerRef)

  return (
    <div ref={containerRef} id="comment-container">
      {isIntersecting ? (
        <Script
          src="https://giscus.app/client.js"
          data-repo="Plumbiu/blog"
          data-repo-id="R_kgDOKYTpow"
          data-category="Announcements"
          data-category-id="DIC_kwDOKYTpo84ClYz1"
          data-mapping="url"
          data-strict="0"
          data-reactions-enabled="1"
          data-emit-metadata="0"
          data-input-position="bottom"
          data-theme={window.getLocalTheme()}
          data-lang="zh-CN"
          crossOrigin="anonymous"
          async
        />
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default Comment
