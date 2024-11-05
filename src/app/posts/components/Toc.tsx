'use client'

import { memo, useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { Link } from 'next-view-transitions'
import { throttle } from '@/utils'
import styles from './Toc.module.css'

interface ITocList {
  title: string
  id: string
  pl: number
}

const TocLink = memo(
  ({ id, pl, title, active }: ITocList & { active: boolean }) => (
    <Link
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

function Toc() {
  const [list, setList] = useState<ITocList[]>([])
  const [activeIndex, setActiveIndex] = useState<number>()
  const nodes = useRef<NodeListOf<Element>>()
  const tocRef = useRef<HTMLDivElement>(null)

  function highlight(i: number) {
    setActiveIndex(i)
    const tocDom = tocRef.current
    const top = (tocDom?.children[i] as any)?.offsetTop
    if (top) {
      const tocHeight = tocDom?.clientHeight ?? 0
      tocDom?.scrollTo({
        top: top - Math.floor(tocHeight / 2) - 16,
      })
    }
  }

  const handler = throttle(
    () => {
      const viewHeight = window.innerHeight / 2
      console.log(viewHeight)
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
    },
    100,
    { ignoreFirst: true },
  )

  useEffect(() => {
    nodes.current = document.querySelectorAll('.md > h1,h2,h3')
    handler()
    setList(
      Array.from(nodes.current!).map((node) => ({
        title: node.textContent!,
        id: node.id!,
        pl: +node.tagName[1] * 16,
      })),
    )
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
