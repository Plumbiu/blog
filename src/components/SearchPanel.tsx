'use client'

import { cn } from '@/lib/client'
import {
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import styles from './SearchPanel.module.css'
import Modal from './Modal'
import { CopyErrorIcon, SearchIcon, SearchSlashIcon } from './Icons'
import { upperFirstChar } from '@/lib/shared'
import Link from 'next/link'
import { entries } from '@/lib/types'
import useSearchPanelStore from '@/store/search-panel'

interface SearchData {
  date: string
  title: string
  path: string
  type: string
}

const EmptyContent = memo(({ search }: { search: string }) => {
  return (
    <div className={styles.empty_content}>
      <SearchSlashIcon />
      No results found for "
      <span className={styles.highlight_word}>{search}</span>"
    </div>
  )
})

type ListType = [string, SearchData[]][]
interface SearchPanelProps {
  data?: SearchData[]
}

const InitialEmptyContent = 'No results'

function SearchPanel({ data }: SearchPanelProps) {
  const hidden = useSearchPanelStore('hidden')
  const searchPanelVisible = useSearchPanelStore('visible')
  const [mounted, setMounted] = useState(false)
  const [lists, setLists] = useState<ListType>([])
  const listRef = useRef<SearchData[]>(data)
  const [activePath, setActivePath] = useState<string>()
  const [emptyContent, setEmptyContent] =
    useState<ReactNode>(InitialEmptyContent)
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
        .then((data: SearchData[]) => {
          listRef.current = data
        })
    }
  }, [])

  useEffect(() => {
    if (search.length > 0 && listRef.current) {
      const lists = listRef.current.filter((list) =>
        list.title.toLowerCase().includes(search.toLowerCase()),
      )
      if (lists.length === 0) {
        setEmptyContent(<EmptyContent search={search} />)
      }
      const result: Record<string, SearchData[]> = {}
      for (const list of lists) {
        const type = upperFirstChar(list.type)
        if (!type) {
          continue
        }
        if (!result[type]) {
          result[type] = []
        }
        result[type].push(list)
      }
      setLists(entries(result))
    } else {
      setLists([])
      setEmptyContent(InitialEmptyContent)
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
            <div className={styles.empty}>{emptyContent}</div>
          )}
          {lists.map(([type, list]) => (
            <section key={type}>
              <div className={styles.list_type}>{type}</div>
              <div>
                {list.map(({ path, title, date }) => (
                  <Link
                    key={path}
                    onClick={() => hidden()}
                    href={`/${path}`}
                    onMouseEnter={() => setActivePath(path)}
                    className={cn(styles.list, {
                      [styles.list_active]: activePath === path,
                    })}
                  >
                    <div className={styles.date}>{date}</div>
                    <div className={styles.title}>{handleHihglight(title)}</div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className={styles.footer}>
          <div>Type to search</div>
        </div>
      </div>
    </Modal>
  )
}

export default SearchPanel
