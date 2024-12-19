'use client'

import { cn } from '@/utils/client'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import styles from './SearchPanel.module.css'
import Modal from './Modal'
import { CopyErrorIcon, SearchIcon } from './Icons'
import { upperFirstChar } from '@/utils'
import { Link } from 'next-view-transitions'

interface SearchData {
  title: string
  path: string
  type: string
}

interface SearchPanelProps {
  setSearchVisible: (visible: boolean) => void
}

function SearchPanel({ setSearchVisible }: SearchPanelProps) {
  const listRef = useRef<SearchData[]>()
  const [lists, setLists] = useState<SearchData[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
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
      setLists(lists)
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
    <Modal>
      <div
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const target = e.target as HTMLElement
          console.log(contentRef.current)
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
            {lists.map((list, i) => (
              <Link
                onClick={() => setSearchVisible(false)}
                href={`/${list.path}`}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(styles.list, {
                  [styles.list_active]: activeIndex === i,
                })}
                key={list.path}
              >
                <div>
                  <div className={styles.type}>{upperFirstChar(list.type)}</div>
                  <div className={styles.title}>
                    {handleHihglight(list.title)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className={styles.footer}>
            <div>ESC to close</div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default SearchPanel
