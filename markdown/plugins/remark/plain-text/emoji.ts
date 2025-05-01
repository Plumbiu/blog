import type { Root } from 'mdast'
import { findAndReplace } from 'mdast-util-find-and-replace'

const EmojiRegx = /:([\w\d]+):/g
function replaceWithEmoji(tree: Root, emojiMap: Record<string, string>) {
  findAndReplace(tree, [
    EmojiRegx,
    (_, $1) => {
      const emoji = emojiMap[$1]
      if (emoji) {
        return emoji
      }
      return false
    },
  ])
}

export default replaceWithEmoji
