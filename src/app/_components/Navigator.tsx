'use client'

import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { ReactNode, useMemo } from 'react'
import Link from 'next/link'
import { upperFirstChar } from '@/utils'
import {
  ArrowRightIcon,
  BlogIcon,
  CodeIcon,
  HomeIcon,
  LifeIcon,
  NoteIcon,
  SummaryIcon,
} from './Icons'
import Selector from './Selector'
import styles from './Navigator.module.css'
import Home from '../page'

const notePathMap = {
  '/': 'Blog',
  blog: 'Blog',
  life: 'life',
  note: 'note',
  summary: 'note',
}

const linkMap: Record<string, ReactNode> = {
  blog: <BlogIcon />,
  life: <LifeIcon />,
  summary: <SummaryIcon />,
  note: <NoteIcon />,
}

function Navigator() {
  const pathname = usePathname()

  const routes = useMemo(() => {
    return pathname[0] === '/'
      ? pathname.slice(1).split('/')
      : pathname.split('/')
  }, [pathname])
  const selectNode = useMemo(() => {
    const first = routes[0]
    if (first === 'post') {
      return null
    }
    if (linkMap[first]) {
      return (
        <div className="fcc">
          {linkMap[first]}
          {upperFirstChar(first)}
        </div>
      )
    }
    if (pathname === '/') {
      return (
        <div className="fcc">
          <BlogIcon />
          Blog
        </div>
      )
    }
    return null
  }, [routes])

  return (
    <div className={clsx('center', styles.wrap)}>
      <HomeIcon />
      <ArrowRightIcon />
      <Selector
        items={Object.keys(linkMap).map((key) => ({
          value: key,
          label: (
            <Link className="fcc" href={'/' + key}>
              {linkMap[key]}
              {upperFirstChar(key)}
            </Link>
          ),
        }))}
        title={selectNode}
        onChange={(value: string) => {}}
      />
    </div>
  )
}

export default Navigator
