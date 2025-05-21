import { ComponentKey } from '../constant'
import { buildHandlerFunction } from '../utils'

export const CodeRunnerCodeKey = 'run-code'
export const handleCodeRunnerCodeKey = buildHandlerFunction(CodeRunnerCodeKey)

export function isTypeScript(lang: string) {
  lang = lang.toLowerCase()
  return lang === 'ts' || lang === 'typescript'
}

export function isJavaScript(lang: string) {
  lang = lang.toLowerCase()
  return lang === 'js' || lang === 'javascript'
}

export const LoggerName = 'Log'

export function isLogger(props: any) {
  return props[ComponentKey] === LoggerName
}
