import { ComponentKey } from '../../constant'

export const TitleCodeName = 'PreTitle'

export function isTitleCode(props: any) {
  return props[ComponentKey] === TitleCodeName
}
