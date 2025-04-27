import { visit } from 'unist-util-visit'
import type { Text } from 'mdast'
import type { RemarkPlugin } from '../../constant'
import { makeProperties } from '../../utils'
import replaceWithEmoji from './emoji'
import replaceWithVariable from './variable'

export const remarkTextReplacePlugin: RemarkPlugin<string> = (code: string) => {
  function handler(node: Text) {
    makeProperties(node)
    replaceWithVariable(node, code)
    replaceWithEmoji(node, code)
  }

  return (tree) => {
    visit(tree, 'text', handler)
  }
}
