'use client'

import Image from 'next/image'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BlogUrl, GithubName, GithubRepoName, GithubRepoUrl } from '~/data/site'
import styles from './Comment.module.css'
import { cn } from '@/utils/client'
import issueMap from '~/data/issues.json'
import useObserver from '@/hooks/useObservser'
import { entries, isArray, isString } from '@/utils/types'
import { GithubAppClientId } from '@/constants'
import { ExternalLinkIcon } from '@/components/Icons'

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

const LoginGithub = memo(({ pathname }: CommentProps) => {
  return (
    <button
      type="button"
      className="fcc"
      onClick={(e) => {
        e.preventDefault()
        sessionStorage.setItem('prev-pathname', `${BlogUrl}${pathname}`)
        location.href = `https://github.com/login/oauth/authorize?client_id=${GithubAppClientId}&redirect_uri=${BlogUrl}api/oauth`
      }}
    >
      使用 Github 登录
    </button>
  )
})

const LoadingUI = memo(() => (
  <div className={cn(styles.loading_wrap)}>
    <div className={styles.loading} />
    加载评论中......
  </div>
))

const Comment = memo(({ pathname }: CommentProps) => {
  const [status, setStatus] = useState<'loading' | 'error' | 'loaded'>(
    'loading',
  )
  const [accessToken, setAccessToken] = useState<string>()
  const [data, setData] = useState<any[]>([])
  const [errorMessage, _setErrorMessage] = useState<string>()
  const containerRef = useRef<HTMLDivElement>(null)
  const isIntersecting = useObserver(containerRef)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const issueName = `[comment] ${pathname}`
  const issueNumber = issueMap[issueName]
  const queryUrl = `https://api.github.com/repos/${GithubName}/${GithubRepoName}/issues/${issueNumber}/comments`

  const getToken = useCallback(() => {
    return localStorage.getItem('access-token')
  }, [])
  const setErrorMessage = useCallback((error: any) => {
    setStatus('error')
    if (isString(error.message)) {
      setErrorMessage(error.message)
    } else {
      setErrorMessage('未知错误')
    }
  }, [])
  const getIssues = useCallback(async () => {
    try {
      setStatus('loading')
      const token = getToken()
      const headers: Record<string, string> = {
        accept: 'application/vnd.github.VERSION.html+json',
      }
      if (token) {
        setAccessToken(token)
        headers.authorization = `Bearer ${token}`
      }
      const lists = await fetch(queryUrl, {
        headers,
        cache: 'no-store',
      }).then((res) => res.json())
      lists.sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      if (isArray(lists)) {
        setData(lists)
        setStatus('loaded')
      } else {
        setErrorMessage(lists)
      }
    } catch (error: any) {
      setErrorMessage(error)
    }
  }, [])

  useEffect(() => {
    if (!isIntersecting || !issueNumber) {
      return
    }
    getIssues()
  }, [isIntersecting])

  const createIssue = useCallback(async (body: string) => {
    const token = getToken()
    body = body.trim()
    if (!token || !body) {
      return
    }
    try {
      setStatus('loading')
      await fetch(queryUrl, {
        method: 'POST',
        headers: {
          accept: 'application/vnd.github+json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body }),
      })
      await getIssues()
    } catch (error) {
      setErrorMessage(error)
    }
    if (textareaRef.current) {
      textareaRef.current.value = ''
    }
  }, [])

  const shouldShowLists = useMemo(
    () => status === 'loaded' && isArray(data),
    [data, status],
  )

  const CommentTextarea = useCallback(() => {
    const userLogin = localStorage.getItem('user-login')
    const userAvatar = localStorage.getItem('user-avatar')
    return (
      accessToken && (
        <div className={styles.item}>
          <div className={styles.top}>
            {userAvatar && (
              <Image src={userAvatar} width={32} height={32} alt={userAvatar} />
            )}
            {userLogin && <div className={styles.login}>{userLogin}</div>}
          </div>
          <textarea placeholder="添加评论" ref={textareaRef} />
          <button
            className={styles.issue_btn}
            type="button"
            onClick={() => {
              createIssue(textareaRef.current!.value)
            }}
          >
            提交
          </button>
        </div>
      )
    )
  }, [accessToken])
  const Lists = useCallback(() => {
    if (!shouldShowLists) {
      return null
    }
    return data.map((list: any) => (
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
    ))
  }, [status, data])
  const node = useMemo(() => {
    if (!isIntersecting) {
      return null
    }
    if (status === 'error') {
      return (
        <div className="md">
          <blockquote className="blockquote-danger">{errorMessage}</blockquote>
          <LoginGithub pathname={pathname} />
        </div>
      )
    }

    return (
      <>
        {!accessToken && status === 'loaded' && (
          <div className={cn(styles.github_login, 'fcc')}>
            <LoginGithub pathname={pathname} />
          </div>
        )}
        <div className={styles.comment_info}>
          <div className={styles.count}>{data.length}条评论</div>
          <a
            className={cn('fcc', styles.add_link)}
            href={`${GithubRepoUrl}/issues/${issueNumber}`}
          >
            去 issue 页面添加评论 <ExternalLinkIcon />
          </a>
        </div>
        <CommentTextarea />
        <Lists />
        {status === 'loading' && <LoadingUI />}
      </>
    )
  }, [isIntersecting, data, status])

  return (
    <div ref={containerRef} className={styles.wrapper}>
      {node}
    </div>
  )
})

export default Comment
