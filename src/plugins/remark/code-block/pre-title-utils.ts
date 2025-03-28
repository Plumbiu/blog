import { buildHandlerFunction } from '@/plugins/utils'
import { ComponentKey } from '../../constant'

export const PreTitleName = 'PreTitle'

export function isPreTitle(props: any) {
  return props[ComponentKey] === PreTitleName
}

const PreTitleKey = `${ComponentKey}${PreTitleName}-title`
export const handlePreTitleValue = buildHandlerFunction<string>(PreTitleKey)
