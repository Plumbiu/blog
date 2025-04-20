import Link from 'next/link'
import type { ReactNode } from 'react'
import { Categoires } from '~/constants/shared'
import { upperFirstChar } from '@/lib/shared'
import { cn } from '@/lib/client'
import { BlogIcon, LifeIcon, SummaryIcon, NoteIcon } from '@/components/Icons'
import styles from './Action.module.css'

export const listActionIconMap: Record<string, ReactNode> = {
  blog: <BlogIcon />,
  life: <LifeIcon />,
  summary: <SummaryIcon />,
  note: <NoteIcon />,
}

function ArtlistAction({ type }: { type: string }) {
  return (
    <div className={styles.action}>
      {Categoires.map((p) => (
        <Link
          className={cn(styles.item, {
            [styles.active]: type === p,
          })}
          key={p}
          href={`/list/${p}/1`}
        >
          {listActionIconMap[p]}
        </Link>
      ))}
    </div>
  )
}

export default ArtlistAction
