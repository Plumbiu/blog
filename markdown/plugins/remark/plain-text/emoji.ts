import type { InlineCode, Text } from 'mdast'
import { getRawValueFromPosition } from './utils'
import emojiMap from '~/markdown/config/emoji'
import MagicString from 'magic-string'

const EmojiRegx = /:([\w\d]+):/g
function replaceWithEmoji(node: Text | InlineCode, code: string) {
  const rawValue = getRawValueFromPosition(code, node)
  if (rawValue) {
    let m: RegExpExecArray | null = null
    const ms = new MagicString(node.value)
    while ((m = EmojiRegx.exec(rawValue))) {
      const [raw, match] = m
      if (raw && match) {
        const emoji = emojiMap[match]
        if (emoji) {
          ms.update(m.index, m.index + raw.length, emoji)
        }
      }
    }
    node.value = ms.toString()
  }
  EmojiRegx.lastIndex = 0
}

export default replaceWithEmoji
