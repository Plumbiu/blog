'use client'

import { cn } from '@/lib/client'
import { SearchIcon } from '../../Icons'
import styles from './Search.module.css'
import useSearchPanelStore from '@/store/search-panel'
import { useEffect } from 'react'
import { preventDefault } from '@/store/utils'

export default function Search({ className }: { className?: string }) {
  const cls = cn(className, styles.search)
  const showSearchPanel = useSearchPanelStore((s) => s.show)
  function show(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault()
      showSearchPanel()
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', show)
    window.addEventListener('keyup', preventDefault)

    return () => {
      window.removeEventListener('keydown', show)
      window.removeEventListener('keyup', preventDefault)
    }
  }, [])

  return (
    <div onClick={() => showSearchPanel()} className={cls}>
      <div className="fcc">
        <SearchIcon />
        <span>搜索</span>
      </div>
      <div className="keyboard_tag">Ctrl+K</div>
    </div>
  )
}
