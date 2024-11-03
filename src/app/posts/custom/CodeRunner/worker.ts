import { LogInfo } from '@/hooks/useConsole'
import { isFunction, isNumber, isString } from '@/utils'

addEventListener('message', (event: MessageEvent<string>) => {
  const result: LogInfo[] = []
  const logFn = (value: any) => {
    const now = Date.now()
    if (!isString(value) || !isNumber(value)) {
      if (isFunction(value)) {
        value = value.toString()
      } else {
        value = JSON.stringify(value)
      }
    }
    const info = { date: now, value }
    result.push(info)
  }
  const fn = new Function('console', event.data)
  fn({ log: logFn })

  postMessage(result)
})
