import { ComponentKey } from '../../constant'

export const PreTitleName = 'PreTitle'

export function isPreTitle(props: any) {
  return props[ComponentKey] === PreTitleName
}
