'use client'

import { cn } from '@/lib/client'
import { CommandKey, SearchIcon } from '../../Icons'
import styles from './Search.module.css'
import useSearchPanelStore from '@/store/search-panel'
import useSystemInfo from '@/hooks/useIsMac'

export default function Search({ className }: { className?: string }) {
  const cls = cn(className, styles.search)
  const showSearchPanel = useSearchPanelStore((s) => s.show)
  const info = useSystemInfo()

  return (
    <div onClick={() => showSearchPanel()} className={cls}>
      <div className="fcc">
        <SearchIcon />
        <span>搜索</span>
      </div>
      {!!info && (
        <div className={styles.key}>
          {info.isWin && <CommandKey />}
          {/* {info.isWin && <div>Ctrl</div>} */}
          <span>+</span>
          <span>K</span>
        </div>
      )}
    </div>
  )
}
