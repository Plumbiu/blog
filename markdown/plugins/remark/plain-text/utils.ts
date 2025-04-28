import type { Text } from 'mdast'

// markdown file content like:
// \:smile\:
// remark node value will be :smile:
// this function get raw value \:smile\:
export function getRawValueFromPosition(code: string, node: Text) {
  const position = node.position
  if (
    position == null ||
    position.start.offset == null ||
    position.end.offset == null
  ) {
    return
  }
  const value = code.slice(position.start.offset, position.end.offset)
  return value
}
