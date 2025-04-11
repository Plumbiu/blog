/// <reference types="mdast-util-directive" />
import type { Plugin } from 'unified'
import type { Root } from 'hast'
import type { Root as RemarkRoot } from 'mdast'
import { buildHandlerFunction } from './utils'
import { generatePluginKey } from './generate-key'

export const ComponentKey = generatePluginKey('cmp-key')
export const handleComponentName = buildHandlerFunction<string>(ComponentKey)

export type RehypePlugin<T = undefined> = Plugin<[T], Root>
export type RemarkPlugin<T = undefined> = Plugin<[T], RemarkRoot>

export const ComponentCodeKey = generatePluginKey('cmp-code')
export const handleComponentCode =
  buildHandlerFunction<string>(ComponentCodeKey)

export const ComponentMetaKey = generatePluginKey('cmp-meta')
export const handleComponentMeta =
  buildHandlerFunction<string>(ComponentMetaKey)

export const ComponentLangKey = generatePluginKey('cmp-lang')
export const handleLang = buildHandlerFunction<string>(ComponentLangKey)

export const ComponentPropsKey = generatePluginKey('cmp-props')
export const handleComponentProps = buildHandlerFunction<
  Record<string, string>
>(ComponentPropsKey, JSON.parse)

export type FileMap = Record<
  string,
  {
    code: string
    meta: string
  }
>
const ComponentFileMapPrefx = generatePluginKey('cmp-file-')
export const FileMapItemKey = generatePluginKey(`${ComponentFileMapPrefx}key`)
export const handleFileMapItemKey = buildHandlerFunction(FileMapItemKey)
export const FileMapKey = generatePluginKey(`${ComponentFileMapPrefx}map`)
export const handleFileMap = buildHandlerFunction<Record<string, string>>(
  FileMapKey,
  JSON.parse,
)
export const ComponentSelectorKey = generatePluginKey(
  `${ComponentFileMapPrefx}selector`,
)
export const handleComponentSelectorKey =
  buildHandlerFunction<string>(ComponentSelectorKey)
export const FileMapStartStr = '///'
