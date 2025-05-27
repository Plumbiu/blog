import { visit } from 'unist-util-visit'
import { HTMLTextComponentKey, type RemarkPlugin } from '../constant'
import { makeProperties } from '../utils'
import { handleHTMLParserCodeKey, HTMLParserName } from './html-parser-utils'
import { markComponent } from './utils'
import { parseTsx } from '~/markdown/utils/tsx-parser'
import { isString } from '@/lib/types'

const remarkHtmlParser: RemarkPlugin = () => {
  return (tree) => {
    visit(tree, 'html', (node, _index, parent) => {
      makeProperties(node)
      const value = node.value
      const componentBody = `export default function __R(props) {
        return ${value}
      }`
      const props = node.data!.hProperties!
      if (isString(props[HTMLTextComponentKey]) && parent) {
        markComponent(node, props[HTMLTextComponentKey])
      } else {
        const code = parseTsx(componentBody)
        markComponent(node, HTMLParserName)
        handleHTMLParserCodeKey(props, code)
      }
    })
  }
}

export default remarkHtmlParser
