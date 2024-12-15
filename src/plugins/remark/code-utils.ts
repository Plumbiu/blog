import {
  ComponentCodeKey,
  ComponentLangKey,
  ComponentMetaKey,
} from '../constant'

export function getOptimizedCodeProps(props: any) {
  delete props[ComponentCodeKey]
  delete props[ComponentLangKey]
  delete props[ComponentMetaKey]
  return props
}
