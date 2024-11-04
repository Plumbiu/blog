import { useCallback, useState } from 'react'
import { getType } from '@/utils'
import useMounted from './useMounted'

export interface LogInfo {
  date: number
  value: any
  valueType: string
}

export default function useConsole() {
  const [logs, setLogs] = useState<LogInfo[]>([])
  const isMounted = useMounted()

  const log = useCallback(
    (value: any) => {
      const now = Date.now()
      const info = {
        date: now,
        value,
        valueType: getType(value),
      }
      const lastLog = logs[logs.length - 1]
      if (lastLog == null || lastLog.date !== now) {
        if (!isMounted) {
          logs.push(info)
        } else {
          setLogs((prev) => [...prev, info])
        }
      }
    },
    [isMounted],
  )

  return {
    logs,
    logFn: { log },
  }
}
