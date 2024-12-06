/* eslint-disable @stylistic/max-len */
'use client'

// It could be running at server, but doesn't support onClick or other props
import {
  createElement,
  memo,
  ReactNode,
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { mono } from '@/app/fonts'
import { handlePlaygroundFileKey } from '@/app/posts/plugins/rehype/playground-pre'
import {
  handlePlaygroundFileMapKey,
  handlePlaygroundSelector,
  handlePlaygroundCustomPreivew,
  handlePlaygroundHidePreviewTabsKey,
  handlePlaygroundStyles,
  handlePlaygroundHideCodeTabsKey,
} from '@/app/posts/plugins/remark/playground-utils'
import ReactShadowRoot from '@/components/Shadow'
import useConsole from '@/hooks/useConsole'
import useObserver from '@/hooks/useObservser'
import { cn } from '@/utils/client'
import styles from './index.module.css'
import { renderStaticPlayground, renerPlayground } from './compile'
import CodeWrap from '../_common/CodeWrap'
import Console from '../_common/Console'
import { componentMap } from '..'
import Loading from '../_common/Loading'

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
}

interface TabProps extends TabItem {
  isActive: boolean
}
const Tab = memo((props: TabProps) => {
  const { name, onClick, hidden = false, isActive } = props
  if (hidden) {
    return null
  }
  return (
    <div
      key={name}
      onClick={onClick}
      className={cn({
        [styles['tab_active']]: isActive,
      })}
    >
      {name}
    </div>
  )
})

const CodePreview = memo(
  ({ defaultSelector, nodeMap, tabs, hide }: CodePreviewProps) => {
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
        <pre className={mono.className}>{node}</pre>
      </div>
    )
  },
)

const PreviewTabName = 'Preview'
const ConsoleTabName = 'Console'

const Playground = (props: any) => {
  const {
    defaultSelector,
    codeNodeMap,
    css,
    files,
    codeTabs,
    isStatic,
    isPreviewTabsHidden,
    isCodeTabsHidden,
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
    const isPreviewTabsHidden = handlePlaygroundHidePreviewTabsKey(props)
    const isCodeTabsHidden = handlePlaygroundHideCodeTabsKey(props)
    const customPreviewName = handlePlaygroundCustomPreivew(props)
    return {
      defaultSelector,
      codeNodeMap,
      css,
      files,
      codeTabs,
      isStatic,
      isPreviewTabsHidden,
      isCodeTabsHidden,
      customPreviewName,
    }
  }, [props])

  const { logFn, logs, setLogs } = useConsole()
  const nodeRef = useRef<HTMLDivElement>(null)
  const [isConsoleVisible, setIsConsoleVisible] = useState(false)
  const root = useRef<Root>()
  const renderNode = useCallback(() => {
    setLogs(logs)
    root.current?.unmount()
    root.current = createRoot(nodeRef.current!)
    const customPreviewNode = componentMap[customPreviewName]
    const playgroundProps = {
      files,
      defaultSelector,
      logFn,
    }
    if (!nodeRef.current) {
      return
    }
    let node = null
    if (!isStatic) {
      node = customPreviewNode
        ? createElement(customPreviewNode, props)
        : renerPlayground(playgroundProps)
    } else {
      node = renderStaticPlayground(playgroundProps)
    }
    root.current.render(
      <ReactShadowRoot shadow={!!css}>
        {!!css && <style>{css}</style>}
        <Suspense fallback={<Loading />}>{node}</Suspense>
      </ReactShadowRoot>,
    )

    return () => {
      setTimeout(() => {
        root.current?.unmount()
      })
    }
  }, [])

  useObserver(nodeRef, renderNode)

  return (
    <CodeWrap barText="Code Playground" forceUpdate={renderNode}>
      <CodePreview
        tabs={codeTabs}
        nodeMap={codeNodeMap}
        defaultSelector={defaultSelector}
        hide={!!isCodeTabsHidden}
      />
      <div>
        {!(isStatic || isPreviewTabsHidden) && (
          <div className={styles.tab}>
            <div
              className={cn({
                [styles['tab_active']]: !isConsoleVisible,
              })}
              onClick={() => setIsConsoleVisible(false)}
            >
              {PreviewTabName}
            </div>
            <div
              className={cn({
                [styles['tab_active']]: isConsoleVisible,
              })}
              onClick={() => setIsConsoleVisible(true)}
            >
              {ConsoleTabName}
            </div>
            <div />
          </div>
        )}
        <div
          className={cn(styles.preview, {
            [styles.hide]: isConsoleVisible,
          })}
          ref={nodeRef}
        />
        {isConsoleVisible && <Console logs={logs} />}
      </div>
    </CodeWrap>
  )
}

export default Playground
