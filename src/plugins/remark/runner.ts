import { transform, Options } from 'sucrase'
import { visit } from 'unist-util-visit'
import { minifyCodeSync } from '@/utils/node/optimize'
import { isJavaScript, isTypeScript, RunCodeKey } from './runner-utils'
import { ComponentCodeKey, ComponentKey, RemarkPlugin } from '../constant'
import { makeProperties } from '../utils'

export const RunnerName = 'Run'
const transfromOptions: Options = {
  transforms: ['flow'],
}
export function isRuner(props: any) {
  return props[ComponentKey] === RunnerName
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
      props[ComponentCodeKey] = code
      const lang = node.lang?.toLowerCase()
      if (!lang) {
        return
      }
      if (!isJavaScript(lang) && !isTypeScript(lang)) {
        return
      }
      if (isTypeScript(lang)) {
        code = transform(code, transfromOptions).code
      }

      // @ts-ignore
      node.type = 'root'
      node.data!.hName = 'div'
      props[ComponentKey] = RunnerName
      props[RunCodeKey] = minifyCodeSync(code)
    })
  }
}

export default remarkRunner
