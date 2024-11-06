import { LogInfo } from '@/hooks/useConsole'
import { getType, isFunction, isSymbol, transfromNoneLogValue } from '@/utils'

addEventListener('message', (event: MessageEvent<string>) => {
  const result: LogInfo[] = []
  const logFn = (value: any) => {
    const now = Date.now()
    const valueType = getType(value)
    if (isFunction(value) || isSymbol(value)) {
      value = value.toString()
    } else if (value == null) {
      value = transfromNoneLogValue(value)
    }
    const info = { date: now, value, valueType }
    result.push(info)
  }
  const fn = new Function('console', event.data)
  fn({ log: logFn })

  postMessage(result)
})
