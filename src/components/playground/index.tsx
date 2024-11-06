/* eslint-disable import-x/no-named-as-default */
'use client'

// It could be running at server, but doesn't support onClick or other props
import React, { createElement, memo, ReactNode, useMemo, useState } from 'react'
import clsx from 'clsx'
import { mono } from '@/app/fonts'
import { getFileKeyFromProps } from '@/plugins/rehype/playground-pre'
import {
  getComponentFileMapKey,
  getComponentShowConsoleKey,
  getDefaultSelectorFromProps,
  getPlaygroundCustomPreivew,
  getPlaygroundHideConsoleKey,
  getPlaygroundHidePreviewKey,
  getPlaygroundHideTabsKey,
} from '@/plugins/remark/playground-client'
import ReactShadowRoot from '@/app/components/Shadow'
import useConsole from '@/hooks/useConsole'
import styles from './index.module.css'
import { StaticPlaygroundPreview, PlaygroundPreview } from './compile'
import CodeWrap from '../_common/CodeWrap'
import Console from '../_common/Console'
import { ComponentMap } from '..'

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
  const defaultSelector = getDefaultSelectorFromProps(props)
  const nodes = Object.fromEntries(
    children.map((node: any) => [getFileKeyFromProps(node.props), node]),
  )
  const files = getComponentFileMapKey(props)
  const tabs = Object.keys(files)
  const isStatic = defaultSelector.endsWith('.html')
  const isPreviewHide = getPlaygroundHidePreviewKey(props)
  const isConsoleHide = getPlaygroundHideConsoleKey(props)
  const isTabsHide = getPlaygroundHideTabsKey(props)
  const customPreviewName = getPlaygroundCustomPreivew(props)
  const { logFn, logs } = useConsole()

  let defaultRenderConsole = false
  if (isConsoleHide) {
    defaultRenderConsole = false
  } else {
    if (isPreviewHide || getComponentShowConsoleKey(props)) {
      defaultRenderConsole = true
    }
  }

  const [isConsoleDefaultRender, setIsConsoleDefaultRender] =
    useState(defaultRenderConsole)

  const { node, nodeStyles } = useMemo(() => {
    let node: ReactNode = null
    const styles: string[] = []

    if (customPreviewName && ComponentMap[customPreviewName]) {
      console.log(customPreviewName, ComponentMap[customPreviewName])

      return {
        node: createElement(ComponentMap[customPreviewName]),
        nodeStyles: styles,
      }
    }
    for (const key in files) {
      if (key.endsWith('.css')) {
        styles.push(files[key])
      }
    }
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
            {!isPreviewHide && (
              <div
                onClick={() => setIsConsoleDefaultRender(false)}
                className={clsx({
                  [styles.tab_active]: !isConsoleDefaultRender,
                })}
              >
                Preview
              </div>
            )}
            {!isConsoleHide && (
              <div
                className={clsx({
                  [styles.tab_active]: isConsoleDefaultRender,
                })}
                onClick={() => setIsConsoleDefaultRender(true)}
              >
                Console
              </div>
            )}
          </div>
        )}
        {!isPreviewHide && (
          <ReactShadowRoot
            className={clsx(styles.preview, {
              [styles.hide]: isConsoleDefaultRender,
            })}
          >
            {nodeStyles.map((css, key) => (
              <style key={key}>{css}</style>
            ))}
            {node}
          </ReactShadowRoot>
        )}
        {isConsoleDefaultRender && <Console logs={logs} />}
      </div>
    </CodeWrap>
  )
})

export default Playground
