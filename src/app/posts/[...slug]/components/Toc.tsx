'use client'

import { memo, useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/client'
import styles from './Toc.module.css'
import { throttle } from 'es-toolkit'

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
  const nodes = useRef<NodeListOf<Element>>(null)
  const tocRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [hightLightIds, setHiLightIds] = useState<Set<string>>(new Set())

  const handler = useCallback(
    throttle(() => {
      const tocDom = tocRef.current
      if (!tocDom) {
        return
      }
      const viewHeight = window.innerHeight - 36
      const scrollY = window.scrollY
      if (scrollY > ShowHeight) {
        const set = new Set<string>()
        tocDom.style.opacity = '1'
        for (let i = 0; i < nodes.current!.length; i++) {
          const node = nodes.current![i]
          const rect = node.getBoundingClientRect()
          if (rect.bottom >= 0 && rect.top < viewHeight) {
            set.add(node.id)
          }
          const nextRect = nodes.current![i + 1]?.getBoundingClientRect()
          if (rect.bottom < 0 && nextRect && nextRect.top > viewHeight) {
            set.add(node.id)
          }
          setHiLightIds(set)
        }
      } else {
        tocDom.style.opacity = '0'
      }
    }, 150),
    [],
  )

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
          <TocLink key={i} {...list} active={hightLightIds.has(list.id)} />
        ))}
      </div>
    </div>
  )
}

export default Toc
