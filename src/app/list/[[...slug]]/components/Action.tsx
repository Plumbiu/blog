import Link from 'next/link'
import type { ReactNode } from 'react'
import { Categoires } from '~/constants/shared'
import {
  BlogIcon,
  LifeIcon,
  SummaryIcon,
  NoteIcon,
  FolderIcon,
} from '@/components/Icons'
import styles from './Action.module.css'
import Selector from '@/components/ui/Selector'
import { upperFirstChar } from '@/lib/shared'
import { cn } from '@/lib/client'

export const listActionIconMap: Record<string, ReactNode> = {
  blog: <BlogIcon />,
  life: <LifeIcon />,
  summary: <SummaryIcon />,
  note: <NoteIcon />,
}

function ArtlistAction() {
  return (
    <div className={styles.action}>
      <Selector
        items={Categoires.map((p) => ({
          label: (
            <Link className={styles.item} key={p} href={`/list/${p}/1`}>
              {listActionIconMap[p]}
              {upperFirstChar(p)}
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
