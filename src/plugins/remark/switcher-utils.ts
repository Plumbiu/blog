import { ComponentKey } from '../constant'

export const SwitcherName = 'Switcher'

export function isSwitcher(props: any) {
  return props[ComponentKey] === SwitcherName
}
