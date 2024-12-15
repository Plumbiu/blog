/* eslint-disable @stylistic/max-len */
import type { StringValueObj } from '@/types/base'
import { ComponentKey } from '../constant'
import { buildHandlerFunction, getFirstLine } from '../utils'

export const PlaygroundHidePreviewTabsKeySuffix = 'no-v-tab'
export const PlaygroundHideCodeTabsKeySuffix = 'no-c-tab'

export const PlaygroundPrefix = `${ComponentKey}p-`
const PlaygroundDefaultSelectorKey = `${PlaygroundPrefix}select`
const PlaygroundHidePreviewKey = `${PlaygroundPrefix}no-view`
const PlaygroundHidePreviewTabsKey = `${PlaygroundPrefix}${PlaygroundHidePreviewTabsKeySuffix}`
const PlaygroundHideCodeTabsKey = `${PlaygroundPrefix}${PlaygroundHideCodeTabsKeySuffix}`
const PlaygroundFileMapKey = `${PlaygroundPrefix}file`
const PlaygroundCustomPreivew = `${PlaygroundPrefix}cus-view`
const PlaygroundStyles = `${PlaygroundPrefix}css`

export const handlePlaygroundSelector = buildHandlerFunction<string>(
  PlaygroundDefaultSelectorKey,
)

export const handlePlaygroundFileMapKey = buildHandlerFunction<StringValueObj>(
  PlaygroundFileMapKey,
  JSON.parse,
)

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
interface FileAttr {
  code: string
  meta: string
}
export const buildFiles = (code: string, startStr: string) => {
  if (!code?.startsWith(startStr)) {
    code = `/// ${startStr}\n${code}`
  }
  const tokens = code.split('///')
  const attrs: Record<string, FileAttr> = {}
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
