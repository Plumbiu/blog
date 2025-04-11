import { generatePluginKey } from '../generate-key'
import { buildHandlerFunction } from '../utils'

export const HTMLParserName = 'html-parser'
export const HTMLParserCodeKey = generatePluginKey('html-parser-code')
export const handleHTMLParserCodeKey =
  buildHandlerFunction<string>(HTMLParserCodeKey)
