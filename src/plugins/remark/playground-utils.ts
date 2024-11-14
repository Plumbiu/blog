import { StringValueObj } from '@/types/base'
import { ComponentKey } from '../constant'
import { buildPlaygroundHandlerFunction } from '../utils'

export const PlaygroundPrefix = `${ComponentKey}p-`
const PlaygroundDefaultSelectorKey = `${PlaygroundPrefix}select`
const PlaygroundHidePreviewKey = `${PlaygroundPrefix}no-view`
const PlaygroundHideTabsKey = `${PlaygroundPrefix}no-tab`
const PlaygroundHideConsoleKey = `${PlaygroundPrefix}no-console`
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

export const handlePlaygroundHideTabsKey = buildPlaygroundHandlerFunction<
  boolean | undefined
>(PlaygroundHideTabsKey)

export const handlePlaygroundCustomPreivew =
  buildPlaygroundHandlerFunction<string>(PlaygroundCustomPreivew)

export const handlePlaygroundStyles =
  buildPlaygroundHandlerFunction<string[]>(PlaygroundStyles)

export const PlaygroundName = 'Playground'
export function isPlayground(props: any) {
  return props[ComponentKey] === PlaygroundName
}
