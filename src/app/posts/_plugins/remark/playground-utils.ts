/* eslint-disable @stylistic/max-len */
import { StringValueObj } from '@/types/base'
import { ComponentKey } from '../constant'
import { buildPlaygroundHandlerFunction } from '../utils'

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

export const handlePlaygroundSelector = buildPlaygroundHandlerFunction<string>(
  PlaygroundDefaultSelectorKey,
)

export const handlePlaygroundFileMapKey =
  buildPlaygroundHandlerFunction<StringValueObj>(
    PlaygroundFileMapKey,
    JSON.parse,
  )

export const handlePlaygroundHidePreviewKey = buildPlaygroundHandlerFunction<
  boolean | undefined
>(PlaygroundHidePreviewKey)

export const handlePlaygroundHidePreviewTabsKey =
  buildPlaygroundHandlerFunction<boolean | undefined>(
    PlaygroundHidePreviewTabsKey,
  )

export const handlePlaygroundHideCodeTabsKey = buildPlaygroundHandlerFunction<
  boolean | undefined
>(PlaygroundHideCodeTabsKey)

export const handlePlaygroundCustomPreivew =
  buildPlaygroundHandlerFunction<string>(PlaygroundCustomPreivew)

export const handlePlaygroundStyles =
  buildPlaygroundHandlerFunction<string[]>(PlaygroundStyles)

export const PlaygroundName = 'Playground'
export function isPlayground(props: any) {
  return props[ComponentKey] === PlaygroundName
}
