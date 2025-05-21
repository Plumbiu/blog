'use client'

import { useEffect, useRef, useState } from 'react'
import type { LogInfo } from '@/hooks/useConsole'
import PreComponent from '@/components/ui/Pre'
import { handleCodeRunnerCodeKey } from '~/markdown/plugins/remark/logger-utils'
import CodeWrapper from '../_common/CodeWrapper'
import Console from '../_common/Console'
import Loading from '../_common/Loading'
import wrapperStyles from '../_common/CodeWrapper.module.css'
import useDivider from '@/hooks/useDivider'

function CodeRunner(props: any) {
  const runCode = handleCodeRunnerCodeKey(props)
  const [logs, setLogs] = useState<LogInfo[]>([])
  const workerRef = useRef<Worker>(null)
  const ref = useRef<HTMLDivElement>(null)
  const { node, init } = useDivider()

  useEffect(() => {
    init(ref.current)

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
      <div className={wrapperStyles.container}>
        <PreComponent ref={ref}>{props.children}</PreComponent>
        {node}
        {logs.length > 0 ? <Console showType logs={logs} /> : <Loading />}
      </div>
    </CodeWrapper>
  )
}

export default CodeRunner
