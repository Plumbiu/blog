import { memo, useMemo } from 'react'
import { cn } from '@/lib/client'
import type { LogInfo } from '@/hooks/useConsole'
import { isString } from '@/lib/types'
import styles from './Console.module.css'
import { toLogValue } from '@/lib/shared'

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

const ConsoleItem = memo(
  ({ log, showType }: { log: LogInfo; showType: boolean }) => {
    const { value, valueType, date } = log
    return (
      <div>
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
          {toLogValue(value)}
        </div>
        <div className={styles.left}>
          {showType ? valueType : formatTime(date)}
        </div>
      </div>
    )
  },
)

const Console = memo(
  ({ logs, showType = false, className, ...rest }: ConsoleProps) => {
    const node = useMemo(() => {
      return logs.map((log, i) => (
        <ConsoleItem key={i} log={log} showType={showType} />
      ))
    }, [showType, logs])

    return (
      <div className={cn(styles.console, className)} {...rest}>
        {node}
      </div>
    )
  },
)

export default Console
