import { buildHandlerFunction } from '../utils'

export const HTMLParserName = 'html-parser'
export const HTMLParserCodeKey = 'html-parser-code'
export const handleHTMLParserCodeKey =
  buildHandlerFunction<string>(HTMLParserCodeKey)
