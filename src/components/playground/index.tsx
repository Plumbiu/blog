/* eslint-disable import-x/no-named-as-default */
'use client'

// It could be running at server, but doesn't support onClick or other props
import React, { memo, ReactNode, useMemo, useState } from 'react'
import { jsx } from 'react/jsx-runtime'
import clsx from 'clsx'
import { mono } from '@/app/fonts'
import { handlePlaygroundFileKey } from '@/plugins/rehype/playground-pre'
import {
  handlePlaygroundFileMapKey,
  handlePlaygroundSelector,
  handlePlaygroundCustomPreivew,
  handlePlaygroundHideConsoleKey,
  handlePlaygroundHideTabsKey,
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
  const files = handlePlaygroundFileMapKey(props) as StringValueObj
  const tabs = Object.keys(files)
  const isStatic = defaultSelector.endsWith('.html')
  const isConsoleHide = handlePlaygroundHideConsoleKey(props)
  const isTabsHide = handlePlaygroundHideTabsKey(props)
  const customPreviewName = handlePlaygroundCustomPreivew(props)
  const { logFn, logs } = useConsole()

  const [isConsoleVisible, setIsConsoleVisible] = useState(!!isConsoleHide)

  const { node, nodeStyles } = useMemo(() => {
    const styles: string[] = []

    const customPreviewNode = componentMap[customPreviewName]
    if (!isStatic && customPreviewNode) {
      return {
        node: jsx(customPreviewNode, props),
        nodeStyles: styles,
      }
    }
    for (const key in files) {
      if (key.endsWith('.css')) {
        styles.push(files[key])
      }
    }
    let node: ReactNode = null
    const playgroundProps = {
      files,
      defaultSelector,
      logFn,
    }
    if (isStatic) {
      node = <StaticPlaygroundPreview {...playgroundProps} />
    } else {
      node = <PlaygroundPreview {...playgroundProps} />
    }
    return {
      node,
      nodeStyles: styles,
    }
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
