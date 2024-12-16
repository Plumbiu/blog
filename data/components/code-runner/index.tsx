import { useEffect, useRef, useState } from 'react'
import type { LogInfo } from '@/hooks/useConsole'
import PreComponent from '@/app/posts/components/Pre'
import { handleRunCode } from '@/plugins/remark/runner-utils'
import useObserver from '@/hooks/useObservser'
import CodeWrapper from '../_common/CodeWrapper'
import Console from '../_common/Console'
import Loading from '../_common/Loading'

function CodeRunner(props: any) {
  const runCode = handleRunCode(props)
  const [logs, setLogs] = useState<LogInfo[]>([])
  const workerRef = useRef<Worker>()
  const observerRef = useRef<HTMLDivElement>(null)
  const isIntersecting = useObserver(observerRef)

  useEffect(() => {
    if (!isIntersecting) {
      return
    }
    workerRef.current = new Worker(new URL('./worker.ts', import.meta.url))
    workerRef.current.postMessage(runCode)
    workerRef.current.onmessage = (event: MessageEvent<LogInfo[]>) => {
      setLogs(event.data)
    }
    return () => {
      workerRef.current?.terminate()
    }
  }, [isIntersecting])
  return (
    <div ref={observerRef}>
      <CodeWrapper
        barText="Code Runner"
        forceUpdate={() => {
          setLogs([])
          workerRef.current?.postMessage(runCode)
        }}
      >
        <PreComponent className="codeblock_split">
          {props.children}
        </PreComponent>
        {logs.length > 0 ? <Console showType logs={logs} /> : <Loading />}
      </CodeWrapper>
    </div>
  )
}

export default CodeRunner
