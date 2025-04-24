import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  BlogIcon,
  LifeIcon,
  SummaryIcon,
  NoteIcon,
  FolderIcon,
} from '@/components/Icons'
import styles from './Action.module.css'
import Selector from '@/components/ui/Selector'
import { cn } from '@/lib/client'

export const listActionIconp: [string, string, ReactNode][] = [
  ['博客', 'blog', <BlogIcon key="blog" />],
  ['生活', 'life', <LifeIcon key="life" />],
  ['总结', 'summary', <SummaryIcon key="summary" />],
  ['笔记', 'note', <NoteIcon key="note" />],
] as const

function ArtlistAction() {
  return (
    <div className={styles.action}>
      <Selector
        items={listActionIconp.map(([label, p, icon]) => ({
          label: (
            <Link className={styles.item} key={p} href={`/list/${p}/1`}>
              {icon}
              {label}
            </Link>
          ),
          value: p,
        }))}
      >
        <div className={cn('fcc', styles.label)}>
          <FolderIcon />
          全部分类
        </div>
      </Selector>
    </div>
  )
}

export default ArtlistAction
