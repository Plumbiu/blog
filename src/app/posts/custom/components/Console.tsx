import { clsx } from 'clsx'
import { LogInfo } from '@/hooks/useConsole'
import { isNumber, isString, padStartZero, transfromLogValue } from '@/utils'
import styles from './Console.module.css'

function formatTime(date: number) {
  const d = new Date(date)
  const hh = padStartZero(d.getHours())
  const mm = padStartZero(d.getMinutes())
  const ss = padStartZero(d.getSeconds())
  return `${hh}:${mm}:${ss}`
}

interface ConsoleProps {
  logs: LogInfo[]
  showType?: boolean
}

const Console = ({ logs, showType = false }: ConsoleProps) => {
  return (
    <div className={styles.console}>
      {logs.map(({ value, date, valueType }, i) => {
        const isNone = value === 'null' || value === 'undefined'
        const isValueString = isString(value) && !isNone

        return (
          <div key={i}>
            <div
              className={clsx(styles.right, {
                [styles.num]: isNumber(value),
                [styles.string]: isValueString,
                [styles.none]: isNone,
              })}
            >
              {transfromLogValue(value)}
            </div>
            <div className={styles.left}>
              {showType ? valueType : formatTime(date)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Console
