'use client'

import { cn } from '@/lib/client'
import {
  type ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import styles from './SearchPanel.module.css'
import Modal from '../ui/Modal'
import { CopyErrorIcon, SearchIcon } from '../Icons'
import Link from 'next/link'
import useSearchPanelStore from '@/store/search-panel'
import type { PostList } from '~/markdown/types'

interface SearchPanelProps {
  data?: PostList[]
}

const SearchPanel = memo(({ data }: SearchPanelProps) => {
  const hidden = useSearchPanelStore((s) => s.hidden)
  const searchPanelVisible = useSearchPanelStore((s) => s.visible)
  const [mounted, setMounted] = useState(false)
  const [lists, setLists] = useState<PostList[]>([])
  const listRef = useRef<PostList[]>(data)
  const [activePath, setActivePath] = useState<string>()
  const [search, setSearch] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)
  const label = useId()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!listRef.current?.length) {
      fetch('/api/search', {
        cache: 'force-cache',
      })
        .then((res) => res.json())
        .then((data: PostList[]) => {
          listRef.current = data
        })
    }
  }, [])

  useEffect(() => {
    if (search.length > 0 && listRef.current) {
      const lowerFormat = search.toLowerCase()
      const lists = listRef.current.filter(
        (list) =>
          list.meta.title.toLowerCase().includes(lowerFormat) ||
          list.meta.desc?.toLowerCase().includes(lowerFormat),
      )
      setLists(lists)
    } else {
      setLists([])
    }
  }, [search, data])

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

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }, [])
  if (!searchPanelVisible || !mounted) {
    return null
  }
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
        <form className={styles.form}>
          <label htmlFor={label}>
            <SearchIcon />
          </label>
          <input
            value={search}
            onChange={handleInputChange}
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
        {!!lists.length && (
          <div className={styles.list_wrapper}>
            {lists.map((list) => {
              const { path, meta } = list
              return (
                <Link
                  key={path}
                  onClick={() => hidden()}
                  href={`/${path}`}
                  onMouseEnter={() => setActivePath(path)}
                  className={cn(styles.list, {
                    [styles.list_active]: activePath === path,
                  })}
                >
                  <div className={styles.title}>
                    {handleHihglight(meta.title)}
                  </div>
                  {!!meta.desc && (
                    <div className={styles.desc}>
                      {handleHihglight(meta.desc)}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </Modal>
  )
})

export default SearchPanel
