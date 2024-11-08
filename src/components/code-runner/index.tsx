'use client'

import { useEffect, useRef, useState } from 'react'
import { LogInfo } from '@/hooks/useConsole'
import { getRunCode } from '@/plugins/remark/runner'
import { LoadingIcon } from '@/app/components/Icons'
import PreComponent from '@/app/posts/components/Pre'
import styles from './index.module.css'
import CodeWrap from '../_common/CodeWrap'
import Console from '../_common/Console'

function CodeRunner(props: any) {
  const code = getRunCode(props)
  const [logs, setLogs] = useState<LogInfo[]>([])
  const workerRef = useRef<Worker>()

  useEffect(() => {
    workerRef.current = new Worker(new URL('./worker.ts', import.meta.url))
    workerRef.current?.postMessage(code)
    workerRef.current.onmessage = (event: MessageEvent<LogInfo[]>) => {
      setLogs(event.data)
    }
    return () => {
      workerRef.current?.terminate()
    }
  }, [])
  return (
    <CodeWrap barText="Code Runner">
      <PreComponent>{props.children}</PreComponent>
      {logs.length ? (
        <Console showType logs={logs} />
      ) : (
        <div className={styles.run}>
          {<LoadingIcon />}
          <div>Running...</div>
        </div>
      )}
    </CodeWrap>
  )
}

export default CodeRunner
