/* eslint-disable import/no-named-as-default */
'use client'

// It could be running at server, but doesn't support onClick or other props
import React, { memo, ReactNode, useCallback, useMemo, useState } from 'react'
import clsx from 'clsx'
import styles from './index.module.css'
import { buildFiles, padStartZero } from '@/utils'
import { mono } from '@/app/fonts'
import { getFileKeyFromProps } from '@/plugins/rehype/playground-pre'
import {
  getCodeFromProps,
  getDefaultSelectorFromProps,
} from '@/plugins/remark/playground'
import useMounted from '@/hooks/useMounted'
import ReactShadowRoot from '@/app/components/Shadow'
import dynamic from 'next/dynamic'

const PlaygroundPreview = dynamic(() =>
  import('./compile').then((res) => res.PlaygroundPreview),
)

const StaticPlaygroundPreview = dynamic(() =>
  import('./compile').then((res) => res.StaticPlaygroundPreview),
)
interface LogInfo {
  date: number
  value: any
}

interface CodePreviewProps {
  defaultSelector: string
  nodes: Record<string, ReactNode>
  tabs: string[]
}

const CodePreview = memo(
  ({ defaultSelector, nodes, tabs }: CodePreviewProps) => {
    const [selector, setSelector] = useState(defaultSelector)
    return (
      <div className={styles.code}>
        <div className={styles.tab}>
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setSelector(tab)}
              className={clsx({
                [styles['tab_active']]: tab === selector,
              })}
            >
              {tab}
            </div>
          ))}
        </div>
        <pre className={mono.className}>{nodes[selector]}</pre>
      </div>
    )
  },
)

function formatTime(date: number) {
  const d = new Date(date)
  const hh = padStartZero(d.getHours())
  const mm = padStartZero(d.getMinutes())
  const ss = padStartZero(d.getSeconds())
  return `${hh}:${mm}:${ss}`
}

const Playground = (props: any) => {
  const code = getCodeFromProps(props)
  const children = props.children
  const defaultSelector = getDefaultSelectorFromProps(props)
  const nodes = useMemo(
    () =>
      Object.fromEntries(
        children.map((node: any) => [getFileKeyFromProps(node.props), node]),
      ),
    [children],
  )
  const files = useMemo(
    () => buildFiles(code, defaultSelector),
    [code, defaultSelector],
  )
  const tabs = useMemo(() => Object.keys(files), [files])
  const isStatic = defaultSelector.endsWith('.html')
  const isMounted = useMounted()
  const [isConsoleVisible, setIsConsoleVisible] = useState(false)
  const [logs, setLogs] = useState<LogInfo[]>([])

  const logMethod = useCallback(
    (value: any) => {
      const now = Date.now()
      const info = { date: now, value }
      const lastLog = logs[logs.length - 1]
      if (lastLog == null || lastLog.date !== now) {
        if (!isMounted) {
          logs.push(info)
        } else {
          setLogs((prev) => [...prev, info])
        }
      }
    },
    [isMounted],
  )

  const node = useMemo(() => {
    const playgroundProps = {
      files,
      defaultSelector,
      logMethod,
    }

    if (isStatic) {
      return <StaticPlaygroundPreview {...playgroundProps} />
    }
    return <PlaygroundPreview {...playgroundProps} />
  }, [])

  return (
    <div>
      <div className={styles.bar}>Code Playground</div>
      <div className={styles.container}>
        <CodePreview
          tabs={tabs}
          nodes={nodes}
          defaultSelector={defaultSelector}
        />
        <div>
          {!isStatic && (
            <div className={styles.tab}>
              <div
                onClick={() => setIsConsoleVisible(false)}
                className={clsx({
                  [styles.tab_active]: !isConsoleVisible,
                })}
              >
                Preview
              </div>
              <div
                className={clsx({
                  [styles.tab_active]: isConsoleVisible,
                })}
                onClick={() => setIsConsoleVisible(true)}
              >
                Console
              </div>
            </div>
          )}
          <ReactShadowRoot
            className={clsx(styles.preview, {
              [styles.hide]: isConsoleVisible,
            })}
          >
            {node}
          </ReactShadowRoot>
          {isConsoleVisible && (
            <div className={styles.console}>
              {logs.map((info) => (
                <div key={info.date.valueOf()}>
                  <span>{info.value}</span>
                  <span className={styles.console_date}>
                    {formatTime(info.date)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Playground
