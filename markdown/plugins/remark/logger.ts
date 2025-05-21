import { visit } from 'unist-util-visit'
import {
  handleCodeRunnerCodeKey,
  isJavaScript,
  isTypeScript,
  LoggerName,
} from './logger-utils'
import {
  handleComponentCode,
  handleComponentMeta,
  handleLang,
  type RemarkPlugin,
} from '../constant'
import { makeProperties } from '../utils'
import { markComponent } from './utils'
import { parseTsx } from '~/markdown/utils/tsx-parser'

const remarkRunnerPlugin: RemarkPlugin = () => {
  return (tree) => {
    visit(tree, 'code', (node) => {
      makeProperties(node)
      const props = node.data!.hProperties!
      let code = node.value.trim()
      const meta = node.meta
      if (!meta?.includes(LoggerName)) {
        return
      }
      handleComponentCode(props, code)
      const lang = node.lang?.toLowerCase()

      if (!lang) {
        return
      }
      handleLang(props, lang)

      if (!(isJavaScript(lang) || isTypeScript(lang))) {
        return
      }
      if (isTypeScript(lang)) {
        code = parseTsx(code, {
          transforms: ['flow', 'imports'],
        })
      }
      markComponent(node, LoggerName)
      handleComponentMeta(props, meta)
      handleCodeRunnerCodeKey(props, code)
    })
  }
}

export default remarkRunnerPlugin
