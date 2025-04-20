'use client'

import { useEffect, useRef, useState } from 'react'
import type { LogInfo } from '@/hooks/useConsole'
import PreComponent from '@/components/ui/Pre'
import { handleCodeRunnerCodeKey } from '~/markdown/plugins/remark/runner-utils'
import CodeWrapper from '../_common/CodeWrapper'
import Console from '../_common/Console'
import Loading from '../_common/Loading'

function CodeRunner(props: any) {
  const runCode = handleCodeRunnerCodeKey(props)
  const [logs, setLogs] = useState<LogInfo[]>([])
  const workerRef = useRef<Worker>(null)

  useEffect(() => {
    workerRef.current = new Worker(new URL('./worker.ts', import.meta.url))
    workerRef.current.postMessage(runCode)
    workerRef.current.onmessage = (event: MessageEvent<LogInfo[]>) => {
      setLogs(event.data)
    }
    return () => {
      workerRef.current?.terminate()
    }
  }, [])
  return (
    <CodeWrapper
      barText="Code Runner"
      forceUpdate={() => {
        setLogs([])
        workerRef.current?.postMessage(runCode)
      }}
    >
      <PreComponent className="codeblock_split">{props.children}</PreComponent>
      {logs.length > 0 ? <Console showType logs={logs} /> : <Loading />}
    </CodeWrapper>
  )
}

export default CodeRunner
