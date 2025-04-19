'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/client'
import styles from './Toc.module.css'

interface ITocList {
  title: string
  id: string
  depth: number
}

const ShowHeight = 110

const TocLink = memo(
  ({ id, depth, title, active }: ITocList & { active: boolean }) => (
    <Link
      style={{
        paddingLeft: depth * 16,
      }}
      className={cn(styles.item, {
        [styles.active]: active,
      })}
      href={`#${id}`}
    >
      {title}
    </Link>
  ),
)

function Toc() {
  const [lists, setLists] = useState<ITocList[]>([])
  const [activeIndex, setActiveIndex] = useState<number>()
  const nodes = useRef<NodeListOf<Element>>(null)
  const tocRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const highlight = useCallback((i: number) => {
    setActiveIndex(i)
    const tocDom = tocRef.current
    const listDom = listRef.current
    if (!tocDom || !listDom) {
      return
    }
    const top = (listDom.children?.[i] as any)?.offsetTop
    if (top) {
      const scrollHeight = tocDom.scrollHeight
      const viewHeight = tocDom.clientHeight
      let data = top / 2
      if (scrollHeight - top + 36 < viewHeight) {
        data = scrollHeight
      } else if (top - 32 < viewHeight) {
        data = 0
      }

      tocDom?.scrollTo({
        top: data,
      })
    }
  }, [])

  const highlightSet = useMemo(() => {
    if (activeIndex == null) {
      return
    }
    const indexSet = new Set([activeIndex])
    const currentDepth = lists[activeIndex].depth
    const depthSet = new Set([currentDepth])
    for (let i = activeIndex - 1; i >= 0; i--) {
      const list = lists[i]
      if (list.depth < currentDepth && !depthSet.has(list.depth)) {
        indexSet.add(i)
        depthSet.add(list.depth)
      }
    }
    return indexSet
  }, [activeIndex])

  const handler = () => {
    const tocDom = tocRef.current
    if (!tocDom) {
      return
    }
    const viewHeight = 300
    const scrollY = window.scrollY
    if (scrollY > ShowHeight) {
      tocDom.style.opacity = '1'
      for (let i = 0; i < nodes.current!.length; i++) {
        const node = nodes.current![i]
        const rect = node.getBoundingClientRect()
        if (rect.bottom >= 0 && rect.top < viewHeight) {
          highlight(i)
          break
        }
        const nextRect = nodes.current![i + 1]?.getBoundingClientRect()
        if (rect.bottom < 0 && nextRect && nextRect.top > viewHeight) {
          highlight(i)
          break
        }
      }
    } else {
      tocDom.style.opacity = '0'
    }
  }

  useEffect(() => {
    nodes.current = document.querySelectorAll('.md > h1,h2,h3')
    handler()
    setLists(
      Array.from(nodes.current!).map((node) => ({
        title: node.textContent!,
        id: node.id!,
        depth: +node.tagName[1],
      })),
    )
    window.addEventListener('scroll', handler)

    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div ref={tocRef} className={styles.toc}>
      <div className={styles.list} ref={listRef}>
        {lists.map((list, i) => (
          <TocLink
            key={i}
            {...list}
            active={
              activeIndex != null && highlightSet != null && highlightSet.has(i)
            }
          />
        ))}
      </div>
    </div>
  )
}

export default Toc
