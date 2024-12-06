import { LogInfo } from '@/hooks/useConsole'
import { getType } from '@/utils'

addEventListener('message', (event: MessageEvent<string>) => {
  const result: LogInfo[] = []
  const logFn = (value: any) => {
    const now = Date.now()
    const valueType = getType(value)
    if (typeof value !== 'object' || value == null) {
      value = String(value)
    } else {
      value = JSON.stringify(value)
    }
    const info = { date: now, value: String(value), valueType }
    result.push(info)
  }
  const fn = new Function('console', event.data)
  fn({ log: logFn })

  postMessage(result)
})
