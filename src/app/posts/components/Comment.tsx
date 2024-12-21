'use client'

import Image from 'next/image'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { GithubName, GithubRepoName, GithubRepoUrl } from '~/data/site'
import styles from './Comment.module.css'
import { cn } from '@/utils/client'
import issueMap from '~/data/issues.json'
import { Link } from 'next-view-transitions'
import { ExternalLinkIcon } from '@/components/Icons'
import useObserver from '@/hooks/useObservser'
import { entries, isArray, isString } from '@/utils/types'

const reactionsMap: Record<string, string> = {
  '+1': '👍',
  '-1': '👎',
  laugh: '😆',
  hooray: '🎉',
  confused: '😕',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
}

interface CommentProps {
  pathname: string
}
const timeago = (createdAt: string): string => {
  const created = new Date(createdAt)
  const now = new Date()
  const duration = (now.getTime() - created.getTime()) / 1000 / 60
  let ans = '刚刚'
  if (duration > 0 && duration < 60) {
    // 一小时内
    ans = `${duration.toFixed(0)}分钟前`
  } else if (duration < 60 * 24) {
    // 一天内
    ans = `${(duration / 60).toFixed(0)}小时前`
  } else if (duration < 60 * 24 * 30) {
    // 一个月内
    ans = `${(duration / 60 / 24).toFixed(0)}天前`
  } else {
    // 一年内
    ans = `${created.getFullYear()}年${created.getMonth()}月${created.getDate()}日`
  }
  return ans
}

type Data = { status: 'error' | 'loading' | 'loaded'; value?: any }

const Comment = memo(({ pathname }: CommentProps) => {
  const [data, setData] = useState<Data>({ status: 'loading' })
  const containerRef = useRef<HTMLDivElement>(null)
  const isIntersecting = useObserver(containerRef)
  const issueName = `[comment] ${pathname}`
  const issueNumber = issueMap[issueName]

  useEffect(() => {
    if (!isIntersecting || !issueNumber) {
      return
    }
    ;(async () => {
      try {
        const queryUrl = `https://api.github.com/repos/${GithubName}/${GithubRepoName}/issues/${issueNumber}/comments`
        const lists = await fetch(queryUrl, {
          headers: {
            accept: 'application/vnd.github.VERSION.html+json',
          },
          cache:
            process.env.NODE_ENV === 'development' ? 'force-cache' : 'no-store',
        }).then((res) => res.json())

        if (isArray(lists)) {
          setData({ status: 'loaded', value: lists })
        } else if (isString(lists.message)) {
          setData({ status: 'error', value: lists.message })
        } else {
          setData({ status: 'error', value: '未知错误' })
        }
      } catch (error) {
        setData({ status: 'error' })
      }
    })()
  }, [isIntersecting])

  const node = useMemo(() => {
    if (data.status === 'error') {
      return (
        <div className="md">
          <blockquote className="blockquote-danger">
            {data.value}
          </blockquote>
        </div>
      )
    }
    if (!data.value || !isIntersecting) {
      return null
    }
    if (data.status === 'loading') {
      return (
        <div className={cn(styles.loading_wrap)}>
          <div className={styles.loading} />
          加载评论中......
        </div>
      )
    }
    if (!isArray(data.value)) {
      return null
    }
    return (
      <>
        <div className={styles.count}>{data.value.length}条评论</div>
        {data.value.map((list: any) => (
          <div key={list.id} className={styles.item}>
            <div className={styles.top}>
              <Image src={list.user.avatar_url} width={32} height={32} alt="" />
              <div className={styles.login}>{list.user.login}</div>
              <div className={styles.date}>{timeago(list.created_at)}</div>
              {list.author_association === 'OWNER' && (
                <div className={styles.owner}>所有者</div>
              )}
            </div>
            <div
              className={cn('md', styles.body)}
              dangerouslySetInnerHTML={{
                __html: list.body_html,
              }}
            />
            {list.reactions.total_count > 0 && (
              <div className={styles.reactions}>
                {entries(list.reactions).map(([key, reaction]) => {
                  if (!reactionsMap[key] || reaction === 0) {
                    return null
                  }
                  return (
                    <div key={key}>
                      <span>{reactionsMap[key]}</span>
                      <span>{reaction as string}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </>
    )
  }, [isIntersecting, data])

  return (
    <div ref={containerRef} className={styles.wrapper}>
      <Link
        target="_blank"
        className={cn('fcc', styles.add_link)}
        href={`${GithubRepoUrl}/issues/${issueNumber}`}
      >
        去 issue 页面添加评论
        <ExternalLinkIcon />
      </Link>
      {node}
    </div>
  )
})

export default Comment
