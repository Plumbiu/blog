import type { RemarkPlugin } from '../../constant'
import replaceWithEmoji from './emoji'
import replaceWithVariable from './variable'
import variableMap from '~/markdown/config/variables'
import emojiMap from '~/markdown/config/emoji'

export const remarkPlainTextPlugin: RemarkPlugin<
  [
    {
      variable: Record<string, any>
      emoji: Record<string, string>
    },
  ]
> = ({ variable = {}, emoji = {} }) => {
  return (tree) => {
    replaceWithEmoji(tree, Object.assign({}, emojiMap, emoji))
    replaceWithVariable(tree, Object.assign({}, variableMap, variable))
  }
}
