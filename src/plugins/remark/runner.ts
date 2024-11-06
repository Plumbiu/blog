import { transform, Options } from 'sucrase'
import { visit } from 'unist-util-visit'
import { isJavaScript, isTypeScript } from '@/utils'
import { ComponentCodeKey, ComponentKey, RemarkReturn } from '../constant'
import { buildPlaygroundHandlerFunction, makeProperties } from '../utils'

export const RunnerName = 'Run'
const transfromOptions: Options = {
  transforms: ['flow'],
}
const RunCodeKey = `${ComponentKey}run-code`
export const getRunCode = buildPlaygroundHandlerFunction(RunCodeKey)
export function isRuner(props: any) {
  return props[ComponentKey] === RunnerName
}
function remarkRunner(): RemarkReturn {
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
      props[RunCodeKey] = code
    })
  }
}

export default remarkRunner
