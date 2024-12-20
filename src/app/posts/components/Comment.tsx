'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

function Comment() {
  const [mount, setMount] = useState(false)
  useEffect(() => {
    setMount(true)
  }, [])
  return (
    mount && (
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
        data-loading="lazy"
        crossOrigin="anonymous"
        async
      />
    )
  )
}

export default Comment
