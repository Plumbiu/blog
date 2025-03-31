import { buildHandlerFunction } from '@/plugins/utils'
import { ComponentKey } from '../../constant'
import { generatePluginKey } from '@/plugins/optimize-utils'

export const PreTitleName = 'PreTitle'

export function isPreTitle(props: any) {
  return props[ComponentKey] === PreTitleName
}

const PreTitleKey = generatePluginKey(`${ComponentKey}${PreTitleName}-title`)
export const handlePreTitleValue = buildHandlerFunction<string>(PreTitleKey)
