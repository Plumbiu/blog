import type { LogInfo } from '@/hooks/useConsole'
import { toLogValue } from '@/lib/shared'
import { getType } from '@/lib/types'
import getCodeRunnerModuleMap from '~/markdown/config/logger-module-map'

addEventListener('message', async (event: MessageEvent<string>) => {
  const result: Omit<LogInfo, 'date'>[] = []
  const logFn = (value: any) => {
    const valueType = getType(value)
    const info = { value: toLogValue(value), valueType }
    result.push(info)
  }
  const scopes: string[] = ['console']
  const scopeParams: any[] = [{ log: logFn }]
  const code = event.data
  if (code.includes('require(')) {
    scopes.push('require')
    const imports = await getCodeRunnerModuleMap(code)
    scopeParams.push((key: string) => imports[key])
  }
  const fn = new Function(...scopes, event.data)
  fn(...scopeParams)

  postMessage(result)
})
