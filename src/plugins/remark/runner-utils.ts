import { ComponentKey } from '../constant'
import { buildPlaygroundHandlerFunction } from '../utils'

export const RunCodeKey = `${ComponentKey}run-code`
export const handleRunCode = buildPlaygroundHandlerFunction(RunCodeKey)

export function isTypeScript(lang: string) {
  lang = lang.toLowerCase()
  return lang === 'ts' || lang === 'typescript'
}

export function isJavaScript(lang: string) {
  lang = lang.toLowerCase()
  return lang === 'js' || lang === 'javascript'
}
