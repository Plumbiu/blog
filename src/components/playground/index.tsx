/* eslint-disable import-x/no-named-as-default */
'use client'

// It could be running at server, but doesn't support onClick or other props
import { createElement, memo, ReactNode, useMemo, useState } from 'react'
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
import useForceUpdate from '@/hooks/useForceUpdate'
import styles from './index.module.css'
import { renderStaticPlayground, renerPlayground } from './compile'
import CodeWrap from '../_common/CodeWrap'
import Console from '../_common/Console'
import { componentMap } from '..'

interface CodePreviewProps {
  defaultSelector: string
  nodes: Record<string, ReactNode>
  tabs: string[]
  hide: boolean
}

const CodePreview = memo(
  ({ defaultSelector, nodes, tabs, hide }: CodePreviewProps) => {
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
            <div />
          </div>
        )}
        <pre className={mono.className}>{nodes[selector]}</pre>
      </div>
    )
  },
)

const Playground = memo((props: any) => {
  const {
    defaultSelector,
    nodes,
    css,
    files,
    tabs,
    isStatic,
    isConsoleHide,
    isTabsHide,
    customPreviewName,
  } = useMemo(() => {
    const children = Array.isArray(props.children)
      ? props.children
      : [props.children]
    const defaultSelector = handlePlaygroundSelector(props)
    const nodes = Object.fromEntries(
      children.map((node: any) => [handlePlaygroundFileKey(node.props), node]),
    )
    const css = handlePlaygroundStyles(props) ?? ''
    const files = handlePlaygroundFileMapKey(props) as StringValueObj
    const tabs = Object.keys(files)
    const isStatic = defaultSelector.endsWith('.html')
    const isConsoleHide = handlePlaygroundHideConsoleKey(props)
    const isTabsHide = handlePlaygroundHideTabsKey(props)
    const customPreviewName = handlePlaygroundCustomPreivew(props)
    return {
      defaultSelector,
      nodes,
      css,
      files,
      tabs,
      isStatic,
      isConsoleHide,
      isTabsHide,
      customPreviewName,
    }
  }, [props])

  const { logFn, logs } = useConsole()

  const node = useMemo(() => {
    const customPreviewNode = componentMap[customPreviewName]
    const playgroundProps = {
      files,
      defaultSelector,
      logFn,
    }
    if (!isStatic) {
      return customPreviewNode
        ? createElement(customPreviewNode, props)
        : renerPlayground(playgroundProps)
    }
    return renderStaticPlayground(playgroundProps)
  }, [])

  const [singal, forceUpdate] = useForceUpdate()
  const [isConsoleVisible, setIsConsoleVisible] = useState(!!isConsoleHide)

  return (
    <CodeWrap barText="Code Playground" forceUpdate={forceUpdate}>
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
            <div />
          </div>
        )}
        <ReactShadowRoot
          key={singal}
          shadow={!!css}
          className={clsx(styles.preview, {
            [styles.hide]: isConsoleVisible,
          })}
        >
          {!!css && <style>{css}</style>}
          {node}
        </ReactShadowRoot>
        {isConsoleVisible && <Console logs={logs} />}
      </div>
    </CodeWrap>
  )
})

export default Playground
