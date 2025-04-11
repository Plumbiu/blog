import { visit } from 'unist-util-visit'
import { handleComponentName, type RemarkPlugin } from '../constant'
import { makeProperties } from '../utils'
import { handleHTMLParserCodeKey, HTMLParserName } from './html-parser-utils'
import { sucraseParse } from '@/lib/node/jsx-parse'

const remarkHtmlParser: RemarkPlugin = () => {
  return (tree) => {
    visit(tree, 'html', (node, _, parent) => {
      makeProperties(node)
      const value = node.value
      const componentBody = `export default function __R(props) {
        return ${value}
      }`
      const code = sucraseParse(componentBody)
      // @ts-ignore
      parent.type = 'root'
      // @ts-ignore
      node.type = 'root'
      node.data!.hName = 'div'
      const props = node.data!.hProperties!
      handleComponentName(props, HTMLParserName)
      handleHTMLParserCodeKey(props, code)
    })
  }
}

export default remarkHtmlParser
