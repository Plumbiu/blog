import { visit } from 'unist-util-visit'
import type { InlineCode, Text } from 'mdast'
import type { RemarkPlugin } from '../../constant'
import { makeProperties } from '../../utils'
import replaceWithEmoji from './emoji'
import replaceVariable from './variable'
import replaceKeywords from './keywords'
import type { RemarkParent } from '../types'

export const remarkTextReplacePlugin: RemarkPlugin<string> = (code: string) => {
  function handler(
    node: Text,
    index: number | undefined,
    parent: RemarkParent,
  ) {
    makeProperties(node)
    replaceVariable(node, code)
    replaceWithEmoji(node, code)
    replaceKeywords(node, code, index, parent)
  }

  return (tree) => {
    visit(tree, 'text', handler)
  }
}
