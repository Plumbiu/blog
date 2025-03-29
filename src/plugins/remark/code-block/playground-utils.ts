import { ComponentKey, type FileMap, FileMapStartStr } from '../../constant'
import { buildHandlerFunction, getFirstLine } from '../../utils'

const NO = 'n'
const View = 'v'
const Tab = 't'
export const PlaygroundHidePreviewTabsKeySuffix = `${NO}-${View}-${Tab}`
export const PlaygroundHideCodeTabsKeySuffix = `${NO}-c-${Tab}`

export const PlaygroundPrefix = `${ComponentKey}-p`
const PlaygroundHidePreviewKey = `${PlaygroundPrefix}${NO}-${View}`
const PlaygroundHidePreviewTabsKey = `${PlaygroundPrefix}${PlaygroundHidePreviewTabsKeySuffix}`
const PlaygroundHideCodeTabsKey = `${PlaygroundPrefix}${PlaygroundHideCodeTabsKeySuffix}`
const PlaygroundCustomPreivew = `${PlaygroundPrefix}cus-${View}`
const PlaygroundStyles = `${PlaygroundPrefix}css`

export const handlePlaygroundHidePreviewKey = buildHandlerFunction<
  boolean | undefined
>(PlaygroundHidePreviewKey)

export const handlePlaygroundHidePreviewTabsKey = buildHandlerFunction<
  boolean | undefined
>(PlaygroundHidePreviewTabsKey)

export const handlePlaygroundHideCodeTabsKey = buildHandlerFunction<
  boolean | undefined
>(PlaygroundHideCodeTabsKey)

export const handlePlaygroundCustomPreivew = buildHandlerFunction<string>(
  PlaygroundCustomPreivew,
)

export const handlePlaygroundStyles =
  buildHandlerFunction<string[]>(PlaygroundStyles)

export const PlaygroundName = 'Playground'
export function isPlayground(props: any) {
  return props[ComponentKey] === PlaygroundName
}

const WhiteSpaceMultiRegx = /\s+/
export const buildFiles = (code: string, selector?: string) => {
  if (selector && !code?.startsWith(selector)) {
    code = `${FileMapStartStr} ${selector}\n${code}`
  }
  const tokens = code.split(FileMapStartStr)
  const attrs: FileMap = {}
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (token[0] === ' ') {
      const str = getFirstLine(tokens[i])
      const [key, ...metas] = str.trim().split(WhiteSpaceMultiRegx)
      attrs[key] = {
        code: tokens[i].slice(str.length).trim(),
        meta: metas.join(' '),
      }
    }
  }
  return attrs
}
