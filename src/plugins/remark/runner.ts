import { transform, Options } from 'sucrase'
import { visit } from 'unist-util-visit'
import { ComponentCodeKey, ComponentMetaKey } from './playground'
import { ComponentKey, RemarkReturn } from '../constant'
import { makeProperties } from '../utils'

export const RunnerName = 'Run'
const transfromOptions: Options = {
  transforms: ['flow'],
}
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
      const lang = node.lang?.toLowerCase()
      if (lang !== 'js' && lang !== 'ts') {
        return
      }
      if (lang === 'ts') {
        code = transform(code, transfromOptions).code
      }
      if (!meta?.includes(RunnerName)) {
        return
      }
      // @ts-ignore
      node.type = 'root'
      node.data!.hName = 'div'
      props[ComponentKey] = RunnerName
      props[ComponentCodeKey] = code
      props[ComponentMetaKey] = meta
    })
  }
}

export default remarkRunner
