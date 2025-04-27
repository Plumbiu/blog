'use client'

import IntersectionObserverComponent from '@/components/function/IntersectionObserverComponent'
import { createElement } from 'react'
import { handleComponentName } from '~/markdown/plugins/constant'
import { PlaygroundName } from '~/markdown/plugins/remark/code-block/playground-utils'
import { PreTitleName } from '~/markdown/plugins/remark/code-block/pre-title-utils'
import { SwitcherName } from '~/markdown/plugins/remark/code-block/switcher-utils'
import { CodeRunnerName } from '~/markdown/plugins/remark/runner-utils'
import { customComponentMap } from './custom-components'
import { genericComponentMap } from './generic-components'

const SyncComponentNameSet = new Set([
  PlaygroundName,
  CodeRunnerName,
  SwitcherName,
  PreTitleName,
])

function CustomComponent(props: any) {
  const componentName = handleComponentName(props)
  const value =
    customComponentMap[componentName] ?? genericComponentMap[componentName]

  if (value) {
    if (SyncComponentNameSet.has(componentName)) {
      return createElement(value, props)
    }

    return (
      <IntersectionObserverComponent props={props}>
        {value}
      </IntersectionObserverComponent>
    )
  }
  return props.children
}

export default CustomComponent
