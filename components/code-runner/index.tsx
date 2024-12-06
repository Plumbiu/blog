import { useEffect, useRef, useState } from 'react'
import { LogInfo } from '@/hooks/useConsole'
import PreComponent from '@/app/posts/components/Pre'
import { handleComponentCode } from '@/app/posts/plugins/constant'
import { getRunCode } from '@/app/posts/plugins/remark/runner-utils'
import useObserver from '@/hooks/useObservser'
import CodeWrap from '../_common/CodeWrap'
import Console from '../_common/Console'
import Loading from '../_common/Loading'

function CodeRunner(props: any) {
  const runCode = getRunCode(props)
  const code = handleComponentCode(props)
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
      <CodeWrap
        barText="Code Runner"
        forceUpdate={() => {
          setLogs([])
          workerRef.current?.postMessage(runCode)
        }}
      >
        <PreComponent code={code}>{props.children}</PreComponent>
        {logs.length ? <Console showType logs={logs} /> : <Loading />}
      </CodeWrap>
    </div>
  )
}

export default CodeRunner
