'use client'

import { useEffect, useRef } from 'react'

function Comment() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = document.createElement('script')
    element.src = 'https://giscus.app/client.js'
    element.setAttribute('data-repo', 'Plumbiu/blog')
    element.setAttribute('data-repo-id', 'R_kgDOKYTpow')
    element.setAttribute('data-category', 'Announcements')
    element.setAttribute('data-category-id', 'DIC_kwDOKYTpo')
    element.setAttribute('data-mapping', 'url')
    element.setAttribute('data-strict', '0')
    element.setAttribute('data-reactions-enabled', '1')
    element.setAttribute('data-emit-metadata', '0')
    element.setAttribute('data-input-position', 'bottom')
    element.setAttribute('data-theme', window.getLocalTheme())
    element.setAttribute('data-lang', 'zh-CN')
    element.crossOrigin = 'anonymous'
    element.async = true
    ref.current!.appendChild(element)
  }, [])

  return <div ref={ref} className="giscus" />
}

export default Comment
