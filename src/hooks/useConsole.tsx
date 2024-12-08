import { useState } from 'react'
import { getType } from '@/utils/types'

export interface LogInfo {
  date: number
  value: any
  valueType: string
}

export default function useConsole() {
  const [logs, setLogs] = useState<LogInfo[]>([])
  const log = (value: any) => {
    const now = Date.now()
    const info = {
      date: now,
      value,
      valueType: getType(value),
    }
    setLogs((prev) => [...prev, info])
  }

  return {
    logs,
    logFn: { log },
    setLogs,
  }
}
