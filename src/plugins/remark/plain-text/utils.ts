import type { Text, InlineCode } from 'mdast'
import type { Position } from 'unist'

export function getRawValueFromPosition(
  code: string,
  position: Position | undefined,
  node: Text | InlineCode,
) {
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

export function injectNodeValue(
  code: string,
  node: Text | InlineCode,
  startStr: string,
  endStr: string,
  replacer: (value: string) => string | number | undefined | null,
) {
  const position = node.position
  let value = getRawValueFromPosition(code, position, node)
  if (!value) {
    return
  }
  const startStrLen = startStr.length
  const endStrLen = endStr.length

  const start = value.indexOf(startStr)
  const end = value.lastIndexOf(endStr)
  if (start === -1 || end === -1) {
    return
  }
  const prefix = value.slice(0, start)
  const suffix = value.slice(end + endStrLen)
  value = value.slice(start, end + endStrLen)
  if (value.startsWith(startStr) && value.endsWith(endStr)) {
    const replaceStr = replacer(value.slice(startStrLen, -endStrLen).trim())
    if (replaceStr != null) {
      node.value = prefix + replaceStr + suffix
    }
  }
}
