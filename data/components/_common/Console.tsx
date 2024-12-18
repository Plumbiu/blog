import { memo } from 'react'
import { cn } from '@/utils/client'
import type { LogInfo } from '@/hooks/useConsole'
import { isString } from '@/utils/types'
import styles from './Console.module.css'
import { transfromLogValue } from '../utils'

export function padStartZero(str: number | string, num = 2) {
  if (!isString(str)) {
    str = String(str)
  }
  return str.padStart(num, '0')
}

function formatTime(date: number | null | undefined) {
  if (date == null) {
    return ''
  }
  const d = new Date(date)
  const hh = padStartZero(d.getHours())
  const mm = padStartZero(d.getMinutes())
  const ss = padStartZero(d.getSeconds())
  return `${hh}:${mm}:${ss}`
}

interface ConsoleProps {
  logs: LogInfo[]
  showType?: boolean
  [key: string]: any
}

const Console = memo(
  ({ logs, showType = false, className, ...rest }: ConsoleProps) => {
    return (
      <div className={cn(styles.console, className)} {...rest}>
        {logs.map(({ value, date, valueType }, i) => (
          <div key={i}>
            <div
              className={cn(styles.right, {
                [styles.num]: valueType === 'Number',
                [styles.string]: valueType === 'String',
                [styles.none]:
                  valueType === 'Null' ||
                  valueType === 'Undefined' ||
                  valueType === 'Function',
                [styles.bool]: valueType === 'Boolean',
                [styles.symbol]: valueType === 'Symbol',
              })}
            >
              {transfromLogValue(value)}
            </div>
            <div className={styles.left}>
              {showType ? valueType : formatTime(date)}
            </div>
          </div>
        ))}
      </div>
    )
  },
)

export default Console
