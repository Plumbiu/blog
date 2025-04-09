import { transform, type Options } from 'sucrase'
import { visit } from 'unist-util-visit'
import minifyCodeSync  from '~/optimize/minify-code'
import {
  handleRunCode,
  isJavaScript,
  isTypeScript,
  RunnerName,
} from './runner-utils'
import {
  handleComponentCode,
  handleComponentMeta,
  handleComponentName,
  handleLang,
  type RemarkPlugin,
} from '../constant'
import { makeProperties } from '../utils'

const transfromOptions: Options = {
  transforms: ['flow'],
}
const remarkRunner: RemarkPlugin = () => {
  return (tree) => {
    visit(tree, 'code', (node) => {
      makeProperties(node)
      const props = node.data!.hProperties!
      let code = node.value.trim()
      const meta = node.meta
      if (!meta?.includes(RunnerName)) {
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
        code = transform(code, transfromOptions).code
      }

      // @ts-ignore
      node.type = 'root'
      node.data!.hName = 'div'
      handleComponentName(props, RunnerName)
      handleComponentMeta(props, meta)
      handleRunCode(props, minifyCodeSync(code))
    })
  }
}

export default remarkRunner
