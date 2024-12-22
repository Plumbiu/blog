'use client'

import Image from 'next/image'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GithubName, GithubRepoName, GithubRepoUrl } from '~/data/site'
import styles from './Comment.module.css'
import { cn } from '@/utils/client'
import issueMap from '~/data/issues.json'
import { Link } from 'next-view-transitions'
import { ExternalLinkIcon, GithubIcon } from '@/components/Icons'
import useObserver from '@/hooks/useObservser'
import { entries, isArray, isString } from '@/utils/types'
import { GithubAppClientId } from '@/constants'

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

type Data = {
  status: 'error' | 'loading' | 'loaded'
  value?: any
  token?: string | null
}

const LoginGithub = memo(() => (
  <a
    className="fcc"
    data-type="button"
    href={`https://github.com/login/oauth/authorize?client_id=${GithubAppClientId}&redirect_uri=http://localhost:3000/api/oauth`}
  >
    <GithubIcon fontSize={20} /> 使用 Github 登录
  </a>
))

const Comment = memo(({ pathname }: CommentProps) => {
  const [data, setData] = useState<Data>({ status: 'loading' })
  const containerRef = useRef<HTMLDivElement>(null)
  const isIntersecting = useObserver(containerRef)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const issueName = `[comment] ${pathname}`
  const issueNumber = issueMap[issueName]
  const queryUrl = `https://api.github.com/repos/${GithubName}/${GithubRepoName}/issues/${issueNumber}/comments`
  const getToken = useCallback(() => {
    return localStorage.getItem('access-token')
  }, [])

  useEffect(() => {
    if (!isIntersecting || !issueNumber) {
      return
    }
    ;(async () => {
      try {
        const token = getToken()
        const headers: Record<string, string> = {
          accept: 'application/vnd.github.VERSION.html+json',
        }
        if (token) {
          headers.authorization = `Bearer ${token}`
        }
        const lists = await fetch(queryUrl, {
          headers,
          cache: 'no-store',
        }).then((res) => res.json())

        if (isArray(lists)) {
          setData({ status: 'loaded', value: lists, token })
        } else if (isString(lists.message)) {
          setData({ status: 'error', value: lists.message, token })
        } else {
          setData({ status: 'error', value: '未知错误', token })
        }
      } catch (error) {
        setData({ status: 'error' })
      }
    })()
  }, [isIntersecting])

  const createIssue = useCallback(async (body: string) => {
    const token = getToken()
    body = body.trim()
    if (!token || !body) {
      return
    }
    try {
      await fetch(queryUrl, {
        method: 'POST',
        headers: {
          accept: 'application/vnd.github+json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body }),
      })
    } catch (error) {}
  }, [])

  const node = useMemo(() => {
    if (data.status === 'error') {
      return (
        <div className="md">
          <blockquote className="blockquote-danger">{data.value}</blockquote>
          <LoginGithub />
        </div>
      )
    }
    if (data.status === 'loading') {
      return (
        <div className={cn(styles.loading_wrap)}>
          <div className={styles.loading} />
          加载评论中......
        </div>
      )
    }
    if (!isIntersecting || data.status !== 'loaded' || !isArray(data.value)) {
      return null
    }
    const userLogin = localStorage.getItem('user-login')
    const userAvatar = localStorage.getItem('user-avatar')
    return (
      <>
        <Link
          target="_blank"
          className={cn('fcc', styles.add_link)}
          href={`${GithubRepoUrl}/issues/${issueNumber}`}
        >
          去 issue 页面添加评论
          <ExternalLinkIcon />
        </Link>
        {!data.token && (
          <div className={cn(styles.github_login, 'fcc')}>
            <div className={styles.or}>or</div>
            <LoginGithub />
          </div>
        )}
        <div className={styles.count}>{data.value.length}条评论</div>
        {data.token && (
          <div className={styles.item}>
            {userLogin && userAvatar && (
              <div className={styles.top}>
                <Image src={userAvatar} width={32} height={32} alt="" />
                <div className={styles.login}>{userLogin}</div>
              </div>
            )}
            <textarea placeholder="添加评论" ref={textareaRef} />
            <button
              className={styles.issue_btn}
              data-disabled={!data.token}
              type="button"
              onClick={() => {
                createIssue(textareaRef.current!.value)
              }}
            >
              提交
            </button>
          </div>
        )}
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
      {node}
    </div>
  )
})

export default Comment
