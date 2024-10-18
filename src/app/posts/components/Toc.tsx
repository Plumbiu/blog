'use client'

import { memo, useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { Link } from 'next-view-transitions'
import styles from './Toc.module.css'
import { formatId, throttle } from '@//utils'

interface ITocList {
  title: string
  id: string
  pl: number
}

const TocLink = memo(
  ({ id, pl, title, active }: ITocList & { active: boolean }) => (
    <Link
      key={id}
      style={{
        paddingLeft: pl,
      }}
      className={clsx(styles.link, {
        [styles.active]: active,
      })}
      href={`#${id}`}
    >
      {title}
    </Link>
  ),
)

function Toc({ title }: { title: string }) {
  const [list, setList] = useState<ITocList[]>([])
  const [activeIndex, setActiveIndex] = useState<number>()
  const nodes = useRef<NodeListOf<Element>>()
  const tocRef = useRef<HTMLDivElement>(null)

  const handler = throttle(() => {
    const tocHeight = tocRef.current?.clientHeight ?? 0
    const viewHeight = window.innerHeight
    for (let i = 0; i < nodes.current!.length; i++) {
      const node = nodes.current![i]
      const rect = node.getBoundingClientRect()
      if (rect.bottom >= 0 && rect.top < viewHeight) {
        setActiveIndex(i)
        const top = (tocRef.current?.children[i] as any)?.offsetTop
        if (top) {
          tocRef.current?.scrollTo({
            top: top - Math.floor(tocHeight / 2) - 16,
          })
        }
        break
      }
    }
  }, 100)

  useEffect(() => {
    nodes.current = document.querySelectorAll('.md > h1,h2,h3')
    handler()
    setList([
      {
        title,
        id: formatId(title),
        pl: 16,
      },
      ...Array.from(nodes.current!).map((node) => ({
        title: node.textContent!,
        id: node.id!,
        pl: +node.tagName[1] * 16,
      })),
    ])
    window.addEventListener('scroll', handler)

    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div ref={tocRef} className={styles.toc}>
      {list.map((list, i) => (
        <TocLink key={i} {...list} active={i === activeIndex} />
      ))}
    </div>
  )
}

export default Toc
