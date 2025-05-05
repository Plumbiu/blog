import { buildHandlerFunction } from '~/markdown/plugins/utils'
import { ComponentKey } from '../../constant'

export const PreTitleName = 'PreTitle'

export function isPreTitle(props: any) {
  return props[ComponentKey] === PreTitleName
}

const PreTitleKey = 'pre-title'
export const handlePreTitleValue = buildHandlerFunction<string>(PreTitleKey)
