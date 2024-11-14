/* eslint-disable import-x/no-named-as-default */
'use client'

// It could be running at server, but doesn't support onClick or other props
import React, { createElement, memo, ReactNode, useMemo, useState } from 'react'
import clsx from 'clsx'
import { mono } from '@/app/fonts'
import { handlePlaygroundFileKey } from '@/plugins/rehype/playground-pre'
import {
  handlePlaygroundFileMapKey,
  handlePlaygroundSelector,
  handlePlaygroundCustomPreivew,
  handlePlaygroundHideConsoleKey,
  handlePlaygroundHideTabsKey,
  handlePlaygroundStyles,
} from '@/plugins/remark/playground-utils'
import ReactShadowRoot from '@/app/components/Shadow'
import useConsole from '@/hooks/useConsole'
import { StringValueObj } from '@/types/base'
import styles from './index.module.css'
import { StaticPlaygroundPreview, PlaygroundPreview } from './compile'
import CodeWrap from '../_common/CodeWrap'
import Console from '../_common/Console'
import { componentMap } from '..'

interface CodePreviewProps {
  defaultSelector: string
  nodes: Record<string, ReactNode>
  tabs: string[]
  hide: boolean
}

const CodePreview = ({
  defaultSelector,
  nodes,
  tabs,
  hide,
}: CodePreviewProps) => {
  const [selector, setSelector] = useState(defaultSelector)
  return (
    <div>
      {!hide && (
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
      )}
      <pre className={mono.className}>{nodes[selector]}</pre>
    </div>
  )
}

const Playground = memo((props: any) => {
  const children = Array.isArray(props.children)
    ? props.children
    : [props.children]
  const defaultSelector = handlePlaygroundSelector(props)
  const nodes = Object.fromEntries(
    children.map((node: any) => [handlePlaygroundFileKey(node.props), node]),
  )
  const nodeStyles = handlePlaygroundStyles(props) ?? []
  const files = handlePlaygroundFileMapKey(props) as StringValueObj
  const tabs = Object.keys(files)
  const isStatic = defaultSelector.endsWith('.html')
  const isConsoleHide = handlePlaygroundHideConsoleKey(props)
  const isTabsHide = handlePlaygroundHideTabsKey(props)
  const customPreviewName = handlePlaygroundCustomPreivew(props)
  const { logFn, logs } = useConsole()
  const [isConsoleVisible, setIsConsoleVisible] = useState(!!isConsoleHide)

  const node = useMemo(() => {
    const customPreviewNode = componentMap[customPreviewName]
    const playgroundProps = {
      files,
      defaultSelector,
      logFn,
    }
    if (!isStatic) {
      return customPreviewNode ? (
        createElement(customPreviewNode, props)
      ) : (
        <PlaygroundPreview {...playgroundProps} />
      )
    }
    return <StaticPlaygroundPreview {...playgroundProps} />
  }, [])

  return (
    <CodeWrap barText="Code Playground">
      <CodePreview
        tabs={tabs}
        nodes={nodes}
        defaultSelector={defaultSelector}
        hide={!!isTabsHide}
      />
      <div>
        {!isStatic && !isTabsHide && (
          <div className={styles.tab}>
            <div
              onClick={() => setIsConsoleVisible(false)}
              className={clsx({
                [styles.tab_active]: !isConsoleVisible,
              })}
            >
              Preview
            </div>
            {!isConsoleHide && (
              <div
                className={clsx({
                  [styles.tab_active]: isConsoleVisible,
                })}
                onClick={() => setIsConsoleVisible(true)}
              >
                Console
              </div>
            )}
          </div>
        )}
        <ReactShadowRoot
          shadow={!!nodeStyles.length}
          className={clsx(styles.preview, {
            [styles.hide]: isConsoleVisible,
          })}
        >
          {nodeStyles.map((css, key) => (
            <style key={key}>{css}</style>
          ))}
          {node}
        </ReactShadowRoot>
        {isConsoleVisible && <Console logs={logs} />}
      </div>
    </CodeWrap>
  )
})

export default Playground
