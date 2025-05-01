import { visit } from 'unist-util-visit'
import type { RemarkPlugin } from '../constant'
import { makeProperties } from '../utils'
import { handleHTMLParserCodeKey, HTMLParserName } from './html-parser-utils'
import { sucraseParse } from '@/lib/node/jsx-parse'
import { markComponent } from './utils'

const remarkHtmlParser: RemarkPlugin = () => {
  return (tree) => {
    visit(tree, 'html', (node) => {
      makeProperties(node)
      const value = node.value
      const componentBody = `export default function __R(props) {
        return ${value}
      }`
      const props = node.data!.hProperties!
      const code = sucraseParse(componentBody)
      handleHTMLParserCodeKey(props, code)
      markComponent(node, HTMLParserName)
    })
  }
}

export default remarkHtmlParser
