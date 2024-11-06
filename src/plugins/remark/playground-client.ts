import { StringValueObj } from '@/types/base'
import { ComponentKey } from '../constant'
import { buildGetFunction } from '../utils'

export const PlaygroundPrefix = `${ComponentKey}p-`
export const PlaygroundDefaultSelectorKey = `${PlaygroundPrefix}select`
export const PlaygroundShowDefaultConsoleKey = `${PlaygroundPrefix}console`
export const PlaygroundHidePreviewKey = `${PlaygroundPrefix}no-view`
export const PlaygroundHideTabsKey = `${PlaygroundPrefix}no-tab`
export const PlaygroundHideConsoleKey = `${PlaygroundPrefix}no-console`
export const PlaygroundFileMapKey = `${PlaygroundPrefix}file`
export const PlaygroundCustomPreivew = `${PlaygroundPrefix}cus-view`

export const getDefaultSelectorFromProps = buildGetFunction<string>(
  PlaygroundDefaultSelectorKey,
)
export const getComponentShowConsoleKey = buildGetFunction<boolean | undefined>(
  PlaygroundShowDefaultConsoleKey,
)
export const getComponentFileMapKey = buildGetFunction<StringValueObj>(
  PlaygroundFileMapKey,
  JSON.parse,
)
export const getPlaygroundHidePreviewKey = buildGetFunction<
  boolean | undefined
>(PlaygroundHidePreviewKey)
export const getPlaygroundHideTabsKey = buildGetFunction<boolean | undefined>(
  PlaygroundHideTabsKey,
)
export const getPlaygroundHideConsoleKey = buildGetFunction<
  boolean | undefined
>(PlaygroundHideConsoleKey)

export const getPlaygroundCustomPreivew = buildGetFunction<string>(
  PlaygroundCustomPreivew,
)

export const PlaygroundName = 'Playground'
export function isPlayground(props: any) {
  return props[ComponentKey] === PlaygroundName
}
