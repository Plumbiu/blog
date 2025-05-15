import { visit } from 'unist-util-visit'
import {
  handleCodeRunnerCodeKey,
  isJavaScript,
  isTypeScript,
  CodeRunnerName,
} from './runner-utils'
import {
  handleComponentCode,
  handleComponentMeta,
  handleLang,
  type RemarkPlugin,
} from '../constant'
import { makeProperties } from '../utils'
import { sucraseParse } from '@/lib/node/jsx-parse'
import { markComponent } from './utils'

const remarkRunnerPlugin: RemarkPlugin = () => {
  return (tree) => {
    visit(tree, 'code', (node) => {
      makeProperties(node)
      const props = node.data!.hProperties!
      let code = node.value.trim()
      const meta = node.meta
      if (!meta?.includes(CodeRunnerName)) {
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
        code = sucraseParse(code, {
          transforms: ['flow', 'imports'],
        })
      }
      markComponent(node, CodeRunnerName)
      handleComponentMeta(props, meta)
      handleCodeRunnerCodeKey(props, code)
    })
  }
}

export default remarkRunnerPlugin
