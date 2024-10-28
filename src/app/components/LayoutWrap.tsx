'use client'

import {
  createElement,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import { ViewTransitions } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import { applyCurrentTheme } from '@/utils/client/theme'
import useModalStore from '@/store/modal'
import { runMicrotask, runTask } from '@/utils'

interface ThemeWrap {
  children: ReactNode
}

function LayoutWrap(props: ThemeWrap) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const modalStore = useModalStore()

  useLayoutEffect(() => {
    applyCurrentTheme()
    setMounted(true)
    window.addEventListener('storage', applyCurrentTheme)
    return () => {
      window.removeEventListener('storage', applyCurrentTheme)
    }
  }, [])

  useEffect(() => {
    runTask(() => {
      const imgs = document.querySelectorAll('img')
      for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i]
        img.onclick = () =>
          modalStore.setChildren(
            createElement('img', {
              src: img.src,
              alt: img.alt,
            }),
          )
      }
    })
  }, [pathname])

  return <ViewTransitions>{mounted && props.children}</ViewTransitions>
}

export default LayoutWrap
