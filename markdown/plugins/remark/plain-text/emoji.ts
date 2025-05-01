import type { Root } from 'mdast'
import { findAndReplace } from 'mdast-util-find-and-replace'

const EmojiRegx = /:([\w\d]+):/g
function replaceWithEmoji(tree: Root, emojiMap: Record<string, string>) {
  findAndReplace(tree, [
    EmojiRegx,
    (_, $1) => {
      return emojiMap[$1]
    },
  ])
}

export default replaceWithEmoji
