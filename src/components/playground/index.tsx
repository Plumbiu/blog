/* eslint-disable import-x/no-named-as-default */
'use client'

// It could be running at server, but doesn't support onClick or other props
import {
  createElement,
  memo,
  ReactNode,
  useMemo,
  useReducer,
  useState,
} from 'react'
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
import styles from './index.module.css'
import { renderStaticPlayground, renerPlayground } from './compile'
import CodeWrap from '../_common/CodeWrap'
import Console from '../_common/Console'
import { componentMap } from '..'

interface TabItem {
  name: string
  onClick?: () => void
  hidden?: boolean
}

interface CodePreviewProps {
  defaultSelector: string
  nodeMap: Record<string, ReactNode>
  tabs: TabItem[]
  hide: boolean
  isCode: boolean
}

interface TabProps extends TabItem {
  isActive: boolean
}
const Tab = memo((props: TabProps) => {
  const { name, onClick, hidden = false, isActive } = props
  if (hidden) {
    return name
  }
  return (
    <div
      key={name}
      onClick={onClick}
      className={clsx({
        [styles['tab_active']]: isActive,
      })}
    >
      {name}
    </div>
  )
})

const PreviewItem = memo(
  ({ defaultSelector, nodeMap, tabs, hide, isCode }: CodePreviewProps) => {
    const [selector, setSelector] = useState(defaultSelector)
    const node = nodeMap[selector]
    return (
      <div>
        {!hide && tabs.length > 1 && (
          <div className={styles.tab}>
            {tabs.map((tabProps) => (
              <Tab
                key={tabProps.name}
                {...tabProps}
                isActive={tabProps.name === selector}
                onClick={() => {
                  tabProps.onClick?.()
                  setSelector(tabProps.name)
                }}
              />
            ))}
            <div />
          </div>
        )}
        {isCode ? <pre className={mono.className}>{node}</pre> : node}
      </div>
    )
  },
)

const PreviewTabName = 'Preview'
const ConsoleTabName = 'Console'

const Playground = memo((props: any) => {
  const {
    defaultSelector,
    codeNodeMap,
    css,
    files,
    codeTabs,
    isStatic,
    isConsoleHidden,
    isTabsHide,
    customPreviewName,
  } = useMemo(() => {
    const children = Array.isArray(props.children)
      ? props.children
      : [props.children]
    const defaultSelector = handlePlaygroundSelector(props)
    const codeNodeMap = Object.fromEntries(
      children.map((node: any) => [handlePlaygroundFileKey(node.props), node]),
    )
    const css = handlePlaygroundStyles(props) ?? ''
    const files = handlePlaygroundFileMapKey(props)
    const codeTabs = Object.keys(files).map((name) => ({ name }))
    const isStatic = defaultSelector.endsWith('.html')
    const isConsoleHidden = handlePlaygroundHideConsoleKey(props)
    const isTabsHide = handlePlaygroundHideTabsKey(props)
    const customPreviewName = handlePlaygroundCustomPreivew(props)
    return {
      defaultSelector,
      codeNodeMap,
      css,
      files,
      codeTabs,
      isStatic,
      isConsoleHidden,
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

  const [singal, forceUpdate] = useReducer(() => Math.random(), 1)
  const [isConsoleVisible, setIsConsoleVisible] = useState(!!isConsoleHidden)

  return (
    <CodeWrap barText="Code Playground" forceUpdate={forceUpdate}>
      <PreviewItem
        tabs={codeTabs}
        nodeMap={codeNodeMap}
        defaultSelector={defaultSelector}
        hide={!!isTabsHide}
        isCode={true}
      />
      <PreviewItem
        tabs={[
          {
            name: PreviewTabName,
            onClick() {
              setIsConsoleVisible(false)
            },
          },
          {
            name: ConsoleTabName,
            hidden: isConsoleHidden,
            onClick() {
              setIsConsoleVisible(true)
            },
          },
        ]}
        nodeMap={{
          [PreviewTabName]: (
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
          ),
          [ConsoleTabName]: isConsoleVisible ? <Console logs={logs} /> : null,
        }}
        defaultSelector={PreviewTabName}
        hide={!!(isStatic || isTabsHide)}
        isCode={false}
      />
    </CodeWrap>
  )
})

export default Playground
