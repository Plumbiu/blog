/* eslint-disable @stylistic/no-confusing-arrow */
import { useEffect, useRef, useState } from 'react'
import { LogInfo } from '@/app/_hooks/useConsole'
import { LoadingIcon } from '@/app/_components/Icons'
import PreComponent from '@/app/posts/_components/Pre'
import { handleComponentCode } from '@/app/posts/_plugins/constant'
import { getRunCode } from '@/app/posts/_plugins/remark/runner-utils'
import IntersectionComponent from '@/app/_components/IntersectionComponent'
import styles from './index.module.css'
import CodeWrap from '../_common/CodeWrap'
import Console from '../_common/Console'

function CodeRunner(props: any) {
  const runCode = getRunCode(props)
  const code = handleComponentCode(props)
  const [logs, setLogs] = useState<LogInfo[]>([])
  const workerRef = useRef<Worker>()

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
    <CodeWrap
      barText="Code Runner"
      forceUpdate={() => {
        setLogs([])
        workerRef.current?.postMessage(runCode)
      }}
    >
      <PreComponent code={code}>{props.children}</PreComponent>
      <IntersectionComponent>
        {() =>
          logs.length ? (
            <Console showType logs={logs} />
          ) : (
            <div className={styles.run}>
              <LoadingIcon />
              <div>Running...</div>
            </div>
          )
        }
      </IntersectionComponent>
    </CodeWrap>
  )
}

export default CodeRunner
