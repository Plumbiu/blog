import {
  ComponentCodeKey,
  ComponentLangKey,
  ComponentMetaKey,
  ComponentPropsKey,
} from './constant'
import { fileTreeMapKey } from './remark/code/file-tree/file-tree-utils'

// Some prop only work in remark or rehype, it run on server side
// delete it for optimize client side
export function optimizeProps(props: any) {
  if (!props) {
    return
  }
  delete props[ComponentCodeKey]
  delete props[ComponentLangKey]
  delete props[ComponentMetaKey]
  delete props[ComponentPropsKey]
  delete props[fileTreeMapKey]
}
