import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  BlogIcon,
  LifeIcon,
  SummaryIcon,
  NoteIcon,
  FolderOpenIcon,
} from '@/components/Icons'
import styles from './Action.module.css'
import Selector from '@/components/ui/Selector'
import { cn } from '@/lib/client'

const map: Record<string, string> = {
  blog: '博客',
  life: '生活',
  summary: '总结',
  note: '笔记',
}

export const listActionIconMap: Record<string, ReactNode> = {
  '': <FolderOpenIcon />,
  blog: <BlogIcon />,
  life: <LifeIcon />,
  summary: <SummaryIcon />,
  note: <NoteIcon />,
}

function ArtlistAction({ type }: { type: keyof typeof map | undefined }) {
  return (
    <div className={styles.action}>
      <Selector
        items={Object.entries(listActionIconMap).map(([p, icon]) => ({
          label: (
            <Link
              className={styles.item}
              key={p}
              href={`/list/${p ? `${p}/` : ''}1`}
            >
              {icon}
              {map[p] || '全部'}
            </Link>
          ),
          value: p || '全部',
        }))}
        label={
          <div className={cn('fcc', styles.label)}>
            {type ? listActionIconMap[type] : <FolderOpenIcon />}
            {type ? map[type] : '全部'}
          </div>
        }
      />
    </div>
  )
}

export default ArtlistAction
