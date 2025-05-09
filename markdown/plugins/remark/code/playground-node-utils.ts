import { CodeTabSplitString } from '../../constant'
import { getFirstLine } from '../../utils'

export const SupportPlaygroundLang = new Set(['jsx', 'tsx', 'js', 'ts'])
export const SupportStaticPlaygroundLang = new Set(['html', 'css', 'js', 'txt'])

export function isStaticLangugage(lang: string) {
  return SupportStaticPlaygroundLang.has(lang)
}

export function isDyncmicLangugage(lang: string) {
  return SupportPlaygroundLang.has(lang)
}

export function getDefaultSelector(code: string, lang: string) {
  const firstLine = getFirstLine(code)
  if (firstLine.startsWith(CodeTabSplitString)) {
    return firstLine.replace(CodeTabSplitString, '').trim()
  }
  if (isStaticLangugage(lang)) {
    return `index.${lang}`
  }
  if (isDyncmicLangugage(lang)) {
    return `App.${lang}`
  }

  return 'index'
}
