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
}

const Console = ({ logs }: ConsoleProps) => {
  return (
    <div className={styles.console}>
      {logs.map(({ value, date }, i) => {
        const isNone = value === 'null' || value === 'undefined'
        const isValueString = isString(value) && !isNone

        const quote = isValueString && <span className={styles.quote}>'</span>
        return (
          <div key={i}>
            <div>
              {quote}
              <span
                className={clsx(styles.value, {
                  [styles.num]: isNumber(value),
                  [styles.string]: isValueString,
                  [styles.none]: isNone,
                })}
              >
                {transfromLogValue(value)}
              </span>
              {quote}
            </div>
            <span className={styles.console_date}>{formatTime(date)}</span>
          </div>
        )
      })}
    </div>
  )
}

export default Console
