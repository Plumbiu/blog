import type { Text, InlineCode } from 'mdast'

// markdown file content like:
// \:smile\:
// remark node value will be :smile:
// this function get raw value \:smile\:
export function getRawValueFromPosition(code: string, node: Text | InlineCode) {
  const position = node.position
  if (!position || !position.start.offset || !position.end.offset) {
    return
  }
  const isInlineCode = node.type === 'inlineCode'
  const offset = isInlineCode ? 1 : 0
  const value = code.slice(
    position.start.offset + offset,
    position.end.offset - offset,
  )
  return value
}
