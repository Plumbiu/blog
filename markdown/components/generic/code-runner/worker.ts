import type { LogInfo } from '@/hooks/useConsole'
import { getType } from '@/lib/types'
import { transfromLogValue } from '../utils'

addEventListener('message', (event: MessageEvent<string>) => {
  const result: Omit<LogInfo, 'date'>[] = []
  const logFn = (value: any) => {
    const valueType = getType(value)
    const info = { value: transfromLogValue(value), valueType }
    result.push(info)
  }
  const fn = new Function('console', event.data)
  fn({ log: logFn })

  postMessage(result)
})
