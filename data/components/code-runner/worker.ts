import type { LogInfo } from '@/hooks/useConsole'
import { getType } from '@/utils/types'
import { transfromLogValue } from '../utils'

addEventListener('message', (event: MessageEvent<string>) => {
  const result: LogInfo[] = []
  const logFn = (value: any) => {
    const now = Date.now()
    const valueType = getType(value)
    const info = { date: now, value: transfromLogValue(value), valueType }
    result.push(info)
  }
  const fn = new Function('console', event.data)
  fn({ log: logFn })

  postMessage(result)
})
