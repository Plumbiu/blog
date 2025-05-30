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
} from '~/markdown/plugins/remark/code/playground-utils'
import ReactShadowRoot from '@/components/function/Shadow'
import useConsole from '@/hooks/useConsole'
import useObserver from '@/hooks/useObservser'
import { cn } from '@/lib/client'
import styles from './index.module.css'
import tabStyles from '../_styles/tab.module.css'
import { renderStaticPlayground, renderPlayground } from './compile'
import CodeWrapper from '../_common/CodeWrapper'
import Console from '../_common/Console'
import Loading from '../_common/Loading'
import {
  handleComponentCodeTitle,
  handleComponentDefaultSelectorKey,
  handleFileMap,
} from '~/markdown/plugins/constant'
import CodePreview from '../_common/CodePreview'
import { customComponentMap } from '~/markdown/components/custom-components'

const Playground = (props: any) => {
  const {
    defaultSelector,
    css,
    files,
    isStatic,
    isPreviewTabsHidden,
    customPreviewNode,
    title,
  } = useMemo(() => {
    const defaultSelector = handleComponentDefaultSelectorKey(props)
    const css = handlePlaygroundStyles(props)
    const files = handleFileMap(props)
    const isStatic = defaultSelector.endsWith('.html')
    const isPreviewTabsHidden = handlePlaygroundHidePreviewTabsKey(props)
    const customPreviewName = handlePlaygroundCustomPreivew(props)
    const customPreviewNode = customComponentMap[customPreviewName]
    const title = handleComponentCodeTitle(props)
    return {
      defaultSelector,
      css,
      files,
      isStatic,
      isPreviewTabsHidden,
      customPreviewNode,
      title,
    }
  }, [props])

  const { logFn, logs, setLogs } = useConsole()
  const nodeRef = useRef<HTMLDivElement>(null)
  const [isConsoleVisible, setIsConsoleVisible] = useState(false)
  const root = useRef<Root>(null)
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
        : renderPlayground(playgroundProps)()
    }
    node = <Suspense fallback={<Loading />}>{node}</Suspense>
    if (css) {
      node = (
        <ReactShadowRoot>
          <style>{css}</style>
          {node}
        </ReactShadowRoot>
      )
    }
    root.current.render(node)
    return () => {
      setTimeout(() => {
        root.current?.unmount()
      })
    }
  }, [])

  useObserver(nodeRef, renderNode)

  return (
    <CodeWrapper
      barText={title || 'Code Playground'}
      forceUpdate={() => renderNode(true)}
    >
      <CodePreview {...props} />
      <div>
        {!(isStatic || isPreviewTabsHidden) && (
          <div className={tabStyles.tab}>
            <div
              data-testid="preview-tab"
              className={cn({
                [tabStyles.tab_active]: !isConsoleVisible,
              })}
              onClick={() => setIsConsoleVisible(false)}
            >
              Preview
            </div>
            <div
              data-testid="console-tab"
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
          className={cn(styles.node_preview, {
            [styles.hide]: isConsoleVisible,
          })}
          data-testid="preview"
          ref={nodeRef}
        />
        <Console
          className={cn({
            [styles.hide]: !isConsoleVisible,
          })}
          logs={logs}
        />
      </div>
    </CodeWrapper>
  )
}

export default Playground
