import { useState } from 'react'
import { LogInfo } from '@/hooks/useConsole'
import { getCodeFromProps } from '@/plugins/remark/playground'
import { isString, isNumber, isFunction, runTask } from '@/utils'
import { LoadingIcon, StartIcon } from '@/app/components/Icons'
import styles from './index.module.css'
import CodeWrap from '../components/CodeWrap'
import Console from '../components/Console'

function CodeRunner(props: any) {
  const code = getCodeFromProps(props)
  const [logs, setLogs] = useState<LogInfo[]>([])
  const [isRuning, setIsRuning] = useState(false)
  return (
    <CodeWrap barText="Code Runner">
      <div>{props.defaultnode}</div>
      {logs.length ? (
        <Console logs={logs} />
      ) : (
        <div
          className={styles.run}
          onClick={() => {
            const result: LogInfo[] = []
            const logFn = (value: any) => {
              const now = Date.now()
              if (!isString(value) || !isNumber(value)) {
                if (isFunction(value)) {
                  value = value.toString()
                } else {
                  value = JSON.stringify(value)
                }
              }
              const info = { date: now, value }
              result.push(info)
            }
            setIsRuning(true)
            runTask(() => {
              const fn = new Function('console', code)
              fn({ log: logFn })
              setLogs(result)
            })
          }}
        >
          {!isRuning && <StartIcon />}
          <div>{isRuning ? 'Running...' : 'Run'}</div>
        </div>
      )}
    </CodeWrap>
  )
}

export default CodeRunner
