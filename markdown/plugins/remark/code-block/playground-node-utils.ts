import { type FileMap, FileMapStartStr } from '../../constant'
import { getFirstLine } from '../../utils'

const WhiteSpaceMultiRegx = /\s+/
export const buildFiles = (code: string, defaultSelector?: string) => {
  if (defaultSelector && !code?.startsWith(defaultSelector)) {
    code = `${FileMapStartStr} ${defaultSelector}\n${code}`
  }
  const tokens = code.split(FileMapStartStr)
  const attrs: FileMap = {}
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (token[0] === ' ') {
      const str = getFirstLine(tokens[i])
      const [key, ...metas] = str.trim().split(WhiteSpaceMultiRegx)
      attrs[key] = {
        code: tokens[i].slice(str.length).trim(),
        meta: metas.join(' '),
      }
    }
  }
  return attrs
}

export const SupportPlaygroundLang = new Set(['jsx', 'tsx', 'js', 'ts'])
export const SupportStaticPlaygroundLang = new Set(['html', 'css', 'js', 'txt'])

export function isStaticLangugage(lang: string) {
  return SupportStaticPlaygroundLang.has(lang)
}

export function isDyncmicLangugage(lang: string) {
  return SupportPlaygroundLang.has(lang)
}

export function getFirstFileKey(code: string, lang: string) {
  const firstLine = getFirstLine(code)
  if (firstLine.startsWith(FileMapStartStr)) {
    return firstLine.replace(FileMapStartStr, '').trim()
  }
  if (isStaticLangugage(lang)) {
    return `index.${lang}`
  }
  if (isDyncmicLangugage(lang)) {
    return `App.${lang}`
  }

  return `index.${lang}`
}
