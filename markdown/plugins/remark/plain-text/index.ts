import type { RemarkPlugin } from '../../constant'
import replaceWithEmoji from './emoji'
import replaceWithVariable from './variable'
import variableMap, { type VariableType } from '~/markdown/config/variables'
import emojiMap, { type EmojiType } from '~/markdown/config/emoji'
import { assign } from '@/lib/types'

export const remarkPlainTextPlugin: RemarkPlugin<
  [
    {
      variable: VariableType
      emoji: EmojiType
    },
  ]
> = ({ variable = {}, emoji = {} }) => {
  return (tree) => {
    replaceWithEmoji(tree, assign(emojiMap, emoji))
    replaceWithVariable(tree, assign(variableMap, variable))
  }
}
