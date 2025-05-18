'use client'

import { cn } from '@/lib/client'
import { SearchIcon } from '../../Icons'
import styles from './Search.module.css'
import useSearchPanelStore from '@/store/search-panel'

export default function Search({ className }: { className?: string }) {
  const cls = cn(className, styles.search)
  const showSearchPanel = useSearchPanelStore((s) => s.show)

  return (
    <div onClick={() => showSearchPanel()} className={cls}>
      <div className="fcc">
        <SearchIcon />
        <span>搜索</span>
      </div>
    </div>
  )
}
