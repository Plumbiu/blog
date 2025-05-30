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
import type { PostList, PostMeta } from '~/markdown/types'
import useMounted from '../../hooks/useMounted'

export type SearchData = Pick<PostList, 'path' | 'type'> & {
  meta: Pick<PostMeta, 'title' | 'desc' | 'tags'>
}
interface SearchPanelProps {
  data: SearchData[]
}

const SearchPanel = memo(({ data }: SearchPanelProps) => {
  const hidden = useSearchPanelStore((s) => s.hidden)
  const searchPanelVisible = useSearchPanelStore((s) => s.visible)
  const mounted = useMounted()
  const [lists, setLists] = useState<SearchData[]>(data)
  const [activePath, setActivePath] = useState<string>()
  const [search, setSearch] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)
  const label = useId()

  useEffect(() => {
    if (search.length > 0) {
      const lowerFormat = search.toLowerCase()
      const lists = data.filter(
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
        return <span>{text}</span>
      }
      const index = lowerText.indexOf(lowerSearch)
      const before = text.slice(0, index)
      const after = text.slice(index + search.length)
      return (
        <>
          <span>{before}</span>
          <span className={styles.highlight_word}>
            {text.slice(index, index + search.length)}
          </span>
          <span>{after}</span>
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
                    <div className={cn('ml-4', 'fcc')}>
                      {!!meta.tags &&
                        meta.tags.map((tag) => (
                          <div className={styles.tag} key={tag}>
                            {tag}
                          </div>
                        ))}
                    </div>
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
