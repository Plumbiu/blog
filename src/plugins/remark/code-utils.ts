import {
  ComponentCodeKey,
  ComponentLangKey,
  ComponentMetaKey,
} from '../constant'

// Some prop only work in remark or rehype, it run on server side
// delete it for optimize client side
export function optimizeCodeProps(props: any) {
  delete props[ComponentCodeKey]
  delete props[ComponentLangKey]
  delete props[ComponentMetaKey]
}
