'use client'

import Image from 'next/image'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BlogUrl, GithubName, GithubRepoName, GithubRepoUrl } from '~/data/site'
import styles from './Comment.module.css'
import { cn } from '@/lib/client'
import issueMap from '~/data/issues.json'
import useObserver from '@/hooks/useObservser'
import { isArray, isString } from '@/lib/types'
import { GithubAppClientId } from '@/constants'
import { ExternalLinkIcon, GithubIcon } from '@/components/Icons'

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
        location.href = `https://github.com/login/oauth/authorize?client_id=${GithubAppClientId}&redirect_uri=${BlogUrl}api/oauth/redirect`
      }}
    >
      <GithubIcon fontSize={24} />
      使用 Github 登录评论
    </button>
  )
})

const LoadingUI = memo(() => (
  <div className={cn(styles.loading_wrap)}>
    <div className={styles.loading} />
    加载评论中......
  </div>
))

interface List {
  user: {
    login: string
    avatar_url: string
  }
  created_at: string
  body_html: string
  reactions: Record<string, number>
  author_association: string
}

interface ListItemProps {
  list: List
  active: boolean
}

const ListItem = memo(({ list, active }: ListItemProps) => {
  return (
    <div
      className={cn(styles.item, {
        [styles.item_active]: active,
      })}
    >
      <div className={styles.top}>
        <Image
          src={list.user.avatar_url}
          width={28}
          height={28}
          alt={list.user.avatar_url}
        />
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
      {/* {list.reactions.total_count > 0 && (
        <div className={styles.reactions}>
          {entries(list.reactions).map(([key, reaction]) => {
            if (!reactionsMap[key] || reaction === 0) {
              return null
            }
            return (
              <div key={key}>
                <span>{reactionsMap[key]}</span>
                <span>{reaction}</span>
              </div>
            )
          })}
        </div>
      )} */}
    </div>
  )
})

const getToken = () => {
  return localStorage.getItem('access-token')
}

const Comment = memo(({ pathname }: CommentProps) => {
  const [status, setStatus] = useState<'loading' | 'error' | 'loaded'>(
    'loading',
  )
  const [accessToken, setAccessToken] = useState<string>()
  const [data, setData] = useState<any[]>([])
  const [errorMessage, _setErrorMessage] = useState<string>()
  const [highLightFirstOne, setHighLightFirstOne] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isIntersecting = useObserver(containerRef)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const issueNumber = issueMap[pathname.slice(6)]
  const queryUrl = `https://api.github.com/repos/${GithubName}/${GithubRepoName}/issues/${issueNumber}/comments`

  const setErrorMessage = useCallback((error: any) => {
    setStatus('error')
    if (isString(error.message)) {
      if (error.message === 'Bad credentials') {
        _setErrorMessage('Github token 过期，请重新登录')
      } else if (error.message.startsWith('API rate limit')) {
        _setErrorMessage('超出 Github API 速率限制，请登录获取更多次数')
      } else if (error.message.startsWith('Failed to fetch')) {
        _setErrorMessage('Github API 请求失败，请检查网络')
      } else {
        _setErrorMessage(error.message)
      }
    } else {
      _setErrorMessage('未知错误，请尝试登录 Github 解决')
    }
  }, [])

  const getIssues = useCallback(async (loading = true) => {
    try {
      loading && setStatus('loading')
      const token = getToken()
      const headers: Record<string, string> = {
        accept: 'application/vnd.github.VERSION.html+json',
      }
      if (token) {
        const verifyText = await fetch('/api/oauth/verify', {
          headers: {
            authorization: token,
          },
        }).then((res) => res.text())
        if (verifyText !== 'error') {
          setAccessToken(token)
          headers.authorization = `Bearer ${token}`
        }
      }
      const lists = await fetch(queryUrl, {
        headers,
        cache: 'no-store',
      }).then((res) => res.json())

      if (isArray(lists)) {
        lists.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        setData(lists)
        setStatus('loaded')
      } else {
        setErrorMessage(lists)
      }
    } catch (error: any) {
      setErrorMessage(error)
    }
  }, [])
  const issueAddNode = useMemo(
    () => (
      <a
        target="_blank"
        className={styles.add_link}
        href={`${GithubRepoUrl}/issues/${issueNumber}`}
        rel="noreferrer"
      >
        去 issue 页面添加评论 <ExternalLinkIcon />
      </a>
    ),
    [],
  )

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
      await fetch(queryUrl, {
        method: 'POST',
        headers: {
          accept: 'application/vnd.github+json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body }),
      })
      await getIssues(false)
      setHighLightFirstOne(true)
    } catch (error) {
      setErrorMessage(error)
    }
    if (textareaRef.current) {
      textareaRef.current.value = ''
    }
  }, [])

  const CommentTextarea = useCallback(() => {
    const userLogin = localStorage.getItem('user-login')
    const userAvatar = localStorage.getItem('user-avatar')
    return (
      accessToken && (
        <div className={styles.item}>
          <div className={styles.top}>
            {userAvatar && (
              <Image src={userAvatar} width={28} height={28} alt={userAvatar} />
            )}
            {userLogin && <div className={styles.login}>{userLogin}</div>}
          </div>
          <textarea placeholder="添加评论" ref={textareaRef} />
          <div className={styles.submit}>
            <button
              type="button"
              onClick={() => {
                createIssue(textareaRef.current!.value)
              }}
            >
              提交
            </button>
          </div>
        </div>
      )
    )
  }, [accessToken])

  const Lists = useCallback(() => {
    return (
      <>
        {status === 'loading' && <LoadingUI />}
        {isArray(data) &&
          data.map((list: any, i) => (
            <ListItem
              key={list.id}
              list={list}
              active={highLightFirstOne && i === 0}
            />
          ))}
      </>
    )
  }, [status, data, highLightFirstOne])

  const node = useMemo(() => {
    if (!isIntersecting) {
      return null
    }
    if (status === 'error') {
      return (
        <div className="md">
          <LoginGithub pathname={pathname} />
          <blockquote className="blockquote-danger">
            <p>{errorMessage}</p>
            <p className={styles.error_link}>{issueAddNode}</p>
          </blockquote>
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
        {status === 'loaded' && (
          <div className={styles.comment_info}>
            <div className={styles.count}>{data.length}条评论</div>
            {issueAddNode}
          </div>
        )}
        <CommentTextarea />
        <Lists />
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
