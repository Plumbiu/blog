import { useEffect, useRef, useState } from 'react'
import { LogInfo } from '@/hooks/useConsole'
import { LoadingIcon } from '@/app/components/Icons'
import { getCodeFromProps } from '@/plugins/constant'
import styles from './index.module.css'
import CodeWrap from '../components/CodeWrap'
import Console from '../components/Console'

function CodeRunner(props: any) {
  const code = getCodeFromProps(props)
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
      <div>{props.defaultnode}</div>
      {logs.length ? (
        <Console showType logs={logs} />
      ) : (
        <div className={styles.run}>
          {<LoadingIcon />}
          <div>{'Running...'}</div>
        </div>
      )}
    </CodeWrap>
  )
}

export default CodeRunner
