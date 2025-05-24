'use client'

import { cn } from '@/lib/client'
import { CommandKey, SearchIcon } from '../../Icons'
import styles from './Search.module.css'
import useSearchPanelStore from '@/store/search-panel'
import useSystemInfo from '@/hooks/useIsMac'
import { useEffect } from 'react'

export default function Search({ className }: { className?: string }) {
  const cls = cn(className, styles.search)
  const showSearchPanel = useSearchPanelStore((s) => s.show)
  const info = useSystemInfo()

  useEffect(() => {
    if (!info) {
      return
    }
    const handleKeydown = (e: KeyboardEvent) => {
      const key = e.key
      console.log({ key })
      if (info.isMac) {
        if (key === 'k' && e.metaKey) {
          showSearchPanel()
          e.preventDefault()
        }
      } else if (info.isWin && key === 'k' && e.ctrlKey) {
        e.preventDefault()
        showSearchPanel()
      }
    }
    window.addEventListener('keydown', handleKeydown, {
      passive: false,
    })

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [info])

  return (
    <div onClick={() => showSearchPanel()} className={cls}>
      <div className="fcc">
        <SearchIcon />
        <span>搜索</span>
      </div>
      {!!info && (
        <div className={styles.key}>
          {info.isMac && <CommandKey />}
          {info.isWin && <div>Ctrl</div>}
          <span>+</span>
          <span>K</span>
        </div>
      )}
    </div>
  )
}
