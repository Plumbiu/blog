import Hr from '../ui/Hr'
import ListCenter from './ListCenter'
import type { FC, ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export interface Props {
  blogInfo: Array<{
    primary: string
    href: string
    count: number
  }>
  githubInfo: Array<{
    primary: string
    icon: ReactNode
    href?: string
  }>
}

const ListTop: FC<Props> = ({ blogInfo, githubInfo }) => {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          padding: '16px 16px 8px 16px',
        }}
      >
        <Link
          href="https://github.com/Plumbiu"
          style={{
            paddingTop: '10px',
          }}
        >
          <Image
            width={56}
            height={56}
            style={{
              borderRadius: '50%',
            }}
            alt={'Plumbiu'}
            src="/avatar.jpg"
          />
        </Link>
        <div
          style={{
            padding: '8px 15px',
          }}
        >
          <div
            style={{
              paddingBottom: '4px',
              letterSpacing: '0.15px',
            }}
          >
            👋 Plumbiu
          </div>
          <div
            style={{
              color: 'rgba(0, 0, 0, 0.6)',
              fontSize: '0.875rem',
              lineHeight: '1.43',
              letterSpacing: '0.2px',
            }}
          >
            Studprogrammeried at Hangzhou Dianzi University (杭州电子科技大学)
            (HDU)，a front-end coder
          </div>
        </div>
      </div>
      <Hr />
      <ListCenter blogInfo={blogInfo} githubInfo={githubInfo} />
    </div>
  )
}

export default ListTop
