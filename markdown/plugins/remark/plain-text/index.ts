import { visit } from 'unist-util-visit'
import type { Text } from 'mdast'
import type { RemarkPlugin } from '../../constant'
import { makeProperties } from '../../utils'
import replaceWithEmoji from './emoji'
import replaceWithVariable from './variable'
import replaceWithLink from './link'
import type { RemarkParent } from '../types'

export const remarkTextReplacePlugin: RemarkPlugin<string> = (code: string) => {
  function handler(
    node: Text,
    index: number | undefined,
    parent: RemarkParent,
  ) {
    makeProperties(node)
    replaceWithVariable(node, code)
    replaceWithEmoji(node, code)
    replaceWithLink(node, code, index, parent)
  }

  return (tree) => {
    visit(tree, 'text', handler)
  }
}
