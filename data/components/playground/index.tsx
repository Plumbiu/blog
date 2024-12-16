'use client'

// It could be running at server, but doesn't support onClick or other props
import {
  createElement,
  type ReactNode,
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createRoot, type Root } from 'react-dom/client'
import {
  handlePlaygroundCustomPreivew,
  handlePlaygroundHidePreviewTabsKey,
  handlePlaygroundStyles,
  handlePlaygroundHideCodeTabsKey,
} from '@/plugins/remark/playground-utils'
import ReactShadowRoot from '@/components/Shadow'
import useConsole from '@/hooks/useConsole'
import useObserver from '@/hooks/useObservser'
import { cn } from '@/utils/client'
import styles from './index.module.css'
import tabStyles from '../_styles/tab.module.css'
import { renderStaticPlayground, renerPlayground } from './compile'
import CodeWrap from '../_common/CodeWrap'
import Console from '../_common/Console'
import { componentMap } from '..'
import Loading from '../_common/Loading'
import {
  handleComponentFileKey,
  handleComponentSelectorKey,
  handleFileMap,
} from '@/plugins/constant'
import CodePreview from '../_common/CodePreview'

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
    customPreviewNode,
  } = useMemo(() => {
    const children = Array.isArray(props.children)
      ? props.children
      : [props.children]
    const defaultSelector = handleComponentSelectorKey(props)
    const codeNodeMap = Object.fromEntries(
      children.map((node: any) => [handleComponentFileKey(node.props), node]),
    )
    const css = handlePlaygroundStyles(props) ?? ''
    const files = handleFileMap(props)
    const codeTabs = Object.keys(files).map((name) => ({ name }))
    const isStatic = defaultSelector.endsWith('.html')
    const isPreviewTabsHidden = handlePlaygroundHidePreviewTabsKey(props)
    const isCodeTabsHidden = handlePlaygroundHideCodeTabsKey(props)
    const customPreviewName = handlePlaygroundCustomPreivew(props)
    const customPreviewNode = componentMap[customPreviewName]
    return {
      defaultSelector,
      codeNodeMap,
      css,
      files,
      codeTabs,
      isStatic,
      isPreviewTabsHidden,
      isCodeTabsHidden,
      customPreviewNode,
    }
  }, [props])

  const { logFn, logs, setLogs } = useConsole()
  const nodeRef = useRef<HTMLDivElement>(null)
  const [isConsoleVisible, setIsConsoleVisible] = useState(false)
  const root = useRef<Root>()
  const renderNode = useCallback((refresh = false) => {
    !isStatic && setLogs(logs)
    if (refresh) {
      root.current?.unmount()
    }
    if (!root.current || refresh) {
      root.current = createRoot(nodeRef.current!)
    }
    const playgroundProps = {
      files,
      defaultSelector,
      logFn,
    }
    let node: ReactNode = null

    if (isStatic) {
      node = renderStaticPlayground(playgroundProps)
    } else {
      node = customPreviewNode
        ? createElement(customPreviewNode, props)
        : renerPlayground(playgroundProps)
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
    <CodeWrap barText="Code Playground" forceUpdate={() => renderNode(true)}>
      <CodePreview
        tabs={codeTabs}
        nodeMap={codeNodeMap}
        defaultSelector={defaultSelector}
        hide={!!isCodeTabsHidden}
      />
      <div>
        {!(isStatic || isPreviewTabsHidden) && (
          <div className={tabStyles.tab}>
            <div
              className={cn({
                [tabStyles.tab_active]: !isConsoleVisible,
              })}
              onClick={() => setIsConsoleVisible(false)}
            >
              Preview
            </div>
            <div
              className={cn({
                [tabStyles.tab_active]: isConsoleVisible,
              })}
              onClick={() => setIsConsoleVisible(true)}
            >
              Console
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
