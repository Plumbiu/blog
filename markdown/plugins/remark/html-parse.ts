import { visit } from 'unist-util-visit'
import {
  handleComponentName,
  handleComponentProps,
  type RemarkPlugin,
} from '../constant'
import * as htmlparser2 from 'htmlparser2'
import type { Html } from 'mdast'
import { makeProperties } from '../utils'

const remarkHtmlParser: RemarkPlugin = () => {
  return (tree) => {
    let nowNode: Html | null = null
    const parser = new htmlparser2.Parser(
      {
        onopentag(name, attributes) {
          if (nowNode) {
            makeProperties(nowNode)
            const props = nowNode.data!.hProperties!
            // @ts-ignore
            nowNode.type = 'root'
            nowNode.data!.hName = 'div'
            handleComponentName(props, name)
            handleComponentProps(props, JSON.stringify(attributes))
          }
        },
      },
      {
        xmlMode: true,
      },
    )

    const nodes: Html[] = []
    visit(tree, 'html', (node, _, parent) => {
      // @ts-ignore
      parent.type = 'root'
      nodes.push(node)
    })
    for (const node of nodes) {
      const value = node.value
      if (value) {
        nowNode = node
        parser.write(value)
      }
    }
    parser.end()
  }
}

export default remarkHtmlParser
