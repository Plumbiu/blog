import { visit } from 'unist-util-visit'
import type { Text } from 'mdast'
import type { RemarkPlugin } from '../../constant'
import { makeProperties } from '../../utils'
import replaceWithEmoji from './emoji'
import replaceWithVariable from './variable'
import variableMap from '~/markdown/config/variables'
import emojiMap from '~/markdown/config/emoji'

export const remarkPlainTextPlugin: RemarkPlugin<
  [
    string,
    {
      variable: Record<string, any>
      emoji: Record<string, string>
    },
  ]
> = (code: string, { variable = {}, emoji = {} }) => {
  function handler(node: Text) {
    makeProperties(node)
    replaceWithVariable(node, code, Object.assign({}, variableMap, variable))
    replaceWithEmoji(node, code, Object.assign({}, emojiMap, emoji))
  }

  return (tree) => {
    visit(tree, 'text', handler)
  }
}
