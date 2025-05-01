import type { LogInfo } from '@/hooks/useConsole'
import { toLogValue } from '@/lib/shared'
import { getType } from '@/lib/types'

addEventListener('message', (event: MessageEvent<string>) => {
  const result: Omit<LogInfo, 'date'>[] = []
  const logFn = (value: any) => {
    const valueType = getType(value)
    const info = { value: toLogValue(value), valueType }
    result.push(info)
  }
  const fn = new Function('console', event.data)
  fn({ log: logFn })

  postMessage(result)
})
