'use client'

import { handleComponentName } from '~/markdown/plugins/constant'
import { createElement } from 'react'
import IntersectionObserverComponent from '@/components/IntersectionObserverComponent'
import { genericComponentsMap } from './generic-components'
import { PlaygroundName } from '~/markdown/plugins/remark/code-block/playground-utils'
import { CodeRunnerName } from '~/markdown/plugins/remark/runner-utils'
import { SwitcherName } from '~/markdown/plugins/remark/code-block/switcher-utils'
import { PreTitleName } from '~/markdown/plugins/remark/code-block/pre-title-utils'

const SyncComponentSet = new Set([
  PlaygroundName,
  CodeRunnerName,
  SwitcherName,
  PreTitleName,
])

function CustomComponent(props: any) {
  const componentName = handleComponentName(props)
  const value = genericComponentsMap[componentName]

  if (value) {
    if (SyncComponentSet.has(componentName)) {
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
