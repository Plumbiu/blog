import { LogInfo } from '@/hooks/useConsole'
import { isFunction, isSymbol, transfromNoneLogValue } from '@/utils'

addEventListener('message', (event: MessageEvent<string>) => {
  const result: LogInfo[] = []
  const logFn = (value: any) => {
    const now = Date.now()
    if (isFunction(value) || isSymbol(value)) {
      value = value.toString()
    } else if (value == null) {
      value = transfromNoneLogValue(value)
    }
    const info = { date: now, value }
    result.push(info)
  }
  const fn = new Function('console', event.data)
  fn({ log: logFn })

  postMessage(result)
})
