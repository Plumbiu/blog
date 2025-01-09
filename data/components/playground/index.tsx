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
} from '@/plugins/remark/code-block/playground-utils'
import ReactShadowRoot from '@/components/Shadow'
import useConsole from '@/hooks/useConsole'
import useObserver from '@/hooks/useObservser'
import { cn } from '@/utils/client'
import styles from './index.module.css'
import tabStyles from '../_styles/tab.module.css'
import { renderStaticPlayground, renerPlayground } from './compile'
import CodeWrapper from '../_common/CodeWrapper'
import Console from '../_common/Console'
import { componentMap } from '..'
import Loading from '../_common/Loading'
import { handleComponentSelectorKey, handleFileMap } from '@/plugins/constant'
import CodePreview from '../_common/CodePreview'

const Playground = (props: any) => {
  const {
    defaultSelector,
    css,
    files,
    isStatic,
    isPreviewTabsHidden,
    customPreviewNode,
  } = useMemo(() => {
    const defaultSelector = handleComponentSelectorKey(props)
    const css = handlePlaygroundStyles(props) ?? ''
    const files = handleFileMap(props)
    const isStatic = defaultSelector.endsWith('.html')
    const isPreviewTabsHidden = handlePlaygroundHidePreviewTabsKey(props)
    const customPreviewName = handlePlaygroundCustomPreivew(props)
    const customPreviewNode = componentMap[customPreviewName]
    return {
      defaultSelector,
      css,
      files,
      isStatic,
      isPreviewTabsHidden,
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
    node = <Suspense fallback={<Loading />}>{node}</Suspense>
    if (css) {
      node = (
        <ReactShadowRoot shadow>
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
    <CodeWrapper barText="Code Playground" forceUpdate={() => renderNode(true)}>
      <CodePreview {...props} />
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
