import { ComponentKey } from '../../constant'
import { buildHandlerFunction } from '../../utils'

export const PlaygroundPrefix = 'playground'
export const PlaygroundHidePreviewTabsName = 'no-preview-tab'
export const PlaygroundHideCodeTabsName = 'no-code-tab'

const PlaygroundHidePreviewTabsKey = `${PlaygroundPrefix}-${PlaygroundHidePreviewTabsName}`
const PlaygroundCustomPreivewKey = `${PlaygroundPrefix}-custom-preview`
const PlaygroundStyles = `${PlaygroundPrefix}-css`

export const handlePlaygroundHidePreviewTabsKey = buildHandlerFunction<
  boolean | undefined
>(PlaygroundHidePreviewTabsKey)

export const handlePlaygroundCustomPreivew = buildHandlerFunction<string>(
  PlaygroundCustomPreivewKey,
)

export const handlePlaygroundStyles =
  buildHandlerFunction<string[]>(PlaygroundStyles)

export const PlaygroundName = 'Playground'
export function isPlayground(props: any) {
  return props[ComponentKey] === PlaygroundName
}
