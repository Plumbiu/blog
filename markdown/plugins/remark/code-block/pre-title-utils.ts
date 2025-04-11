import { buildHandlerFunction } from '~/markdown/plugins/utils'
import { ComponentKey } from '../../constant'
import { generatePluginKey } from '~/markdown/plugins/generate-key'

export const PreTitleName = 'PreTitle'

export function isPreTitle(props: any) {
  return props[ComponentKey] === PreTitleName
}

const PreTitleKey = generatePluginKey('pre-title')
export const handlePreTitleValue = buildHandlerFunction<string>(PreTitleKey)
