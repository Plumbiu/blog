import type { Text, InlineCode } from 'mdast'
import { injectNodeValue } from './utils'
import emojilist from '~/data/emoji'

const EmojiStart = ':'
const EmojiEnd = EmojiStart
function injectEmoji(node: Text | InlineCode, code: string) {
  injectNodeValue(code, node, EmojiStart, EmojiEnd, (key) => {
    return emojilist[key]
  })
}

export default injectEmoji
