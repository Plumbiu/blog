'use client'

import { cn } from '@/utils/client'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import styles from './SearchPanel.module.css'
import Modal from './Modal'
import { CopyErrorIcon, KeyboardEscIcon, SearchIcon } from './Icons'
import { upperFirstChar } from '@/utils'
import { Link } from 'next-view-transitions'

interface SearchData {
  date: string
  title: string
  path: string
  type: string
}

type ListType = [string, SearchData[]][]
interface SearchPanelProps {
  setSearchVisible: (visible: boolean) => void
}

function SearchPanel({ setSearchVisible }: SearchPanelProps) {
  const listRef = useRef<SearchData[]>()
  const [lists, setLists] = useState<ListType>([])
  const [activePath, setActivePath] = useState<string>()
  const [search, setSearch] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)
  const label = useId()

  const hidden = useCallback(() => {
    setSearchVisible(false)
  }, [setSearchVisible])
  const handleKeyDown = useCallback(
    (e: WindowEventMap['keydown']) => {
      if (e.key === 'Escape') {
        hidden()
      }
    },
    [hidden],
  )

  useEffect(() => {
    ;(async () => {
      const data: SearchData[] = await fetch('/api/search').then((res) =>
        res.json(),
      )
      listRef.current = data
    })()

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (search.length > 0 && listRef.current) {
      const lists = listRef.current!.filter((list) =>
        list.title.toLowerCase().includes(search.toLowerCase()),
      )
      const result: Record<string, SearchData[]> = {}
      for (const list of lists) {
        const type = upperFirstChar(list.type)
        if (!result[type]) {
          result[type] = []
        }
        result[type].push(list)
      }
      setLists(Object.entries(result))
    } else {
      setLists([])
    }
  }, [search, listRef])

  const handleHihglight = useCallback(
    (text: string) => {
      const lowerText = text.toLowerCase()
      const lowerSearch = search.toLowerCase()
      if (!search || !lowerText.includes(lowerSearch)) {
        return text
      }
      const index = lowerText.indexOf(search)
      const before = lowerText.slice(0, index)
      const after = lowerText.slice(index + search.length)
      return (
        <>
          {before}
          <span className={styles.highlight_word}>
            {text.slice(index, index + search.length)}
          </span>
          {after}
        </>
      )
    },
    [search],
  )
  return (
    <Modal
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        const target = e.target as HTMLElement
        if (!contentRef.current!.contains(target)) {
          hidden()
        }
      }}
    >
      <div ref={contentRef} className={styles.wrap}>
        <div className={styles.header}>
          <form className={styles.form}>
            <label htmlFor={label} className={styles.label}>
              <SearchIcon />
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id={label}
              className={styles.ipt}
              placeholder="Search posts"
              autoComplete="off"
            />
            {search.length > 0 && (
              <button
                onClick={() => setSearch('')}
                className={styles.btn}
                type="reset"
              >
                <CopyErrorIcon />
              </button>
            )}
          </form>
        </div>
        <div className={styles.list_wrapper}>
          {lists.length === 0 && (
            <div className={styles.empty}>No recent posts</div>
          )}
          {lists.map(([type, list]) => (
            <section key={type}>
              <div className={styles.list_type}>{type}</div>
              <div>
                {list.map(({ path, title, date }) => (
                  <Link
                    key={path}
                    onClick={() => setSearchVisible(false)}
                    href={`/${path}`}
                    onMouseEnter={() => setActivePath(path)}
                    className={cn(styles.list, {
                      [styles.list_active]: activePath === path,
                    })}
                  >
                    <div>
                      <div className={styles.date}>{date}</div>
                      <div className={styles.title}>
                        {handleHihglight(title)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className={styles.footer}>
          <div>
            <KeyboardEscIcon /> to close
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default SearchPanel
